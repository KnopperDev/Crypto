import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import client from '../../api/coincap';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import './Detail.scss';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function Detail() {
  const [coin, setCoin] = useState(null);
  const [markets, setMarkets] = useState([]);
  const [priceHistory, setPriceHistory] = useState([]);
  const [timeframe, setTimeframe] = useState('24h');
  const [loading, setLoading] = useState(true);
  const { id } = useParams();

  const timeframes = {
    '24h': { interval: 'h1', start: Date.now() - 24 * 60 * 60 * 1000 },
    '7d': { interval: 'h6', start: Date.now() - 7 * 24 * 60 * 60 * 1000 },
    '30d': { interval: 'h12', start: Date.now() - 30 * 24 * 60 * 60 * 1000 },
    '1y': { interval: 'd1', start: Date.now() - 365 * 24 * 60 * 60 * 1000 }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch coin details, markets data, and price history in parallel
        const tf = timeframes[timeframe];
        const [coinResponse, marketsResponse, historyResponse] = await Promise.all([
          client.get(`/assets/${id}`),
          client.get(`/assets/${id}/markets`),
          client.get(`/assets/${id}/history`, {
            params: {
              interval: tf.interval,
              start: tf.start,
              end: Date.now()
            }
          })
        ]);

        setCoin(coinResponse.data.data);
        setMarkets(marketsResponse.data.data);
        setPriceHistory(historyResponse.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        setLoading(false);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [id, timeframe]);

  function formatNumber(number, decimals = 2) {
    if (!number) return 'N/A';
    const num = parseFloat(number);
    if (num > 1e9) return `$${(num / 1e9).toFixed(decimals)}B`;
    if (num > 1e6) return `$${(num / 1e6).toFixed(decimals)}M`;
    if (num > 1e3) return `$${(num / 1e3).toFixed(decimals)}K`;
    return `$${num.toFixed(decimals)}`;
  }

  function formatPrice(price) {
    if (!price) return 'N/A';
    const num = parseFloat(price);
    if (num < 1) return `$${num.toPrecision(4)}`;
    return `$${num.toFixed(2)}`;
  }

  if (loading || !coin) {
    return (
      <div className="content-wrapper">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  const priceChange = parseFloat(coin.changePercent24Hr || 0);
  const priceChangeClass = priceChange >= 0 ? 'positive' : 'negative';

  return (
    <div className="content-wrapper">
      <div className="coin-detail">
        <div className="coin-header">
          <div className="coin-intro">
            <img
              className="coin-icon"
              src={`https://assets.coincap.io/assets/icons/${coin.symbol.toLowerCase()}@2x.png`}
              alt={`${coin.name} icon`}
              onError={(e) => {
                e.target.src = 'https://coincap.io/static/logo_mark.png';
                e.target.onerror = null;
              }}
            />
            <div className="coin-title">
              <h1>{coin.name}</h1>
              <span className="symbol">{coin.symbol}</span>
            </div>
          </div>

          <div className="coin-price">
            <div className="price-tag">
              <span className="label">Price</span>
              <h2>{formatPrice(coin.priceUsd)}</h2>
            </div>
            <div className={`price-change ${priceChangeClass}`}>
              <span>{priceChange.toFixed(2)}%</span>
            </div>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <span className="stat-label">Market Cap</span>
            <span className="stat-value">{formatNumber(coin.marketCapUsd)}</span>
          </div>

          <div className="stat-card">
            <span className="stat-label">Volume (24h)</span>
            <span className="stat-value">{formatNumber(coin.volumeUsd24Hr)}</span>
          </div>

          <div className="stat-card">
            <span className="stat-label">Circulating Supply</span>
            <span className="stat-value">{formatNumber(coin.supply, 0)} {coin.symbol}</span>
          </div>
        </div>

        <div className="markets-section">
          <h3>Trading Markets</h3>
          <div className="markets-grid">
            {markets.slice(0, 5).map((market, index) => (
              <div key={index} className="market-card">
                <div className="market-header">
                  <span className="exchange">{market.exchangeId}</span>
                  <span className="pair">{market.baseSymbol}/{market.quoteSymbol}</span>
                </div>
                <div className="market-stats">
                  <div className="market-stat">
                    <span className="label">Price</span>
                    <span className="value">{formatPrice(market.priceUsd)}</span>
                  </div>
                  <div className="market-stat">
                    <span className="label">Volume (24h)</span>
                    <span className="value">{formatNumber(market.volumeUsd24Hr)}</span>
                  </div>
                  <div className="market-stat">
                    <span className="label">% Total Volume</span>
                    <span className="value">
                      {((market.volumeUsd24Hr / coin.volumeUsd24Hr) * 100).toFixed(2)}%
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="chart-section">
          <div className="chart-header">
            <h3>Price Chart</h3>
            <div className="timeframe-selector">
              {Object.keys(timeframes).map(tf => (
                <button
                  key={tf}
                  className={`timeframe-button ${timeframe === tf ? 'active' : ''}`}
                  onClick={() => setTimeframe(tf)}
                >
                  {tf}
                </button>
              ))}
            </div>
          </div>
          <div className="chart-container">
            <Line
              data={{
                labels: priceHistory.map(point => {
                  const date = new Date(point.time);
                  return timeframe === '24h'
                    ? date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    : date.toLocaleDateString([], { month: 'short', day: 'numeric' });
                }),
                datasets: [
                  {
                    label: 'Price',
                    data: priceHistory.map(point => point.priceUsd),
                    borderColor: priceChangeClass === 'positive' ? 'rgb(22, 199, 132)' : 'rgb(234, 57, 67)',
                    backgroundColor: priceChangeClass === 'positive'
                      ? 'rgba(22, 199, 132, 0.1)'
                      : 'rgba(234, 57, 67, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHitRadius: 10,
                  }
                ]
              }}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false
                  },
                  tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                      label: function (context) {
                        return `$${parseFloat(context.raw).toFixed(2)}`;
                      }
                    }
                  }
                },
                scales: {
                  x: {
                    grid: {
                      display: false,
                      drawBorder: false
                    },
                    ticks: {
                      maxRotation: 0,
                      color: 'rgb(166, 176, 195)',
                      maxTicksLimit: 8
                    }
                  },
                  y: {
                    grid: {
                      color: 'rgba(166, 176, 195, 0.1)',
                      drawBorder: false
                    },
                    ticks: {
                      color: 'rgb(166, 176, 195)',
                      callback: function (value) {
                        return `$${value.toFixed(2)}`;
                      }
                    }
                  }
                },
                interaction: {
                  intersect: false,
                  mode: 'index'
                }
              }}
            />
          </div>
        </div>

        <div className="info-section">
          <div className="info-card">
            <h3>About {coin.name}</h3>
            <div className="info-content">
              <p>View more details about {coin.name} on:</p>
              <a href={coin.explorer} target="_blank" rel="noopener noreferrer" className="link-button">
                Blockchain Explorer
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Detail;
import { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import { NavLink } from 'react-router-dom';
import './Top-10.scss';

ChartJS.register(ArcElement, Tooltip, Legend);

const Top10 = () => {
    const [coinData, setCoinData] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('https://rest.coincap.io/v3/assets', {
                    headers: {
                        'Authorization': 'Bearer 57fd2a08257281a5bea7686763e58a84c1adfe573a3d327fc12d0cff3bc0e3d0'
                    }
                });
                const data = await response.json();
                setCoinData(data.data.slice(0, 10));
                setLoading(false);
            } catch (error) {
                console.error('Error fetching data:', error);
                setLoading(false);
            }
        };

        fetchData();
        const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
        return () => clearInterval(interval);
    }, []);

    function formatNumber(number, decimals = 2) {
        if (number === undefined) return 'N/A';
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

    if (loading) {
        return (
            <div className="content-wrapper">
                <div className="page-header">
                    <h1>Top 10 Cryptocurrencies</h1>
                    <p className="subtitle">The top 10 cryptocurrencies by market capitalization</p>
                </div>
                <div className="loading">Loading...</div>
            </div>
        );
    }

    const chartData = {
        labels: coinData.map(coin => coin.name),
        datasets: [
            {
                data: coinData.map(coin => parseFloat(coin.marketCapUsd)),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 206, 86, 0.8)',
                    'rgba(75, 192, 192, 0.8)',
                    'rgba(153, 102, 255, 0.8)',
                    'rgba(255, 159, 64, 0.8)',
                    'rgba(255, 99, 255, 0.8)',
                    'rgba(75, 192, 255, 0.8)',
                    'rgba(255, 206, 192, 0.8)',
                    'rgba(54, 255, 235, 0.8)',
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    'rgba(255, 99, 255, 1)',
                    'rgba(75, 192, 255, 1)',
                    'rgba(255, 206, 192, 1)',
                    'rgba(54, 255, 235, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        plugins: {
            legend: {
                position: 'bottom',
                align: 'start',
                labels: {
                    color: 'rgb(166, 176, 195)',
                    padding: 20,
                    font: {
                        size: 14
                    },
                    boxWidth: 15,
                    boxHeight: 15,
                },
                maxItems: 10,
                maxWidth: 1000,
                fullSize: true,
            },
            title: {
                display: true,
                text: 'Market Cap Distribution',
                color: 'rgba(8, 8, 8, 1)',
                font: {
                    size: 18,
                    weight: 'bold'
                },
                padding: 10
            }
        },
        responsive: true,
        maintainAspectRatio: false
    };

    return (
        <div className="content-wrapper">
            <div className="page-header">
                <h1>Top 10 Cryptocurrencies</h1>
                <p className="subtitle">The top 10 cryptocurrencies by market capitalization</p>
            </div>

            <div className="top-10-layout">
                <div className="pie-chart-section">
                    <div className="chart-container">
                        <Pie data={chartData} options={chartOptions} />
                    </div>
                </div>

                <div className="top-10-grid">
                    {coinData.map((coin, index) => (
                        <NavLink to={`/detail/${coin.id}`} key={coin.id} className="coin-card">
                            <div className="coin-card-header">
                                <div className="coin-info">
                                    <span className="rank">#{index + 1}</span>
                                    <img
                                        className="coin-icon"
                                        src={`https://assets.coincap.io/assets/icons/${coin.symbol.toLowerCase()}@2x.png`}
                                        alt={`${coin.name} icon`}
                                        onError={(e) => {
                                            e.target.src = 'https://coincap.io/static/logo_mark.png';
                                            e.target.onerror = null;
                                        }}
                                    />
                                    <div className="coin-name">
                                        <span className="name">{coin.name}</span>
                                        <span className="symbol">{coin.symbol}</span>
                                    </div>
                                </div>
                                <div className={`price-change ${parseFloat(coin.changePercent24Hr) >= 0 ? 'positive' : 'negative'}`}>
                                    {parseFloat(coin.changePercent24Hr || 0).toFixed(2)}%
                                </div>
                            </div>

                            <div className="coin-card-body">
                                <div className="price">
                                    <span className="label">Price</span>
                                    <span className="value">{formatPrice(coin.priceUsd)}</span>
                                </div>

                                <div className="market-cap">
                                    <span className="label">Market Cap</span>
                                    <span className="value">{formatNumber(coin.marketCapUsd)}</span>
                                </div>

                                <div className="volume">
                                    <span className="label">Volume (24h)</span>
                                    <span className="value">{formatNumber(coin.volumeUsd24Hr)}</span>
                                </div>
                            </div>
                        </NavLink>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Top10;

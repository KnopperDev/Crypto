import { useEffect, useState } from 'react';
import './Coins.scss';
import { NavLink } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import { useSearch } from '../../context/SearchContext';

function Coins() {
  const { searchTerm } = useSearch();
  const [coinData, setCoinData] = useState([]);
  const [favoriteCoins, setFavoriteCoins] = useState(() => {
    const saved = localStorage.getItem('favoriteCoins');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('https://rest.coincap.io/v3/assets', {
          headers: {
            'Authorization': 'Bearer 57fd2a08257281a5bea7686763e58a84c1adfe573a3d327fc12d0cff3bc0e3d0'
          }
        });
        const data = await response.json();
        setCoinData(data.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  function handleFavorite(e, coinId) {
    e.preventDefault();
    e.stopPropagation();
    const newFavorites = favoriteCoins.includes(coinId)
      ? favoriteCoins.filter(id => id !== coinId)
      : [...favoriteCoins, coinId];
    setFavoriteCoins(newFavorites);
    localStorage.setItem('favoriteCoins', JSON.stringify(newFavorites));
  }

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

  return (
    <div className='content-wrapper'>

      <div className='coinsContainer'>
        <div className='coinsHeader'>
          <div className='headerItem'>#</div>
          <div className='headerItem'>Name</div>
          <div className='headerItem right'>Price</div>
          <div className='headerItem right'>24h %</div>
          <div className='headerItem right'>Market Cap</div>
          <div className='headerItem right'>Volume(24h)</div>
          <div className='headerItem'>Chart</div>
        </div>

        {coinData.filter(coin => {
          const searchLower = searchTerm.toLowerCase();
          return coin.name.toLowerCase().includes(searchLower) ||
            coin.symbol.toLowerCase().includes(searchLower);
        }).map((coin, index) => (
          <NavLink to={`/detail/${coin.id}`} key={coin.id}>
            <div className='coinsLineContainer'>
              <span className='rank'>{coinData.findIndex(c => c.id === coin.id) + 1}</span>

              <div className='coinInfo'>
                <img
                  className='coinIcon'
                  src={`https://assets.coincap.io/assets/icons/${coin.symbol.toLowerCase()}@2x.png`}
                  alt={`${coin.name} icon`}
                  onError={(e) => {
                    e.target.src = 'https://coincap.io/static/logo_mark.png'; // Fallback icon
                    e.target.onerror = null;
                  }}
                />
                <div className='coinNameWrapper'>
                  <span className='coinName'>{coin.name}</span>
                  <span className='coinSymbol'>{coin.symbol}</span>
                </div>
              </div>

              <div className='price'>{formatPrice(coin.priceUsd)}</div>

              <div className={`priceChange ${parseFloat(coin.changePercent24Hr) >= 0 ? 'positive' : 'negative'}`}>
                {`${parseFloat(coin.changePercent24Hr || 0).toFixed(2)}%`}
              </div>

              <div className='marketCap'>
                <span className='label'>Market Cap</span>
                {formatNumber(coin.marketCapUsd)}
              </div>

              <div className='volume'>
                <span className='label'>Volume</span>
                {formatNumber(coin.volumeUsd24Hr)}
              </div>

              <div className={`sparkline ${parseFloat(coin.changePercent24Hr || 0) >= 0 ? 'positive' : 'negative'}`}>
                {/* Placeholder for sparkline chart */}
              </div>

              <button
                className={`favoriteButton ${favoriteCoins.includes(coin.id) ? 'active' : ''}`}
                onClick={(e) => handleFavorite(e, coin.id)}
                aria-label={favoriteCoins.includes(coin.id) ? 'Remove from favorites' : 'Add to favorites'}
              >
                <FaStar />
              </button>
            </div>
          </NavLink>
        ))}
      </div>
    </div>
  );
}

export default Coins;

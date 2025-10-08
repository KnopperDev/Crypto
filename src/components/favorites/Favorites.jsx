import { useEffect, useState } from 'react';
import { NavLink } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';
import './Favorites.scss';

const Favorites = () => {
  const [coinData, setCoinData] = useState([]);
  const [favoriteCoins, setFavoriteCoins] = useState(() => {
    const saved = localStorage.getItem('favoriteCoins');
    return saved ? JSON.parse(saved) : [];
  });
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
        setCoinData(data.data);
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

  useEffect(() => {
    localStorage.setItem('favoriteCoins', JSON.stringify(favoriteCoins));
  }, [favoriteCoins]);

  function handleRemoveFavorite(e, coinId) {
    e.preventDefault();
    e.stopPropagation();
    setFavoriteCoins(favoriteCoins.filter(id => id !== coinId));
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

  if (loading) {
    return (
      <div className="content-wrapper">
        <div className="page-header">
          <h1>Your Watchlist</h1>
          <p className="subtitle">Track your favorite cryptocurrencies</p>
        </div>
        <div className="loading">Loading...</div>
      </div>
    );
  }

  const favoriteCoinsData = coinData.filter(coin => favoriteCoins.includes(coin.id));

  return (
    <div className="content-wrapper">
      <div className="page-header">
        <h1>Your Watchlist</h1>
        <p className="subtitle">Track your favorite cryptocurrencies</p>
      </div>

      <div className="favorites-container">
        {favoriteCoinsData.length === 0 ? (
          <div className="empty-state">
            <FaStar size={48} />
            <h2>No favorites yet</h2>
            <p>Add coins to your watchlist by clicking the star icon next to any cryptocurrency</p>
            <NavLink to="/" className="browse-link">Browse Cryptocurrencies</NavLink>
          </div>
        ) : (
          <div className="favorites-grid">
            {favoriteCoinsData.map(coin => (
              <NavLink to={`/detail/${coin.id}`} key={coin.id} className="favorite-card">
                <div className="favorite-card-header">
                  <div className="coin-info">
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
                  <button
                    className="remove-button"
                    onClick={(e) => handleRemoveFavorite(e, coin.id)}
                    aria-label="Remove from favorites"
                  >
                    <FaStar />
                  </button>
                </div>

                <div className="favorite-card-body">
                  <div className="price">
                    <span className="label">Price</span>
                    <span className="value">{formatPrice(coin.priceUsd)}</span>
                  </div>

                  <div className={`price-change ${parseFloat(coin.changePercent24Hr) >= 0 ? 'positive' : 'negative'}`}>
                    <span className="label">24h Change</span>
                    <span className="value">{parseFloat(coin.changePercent24Hr || 0).toFixed(2)}%</span>
                  </div>

                  <div className="market-cap">
                    <span className="label">Market Cap</span>
                    <span className="value">{formatNumber(coin.marketCapUsd)}</span>
                  </div>
                </div>
              </NavLink>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Favorites;
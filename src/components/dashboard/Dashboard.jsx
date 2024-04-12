import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../App.scss';
import '.././coins/Coins.scss'
import Coin from '../coins/Coins';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const navigate = useNavigate();
  const [coins, setCoins] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    axios.get("https://api.coincap.io/v2/assets")
      .then((response) => {
        setCoins(response.data.data);
      })
      .catch(error => {
        console.error("Error fetching coin details", error);
        navigate('*');
      });
  }, []);

  const handleAddFavorite = (coinId) => {
    const coinToAdd = coins.find((coin) => coin.id === coinId);
    const existingFavoriteIndex = favorites.findIndex((favorite) => favorite.id === coinId);

    if (existingFavoriteIndex !== -1) {
      // Remove the coin from favorites if it's already there
      const updatedFavorites = [...favorites];
      updatedFavorites.splice(existingFavoriteIndex, 1);
      setFavorites(updatedFavorites);
    } else {
      // Add the coin to favorites if it's not there
      setFavorites([...favorites, coinToAdd]);
    }
  };


  return (
    <>
      <div className='coinHeaderContainer'>
        <div className='coinIdNameSymbol'>
          <div className='headerItemCoinsHeader'>#</div>
          <div className='headerItemCoinsHeader'>Name</div>
        </div>
      </div>
      <div className='Container'>
      <div className='coinsContainer'>
        {coins.map((coin) => (
          <Coin
            key={coin.id}
            id={coin.id}
            rank={coin.rank}
            name={coin.name}
            price={coin.priceUsd}
            symbol={coin.symbol}
            price24Hr={coin.changePercent24Hr}
            marketCapUsd={coin.marketCapUsd}
            volumeUsd24Hr={coin.volumeUsd24Hr}
            supply={coin.supply}
            handleAddFavorite={handleAddFavorite} // Pass the function as prop
          />
        ))}
      </div>
      <div className="favoritesTable">
        <h2>Favoriete Munten</h2>
        <table>
          <tbody>
          {favorites.map((favorite) => (
                <tr key={favorite.id}>
                    <Link to={`/coin/${favorite.id}`} className='favoCoin'>
                      {favorite.name}
                    </Link>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      </div>
    </>
  )
}

export default Dashboard;

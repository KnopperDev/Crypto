import React from "react";
import { Link } from 'react-router-dom';

const Coin = (props) => {
  const handleAddFavorite = () => {
    props.handleAddFavorite(props.id);
  };

  return (
    <div className='coinsLineContainer'>
      <Link to={"/coin/" + props.id}>
        <div className='coins'>
          <div className='coinPriceSymbol'>
            <div className='index'>{props.rank}</div>
            <div className='coinName'>{props.name}</div>
            <div className='coinSymbol'>{props.symbol}</div>
          </div>
        </div>
        <div className='coinPricingHour'>
          <div className='coinPrice'> {props.price ? Number(props.price).toFixed(3) : 'Loading...'}</div>
          <div className='coinPrice'>
            {props.price24Hr !== undefined ? (
              <span style={{ color: Number(props.price24Hr) < 0 ? 'rgb(234, 57, 67)' : Number(props.price24Hr) > 0 ? 'rgb(102, 199, 132)' : 'inrite', }}>
                {Number(props.price24Hr).toFixed(2)}
              </span>
            ) : ('Loading...')}
          </div>
        </div>
      </Link>
      <div className="favoriteButton"><button onClick={handleAddFavorite} className="favoriteButtonb">Favorite</button></div>
    </div>
  )
}

export default Coin;

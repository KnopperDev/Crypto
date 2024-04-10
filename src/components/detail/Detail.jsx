import React, { useEffect, useState } from 'react';
import '../../App.scss';
import '.././coins/Coins.scss'
import Coin from '../coins/Coins';
import { useParams } from 'react-router-dom';

function Detail (){

    const [coin, setCoins] = useState(null);
    let { id } = useParams();

    useEffect(() => {
      fetch('https://api.coincap.io/v2/assets/'+ id)
        .then((response) => response.json())
        .then((json) => setCoins(json.data))
        .catch(error => console.error("Error Fetching", error))
    }, [id]);

    if (!coin){
      return <div> Loading..</div> 
    }
    return(
      <>
      <div>{coin.name}</div>
      <div>{coin.symbol}</div>
      <div>${coin.priceUsd ? Number(coin.priceUsd).toFixed(4) : 'Loading...'}</div>
      </>
    )
}

export default Detail;
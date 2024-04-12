import React, { useEffect, useState } from 'react';
import '../../App.scss';
import '.././detail/Detail.scss'
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
      <div className='containerCoinInfo'>
      <div>Id: {coin.id}</div>
      <div>Symbol: {coin.symbol}</div>
      <div>Name: {coin.name}</div>
      <div>Supply: {coin.supply}</div>
      <div>Marketcap: {coin.marketCapUsd}</div>
      <div>24hr: {coin.volumeUsd24Hr}</div>
      <div>${coin.priceUsd ? Number(coin.priceUsd).toFixed(4) : 'Loading...'}</div>
      <div>Percent 24hr: {coin.changePercent24Hr}</div>
      <div>wap24hr: {coin.vwap24Hr}</div>
      <div>Explorer: {coin.explorer}</div>
      </div>
      </>
    )
}

export default Detail;
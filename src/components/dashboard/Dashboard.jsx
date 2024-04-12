import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../../App.scss';
import '.././coins/Coins.scss'
import Coin from '../coins/Coins';


function Dashboard (){

  const navigate = useNavigate();
    const [coins, setCoins] = useState([]);

    useEffect(() => {
      axios.get("https://api.coincap.io/v2/assets")
          .then((response) => {
          setCoins(response.data.data);})
          .catch(error => {console.error("Error fetching coin details", error); navigate('*');});
  }, []);
    return(
        <>
        <div className='coinHeaderContainer'>
        <div className='coinIdNameSymbol'>
          <div className='headerItemCoinsHeader'>#</div>
          <div className='headerItemCoinsHeader'>Name</div>
        </div>
        <div className='coinprice1h24h7dMarketCap'>
          <div className='headerItemCoinsHeader'>Price</div>
          <div className='headerItemCoinsHeader'>24h %</div>
          <div className='headerItemCoinsHeader'>Market Cap</div>
        </div>
        <div className='coinVolumeSupply7d'>
          <div className='headerItemCoinsHeader'>Volume(24h)</div>
          <div className='headerItemCoinsHeader'>Circulating Supply</div>
        </div>
      </div>
      <div className='coinsContainer'> 
            {coins.map((coin) => {
              return (
              <Coin id={coin.id} rank={coin.rank} name={coin.name} price={coin.priceUsd} symbol={coin.symbol} price24Hr={coin.changePercent24Hr} marketCapUsd={coin.marketCapUsd} volumeUsd24Hr={coin.volumeUsd24Hr} supply={coin.supply}/>
            )})}
      </div>
      </>
    )
}

export default Dashboard;
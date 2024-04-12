import React, { useEffect, useState } from "react";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';
import axios from 'axios'; // Let op: gebruik 'axios' in plaats van 'Axios'

ChartJS.register(ArcElement, Tooltip, Legend);

const Top10 = () => {
    const [coinData, setCoinData] = useState([]);

    useEffect(() => {
        // API-aanroep om gegevens op te halen
        axios.get('https://api.coincap.io/v2/assets/')
            .then(response => {
                const top10Coins = response.data.data.slice(0, 10); // Haal de top 10 munten
                const coinNames = top10Coins.map(coin => coin.name);
                const marketCaps = top10Coins.map(coin => coin.marketCapUsd);

                setCoinData({ names: coinNames, marketCaps: marketCaps });
            })
            .catch(error => {
                console.error("Fout bij het ophalen van gegevens:", error);
            });
    }, []);

    const data = {
        labels: coinData.names,
        datasets: [
            {
                data: coinData.marketCaps,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)',
                    'rgba(75, 192, 192, 0.2)',
                    'rgba(153, 102, 255, 0.2)',
                    'rgba(255, 159, 64, 0.2)',
                    // Voeg meer kleuren toe indien nodig
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                    // Voeg meer kleuren toe indien nodig
                ],
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className='chartContainer'>
            <div className="top10-chart">
                <Pie data={data} />
            </div>
        </div>
    );
}

export default Top10;

import React from 'react';
import { Bar } from 'react-chartjs-2';
import 'chartjs-plugin-datalabels';

export default function GenreBreakdownChart({ genreBreakdown }){
    const genreChartData = {
        labels: genreBreakdown.map(item => item.genre__genre_name),
        datasets: [{
            label: 'Genre Count',
            data: genreBreakdown.map(item => item.genre_count),
            backgroundColor: 'rgb(0,255,56)',
            borderColor: 'rgb(0,255,56)',
            borderWidth: 1,
        }],
    };

    const genreChartOptions = {
        indexAxis: 'y',
        elements: {
            bar: {
                borderWidth: 2,
            },
        },
        responsive: true,
        plugins: {
            datalabels: {
                anchor: 'end',
                align: 'end',
                formatter: (value, context) => {
                    return `${value}`;
                },
                color: '#555',
                font: {
                    weight: 'bold',
                },
                padding: { right: 10 },
            },
            legend: {
                position: 'right',
            },
            title: {
                display: false,
                text: 'Genre Breakdown',
            },
        },
        scales: {
            x: {
                ticks: {
                    display: false,
                },
                grid: {
                    display: false,
                },
                ticks: {
                    callback: function(value) {
                        if (value % 1 === 0) {
                            return value;
                        }
                    },
                    color: '#cecece', 
                },
            },
            y: {
                grid: {
                    display: false,
                },
                ticks: {
                    
                    color: '#cecece', 
                },
                
            }
        },
        elements: {
            bar: {
                borderRadius: 3, // Set the border radius for curved bars
            },
        },

    }

    return (
        <div className='movie-rating-stats'>
            <div className="chart-text">Genre Breakdown</div>
            <Bar data={genreChartData} options={genreChartOptions} />
        </div>
    );
};

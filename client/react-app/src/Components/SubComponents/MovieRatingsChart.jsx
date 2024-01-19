import React from 'react';
import { Bar } from 'react-chartjs-2';
import './MovieRatingsChart.css'

export default function MovieRatingsChart({ movieRatingsDistribution }){
    const ratingsChartData = {
        labels: Object.keys(movieRatingsDistribution),
        datasets: [{
            label: 'Number of Ratings',
            data: Object.values(movieRatingsDistribution),
            backgroundColor: 'rgb(252,186,3)',
            borderColor: 'rgb(252,186,3)',
            borderWidth: 1,
        }],
    };
    
    const ratingsChartOptions = {
        responsive: true,
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Number of Movies',
                    color: '#cecece'
                },
                ticks: {
                    
                    callback: function(value) {
                        if (value % 1 === 0) {
                            return value;
                        }
                    },

                    color: '#cecece'
                },
                grid: {
                    display:false,
                },
            },
            x: {
                title: {
                    display: true,
                    text: 'Ratings',
                    color: '#cecece'
                },
                ticks: {
                    color: '#cecece', 
                },
                grid: {
                    display:false,
                },
            }
        },
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: false,
                text: 'Movie Ratings Distribution',
            },
            
        },

        elements: {
            bar: {
                borderRadius: 3, // Set the border radius for curved bars
            },
        },
    };

    return (
        <div className='movie-rating-stats'>
            <div className="chart-text">Movie Ratings Distribution</div>
            <Bar data={ratingsChartData} options={ratingsChartOptions} />
        </div>
    );
};

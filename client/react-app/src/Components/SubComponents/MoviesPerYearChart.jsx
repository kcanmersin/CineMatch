/* eslint-disable react/prop-types */
import React from 'react';
import { Line } from 'react-chartjs-2';

export default function MoviesPerYearChart({ moviesPerYear }){
    const moviesPerYearChartData = {
        labels: moviesPerYear.map(item => item.release_date.toString()),
        datasets: [{
            label: 'Movies',
            data: moviesPerYear.map(item => item.movie_count),
            fill: false,
            borderColor: '#cecece',
            tension: 1
        }],
    };

    const moviesPerYearChartOptions = {
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
                        if (Number.isInteger(value)) {
                            return value;
                        }
                    },
                    color:'#cecece'
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Year',
                    color: '#cecece'
                },
                ticks: {
                    
                    color:'#cecece'
                }
            }
        },
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: false,
                text: 'Movies per Year',
            },
        },
    };

    return (
        <div className='movie-rating-stats'>
            <div className="chart-text">Movies Per Year</div>
            <Line data={moviesPerYearChartData} options={moviesPerYearChartOptions} />
        </div>
    );
};

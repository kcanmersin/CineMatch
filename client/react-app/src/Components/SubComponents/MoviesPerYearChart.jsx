/* eslint-disable react/prop-types */
import React from 'react';
import { Line } from 'react-chartjs-2';

export default function MoviesPerYearChart({ moviesPerYear }){
    const moviesPerYearChartData = {
        labels: moviesPerYear.map(item => item.release_date.toString()),
        datasets: [{
            label: 'Movies per Year',
            data: moviesPerYear.map(item => item.movie_count),
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1
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
                },
                ticks: {
                    callback: function(value) {
                        if (Number.isInteger(value)) {
                            return value;
                        }
                    }
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Year',
                }
            }
        },
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Movies per Year',
            },
        },
    };

    return (
        <div style={{ width: '40%', marginTop: '20px' }}>
            <h2>Movies per Year</h2>
            <Line data={moviesPerYearChartData} options={moviesPerYearChartOptions} />
        </div>
    );
};

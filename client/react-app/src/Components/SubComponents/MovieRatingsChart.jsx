import React from 'react';
import { Bar } from 'react-chartjs-2';

export default function MovieRatingsChart({ movieRatingsDistribution }){
    const ratingsChartData = {
        labels: Object.keys(movieRatingsDistribution),
        datasets: [{
            label: 'Number of Ratings',
            data: Object.values(movieRatingsDistribution),
            backgroundColor: 'rgba(53, 162, 235, 0.5)',
            borderColor: 'rgba(53, 162, 235, 1)',
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
                },
                ticks: {
                    // Ensure y-axis labels are natural numbers
                    callback: function(value) {
                        if (value % 1 === 0) {
                            return value;
                        }
                    }
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Ratings',
                }
            }
        },
        plugins: {
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Movie Ratings Distribution',
            },
        },
    };

    return (
        <div style={{ width: '40%', marginTop: '20px' }}>
            <h2>Movie Ratings Distribution</h2>
            <Bar data={ratingsChartData} options={ratingsChartOptions} />
        </div>
    );
};

import React from 'react';
import { Bar } from 'react-chartjs-2';
import 'chartjs-plugin-datalabels';

export default function GenreBreakdownChart({ genreBreakdown }){
    const genreChartData = {
        labels: genreBreakdown.map(item => item.genre__genre_name),
        datasets: [{
            label: 'Genre Count',
            data: genreBreakdown.map(item => item.genre_count),
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
            borderColor: 'rgb(255, 99, 132)',
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
                display: true,
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
                }
            },
            y: {
                grid: {
                    display: false,
                }
            }
        }
    };

    return (
        <div style={{ width: '40%' }}>
            <h2>Genre Breakdown</h2>
            <Bar data={genreChartData} options={genreChartOptions} />
        </div>
    );
};

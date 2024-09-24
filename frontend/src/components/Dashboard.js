import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import BoxPlot from './BoxPlot';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Dashboard({ result }) {
  const { sentimentData, keywordData } = result.visualizations;

  const keywordChartData = {
    labels: Object.keys(keywordData),
    datasets: [
      {
        label: 'Keyword Frequency',
        data: Object.values(keywordData),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
    ],
  };

  const keywordChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Keyword Frequency',
      },
    },
  };

  return (
    <div>
      <h2>Analysis Results</h2>
      <div style={{ width: '600px', height: '400px' }}>
        <BoxPlot data={sentimentData} title="Sentiment Distribution" />
      </div>
      <div style={{ width: '600px', height: '400px' }}>
        <Bar options={keywordChartOptions} data={keywordChartData} />
      </div>
      <h3>Content</h3>
      <ul>
        {result.content.map((post, index) => (
          <li key={index}>
            <p>{post.text}</p>
            <p>Author: {post.author}</p>
            <p>Platform: {post.platform}</p>
            <p>Sentiment: {post.sentiment.toFixed(2)}</p>
            <p>Keywords: {post.keywords.join(', ')}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Dashboard;
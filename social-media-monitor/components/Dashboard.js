import React from 'react'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import BoxPlot from './BoxPlot'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

export default function Dashboard({ result }) {
  if (!result || !result.visualizations) {
    return <div>No data available</div>;
  }

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
  }

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
  }

  return (
    <div className="space-y-8">
      <h2 className="text-3xl font-bold text-center mt-4">Analysis Results 📊</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-md">
          <BoxPlot data={sentimentData} title="Sentiment Distribution 🎢" />
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-md">
          <Bar options={keywordChartOptions} data={keywordChartData} />
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 p-4 rounded-md shadow-md">
        <h3 className="text-2xl font-bold mb-4">Content 📄</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {result.content && result.content.map((post, index) => (
            <div
              key={index}
              className="border border-gray-300 dark:border-gray-600 rounded-md p-4 bg-white dark:bg-gray-700">
              <p className="font-bold">{post.text}</p>
              {post.author && <p>Author: {post.author}</p>}
              {post.group_name && <p>Group/Channel: {post.group_name}</p>}
              {post.sentiment !== undefined && <p>Sentiment: {post.sentiment.toFixed(2)}</p>}
              {post.keywords?.length > 0 && <p>Keywords: {post.keywords.join(', ')}</p>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
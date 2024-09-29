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
    return <div className="text-center text-gray-600 dark:text-gray-400 mt-8">No data available</div>;
  }

  const { sentimentData, keywordData } = result.visualizations;

  const keywordChartData = {
    labels: Object.keys(keywordData),
    datasets: [
      {
        label: 'Keyword Frequency',
        data: Object.values(keywordData),
        backgroundColor: 'rgba(59, 130, 246, 0.6)',
        borderColor: 'rgba(59, 130, 246, 1)',
        borderWidth: 1,
      },
    ],
  }

  const keywordChartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            family: "'Inter', sans-serif",
            size: 12
          }
        }
      },
      title: {
        display: true,
        text: 'Keyword Frequency',
        font: {
          family: "'Inter', sans-serif",
          size: 16,
          weight: 'bold'
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          font: {
            family: "'Inter', sans-serif",
            size: 12
          }
        }
      },
      x: {
        ticks: {
          font: {
            family: "'Inter', sans-serif",
            size: 12
          }
        }
      }
    }
  }

  return (
    <div className="space-y-8 p-6 bg-gray-50 dark:bg-gray-900 rounded-lg">
      <h2 className="text-3xl font-bold text-center mt-4 text-gray-800 dark:text-gray-100">Analysis Results 📊</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
          <BoxPlot data={sentimentData} title="Sentiment Distribution 🎢" />
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
          <Bar options={keywordChartOptions} data={keywordChartData} />
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-gray-100">Content 📄</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {result.content && result.content.map((post, index) => (
            <div
              key={index}
              className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700 shadow-md"
            >
              <p className="font-bold text-gray-800 dark:text-gray-100 mb-2">{post.text}</p>
              {post.author && <p className="text-gray-600 dark:text-gray-300">Author: {post.author}</p>}
              {post.group_name && <p className="text-gray-600 dark:text-gray-300">Group/Channel: {post.group_name}</p>}
              {post.sentiment !== undefined && (
                <p className="text-gray-600 dark:text-gray-300">
                  Sentiment: <span className={`font-semibold ${post.sentiment > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {post.sentiment.toFixed(2)}
                  </span>
                </p>
              )}
              {post.keywords?.length > 0 && (
                <p className="text-gray-600 dark:text-gray-300">
                  Keywords: <span className="font-semibold">{post.keywords.join(', ')}</span>
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
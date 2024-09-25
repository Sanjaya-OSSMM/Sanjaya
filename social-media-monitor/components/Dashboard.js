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
  const { sentimentData, keywordData } = result.visualizations

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
      <h2 className="text-3xl font-bold text-center">Analysis Results 📊</h2>
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
        <ul className="space-y-4">
          {result.content.map((post, index) => (
            <li
              key={index}
              className="border border-gray-300 dark:border-gray-600 rounded-md p-4 bg-white dark:bg-gray-700"
            >
              <p className="font-bold">{post.text}</p>
              <p>Author: {post.author}</p>
              <p>Platform: {post.platform}</p>
              <p>Sentiment: {post.sentiment.toFixed(2)}</p>
              <p>Keywords: {post.keywords.join(', ')}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
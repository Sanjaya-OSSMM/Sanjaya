import { Scatter } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

function calculateBoxPlotData(data) {
  const sortedData = data.sort((a, b) => a - b)
  const q1 = sortedData[Math.floor(sortedData.length / 4)]
  const median = sortedData[Math.floor(sortedData.length / 2)]
  const q3 = sortedData[Math.floor((sortedData.length * 3) / 4)]
  const min = sortedData[0]
  const max = sortedData[sortedData.length - 1]
  return { min, q1, median, q3, max }
}

export default function BoxPlot({ data, title }) {
  const datasets = Object.entries(data).map(([platform, sentiments], index) => {
    const { min, q1, median, q3, max } = calculateBoxPlotData(sentiments)
    return {
      label: platform,
      data: [
        { x: index, y: min },
        { x: index, y: q1 },
        { x: index, y: median },
        { x: index, y: q3 },
        { x: index, y: max },
      ],
      backgroundColor: `hsl(${index * 60}, 70%, 50%)`,
      borderColor: `hsl(${index * 60}, 70%, 40%)`,
      borderWidth: 1,
      pointRadius: 6,
      pointHoverRadius: 8,
    }
  })

  const chartData = {
    datasets,
  }

  const options = {
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
        text: title,
        font: {
          family: "'Inter', sans-serif",
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        callbacks: {
          label: (context) => {
            const dataIndex = context.dataIndex;
            const dataset = context.dataset;
            const value = dataset.data[dataIndex].y;
            const labels = ['Min', 'Q1', 'Median', 'Q3', 'Max'];
            return `${dataset.label} - ${labels[dataIndex]}: ${value.toFixed(2)}`;
          }
        }
      }
    },
    scales: {
      x: {
        type: 'category',
        labels: Object.keys(data),
        ticks: {
          font: {
            family: "'Inter', sans-serif",
            size: 12
          }
        }
      },
      y: {
        beginAtZero: true,
        ticks: {
          font: {
            family: "'Inter', sans-serif",
            size: 12
          }
        }
      },
    },
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
      <Scatter options={options} data={chartData} />
    </div>
  )
}
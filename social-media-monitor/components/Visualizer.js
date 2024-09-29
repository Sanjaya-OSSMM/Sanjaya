import React from 'react'
import { Scatter, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
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

export default function BoxPlot({ data, title, type }) {
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

  if (type === 'boxplot') {
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

    const chartData = { datasets }

    options.plugins.tooltip = {
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

    options.scales.x.type = 'category'
    options.scales.x.labels = Object.keys(data)

    return (
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
        <Scatter options={options} data={chartData} />
      </div>
    )
  } else if (type === 'bar') {
    const chartData = {
      labels: Object.keys(data),
      datasets: [
        {
          label: 'Keyword Frequency',
          data: Object.values(data),
          backgroundColor: 'rgba(59, 130, 246, 0.6)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 1,
        },
      ],
    }

    return (
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
        <Bar options={options} data={chartData} />
      </div>
    )
  }

  return null
}
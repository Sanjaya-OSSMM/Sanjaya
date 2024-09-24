import React from 'react';
import { Box, useColorMode } from '@chakra-ui/react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Scatter } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function calculateBoxPlotData(data) {
  const sortedData = data.sort((a, b) => a - b);
  const q1 = sortedData[Math.floor(sortedData.length / 4)];
  const median = sortedData[Math.floor(sortedData.length / 2)];
  const q3 = sortedData[Math.floor((sortedData.length * 3) / 4)];
  const min = sortedData[0];
  const max = sortedData[sortedData.length - 1];
  return { min, q1, median, q3, max };
}

function BoxPlot({ data, title }) {
  const { colorMode } = useColorMode();

  const datasets = Object.entries(data).map(([platform, sentiments], index) => {
    const { min, q1, median, q3, max } = calculateBoxPlotData(sentiments);
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
    };
  });

  const chartData = {
    datasets,
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: title,
      },
    },
    scales: {
      x: {
        type: 'category',
        labels: Object.keys(data),
      },
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <Box boxShadow="md" p={4} borderRadius="md" backgroundColor={colorMode === 'light' ? 'white' : 'gray.700'}>
      <Scatter options={options} data={chartData} />
    </Box>
  );
}

export default BoxPlot;
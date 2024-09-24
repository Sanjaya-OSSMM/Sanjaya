import React from 'react';
import { Box, Heading, VStack, Text, List, ListItem, SimpleGrid, useColorMode } from '@chakra-ui/react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import BoxPlot from './BoxPlot';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function Dashboard({ result }) {
  const { sentimentData, keywordData } = result.visualizations;
  const { colorMode } = useColorMode();

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
    <VStack spacing={8} align="stretch">
      <Heading as="h2" size="xl" textAlign="center">
        Analysis Results 📊
      </Heading>
      <SimpleGrid columns={[1, null, 2]} spacing={8}>
        <Box boxShadow="md" p={4} borderRadius="md" backgroundColor={colorMode === 'light' ? 'white' : 'gray.700'}>
          <BoxPlot data={sentimentData} title="Sentiment Distribution 🎢" />
        </Box>
        <Box boxShadow="md" p={4} borderRadius="md" backgroundColor={colorMode === 'light' ? 'white' : 'gray.700'}>
          <Bar options={keywordChartOptions} data={keywordChartData} />
        </Box>
      </SimpleGrid>
      <Box boxShadow="md" p={4} borderRadius="md" backgroundColor={colorMode === 'light' ? 'white' : 'gray.700'}>
        <Heading as="h3" size="lg" mb={4}>
          Content 📄
        </Heading>
        <List spacing={4}>
          {result.content.map((post, index) => (
            <ListItem
              key={index}
              borderWidth={1}
              borderRadius="md"
              p={4}
              backgroundColor={colorMode === 'light' ? 'white' : 'gray.600'}
              color={colorMode === 'light' ? 'gray.800' : 'white'}
            >
              <Text fontWeight="bold">{post.text}</Text>
              <Text>Author: {post.author}</Text>
              <Text>Platform: {post.platform}</Text>
              <Text>Sentiment: {post.sentiment.toFixed(2)}</Text>
              <Text>Keywords: {post.keywords.join(', ')}</Text>
            </ListItem>
          ))}
        </List>
      </Box>
    </VStack>
  );
}

export default Dashboard;
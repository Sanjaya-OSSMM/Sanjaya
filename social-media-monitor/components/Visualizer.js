import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

// Sentiment Distribution Chart
export const SentimentDistribution = ({ data, title }) => {
  const sentimentCounts = data.reduce((acc, { sentiment }) => {
    acc[sentiment] = (acc[sentiment] || 0) + 1;
    return acc;
  }, {});

  const chartData = Object.entries(sentimentCounts).map(([sentiment, count]) => ({
    sentiment,
    count,
  }));

  return (
    <div>
      <h3 className="text-xl font-semibold text-center mb-4 text-gray-800 dark:text-gray-100">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="sentiment" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Keyword Frequency Chart
export const KeywordFrequency = ({ data, title }) => {
  const sortedData = Object.entries(data)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([keyword, count]) => ({ keyword, count }));

  return (
    <div>
      <h3 className="text-xl font-semibold text-center mb-4 text-gray-800 dark:text-gray-100">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={sortedData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="keyword" type="category" />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#82ca9d" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

// Top Authors Chart
export const TopAuthors = ({ data, title }) => {
  const sortedData = Object.entries(data)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([author, count]) => ({ author, count }));

  return (
    <div>
      <h3 className="text-xl font-semibold text-center mb-4 text-gray-800 dark:text-gray-100">{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={sortedData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="author" type="category" />
          <Tooltip />
          <Legend />
          <Bar dataKey="count" fill="#ffc658" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
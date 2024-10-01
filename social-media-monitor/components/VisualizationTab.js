import React from 'react';
import { 
  SentimentDistribution, 
  KeywordFrequency,
  TopAuthors
} from './Visualizer';

export default function Visualize({ result }) {
  if (!result || !result.content || result.content.length === 0) {
    return <div className="text-center text-gray-600 dark:text-gray-400 mt-8">No visualizations available</div>;
  }

  // Prepare data for visualization
  const sentimentData = result.content.map(post => ({
    sentiment: post.sentiment || 'Neutral', // Provide a default if sentiment is missing
    timestamp: new Date(post.timestamp)
  }));

  const keywordData = result.content.reduce((acc, post) => {
    if (post.keywords) {
      post.keywords.forEach(keyword => {
        acc[keyword] = (acc[keyword] || 0) + 1;
      });
    }
    return acc;
  }, {});

  const authorData = result.content.reduce((acc, post) => {
    const author = post.author || 'Unknown Author'; // Default to avoid issues with missing author
    acc[author] = (acc[author] || 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-8 p-6 bg-gray-50 dark:bg-gray-900 rounded-lg">
      <h2 className="text-3xl font-bold text-center mt-4 text-gray-800 dark:text-gray-100">
        Analysis Results 📊
        {result.content.length !== result.totalPosts && (
          <span className="text-sm font-normal ml-2">
            (Showing {result.content.length} of {result.totalPosts} posts)
          </span>
        )}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
          <SentimentDistribution data={sentimentData} title="Sentiment Distribution 🎢" />
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
          <KeywordFrequency data={keywordData} title="Keyword Frequency 🎢" />
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg col-span-2">
          <TopAuthors data={authorData} title="Top Authors ✍️" />
        </div>
      </div>
    </div>
  );
}
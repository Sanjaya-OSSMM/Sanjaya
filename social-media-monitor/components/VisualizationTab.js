import React from 'react'
import BoxPlot from './Visualizer'

export default function Visualize({ result }) {
  if (!result || !result.content || result.content.length === 0) {
    return <div className="text-center text-gray-600 dark:text-gray-400 mt-8">No visualizations available</div>;
  }

  // Prepare data for visualization
  const sentimentData = result.content.reduce((acc, post) => {
    acc[post.platform] = (acc[post.platform] || []).concat(post.sentiment);
    return acc;
  }, {});

  const keywordData = result.content.reduce((acc, post) => {
    post.keywords.forEach(keyword => {
      acc[keyword] = (acc[keyword] || 0) + 1;
    });
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
          <BoxPlot data={sentimentData} title="Sentiment Distribution 🎢" type="boxplot" />
        </div>
        <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg">
          <BoxPlot data={keywordData} title="Keyword Frequency" type="bar" />
        </div>
      </div>
    </div>
  );
}
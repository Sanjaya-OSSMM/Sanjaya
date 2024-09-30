import React from 'react'
import BoxPlot from './Visualizer'

export default function Visualize({ result }) {
  if (!result || !result.visualizations) {
    return <div className="text-center text-gray-600 dark:text-gray-400 mt-8">No visualizations available</div>;
  }

  const { sentimentData, keywordData } = result.visualizations;

  return (
    <div className="space-y-8 p-6 bg-gray-50 dark:bg-gray-900 rounded-lg">
      <h2 className="text-3xl font-bold text-center mt-4 text-gray-800 dark:text-gray-100">Analysis Results 📊</h2>
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

import { useState } from 'react';
import axios from 'axios';
import { FiFilter, FiSearch } from 'react-icons/fi';

export default function InputForm({ onAnalysis, platform, postLimit, onPostLimitChange, onOpenFilterDialog, filterOptions }) {
  const [keyword, setKeyword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!platform) {
      alert('Please select a platform before searching.');
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post('http://localhost:5000/api/monitor', { 
        platform, 
        keyword, 
        postLimit,
        ...filterOptions
      });
      onAnalysis(response.data);
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while searching. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card p-6 rounded-lg shadow-lg mb-8">
      <div className="flex space-x-4 mb-4">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Enter Keyword"
          className="flex-grow px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
          required
        />
        {platform === 'telegram' && (
          <>
            <select
              value={postLimit}
              onChange={(e) => onPostLimitChange(Number(e.target.value))}
              className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
            >
              <option value={10}>10 posts</option>
              <option value={50}>50 posts</option>
              <option value={100}>100 posts</option>
              <option value={200}>200 posts</option>
            </select>

            <button
              type="button"
              onClick={onOpenFilterDialog}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-400 dark:focus:ring-gray-600 flex items-center justify-center"
              aria-label="Open filter options"
            >
              <FiFilter size={20} />
            </button>
          </>
        )}
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 dark:bg-blue-700 hover:bg-blue-600 dark:hover:bg-blue-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 flex items-center justify-center disabled:bg-gray-300 disabled:text-gray-500"
          disabled={isLoading}
          aria-label="Search"
        >
          {isLoading ? (
            'Searching...'
          ) : (
            <FiSearch size={20} />
          )}
        </button>
      </div>
      {platform && (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Selected platform: <span className="font-semibold">{platform}</span>
        </p>
      )}
    </form>
  )
}
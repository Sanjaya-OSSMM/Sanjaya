import { useState } from 'react'
import axios from 'axios'

export default function InputForm({ onAnalysis, platform, postLimit, onPostLimitChange }) {
  const [keyword, setKeyword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [includeMedia, setIncludeMedia] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!platform) {
      alert('Please select a platform before searching.')
      return
    }
    setIsLoading(true)
    try {
      const response = await axios.post('http://localhost:5000/api/monitor', { 
        platform, 
        keyword, 
        postLimit,
        includeMedia 
      })
      onAnalysis(response.data)
    } catch (error) {
      console.error('Error:', error)
      alert('An error occurred while searching. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

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
        )}
        <button
          type="submit"
          className="button bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:text-gray-500"
          disabled={isLoading}
        >
          {isLoading ? 'Searching...' : 'Search'}
        </button>
      </div>
      {platform === 'telegram' && (
        <div className="flex items-center mt-2">
          <input
            type="checkbox"
            id="includeMedia"
            checked={includeMedia}
            onChange={(e) => setIncludeMedia(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="includeMedia" className="text-sm text-gray-600 dark:text-gray-400">
            Include media in search results
          </label>
        </div>
      )}
      {platform && (
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Selected platform: <span className="font-semibold">{platform}</span>
        </p>
      )}
    </form>
  )
}
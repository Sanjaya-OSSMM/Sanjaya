import { useState } from 'react'
import axios from 'axios'

export default function InputForm({ onAnalysis, theme, platform }) {
  const [keyword, setKeyword] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('http://localhost:5000/api/monitor', { platform, keyword })
      onAnalysis(response.data)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card p-6 rounded-lg shadow-md bg-white dark:bg-gray-800">
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Enter Keyword"
            className="form-input flex-grow bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
            required
          />
          <button
            type="submit"
            className={`button px-6 py-2 rounded-lg font-semibold text-white transition-colors ${
              theme === 'dark' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-blue-500 hover:bg-blue-600'
            }`}
          >
            Submit
          </button>
        </div>
      </div>
    </form>
  )
}
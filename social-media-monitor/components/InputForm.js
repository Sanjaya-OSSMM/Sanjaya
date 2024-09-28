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
    <form onSubmit={handleSubmit} className="glass-card p-6 rounded-lg shadow-md">
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Enter Keyword"
            className="form-input flex-grow"
            required
          />
          <button
            type="submit"
            className={`button ${theme === 'dark' ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-blue-500 hover:bg-blue-600'}`}
          >
            Submit
          </button>
        </div>
      </div>
    </form>
  )
}
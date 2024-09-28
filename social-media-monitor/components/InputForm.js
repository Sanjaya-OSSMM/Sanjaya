import { useState } from 'react'
import axios from 'axios'

export default function InputForm({ onAnalysis, theme }) {
  const [platform, setPlatform] = useState('')
  const [keyword, setKeyword] = useState('')
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      const response = await axios.post('http://localhost:5000/api/monitor', { platform, keyword, isLoggedIn })
      onAnalysis(response.data)
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card p-6 rounded-lg shadow-md">
      <div className="space-y-6">
        <div>
          <label htmlFor="platform" className="block mb-2 text-lg font-bold">Platform 📱</label>
          <select
            id="platform"
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="form-input"
            required
          >
            <option value="">Select Platform</option>
            <option value="twitter">Twitter 🐦</option>
            <option value="instagram">Instagram 📷</option>
          </select>
        </div>
        <div>
          <label htmlFor="keyword" className="block mb-2 text-lg font-bold">Keyword 🔑</label>
          <input
            id="keyword"
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="Enter keyword"
            className="form-input"
            required
          />
        </div>
        <div className="flex items-center">
          <input
            id="logged-in"
            type="checkbox"
            checked={isLoggedIn}
            onChange={(e) => setIsLoggedIn(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="logged-in" className="text-lg font-semibold">Logged in</label>
        </div>
        <button
          type="submit"
          className={`button ${theme === 'dark' ? 'button-dark' : 'button-light'}`}
        >
          Monitor 🔍
        </button>
      </div>
    </form>
  )
}
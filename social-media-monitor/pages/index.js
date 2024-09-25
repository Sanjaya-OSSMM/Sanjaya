import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import InputForm from '../components/InputForm'
import Dashboard from '../components/Dashboard'

export default function Home() {
  const [analysisResult, setAnalysisResult] = useState(null)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Ensures the component is only rendered when on the client side
  useEffect(() => {
    setMounted(true)
  }, [])

  const handleAnalysis = (result) => {
    setAnalysisResult(result)
  }

  // Prevent rendering on the server side
  if (!mounted) return null

  return (
    <div className={`max-w-7xl mx-auto p-8 min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'dark-mode' : 'light-mode'}`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-center">
          Social Media Monitoring Tool 🔍
        </h1>
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-md glass-card shadow-lg hover:scale-105 transition-transform"
        >
          {theme === 'dark' ? '🌞' : '🌙'}
        </button>
      </div>
      
      {/* InputForm */}
      <InputForm onAnalysis={handleAnalysis} />

      {/* Display Dashboard when result is available */}
      {analysisResult && <Dashboard result={analysisResult} />}

      {/* Footer */}
      <footer className="w-full text-center p-4 mt-8 border-t border-gray-300 dark:border-gray-600">
        <p>Built with Next.js and Tailwind CSS with ❤️ by Rasenkai © 2024</p>
      </footer>
    </div>
  )
}
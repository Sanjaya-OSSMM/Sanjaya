import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import InputForm from '../components/InputForm'
import Dashboard from '../components/Dashboard'

export default function Home() {
  const [analysisResult, setAnalysisResult] = useState(null)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Ensures the component is only rendered on the client side
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
      <header className="flex justify-between items-center mb-8">
        <div className="flex flex-col">
          <h1 className="text-4xl font-bold text-left" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Sanjaya
          </h1>
          <h2 className="text-2xl font-semibold text-left mt-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Social Media Monitoring Tool 🔍
          </h2>
        </div>
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-md glass-card shadow-lg hover:scale-105 transition-transform"
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? '🌞' : '🌙'}
        </button>
      </header>

      <main>
        {/* InputForm */}
        <InputForm onAnalysis={handleAnalysis} theme={theme} />

        {/* Display Dashboard when result is available */}
        {analysisResult && <Dashboard result={analysisResult} />}
      </main>

      {/* Footer */}
      <footer className="w-full text-center p-4 mt-8 border-t border-gray-300 dark:border-gray-600" style={{ fontFamily: 'Roboto, sans-serif' }}>
        <p>Built with Next.js and Tailwind CSS with ❤️ by Rasenkai © {new Date().getFullYear()}</p>
      </footer>
    </div>
  )
}
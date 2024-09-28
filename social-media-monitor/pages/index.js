import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import InputForm from '../components/InputForm'
import Dashboard from '../components/Dashboard'
import Sidebar from '../components/Sidebar'

export default function Home() {
  const [analysisResult, setAnalysisResult] = useState(null)
  const [platform, setPlatform] = useState('')
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleAnalysis = (result) => {
    setAnalysisResult(result)
  }

  if (!mounted) return null

  return (
    <div className={`flex min-h-screen transition-colors duration-300 ${theme === 'dark' ? 'dark-mode' : 'light-mode'}`}>
      <Sidebar 
        theme={theme} 
        setTheme={setTheme} 
        platform={platform} 
        setPlatform={setPlatform}
      />
      <div className="flex-1 p-8">
        <main>
          <InputForm 
            onAnalysis={handleAnalysis} 
            theme={theme} 
            platform={platform}
          />
          {analysisResult && <Dashboard result={analysisResult} />}
        </main>
      </div>
    </div>
  )
}
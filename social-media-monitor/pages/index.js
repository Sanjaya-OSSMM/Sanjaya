import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import InputForm from '../components/InputForm'
import Dashboard from '../components/Dashboard'
import Sidebar from '../components/Sidebar'
import Visualize from '../components/VisualizationTab'

export default function Home() {
  const [analysisResult, setAnalysisResult] = useState(null)
  const [visualizationData, setVisualizationData] = useState(null)
  const [platform, setPlatform] = useState('')
  const [view, setView] = useState('dashboard')
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleAnalysis = (result) => {
    setAnalysisResult(result)
    setVisualizationData({
      content: result.content,
      totalPosts: result.content.length
    })
  }

  const handleVisualize = (selectedPosts) => {
    const postsToVisualize = selectedPosts.length > 0 ? selectedPosts : analysisResult.content
    setVisualizationData({
      content: postsToVisualize,
      totalPosts: analysisResult.content.length
    })
    setView('visualize')
  }

  const resetVisualization = () => {
    setVisualizationData(null)
    setView('dashboard')
  }

  if (!mounted) return null

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar 
        theme={theme} 
        setTheme={setTheme} 
        platform={platform} 
        setPlatform={setPlatform}
        setView={setView}
      />
      <div className="flex-1 p-8">
        <main>
          <InputForm 
            onAnalysis={handleAnalysis} 
            platform={platform}
            resetVisualization={resetVisualization}
          />
          {view === 'dashboard' && analysisResult && 
            <Dashboard result={analysisResult} onVisualize={handleVisualize} />
          }
          {view === 'visualize' && visualizationData && 
            <Visualize result={visualizationData} />
          }
        </main>
      </div>
    </div>
  )
}
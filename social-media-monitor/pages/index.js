import { useState, useEffect } from 'react'
import { useTheme } from 'next-themes'
import InputForm from '../components/Input/InputForm'
import Dashboard from '../components/View/Dashboard/Dashboard'
import Sidebar from '../components/Sidebar/Sidebar'
import Visualize from '../components/View/Visualization/VisualizationTab'
import FilterDialog from '../components/Input/FilterDialog'
import TranslationPage from '../components/Translation/TranslationPage'
import CryptoTracker from '../components/CryptoTracker/CryptoTracker'

export default function Home() {
  const [analysisResult, setAnalysisResult] = useState(null)
  const [visualizationData, setVisualizationData] = useState(null)
  const [platform, setPlatform] = useState('')
  const [view, setView] = useState('dashboard')
  const [postLimit, setPostLimit] = useState(100)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isFilterDialogOpen, setIsFilterDialogOpen] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const [filterOptions, setFilterOptions] = useState({
    username: '',
    userId: '',
    groupName: '',
    groupUsername: '',
    operators: [],
    includeMedia: false,
  })
  const [postsToTranslate, setPostsToTranslate] = useState([])

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleAnalysis = (result) => {
    setAnalysisResult(result)
    setVisualizationData({
      content: result.content,
      totalPosts: result.content.length
    })
    setHasSearched(true)
    setView('dashboard')
  }

  const handleVisualize = (selectedPosts) => {
    const postsToVisualize = selectedPosts.length > 0 ? selectedPosts : analysisResult.content
    setVisualizationData({
      content: postsToVisualize,
      totalPosts: analysisResult.content.length
    })
    setView('visualize')
  }

  const handleTranslate = (selectedPosts) => {
    setPostsToTranslate(selectedPosts)
    setView('translate')
  }

  const resetVisualization = () => {
    setVisualizationData(null)
    setView('dashboard')
  }

  const handlePostLimitChange = (limit) => {
    setPostLimit(limit)
  }

  const handleApplyFilters = (newFilters) => {
    setFilterOptions(newFilters)
    setIsFilterDialogOpen(false)
  }

  const handlePlatformChange = (newPlatform) => {
    setPlatform(newPlatform)
    if (view === 'translate') {
      setView('dashboard')
    }
  }

  if (!mounted) return null

  const renderMainContent = () => {
    switch (view) {
      case 'dashboard':
        return (
          <>
            <InputForm 
              onAnalysis={handleAnalysis} 
              platform={platform}
              resetVisualization={resetVisualization}
              postLimit={postLimit}
              onPostLimitChange={handlePostLimitChange}
              onOpenFilterDialog={() => setIsFilterDialogOpen(true)}
              filterOptions={filterOptions}
            />
            {analysisResult && 
              <Dashboard 
                result={analysisResult} 
                onVisualize={handleVisualize}
                onTranslate={handleTranslate}
                postLimit={postLimit}
              />
            }
          </>
        )
      case 'visualize':
        return visualizationData && <Visualize result={visualizationData} />
      case 'translate':
        return <TranslationPage postsToTranslate={postsToTranslate} />
      case 'cryptoTracker':
        return <CryptoTracker />
      default:
        return null
    }
  }

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar 
        theme={theme} 
        setTheme={setTheme} 
        platform={platform} 
        setPlatform={handlePlatformChange}
        view={view}
        setView={setView}
        hasSearched={hasSearched}
      />
      <div className="flex-1 p-8">
        <main>
          {renderMainContent()}
        </main>
      </div>
      <FilterDialog
        isOpen={isFilterDialogOpen}
        onClose={() => setIsFilterDialogOpen(false)}
        onApply={handleApplyFilters}
        initialFilters={filterOptions}
      />
    </div>
  )
}
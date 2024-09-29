import React from 'react'

export default function Sidebar({ theme, setTheme, platform, setPlatform }) {
  return (
    <div className="w-64 bg-gray-100 dark:bg-gray-800 p-6 flex flex-col justify-between h-screen">
      <div>
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-center text-gray-800 dark:text-gray-100">
            Sanjaya 🔍
          </h1>
          <h2 className="text-sm font-semibold text-center mt-1 text-gray-600 dark:text-gray-300">
            Social media monitoring tool
          </h2>
        </header>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold mb-2 text-gray-700 dark:text-gray-200">Platform</h3>
          <button
            onClick={() => setPlatform('twitter')}
            className={`w-full px-4 py-2 rounded transition-colors ${
              platform === 'twitter'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-900'
            }`}
          >
            Twitter
          </button>
          <button
            onClick={() => setPlatform('telegram')}
            className={`w-full px-4 py-2 rounded transition-colors ${
              platform === 'telegram'
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-900'
            }`}
          >
            Telegram
          </button>
        </div>
      </div>
      <div className="space-y-4">
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="w-full px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? '🌞' : '🌙'}
        </button>
        <div className="text-sm text-center mt-1 text-gray-600 dark:text-gray-400">
          <p>Built with ❤️ </p>
          <p>Rasenkai © {new Date().getFullYear()}</p>
        </div>
      </div>
    </div>
  )
}
import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { FaTwitter, FaTelegramPlane } from 'react-icons/fa';
import { MdDashboard } from 'react-icons/md';
import { RiAppsLine } from 'react-icons/ri';
import { HiOutlineViewBoards } from 'react-icons/hi';
import { BsFillMoonStarsFill, BsSunFill } from 'react-icons/bs';
import { FaChartBar } from 'react-icons/fa'; // Added for Visualize icon

export default function Sidebar({ platform, setPlatform, view, setView, hasSearched }) {
  const [privacyWord, setPrivacyWord] = useState('');
  const { theme, setTheme } = useTheme();
  const [isPlatformOpen, setIsPlatformOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(true);

  const privacyWords = ['privacy', 'security', 'freedom', 'confidentiality', 'anonymity', 'data protection', 'transparency', 'trust', 'protection'];

  useEffect(() => {
    const randomWord = privacyWords[Math.floor(Math.random() * privacyWords.length)];
    setPrivacyWord(randomWord);
  }, []);

  return (
    <div className="w-64 bg-white dark:bg-gray-800 p-6 flex flex-col justify-between h-screen">
      <div>
        <header className="mb-8">
          <div className="flex justify-center items-center mb-2">
            <h1 className="text-4xl font-bold ml-2">
              Sanjaya
            </h1>
          </div>
          <h2 className="text-sm font-semibold text-center mt-1 text-gray-600 dark:text-gray-300">
            Social media monitoring tool
          </h2>
        </header>

        <nav className="space-y-2">
          <div>
            <button 
              onClick={() => setIsPlatformOpen(!isPlatformOpen)}
              className="w-full px-4 py-2 text-left flex items-center justify-between text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              <span className="flex items-center">
                <RiAppsLine size={20} className="mr-2" /> Platform
              </span>
              {isPlatformOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
            </button>
            {isPlatformOpen && (
              <div className="ml-4 mt-2 space-y-2">
                <button
                  onClick={() => setPlatform('twitter')}
                  className={`w-full px-4 py-2 text-left text-sm flex items-center ${platform === 'twitter' ? 'text-blue-500' : 'text-gray-600 dark:text-gray-400'} hover:text-blue-500`}
                >
                  <FaTwitter size={18} className="mr-2" /> Twitter
                </button>
                <button
                  onClick={() => setPlatform('telegram')}
                  className={`w-full px-4 py-2 text-left text-sm flex items-center ${platform === 'telegram' ? 'text-blue-500' : 'text-gray-600 dark:text-gray-400'} hover:text-blue-500`}
                >
                  <FaTelegramPlane size={18} className="mr-2" /> Telegram
                </button>
              </div>
            )}
          </div>

          {platform && hasSearched && (
            <div>
              <button 
                onClick={() => setIsViewOpen(!isViewOpen)}
                className="w-full px-4 py-2 text-left flex items-center justify-between text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <span className="flex items-center">
                  <HiOutlineViewBoards size={20} className="mr-2" /> View
                </span>
                {isViewOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
              </button>
              {isViewOpen && (
                <div className="ml-4 mt-2 space-y-2">
                  <button
                    onClick={() => setView('dashboard')}
                    className={`w-full px-4 py-2 text-left text-sm flex items-center ${
                      view === 'dashboard' ? 'bg-blue-500 text-white' : 'text-gray-600 dark:text-gray-400'
                    } hover:bg-blue-500 hover:text-white rounded`}
                  >
                    <MdDashboard size={18} className="mr-2" /> Dashboard
                  </button>
                  <button
                    onClick={() => setView('visualize')}
                    className={`w-full px-4 py-2 text-left text-sm flex items-center ${
                      view === 'visualize' ? 'bg-blue-500 text-white' : 'text-gray-600 dark:text-gray-400'
                    } hover:bg-blue-500 hover:text-white rounded`}
                  >
                    <FaChartBar size={18} className="mr-2" /> Visualize
                  </button>
                </div>
              )}
            </div>
          )}
        </nav>
      </div>

      <div className="space-y-4">
        <button
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="w-full px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors flex items-center justify-center"
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? <BsSunFill size={18} /> : <BsFillMoonStarsFill size={18} />}
          <span className="ml-2">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>

        <div className="text-sm text-center mt-1 text-gray-600 dark:text-gray-400">
          <p>Built with {privacyWord} </p>
          <p>Rasenkai © {new Date().getFullYear()}</p>
        </div>
      </div>
    </div>
  )
}
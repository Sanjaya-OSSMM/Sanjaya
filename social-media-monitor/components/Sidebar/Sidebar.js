import React, { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import { BsFillMoonStarsFill, BsSunFill } from 'react-icons/bs';
import { FaSearch, FaBitcoin } from 'react-icons/fa';
import Navigation from './Navigation';

export default function Sidebar({ platform, setPlatform, view, setView, hasSearched }) {
  const [privacyWord, setPrivacyWord] = useState('');
  const { theme, setTheme } = useTheme();

  const privacyWords = ['privacy', 'security', 'freedom', 'confidentiality', 'anonymity', 'data protection', 'transparency', 'trust', 'protection'];

  useEffect(() => {
    const randomWord = privacyWords[Math.floor(Math.random() * privacyWords.length)];
    setPrivacyWord(randomWord);
  }, []);

  return (
    <div className="w-64 bg-white dark:bg-gray-800 p-6 flex flex-col justify-between h-screen">
      <div>
        <header className="mb-8">
          <div className="flex items-center mb-2">
            <h1 className="ml-4 text-4xl font-bold">Sanjaya</h1>
            <FaSearch className="text-xl ml-2" />
          </div>
          <h2 className="text-sm font-semibold text-gray-600 dark:text-gray-300">
            Social media monitoring tool
          </h2>
        </header>

        <Navigation 
          platform={platform} 
          setPlatform={setPlatform} 
          view={view} 
          setView={setView} 
          hasSearched={hasSearched}
        />

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
  );
}
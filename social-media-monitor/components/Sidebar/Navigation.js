import React, { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { FaTwitter, FaTelegramPlane, FaBitcoin } from 'react-icons/fa';
import { MdDashboard, MdTranslate } from 'react-icons/md';
import { RiAppsLine } from 'react-icons/ri';
import { HiOutlineViewBoards } from 'react-icons/hi';
import { FaChartBar } from 'react-icons/fa';

export default function Navigation({ platform, setPlatform, view, setView, hasSearched }) {
  const [isPlatformOpen, setIsPlatformOpen] = useState(false);
  const [isViewOpen, setIsViewOpen] = useState(true);

  const handlePlatformChange = (newPlatform) => {
    setPlatform(newPlatform);
    if (view === 'translate') {
      setView('dashboard');
    }
  };

  return (
    <nav className="space-y-2 mt-6">
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
              onClick={() => handlePlatformChange('twitter')}
              className={`w-full px-4 py-2 text-left text-sm flex items-center ${platform === 'twitter' && view !== 'translate' ? 'text-blue-500' : 'text-gray-600 dark:text-gray-400'} hover:text-blue-500`}
            >
              <FaTwitter size={18} className="mr-2" /> Twitter
            </button>
            <button
              onClick={() => handlePlatformChange('telegram')}
              className={`w-full px-4 py-2 text-left text-sm flex items-center ${platform === 'telegram' && view !== 'translate' ? 'text-blue-500' : 'text-gray-600 dark:text-gray-400'} hover:text-blue-500`}
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

      <button
        onClick={() => setView('translate')}
        className={`w-full px-4 py-2 text-left flex items-center ${
          view === 'translate' ? 'bg-blue-500 text-white' : 'text-gray-600 dark:text-gray-400'
        } hover:bg-blue-500 hover:text-white rounded`}
      >
        <MdTranslate size={20} className="mr-2" /> Translate
      </button>
      <button
        onClick={() => setView('cryptoTracker')}
        className={`w-full px-4 py-2 text-left flex items-center ${
          view === 'cryptoTracker' ? 'bg-blue-500 text-white' : 'text-gray-600 dark:text-gray-400'
        } hover:bg-blue-500 hover:text-white rounded`}
      >
        <FaBitcoin size={20} className="mr-2" /> Crypto Tracker
      </button>
    </nav>
  );
}
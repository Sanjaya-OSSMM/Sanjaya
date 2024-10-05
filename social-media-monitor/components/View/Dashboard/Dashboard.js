import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { MdContentPaste, MdTranslate } from 'react-icons/md';
import PostCard from './PostCard';

export default function Dashboard({ result, onVisualize, onTranslate }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPosts, setSelectedPosts] = useState([]);
  const [selectMode, setSelectMode] = useState(false);
  const postsPerPage = 10;

  useEffect(() => {
    setSelectedPosts([]);
    setSelectMode(false);
    setCurrentPage(1);
  }, [result]);

  if (!result || !result.content || result.content.length === 0) {
    return <div className="text-center text-gray-600 dark:text-gray-400 mt-8">No content available</div>;
  }

  const totalPosts = result.content.length;
  const totalPages = Math.ceil(totalPosts / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = Math.min(startIndex + postsPerPage, totalPosts);
  const currentPosts = result.content.slice(startIndex, endIndex);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const handleSelectPost = (post) => {
    setSelectedPosts(prev => 
      prev.includes(post) ? prev.filter(p => p !== post) : [...prev, post]
    );
  };

  const handleSubmitSelected = (action) => {
    if (action === 'visualize') {
      onVisualize(selectedPosts);
    } else if (action === 'translate') {
      onTranslate(selectedPosts);
    }
    setSelectMode(false);
    setSelectedPosts([]);
  };

  return (
    <div className="space-y-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="flex items-center justify-between">
        <button
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
          className="flex items-center justify-center w-12 h-12 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:text-gray-500 rounded-full"
        >
          <FaChevronLeft className="text-white" />
        </button>
        <h2 className="text-3xl font-bold text-center mt-4">Content Posts <MdContentPaste className="inline-block ml-2" /></h2>
        <button
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
          className="flex items-center justify-center w-12 h-12 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:text-gray-500 rounded-full"
        >
          <FaChevronRight className="text-white" />
        </button>
      </div>

      <div className="text-center text-gray-600 dark:text-gray-300 mt-2">
        Page {currentPage} of {totalPages} | Showing posts {startIndex + 1}-{endIndex} of {totalPosts}
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={() => setSelectMode(!selectMode)}
          className="button bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:text-gray-500"
        >
          {selectMode ? 'Cancel Selection' : 'Select Posts'}
        </button>
        {selectMode && (
          <div className="space-x-2">
            <button
              onClick={() => handleSubmitSelected('visualize')}
              className="button bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:text-gray-500"
              disabled={selectedPosts.length === 0}
            >
              Visualize Selected ({selectedPosts.length})
            </button>
            <button
              onClick={() => handleSubmitSelected('translate')}
              className="button bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:text-gray-500"
              disabled={selectedPosts.length === 0}
            >
              <MdTranslate className="inline-block mr-2" />
              Translate Selected ({selectedPosts.length})
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {currentPosts.map((post, index) => (
          <PostCard
            key={startIndex + index}
            post={post}
            selectMode={selectMode}
            isSelected={selectedPosts.includes(post)}
            onSelect={() => handleSelectPost(post)}
          />
        ))}
      </div>
    </div>
  )
}
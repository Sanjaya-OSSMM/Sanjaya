import React, { useState, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight, FaCheck } from 'react-icons/fa';
import { MdContentPaste } from 'react-icons/md';

export default function Dashboard({ result, onVisualize }) {
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

  const handleSubmitSelected = () => {
    onVisualize(selectedPosts);
    setSelectMode(false);
    setSelectedPosts([]);
  };

  const renderMedia = (post) => {
    if (post.media && post.media.type && post.media.data) {
      switch (post.media.type) {
        case 'video':
          return (
            <video controls className="w-full h-auto mb-2">
              <source src={post.media.data} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          );
        case 'photo':
          return (
            <img 
              src={post.media.data} 
              alt="Post media" 
              className="w-full h-auto mb-2 rounded-lg"
            />
          );
        default:
          return null;
      }
    }
    return null;
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
          <button
            onClick={handleSubmitSelected}
            className="button bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:text-gray-500"
            disabled={selectedPosts.length === 0}
          >
            Visualize Selected ({selectedPosts.length})
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {currentPosts.map((post, index) => (
          <div
            key={startIndex + index}
            className={`glass-card p-4 ${
              selectMode && selectedPosts.includes(post)
                ? 'border-blue-500 dark:border-blue-400'
                : 'border-gray-300 dark:border-gray-600'
            }`}
            onClick={() => selectMode && handleSelectPost(post)}
          >
            {selectMode && (
              <div className="flex justify-end mb-2">
                <input
                  type="checkbox"
                  checked={selectedPosts.includes(post)}
                  onChange={() => handleSelectPost(post)}
                  className="h-5 w-5"
                />
              </div>
            )}
            {renderMedia(post)}
            <p className="font-bold mb-2">{post.text}</p>
            {post.author && <p className="text-gray-600 dark:text-gray-300">Author: {post.author}</p>}
            {post.group_name && <p className="text-gray-600 dark:text-gray-300">Group/Channel: {post.group_name}</p>}
            <p className="text-gray-600 dark:text-gray-300">Sentiment: {post.sentiment.toFixed(2)}</p>
            <p className="text-gray-600 dark:text-gray-300">Keywords: {post.keywords.join(', ')}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
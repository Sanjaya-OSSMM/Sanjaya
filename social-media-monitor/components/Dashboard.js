import React, { useState, useEffect } from 'react';

export default function Dashboard({ result, onVisualize }) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedPosts, setSelectedPosts] = useState([]);
  const [selectMode, setSelectMode] = useState(false);
  const postsPerPage = 10;

  useEffect(() => {
    setSelectedPosts([]);
    setSelectMode(false);
  }, [result]);

  if (!result || !result.content || result.content.length === 0) {
    return <div className="text-center text-gray-600 dark:text-gray-400 mt-8">No content available</div>;
  }

  const totalPages = Math.ceil(result.content.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = result.content.slice(startIndex, endIndex);

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
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

  return (
    <div className="space-y-8 p-6 bg-gray-50 dark:bg-gray-900 rounded-lg">
      <div className="flex items-center justify-between">
        <button
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded transition-colors ${
            currentPage === 1
              ? 'bg-gray-300 text-gray-500'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          Previous
        </button>
        <h2 className="text-3xl font-bold text-center mt-4 text-gray-800 dark:text-gray-100">Content Posts 📄</h2>
        <button
          onClick={goToNextPage}
          disabled={currentPage === totalPages}
          className={`px-4 py-2 rounded transition-colors ${
            currentPage === totalPages
              ? 'bg-gray-300 text-gray-500'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          Next
        </button>
      </div>

      <div className="text-center text-gray-600 dark:text-gray-300 mt-2">
        Page {currentPage} of {totalPages}
      </div>

      <div className="flex justify-between items-center">
        <button
          onClick={() => setSelectMode(!selectMode)}
          className="px-4 py-2 rounded bg-green-500 text-white hover:bg-green-600 transition-colors"
        >
          {selectMode ? 'Cancel Selection' : 'Select Posts'}
        </button>
        {selectMode && (
          <button
            onClick={handleSubmitSelected}
            className="px-4 py-2 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors"
            disabled={selectedPosts.length === 0}
          >
            Visualize Selected ({selectedPosts.length})
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {currentPosts.map((post, index) => (
          <div
            key={index}
            className={`border rounded-lg p-4 bg-gray-50 dark:bg-gray-700 shadow-md ${
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
            <p className="font-bold text-gray-800 dark:text-gray-100 mb-2">{post.text}</p>
            {post.author && <p className="text-gray-600 dark:text-gray-300">Author: {post.author}</p>}
            {post.group_name && <p className="text-gray-600 dark:text-gray-300">Group/Channel: {post.group_name}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}
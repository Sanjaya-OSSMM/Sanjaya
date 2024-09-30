import React, { useState } from 'react';

export default function Dashboard({ result }) {
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 10;

  if (!result || !result.content || result.content.length === 0) {
    return <div className="text-center text-gray-600 dark:text-gray-400 mt-8">No content available</div>;
  }

  // Calculate total pages
  const totalPages = Math.ceil(result.content.length / postsPerPage);

  // Get the posts for the current page
  const startIndex = (currentPage - 1) * postsPerPage;
  const endIndex = startIndex + postsPerPage;
  const currentPosts = result.content.slice(startIndex, endIndex);

  // Handlers for navigating between pages
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

  return (
    <div className="space-y-8 p-6 bg-gray-50 dark:bg-gray-900 rounded-lg">
      <div className="flex items-center justify-between">
        <button
          onClick={goToPreviousPage}
          disabled={currentPage === 1}
          className={`px-4 py-2 rounded transition-colors ${
            currentPage === 1
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-900'
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
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-blue-100 dark:hover:bg-blue-900'
          }`}
        >
          Next
        </button>
      </div>

      <div className="text-center text-gray-600 dark:text-gray-300 mt-2">
        Page {currentPage} of {totalPages}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {currentPosts.map((post, index) => (
          <div
            key={index}
            className="border border-gray-300 dark:border-gray-600 rounded-lg p-4 bg-gray-50 dark:bg-gray-700 shadow-md"
          >
            <p className="font-bold text-gray-800 dark:text-gray-100 mb-2">{post.text}</p>
            {post.author && <p className="text-gray-600 dark:text-gray-300">Author: {post.author}</p>}
            {post.group_name && <p className="text-gray-600 dark:text-gray-300">Group/Channel: {post.group_name}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}
import React from 'react';

export default function PostCard({ post, selectMode, isSelected, onSelect }) {
  const renderMedia = () => {
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
    <div
      className={`glass-card p-4 ${
        selectMode && isSelected
          ? 'border-blue-500 dark:border-blue-400'
          : 'border-gray-300 dark:border-gray-600'
      }`}
      onClick={() => selectMode && onSelect()}
    >
      {selectMode && (
        <div className="flex justify-end mb-2">
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onSelect}
            className="h-5 w-5"
          />
        </div>
      )}
      {renderMedia()}
      <p className="font-bold mb-2">{post.text}</p>
      {post.author && <p className="text-gray-600 dark:text-gray-300">Author: {post.author}</p>}
      {post.group_name && <p className="text-gray-600 dark:text-gray-300">Group/Channel: {post.group_name}</p>}
      <p className="text-gray-600 dark:text-gray-300">Sentiment: {post.sentiment.toFixed(2)}</p>
      <p className="text-gray-600 dark:text-gray-300">Keywords: {post.keywords.join(', ')}</p>
    </div>
  );
}
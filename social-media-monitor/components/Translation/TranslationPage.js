import React, { useState } from 'react';
import { MdTranslate } from 'react-icons/md';
import axios from 'axios';

export default function TranslationPage({ postsToTranslate }) {
  const [keyword, setKeyword] = useState('');
  const [targetLanguage, setTargetLanguage] = useState('en');
  const [translatedPosts, setTranslatedPosts] = useState([]);
  const [isTranslating, setIsTranslating] = useState(false);
  const [manualTranslation, setManualTranslation] = useState('');

  const handleTranslate = async (textToTranslate = null) => {
    setIsTranslating(true);
    try {
      if (textToTranslate) {
        // Translate the text from the search bar
        const response = await axios.post('http://localhost:5000/api/translate', { 
          text: textToTranslate,
          targetLanguage: targetLanguage
        });
        setManualTranslation(response.data.translatedText);
      } else if (postsToTranslate.length > 0) {
        // Translate the posts from the dashboard
        const translatedPosts = await Promise.all(postsToTranslate.map(async (post) => {
          const response = await axios.post('http://localhost:5000/api/translate', { 
            text: post.text,
            targetLanguage: targetLanguage
          });
          return {
            ...post,
            translatedText: response.data.translatedText
          };
        }));
        setTranslatedPosts(translatedPosts);
      }
    } catch (error) {
      console.error('Translation error:', error);
      alert('An error occurred during translation. Please try again.');
    } finally {
      setIsTranslating(false);
    }
  };

  const filteredPosts = translatedPosts.filter(post =>
    post.text.toLowerCase().includes(keyword.toLowerCase()) ||
    post.translatedText.toLowerCase().includes(keyword.toLowerCase())
  );

  return (
    <div className="space-y-8 p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold text-center">
        Translation Page <MdTranslate className="inline-block ml-2" />
      </h2>

      <div className="flex space-x-4 mb-4">
        <input
          type="text"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          placeholder="Enter text to translate or search"
          className="flex-grow px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
        />
        <select
          value={targetLanguage}
          onChange={(e) => setTargetLanguage(e.target.value)}
          className="px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
        >
          <option value="en">English</option>
          <option value="es">Spanish</option>
          <option value="fr">French</option>
          <option value="de">German</option>
        </select>
        <button
          onClick={() => handleTranslate(keyword)}
          disabled={isTranslating || !keyword}
          className={`px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 flex items-center justify-center ${isTranslating || !keyword ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <MdTranslate className="mr-2" /> {isTranslating ? 'Translating...' : 'Translate'}
        </button>
      </div>

      {manualTranslation && (
        <div className="mt-4 p-4 bg-gray-100 dark:bg-gray-700 rounded-lg">
          <h3 className="font-bold mb-2">Translated Text:</h3>
          <p>{manualTranslation}</p>
        </div>
      )}

      {postsToTranslate.length > 0 && (
        <button
          onClick={() => handleTranslate()}
          disabled={isTranslating}
          className={`mt-4 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 flex items-center justify-center ${isTranslating ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          <MdTranslate className="mr-2" /> {isTranslating ? 'Translating...' : 'Translate Selected Posts'}
        </button>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {filteredPosts.map((post, index) => (
          <div key={index} className="glass-card p-4 border-gray-300 dark:border-gray-600">
            <h3 className="font-bold mb-2">Original Text:</h3>
            <p className="mb-4">{post.text}</p>
            <h3 className="font-bold mb-2">Translated Text:</h3>
            <p className="mb-4">{post.translatedText}</p>
            {post.author && <p className="text-gray-600 dark:text-gray-300">Author: {post.author}</p>}
            {post.group_name && <p className="text-gray-600 dark:text-gray-300">Group/Channel: {post.group_name}</p>}
          </div>
        ))}
      </div>
    </div>
  );
}
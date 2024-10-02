import React, { useState, useEffect } from 'react';

export default function FilterDialog({ isOpen, onClose, onApply, initialFilters }) {
  const [filters, setFilters] = useState(initialFilters);

  useEffect(() => {
    setFilters(initialFilters);
  }, [initialFilters]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onApply(filters);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50" onClick={onClose}>
      <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800" onClick={e => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Filter Options</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:text-gray-300 dark:hover:text-gray-100">×</button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <input
              type="text"
              name="username"
              value={filters.username}
              onChange={handleChange}
              placeholder="Username"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              name="userId"
              value={filters.userId}
              onChange={handleChange}
              placeholder="User ID"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              name="groupName"
              value={filters.groupName}
              onChange={handleChange}
              placeholder="Group Name"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div className="mb-4">
            <input
              type="text"
              name="groupUsername"
              value={filters.groupUsername}
              onChange={handleChange}
              placeholder="Group Username"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Operators</label>
            <div className="flex space-x-4">
              {['AND', 'OR', 'NOT'].map(op => (
                <label key={op} className="inline-flex items-center">
                  <input
                    type="checkbox"
                    value={op}
                    checked={filters.operators.includes(op)}
                    onChange={(e) => {
                      const { checked, value } = e.target;
                      setFilters(prev => ({
                        ...prev,
                        operators: checked
                          ? [...prev.operators, value]
                          : prev.operators.filter(o => o !== value)
                      }));
                    }}
                    className="form-checkbox h-4 w-4 text-blue-600 dark:text-blue-400"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{op}</span>
                </label>
              ))}
            </div>
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-500"
          >
            Apply Filters
          </button>
        </form>
      </div>
    </div>
  );
}
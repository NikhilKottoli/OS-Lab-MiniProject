import React, { useState } from 'react';

const RequestInput = ({ onAddRequest, maxPosition }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Clear existing requests first
    onAddRequest([]);
    
    const positions = inputValue
      .split(',')
      .map(pos => parseInt(pos.trim()))
      .filter(pos => !isNaN(pos) && pos >= 0 && pos <= maxPosition);
    
    if (positions.length > 0) {
      onAddRequest(positions);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label htmlFor="requestSequence" className="block text-sm font-medium text-gray-700">
        Enter Request Sequence (comma-separated)
      </label>
      <div className="flex gap-4">
        <input
          type="text"
          id="requestSequence"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="e.g., 98, 183, 37, 122, 14, 124, 65, 67"
          className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        />
        <button
          type="submit"
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 whitespace-nowrap"
        >
          Add Sequence
        </button>
      </div>
    </form>
  );
};

export default RequestInput;
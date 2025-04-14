import React from 'react';

const AlgorithmSelector = ({ algorithm, onAlgorithmChange }) => {
  const algorithms = [
    { value: 'fcfs', label: 'First Come First Serve (FCFS)' },
    { value: 'sstf', label: 'Shortest Seek Time First (SSTF)' },
    { value: 'scan', label: 'SCAN' },
    { value: 'cscan', label: 'C-SCAN' },
    { value: 'look', label: 'LOOK' },
    { value: 'clook', label: 'C-LOOK' }
  ];

  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select Algorithm
      </label>
      <select
        value={algorithm}
        onChange={(e) => onAlgorithmChange(e.target.value)}
        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      >
        {algorithms.map(({ value, label }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default AlgorithmSelector
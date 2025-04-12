import React from 'react';

const Statistics = ({ totalSeekTime, sequence, averageSeekTime }) => {
  return (
    <div className="bg-gray-50 p-4 rounded-lg">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Algorithm Results</h2>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600">Total Seek Time:</span>
          <span className="font-medium">{totalSeekTime}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Average Seek Time:</span>
          <span className="font-medium">{averageSeekTime.toFixed(2)}</span>
        </div>
        <div>
          <span className="text-gray-600">Sequence of Execution:</span>
          <div className="mt-1">
            {sequence.map((pos, index) => (
              <span key={index} className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
                {pos}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics
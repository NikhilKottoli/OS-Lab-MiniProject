import React from 'react';

const DiskTrack = ({ requests, maxPosition, selectedPositions }) => {
  return (
    <div className="relative w-full h-2 bg-gray-200 rounded-full mb-8">
      {requests.map((request, index) => {
        const percentage = (request.position / maxPosition) * 100;
        const isSelected = selectedPositions.includes(request.position);
        
        return (
          <div
            key={index}
            className={`absolute w-3 h-3 rounded-full transform -translate-x-1/2 -translate-y-1/4
              ${isSelected ? 'bg-green-500' : 'bg-red-500'}`}
            style={{ left: `${percentage}%` }}
            title={`Position: ${request.position}`}
          />
        );
      })}
    </div>
  );
};

export default DiskTrack;
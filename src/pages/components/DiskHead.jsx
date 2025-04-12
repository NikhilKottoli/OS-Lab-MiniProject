import React from 'react';
import { ArrowUpCircle } from 'lucide-react';

const DiskHead = ({ position, maxPosition }) => {
  const percentage = (position / maxPosition) * 100;
  
  return (
    <div 
      className="absolute transition-all duration-500"
      style={{ left: `${percentage}%`, transform: 'translateX(-50%)' }}
    >
      <ArrowUpCircle className="text-blue-600 w-8 h-8" />
    </div>
  );
};

export default DiskHead;
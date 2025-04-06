import React from 'react';
import { useNavigate } from 'react-router-dom';

export const FileOrganizationHome = () => {
  const navigate = useNavigate();
  return (
    <div className="text-center mt-10">
      <h2 className="text-4xl font-bold mb-4">Welcome to the Interactive File Organization Tutorial</h2>
      <p className="text-lg mb-6">Learn how different file organization techniques work through visualizations and interactions!</p>
      <button onClick={() => navigate('/techniques')} className="bg-purple-500 text-white px-6 py-2 rounded">Explore Techniques</button>
    </div>
  );
};
export default FileOrganizationHome;
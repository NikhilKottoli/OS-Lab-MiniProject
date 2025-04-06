import React from 'react';
import { useNavigate } from 'react-router-dom';

export const FileOrganizationHome = () => {
  const navigate = useNavigate();
  return (
    <section className="text-center mt-20 animate-fade-in">
      <h2 className="text-5xl font-extrabold text-purple-700 mb-6">Learn File Organization Visually</h2>
      <p className="text-xl mb-8 text-gray-700">Interactive tutorials and simulations to master sequential, indexed, and hashed techniques.</p>
      <button
        onClick={() => navigate('/techniques')}
        className="bg-purple-600 hover:bg-purple-800 text-white px-8 py-3 rounded-full text-lg shadow-md transition"
      >
        🚀 Start Learning
      </button>
    </section>
  );
};
export default FileOrganizationHome;
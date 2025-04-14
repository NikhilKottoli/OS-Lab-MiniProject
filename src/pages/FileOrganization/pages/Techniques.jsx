import React from 'react';
import { Sequential, Indexed, Hashed } from '../visualizations';

export const FileOrganizationTechniques = () => {
  const [tab, setTab] = React.useState('sequential');

  return (
     <div className="space-y-8 mt-20 animate-fade-in">
      <h2 className="text-5xl font-extrabold text-center text-purple-700">Explore File Organization Techniques</h2>
      <div className="flex justify-center gap-6">
        <button onClick={() => setTab('sequential')} className={`px-6 py-3 rounded-full text-lg font-semibold shadow-md transition ${tab === 'sequential' ? 'bg-purple-600 text-white' : 'bg-white border'}`}>Sequential</button>
        <button onClick={() => setTab('indexed')} className={`px-6 py-3 rounded-full text-lg font-semibold shadow-md transition ${tab === 'indexed' ? 'bg-purple-600 text-white' : 'bg-white border'}`}>Indexed</button>
        <button onClick={() => setTab('hashed')} className={`px-6 py-3 rounded-full text-lg font-semibold shadow-md transition ${tab === 'hashed' ? 'bg-purple-600 text-white' : 'bg-white border'}`}>Hashed</button>
      </div>
      <div className="p-6 rounded-lg shadow-lg bg-white animate-fade-in">
        {tab === 'sequential' && <Sequential />}
        {tab === 'indexed' && <Indexed />}
        {tab === 'hashed' && <Hashed />}
      </div>
    </div>
  );
};
export default FileOrganizationTechniques;
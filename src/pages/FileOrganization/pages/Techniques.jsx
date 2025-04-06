import React from 'react';
import { Sequential, Indexed, Hashed } from '../visualizations';

export const FileOrganizationTechniques = () => {
  const [tab, setTab] = React.useState('sequential');

  return (
    <div>
      <h2 className="text-3xl font-semibold mb-4 text-center">Explore File Organization Techniques</h2>
      <div className="flex justify-center gap-4 mb-4">
        <button onClick={() => setTab('sequential')} className={`px-4 py-2 rounded ${tab === 'sequential' ? 'bg-purple-500 text-white' : 'bg-white'}`}>Sequential</button>
        <button onClick={() => setTab('indexed')} className={`px-4 py-2 rounded ${tab === 'indexed' ? 'bg-purple-500 text-white' : 'bg-white'}`}>Indexed</button>
        <button onClick={() => setTab('hashed')} className={`px-4 py-2 rounded ${tab === 'hashed' ? 'bg-purple-500 text-white' : 'bg-white'}`}>Hashed</button>
      </div>
      <div>
        {tab === 'sequential' && <Sequential />}
        {tab === 'indexed' && <Indexed />}
        {tab === 'hashed' && <Hashed />}
      </div>
    </div>
  );
};
export default FileOrganizationTechniques;
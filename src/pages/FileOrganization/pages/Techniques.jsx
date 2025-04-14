import React from 'react';
import { Sequential, Indexed, Hashed,Hierarchical,Clustered,BTreeC } from '../visualizations';

export const FileOrganizationTechniques = () => {
  const [tab, setTab] = React.useState('sequential');

  return (
     <div className="space-y-8 mt-20 animate-fade-in">
      <h2 className="text-5xl font-extrabold text-center text-purple-700">File Organization Techniques</h2>
      <div className="flex justify-center gap-6">
  <button onClick={() => setTab('sequential')} className={`px-6 py-3 rounded-full text-lg font-semibold shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 hover:shadow-xl ${
    tab === 'sequential' ? 'bg-purple-600 text-white' : 'bg-white border hover:bg-purple-50'
  }`}>Sequential</button>

  <button onClick={() => setTab('indexed')} className={`px-6 py-3 rounded-full text-lg font-semibold shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 hover:shadow-xl ${
    tab === 'indexed' ? 'bg-purple-600 text-white' : 'bg-white border hover:bg-purple-50'
  }`}>Indexed</button>

  <button onClick={() => setTab('hashed')} className={`px-6 py-3 rounded-full text-lg font-semibold shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 hover:shadow-xl ${
    tab === 'hashed' ? 'bg-purple-600 text-white' : 'bg-white border hover:bg-purple-50'
  }`}>Hashed</button>

  <button onClick={() => setTab('hierarchical')} className={`px-6 py-3 rounded-full text-lg font-semibold shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 hover:shadow-xl ${
    tab === 'hierarchical' ? 'bg-purple-600 text-white' : 'bg-white border hover:bg-purple-50'
  }`}>Hierarchical</button>

  <button onClick={() => setTab('clustered')} className={`px-6 py-3 rounded-full text-lg font-semibold shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 hover:shadow-xl ${
    tab === 'clustered' ? 'bg-purple-600 text-white' : 'bg-white border hover:bg-purple-50'
  }`}>Clustered</button>



  <button onClick={() => setTab('btree')} className={`px-6 py-3 rounded-full text-lg font-semibold shadow-md transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 hover:shadow-xl ${
    tab === 'btree' ? 'bg-purple-600 text-white' : 'bg-white border hover:bg-purple-50'
  }`}>BTree</button>
</div>
      <div className="p-6 rounded-lg shadow-lg bg-white animate-fade-in">
        {tab === 'sequential' && <Sequential />}
        {tab === 'indexed' && <Indexed />}
        {tab === 'hashed' && <Hashed />}
        {tab === 'hierarchical' && <Hierarchical />}
        {tab === 'clustered' && <Clustered />}
        
        {tab === 'btree' && <BTreeC />}
      </div>
    </div>
  );
};
export default FileOrganizationTechniques;
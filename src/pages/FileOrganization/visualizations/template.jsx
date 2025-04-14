import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Layers,
  Search,
  Plus,
  Info,
  Trash2,
  Database
} from 'lucide-react';


const cardWrapper = "my-8 bg-white rounded-xl shadow-lg p-6 border border-purple-100";
const sectionBg = "bg-white rounded-xl shadow-lg p-6 border border-purple-100";
const headerTitle = "text-xl font-semibold text-gray-800 mb-2";
const listClass = "list-disc list-inside text-gray-600 space-y-1 ml-2";
const buttonBase = "px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition";
const buttonGhost = "px-3 py-1 text-red-500 hover:text-red-700";


const DataBlock = ({ records, blockId, highlight }) => {
  return (
    <div className="border border-purple-300 rounded-xl p-4">
      <h4 className="text-md font-semibold text-gray-700 mb-3">Data Block {blockId}</h4>
      <div className="space-y-2">
        {records.length === 0 ? (
          <div className="text-sm text-gray-400 italic">No records</div>
        ) : (
          records.map(record => (
            <div
              key={record.id}
              className={`flex items-center justify-between px-4 py-2 rounded-lg text-sm transition-all ${
                highlight === record.id
                  ? 'bg-purple-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700'
              }`}
            >
              <span>R{record.id}:</span>
              <span>{record.value}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};


const Node = ({ x, y, value, highlight }) => (
  <g>
    <circle
      cx={x}
      cy={y}
      r={20}
      className={highlight ? 'fill-emerald-400 stroke-emerald-700 stroke-2' : 'fill-white stroke-emerald-700 stroke-2'}
    />
    <text x={x} y={y + 5} textAnchor="middle" className="text-sm font-medium fill-emerald-900">
      {value}
    </text>
  </g>
);


export const Heap = () => {
  const [blocks, setBlocks] = useState([
    { id: 1, records: [] },
    { id: 2, records: [] },
    { id: 3, records: [] }
  ]);
  const [highlight, setHighlight] = useState(null);
  const [lastId, setLastId] = useState(0);
  const BLOCK_CAPACITY = 4;

  const findAvailableBlock = () => {
    return blocks.find(block => block.records.length < BLOCK_CAPACITY)?.id || blocks[0].id;
  };


  const addRecord = () => {
    const newId = lastId + 1;
    const value = Math.floor(Math.random() * 1000);
    const targetBlockId = findAvailableBlock();

    setBlocks(prevBlocks => 
      prevBlocks.map(block => 
        block.id === targetBlockId
          ? { ...block, records: [...block.records, { id: newId, value }] }
          : block
      )
    );
    setLastId(newId);
    setHighlight(newId);
  };


  const searchRecord = () => {
    const allRecords = blocks.flatMap(block => block.records);
    if (allRecords.length === 0) return;
    
    const randomRecord = allRecords[Math.floor(Math.random() * allRecords.length)];
    setHighlight(randomRecord.id);
  };

  const clearAll = () => {
    setBlocks(blocks.map(block => ({ ...block, records: [] })));
    setLastId(0);
    setHighlight(null);
  };

  return (
    <div className={cardWrapper}>
      <div className="mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Database className="w-6 h-6 text-purple-600" /> Heap File Organization
        </h2>
      </div>
      <p className="text-gray-600 mb-4">
        Records are stored in data blocks without any particular order. New records are inserted into the first available space.
      </p>
      
      <div className="grid lg:grid-cols-2 gap-8">
     
        <div className="space-y-6">
          <div className={sectionBg}>
            <div className="flex items-start gap-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Info className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className={headerTitle}>About Heap Files</h3>
                <ul className={listClass}>
                  <li>Records are stored in data blocks</li>
                  <li>New records go to first available space</li>
                  <li>No ordering maintained</li>
                  <li>Block capacity: {BLOCK_CAPACITY} records</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="flex gap-4">
            <div className={`${sectionBg} flex-1`}>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-purple-600" /> Add Record
              </h3>
              <button 
                className={buttonBase}
                onClick={addRecord}
                disabled={blocks.every(b => b.records.length >= BLOCK_CAPACITY)}
              >
                Insert New Record
              </button>
            </div>
            
            <div className={`${sectionBg} flex-1`}>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Search className="w-5 h-5 text-purple-600" /> Search
              </h3>
              <button 
                className={buttonBase}
                onClick={searchRecord}
                disabled={blocks.every(b => b.records.length === 0)}
              >
                Find Random Record
              </button>
            </div>
          </div>
        </div>

      
        <div className={sectionBg}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-semibold text-gray-800">Data Blocks</h3>
            <button 
              className={buttonGhost}
              onClick={clearAll}
              disabled={blocks.every(b => b.records.length === 0)}
            >
              <Trash2 className="w-4 h-4 inline-block" /> Clear All
            </button>
          </div>
          
          <div className="space-y-4">
            {blocks.map(block => (
              <DataBlock
                key={block.id}
                records={block.records}
                blockId={block.id}
                highlight={highlight}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};



export const BTree= () => {
  const [records, setRecords] = useState([]);
  const [input, setInput] = useState('');
  const [order, setOrder] = useState(3);

  const addRecord = () => {
    const val = input.trim();
    if (!val) return;
    const newRecs = [...records, val].sort((a, b) => a.localeCompare(b));
    setRecords(newRecs);
    setInput('');
  };

  const buildTree = () => {
    const maxKeys = order - 1;
    const root = records.slice(0, maxKeys);
    const leaves = [];
    for (let i = maxKeys; i < records.length; i += maxKeys) {
      leaves.push(records.slice(i, i + maxKeys));
    }
    return { root, leaves };
  };

  const { root, leaves } = buildTree();

  const positions = [];
  root.forEach((v, i) => positions.push({ x: 100 + i * 80, y: 50, v, level: 'root', idx: i }));
  leaves.forEach((leaf, li) => {
    leaf.forEach((v, i) => positions.push({ x: 50 + li * (order * 80) + i * 80, y: 200, v, level: 'leaf', idx: i, leafIndex: li }));
  });

  return (
    <div className={cardWrapper}>
      <div className="mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <TreeDeciduous className="w-6 h-6 text-purple-600" /> B+ Tree Organization
        </h2>
      </div>
      <p className="text-gray-600 mb-4">
        Adjustable-order B+ tree: set order and insert keys to see structure.
      </p>
      <div className="space-y-6">
        <div className={sectionBg}>
          <div className="flex gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Order</label>
              <input
                type="number"
                min="3"
                value={order}
                onChange={e => setOrder(Math.max(3, Number(e.target.value)))}
                className="mt-1 block w-24 px-3 py-2 border rounded-md"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700">Key</label>
              <div className="mt-1 flex">
                <input
                  type="text"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addRecord()}
                  className="flex-1 px-4 py-2 border rounded-lg"
                  placeholder="Enter key"
                />
                <button className={buttonBase} onClick={addRecord}>Insert</button>
              </div>
            </div>
          </div>
          <div className="overflow-auto">
            <svg width={600} height={300}>
              {positions.map((pos, i) => (
                <React.Fragment key={i}>
                  {pos.level === 'leaf' && (
                    <line
                      x1={positions[pos.idx].x}
                      y1={positions[pos.idx].y + 20}
                      x2={pos.x}
                      y2={pos.y - 20}
                      className="stroke-purple-200 stroke-2"
                    />
                  )}
                  <Node x={pos.x} y={pos.y} value={pos.v} />
                </React.Fragment>
              ))}
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};


export const Inverted= () => {
  const terms = ['apple', 'banana', 'cherry'];
  const [index, setIndex] = useState({ apple: [], banana: [], cherry: [] });
  const [highlight, setHighlight] = useState([]);

  const addDoc = () => {
    const id = Math.floor(Math.random() * 1000);
    const term = terms[Math.floor(Math.random() * terms.length)];
    setIndex(prev => ({ ...prev, [term]: [...prev[term], id] }));
    setHighlight([term, id]);
  };
  const searchRecord = () => {
    const res = index['apple'].filter(id => index['banana'].includes(id));
    setHighlight(res);
  };
  const clearAll = () => setIndex({ apple: [], banana: [], cherry: [] });

  return (
    <div className={cardWrapper}>
      <div className="mb-4">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Split className="w-6 h-6 text-purple-600" /> Inverted File Organization
        </h2>
      </div>
      <p className="text-gray-600 mb-4">
        Term-based secondary indexing optimized for full-text search and multi-key access.
      </p>
      <div className="grid lg:grid-cols-2 gap-8">
    
        <div className="space-y-6">
          <div className={sectionBg}>
            <div className="flex items-start gap-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Info className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className={headerTitle}>About Inverted Files</h3>
                <ul className={listClass}>
                  <li>Lexicon of unique terms</li>
                  <li>Postings lists of document references</li>
                  <li>Efficient boolean and phrase queries</li>
                </ul>
              </div>
            </div>
          </div>
          <div className={sectionBg}>
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Search className="w-5 h-5 text-purple-600" /> Query Terms
            </h3>
            <div className="flex gap-3">
              <button className={buttonBase} onClick={addDoc}>Add Doc</button>
              <button className={buttonBase} onClick={searchRecord}>Intersect apple & banana</button>
            </div>
            {highlight.length > 0 && (
              <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg text-green-700">
                Matching DocIDs: <strong>{highlight.join(', ')}</strong>
              </div>
            )}
          </div>
        </div>
 
        <div className="space-y-6">
          <div className={sectionBg}>
            <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <Plus className="w-5 h-5 text-purple-600" /> Add Random Document
            </h3>
            <button className={buttonBase} onClick={addDoc}>Add Random Doc</button>
          </div>
          <div className={sectionBg}>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-gray-800">Postings Lists</h3>
              <button className={buttonGhost} onClick={clearAll}>
                <Trash2 className="w-4 h-4 inline-block" /> Clear All
              </button>
            </div>
            {terms.map(term => (
              <div key={term} className="mb-4">
                <h4 className="font-medium text-gray-800">{term}</h4>
                <div className="flex flex-wrap gap-2 mt-2">
                  {index[term].map(id => (
                    <motion.div
                      key={id}
                      animate={{ scale: highlight.includes(id) ? 1.3 : 1 }}
                      transition={{ type: 'spring', stiffness: 300 }}
                      className={`px-2 py-1 border rounded ${highlight.includes(id) ? 'bg-yellow-300 text-white' : 'bg-indigo-50 text-indigo-700 border-indigo-100'}`}
                    >
                      D{id}
                    </motion.div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};




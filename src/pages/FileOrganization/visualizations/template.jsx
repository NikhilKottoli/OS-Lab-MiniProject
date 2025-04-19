import React, { useState } from 'react';
import {
  Plus,
  Search,
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

// ✅ FIXED: highlight is now checked using `.includes(record.id)`
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
                highlight.includes(record.id)
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

export const Heap = () => {
  const [blocks, setBlocks] = useState([
    { id: 1, records: [] },
    { id: 2, records: [] },
    { id: 3, records: [] }
  ]);
  const [highlight, setHighlight] = useState([]);
  const [lastId, setLastId] = useState(0);
  const [fileName, setFileName] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const BLOCK_CAPACITY = 4;

  const findAvailableBlock = () => {
    return blocks.find(block => block.records.length < BLOCK_CAPACITY)?.id || blocks[0].id;
  };

  const addRecord = () => {
    if (!fileName.trim()) return;
    const newId = lastId + 1;
    const targetBlockId = findAvailableBlock();

    setBlocks(prevBlocks => 
      prevBlocks.map(block => 
        block.id === targetBlockId
          ? { ...block, records: [...block.records, { id: newId, value: fileName }] }
          : block
      )
    );
    setLastId(newId);
    setHighlight([newId]);
    setFileName('');
  };

  const searchRecord = () => {
    const allRecords = blocks.flatMap(block => block.records);
    const matchingIds = allRecords
      .filter(record => record.value === searchQuery)
      .map(record => record.id);
    setHighlight(matchingIds);
  };

  const clearAll = () => {
    setBlocks(blocks.map(block => ({ ...block, records: [] })));
    setLastId(0);
    setHighlight([]);
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
              <div className="flex gap-2">
                <input
                  type="text"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder="Enter file name"
                  className="flex-1 px-1 py-2 border rounded-lg"
                />
                <button
                  className={buttonBase}
                  onClick={addRecord}
                  disabled={blocks.every(b => b.records.length >= BLOCK_CAPACITY)}
                >
                  Add
                </button>
              </div>
            </div>
            
            <div className={`${sectionBg} flex-1`}>
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-1">
                <Search className="w-5 h-5 text-purple-600" /> Search
              </h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search file name"
                  className="flex-1 px-2 py-2 border rounded-lg"
                />
                <button
                  className={buttonBase}
                  onClick={searchRecord}
                  disabled={blocks.every(b => b.records.length === 0)}
                >
                  Search
                </button>
              </div>
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

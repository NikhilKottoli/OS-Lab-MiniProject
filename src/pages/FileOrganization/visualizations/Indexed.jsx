import React, { useState, useEffect } from 'react';
import { ListOrdered, Plus, Search, Trash2, Info } from 'lucide-react';

export const Indexed = () => {
  const [records, setRecords] = useState([]);
  const [input, setInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchResult, setSearchResult] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState('');
  const [recordSize, setRecordSize] = useState(50);
  const [fileSize, setFileSize] = useState(1000);

  const calculateMaxRecords = (fileSize, recordSize) => {
    return Math.floor(fileSize / recordSize);
  };

  const calculatePointer = (index, recordSize) => {
    return index * recordSize;
  };

  const addRecord = () => {
    const trimmed = input.trim();
    if (!trimmed) {
      setError('Record cannot be empty.');
      return;
    }

    const exists = records.some(r => r.value.toLowerCase() === trimmed.toLowerCase());
    if (exists) {
      setError('Record already exists.');
      return;
    }

    const maxRecords = calculateMaxRecords(fileSize, recordSize);
    if (records.length >= maxRecords) {
      setError('Cannot add more records. File size exceeded.');
      return;
    }

    const newRecord = {
      index: records.length,
      value: trimmed,
      pointer: calculatePointer(records.length, recordSize),
    };

    setRecords([...records, newRecord]);
    setInput('');
    setError('');
  };

  const handleKeyPress = (e, action) => {
    if (e.key === 'Enter') action();
  };

  const searchRecord = async () => {
    const trimmed = searchTerm.trim();
    if (!trimmed) {
      setError('Please enter an index to search.');
      return;
    }

    const searchIndex = parseInt(trimmed, 10);
    if (isNaN(searchIndex)) {
      setError('Invalid index input.');
      return;
    }

    setSearching(true);
    setHasSearched(true);
    setError('');
    setSearchResult(null);

    await new Promise(res => setTimeout(res, 500));

    const found = records.find(r => r.index === searchIndex);

    if (found) {
      setSearchResult(found.index);
    } else {
      setSearchResult(null);
    }

    setSearching(false);
  };

  const clearAll = () => {
    setRecords([]);
    setInput('');
    setSearchTerm('');
    setSearchResult(null);
    setHasSearched(false);
    setError('');
  };

  useEffect(() => {
    setSearchResult(null);
    setHasSearched(false);
    setError('');
  }, [searchTerm]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-cyan-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <ListOrdered className="w-8 h-8 text-blue-600" />
            Indexed File Organization
          </h1>
          <p className="text-gray-600 mt-2">A visual demonstration of indexed file organization and searching</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
  
            <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Info className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">About Indexed Organization</h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    An index is maintained to map keys to storage locations, improving access speed.
                    Each record is assigned an index value based on its position in the records array.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Search className="w-5 h-5 text-blue-600" />
                Search Records
              </h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <input
                    type="text"
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    onKeyDown={e => handleKeyPress(e, searchRecord)}
                    placeholder="Enter index to search..."
                  />
                  <button
                    onClick={searchRecord}
                    disabled={searching || !searchTerm.trim()}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Search className="w-4 h-4" />
                    {searching ? 'Searching...' : 'Search'}
                  </button>
                </div>

                {searching && (
                  <p className="text-sm text-gray-500 italic">Looking through index...</p>
                )}

                {searchResult !== null && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg text-green-700">
                    <div className="flex items-center gap-2">
                      <span>✅</span>
                      <div className="overflow-hidden">
                        <p className="truncate">
                          Record "{records[searchResult].value}" found at index {searchResult}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {!searching && hasSearched && searchResult === null && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-2">
                    <span>❌</span> Record not found
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
       
            <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-600" />
                Add Record
              </h3>
              <div className="flex gap-3">
                <input
                  type="text"
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => handleKeyPress(e, addRecord)}
                  placeholder="Enter new record..."
                />
                <button
                  onClick={addRecord}
                  disabled={!input.trim()}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
              {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
            </div>

    
            <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Set File Size & Record Size</h3>
              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="block text-gray-600 mb-2" htmlFor="recordSize">
                      Record Size (bytes)
                    </label>
                    <input
                      type="number"
                      id="recordSize"
                      value={recordSize}
                      onChange={(e) => setRecordSize(parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-gray-600 mb-2" htmlFor="fileSize">
                      File Size (bytes)
                    </label>
                    <input
                      type="number"
                      id="fileSize"
                      value={fileSize}
                      onChange={(e) => setFileSize(parseInt(e.target.value) || 0)}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
              </div>
            </div>

          
            <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Indexed Records ({records.length})</h3>
                {records.length > 0 && (
                  <button
                    onClick={clearAll}
                    className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" /> Clear All
                  </button>
                )}
              </div>

              {records.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No records added yet. Add your first record above.
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-6">
               
                  <div>
                    <h4 className="text-lg font-semibold mb-2">📁 Index File</h4>
                    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                      {records.map((record, i) => (
                        <div
                          key={`index-${i}`}
                          className={`p-3 rounded-lg border ${
                            searchResult === i
                              ? 'bg-green-100 border-green-400 text-green-800 font-semibold'
                              : 'bg-white border-blue-200 text-gray-800'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span>Index {i}</span>
                            <span className="text-gray-600">→ {record.pointer}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                 
                  <div>
                    <h4 className="text-lg font-semibold mb-2">📂 Data File</h4>
                    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                      {records.map((record, i) => (
                        <div
                          key={`data-${i}`}
                          className={`p-3 rounded-lg border ${
                            searchResult === i
                              ? 'bg-green-100 border-green-400 text-green-800 font-semibold'
                              : 'bg-white border-blue-200 text-gray-800'
                          }`}
                        >
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Address {record.pointer}</span>
                            <span className="truncate max-w-[150px]" title={record.value}>
                              {record.value}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

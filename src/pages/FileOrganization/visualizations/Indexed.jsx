import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Plus,
  Search,
  Trash2,
  Info,
  CheckCircle,
  XCircle,
  ListOrdered
} from 'lucide-react';

export const Indexed = () => {
  const [records, setRecords] = useState([]);
  const [input, setInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searching, setSearching] = useState(false);
  const [searchResult, setSearchResult] = useState(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState('');

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

    const newRecord = {
      index: records.length * 10,
      value: trimmed,
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
      setError('Please enter a value to search.');
      return;
    }

    setSearching(true);
    setHasSearched(true);
    setError('');
    setSearchResult(null);

    await new Promise(res => setTimeout(res, 500));

    const index = records.findIndex(
      r => r.value.toLowerCase() === trimmed.toLowerCase()
    );

    if (index !== -1) {
      setSearchResult(index);
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
                    Each record is assigned an index value using the formula: index = record_number × 10
                  </p>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-lg font-semibold text-green-700 flex items-center gap-2 mb-2">
                        <CheckCircle className="w-5 h-5" />
                        Advantages
                      </h4>
                      <ul className="list-disc list-inside text-gray-600 space-y-1 ml-2">
                        <li>Faster access compared to sequential files</li>
                        <li>Suitable for databases with large records</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-red-700 flex items-center gap-2 mb-2">
                        <XCircle className="w-5 h-5" />
                        Disadvantages
                      </h4>
                      <ul className="list-disc list-inside text-gray-600 space-y-1 ml-2">
                        <li>Extra storage is needed for indexes</li>
                        <li>Overhead in maintaining the index</li>
                      </ul>
                    </div>
                  </div>
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
                    placeholder="Enter record to search..."
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
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 flex items-center gap-2">
                    ✅ Found at index {records[searchResult].index}
                  </div>
                )}

                {!searching && hasSearched && searchResult === null && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-2">
                    ❌ Record not found
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
              {error && (
                <p className="text-sm text-red-600 mt-2">{error}</p>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Records ({records.length})</h3>
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
                <div className="grid grid-cols-1 gap-3">
                  {records.map((record, i) => (
                    <div
                      key={i}
                      className={`p-3 rounded-lg transition-all duration-500 ${
                        searchResult === i
                          ? 'bg-green-500 text-white scale-105 shadow-lg'
                          : 'bg-blue-50 text-blue-800 border border-blue-100'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-medium">Index {record.index}:</span>
                        <span>{record.value}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

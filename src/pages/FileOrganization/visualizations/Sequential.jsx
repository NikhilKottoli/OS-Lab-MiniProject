import React, { useEffect, useState } from 'react';
import { BookOpen, Search, Plus, Info, Trash2, CheckCircle, XCircle, ArrowRight, Database, List } from 'lucide-react';

export const Sequential = () => {
  const [records, setRecords] = useState([]);
  const [input, setInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchingIndex, setSearchingIndex] = useState(null);
  const [searchResult, setSearchResult] = useState(null);
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState('');
  const [showOrganization, setShowOrganization] = useState('sequential');

  const MAX_LENGTH = 30;

  const addRecord = () => {
    const trimmedInput = input.trim();
    if (!trimmedInput) {
      setError('Record cannot be empty.');
      return;
    }
    if (trimmedInput.length > MAX_LENGTH) {
      setError(`Record too long. Max ${MAX_LENGTH} characters.`);
      return;
    }
    if (records.includes(trimmedInput)) {
      setError('Record already exists.');
      return;
    }

    setRecords([...records, trimmedInput]);
    setInput('');
    setError('');
  };

  const searchRecord = async () => {
    const trimmedSearch = searchTerm.trim();
    if (!trimmedSearch) {
      setError('Please enter a valid record to search.');
      return;
    }

    setSearchResult(null);
    setSearching(true);
    setHasSearched(true);
    setError('');

    for (let i = 0; i < records.length; i++) {
      setSearchingIndex(i);
      await new Promise(resolve => setTimeout(resolve, 500));
      if (records[i].toLowerCase() === trimmedSearch.toLowerCase()) {
        setSearchResult(i);
        setSearching(false);
        return;
      }
    }

    setSearching(false);
    setSearchingIndex(null);
  };

  const handleKeyPress = (e, action) => {
    if (e.key === 'Enter') {
      action();
    }
  };

  useEffect(() => {
    setSearchResult(null);
    setSearchingIndex(null);
    setHasSearched(false);
  }, [searchTerm]);

  const clearAll = () => {
    setRecords([]);
    setInput('');
    setSearchTerm('');
    setSearchResult(null);
    setSearchingIndex(null);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-indigo-600" />
            Sequential File Organization
          </h1>
          <p className="text-gray-600 mt-2">A visual demonstration of sequential file organization and searching</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-indigo-100">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Info className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">About Sequential Organization</h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    Records are stored sequentially, one after another. To find a specific record,
                    the system must traverse through the records from the beginning until it finds a match.
                  </p>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-lg font-semibold text-green-700 flex items-center gap-2 mb-2">
                        <CheckCircle className="w-5 h-5" />
                        Advantages
                      </h4>
                      <ul className="list-disc list-inside text-gray-600 space-y-1 ml-2">
                        <li>Simple to implement</li>
                        <li>Efficient for batch processing</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-red-700 flex items-center gap-2 mb-2">
                        <XCircle className="w-5 h-5" />
                        Disadvantages
                      </h4>
                      <ul className="list-disc list-inside text-gray-600 space-y-1 ml-2">
                        <li>Slow retrieval for random access</li>
                        <li>Inefficient if frequent modifications are required</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-indigo-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Search className="w-5 h-5 text-indigo-600" />
                Search Records
              </h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <input
                    type="text"
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    onKeyDown={e => handleKeyPress(e, searchRecord)}
                    placeholder="Enter record to search..."
                  />
                  <button
                    onClick={searchRecord}
                    disabled={searching || !searchTerm.trim()}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Search className="w-4 h-4" />
                    {searching ? 'Searching...' : 'Search'}
                  </button>
                </div>

                {searching && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <ArrowRight className="w-4 h-4 animate-pulse" />
                    Traversing records sequentially...
                  </div>
                )}

                {searchResult !== null && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Record found at position {searchResult + 1}
                  </div>
                )}

                {!searching && hasSearched && searchResult === null && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-2">
                    <XCircle className="w-5 h-5" />
                    Record not found
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-indigo-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-indigo-600" />
                Add Record
              </h3>
              <div className="flex gap-3">
                <input
                  type="text"
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => handleKeyPress(e, addRecord)}
                  placeholder="Enter new record..."
                />
                <button
                  onClick={addRecord}
                  disabled={!input.trim()}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
              {error && (
                <p className="text-sm text-red-600 mt-2">{error}</p>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-indigo-100">
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
                <div className="space-y-4">
                  
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Storage Visualization</h4>
                    <div className="flex items-center gap-2 overflow-x-auto pb-2">
                      {records.map((record, index) => (
                        <div
                          key={index}
                          className={`flex-shrink-0 p-3 rounded border ${
                            searchResult === index
                              ? 'bg-green-100 border-green-300'
                              : searchingIndex === index
                              ? 'bg-yellow-50 border-yellow-300'
                              : 'bg-white border-gray-200'
                          }`}
                        >
                          <div className="text-xs text-gray-500 mb-1">Address: {index * 100}</div>
                          <div className="text-sm font-mono">{record}</div>
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
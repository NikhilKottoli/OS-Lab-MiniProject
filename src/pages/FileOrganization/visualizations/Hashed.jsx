import React, { useEffect, useState } from 'react';
import { BookOpen, Search, Plus, Info, Trash2, CheckCircle, XCircle, Hash } from 'lucide-react';

export const Hashed = () => {
  const [records, setRecords] = useState([]);
  const [input, setInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchingHash, setSearchingHash] = useState(null);
  const [searchResult, setSearchResult] = useState(null);
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState('');
  const [searchingIndex, setSearchingIndex] = useState(null); // 🆕 new state

  const MAX_LENGTH = 30;

  const hashFunc = (value) => {
    let hash = 0;
    for (let i = 0; i < value.length; i++) {
      hash += value.charCodeAt(i);
    }
    return hash % 10;
  };
  const explainHash = (value) => {
    const chars = value.split('');
    const asciiValues = chars.map(c => c.charCodeAt(0));
    const sum = asciiValues.reduce((acc, val) => acc + val, 0);
    const hash = sum % 10;
    return { asciiValues, sum, hash };
  };
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

    const exists = records.some(
      r => r.value.toLowerCase() === trimmedInput.toLowerCase()
    );

    if (exists) {
      setError('Record already exists.');
      return;
    }

    const hash = hashFunc(trimmedInput);
    setRecords(prev => [...prev, { hash, value: trimmedInput }]);
    setInput('');
    setError('');
  };

  const searchRecord = async () => {
    const trimmedSearch = searchTerm.trim();

    if (!trimmedSearch) {
      setError('Please enter a valid record to search.');
      return;
    }

    if (records.length === 0) {
      setError('No records available to search.');
      return;
    }

    setSearchResult(null);
    setSearching(true);
    setHasSearched(true);
    setError('');
    setSearchingIndex(null);

    const targetHash = hashFunc(trimmedSearch);
    setSearchingHash(targetHash);

    const bucketRecords = records.filter(r => r.hash === targetHash);

    for (let i = 0; i < bucketRecords.length; i++) {
      const current = bucketRecords[i];
      setSearchingIndex(current.value);
      await new Promise(resolve => setTimeout(resolve, 700));

      if (current.value.toLowerCase() === trimmedSearch.toLowerCase()) {
        const foundIndex = records.findIndex(r => r.value === current.value);
        setSearchResult(foundIndex);
        break;
      }
    }

    setSearching(false);
    setSearchingHash(null);
    setSearchingIndex(null);
  };

  const handleKeyPress = (e, action) => {
    if (e.key === 'Enter') {
      action();
    }
  };

  useEffect(() => {
    setSearchResult(null);
    setSearchingHash(null);
    setHasSearched(false);
    setError('');
  }, [searchTerm]);

  const clearAll = () => {
    setRecords([]);
    setInput('');
    setSearchTerm('');
    setSearchResult(null);
    setSearchingHash(null);
    setSearchingIndex(null);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <Hash className="w-8 h-8 text-emerald-600" />
            Hashed File Organization
          </h1>
          <p className="text-gray-600 mt-2">
            A visual demonstration of hashed file organization and searching
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
       
            <div className="bg-white rounded-xl shadow-lg p-6 border border-emerald-100">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-emerald-100 rounded-lg">
                  <Info className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    About Hashed Organization
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    This method uses a hash function to determine the storage
                    location of records, allowing direct access to data through
                    computed addresses.
                  </p>
                  <p className="text-sm italic text-gray-500 mb-2">
                    Formula: hash = (sum of ASCII codes of characters) % 10
                  </p>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-lg font-semibold text-green-700 flex items-center gap-2 mb-2">
                        <CheckCircle className="w-5 h-5" />
                        Advantages
                      </h4>
                      <ul className="list-disc list-inside text-gray-600 space-y-1 ml-2">
                        <li>Fast retrieval of records</li>
                        <li>Efficient for real-time applications</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-red-700 flex items-center gap-2 mb-2">
                        <XCircle className="w-5 h-5" />
                        Disadvantages
                      </h4>
                      <ul className="list-disc list-inside text-gray-600 space-y-1 ml-2">
                        <li>Collisions can occur, requiring resolution techniques</li>
                        <li>Not efficient for range queries</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

     
            <div className="bg-white rounded-xl shadow-lg p-6 border border-emerald-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Search className="w-5 h-5 text-emerald-600" />
                Search Records
              </h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <input
                    type="text"
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    onKeyDown={e => handleKeyPress(e, searchRecord)}
                    placeholder="Enter record to search..."
                  />
                  <button
                    onClick={searchRecord}
                    disabled={searching || !searchTerm.trim()}
                    className="px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Search className="w-4 h-4" />
                    {searching ? 'Searching...' : 'Search'}
                  </button>
                </div>
                {searchTerm && (
                  <div className="text-sm text-gray-600">
                    <p className="italic mb-1">🔢 Hash Calculation:</p>
                    {(() => {
                      const { asciiValues, sum, hash } = explainHash(searchTerm);
                      return (
                        <p>
                          ASCII: {asciiValues.join(' + ')} = {sum} → {sum} % 10 ={' '}
                          <span className="font-bold text-emerald-600">{hash}</span>
                        </p>
                      );
                    })()}
                  </div>
                )}
                {searching && (
                  <p className="text-sm text-gray-500 italic">
                    Computing hash and looking up record...
                  </p>
                )}

                {searchResult !== null && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 flex items-center gap-2">
                    ✅ Record found at hash bucket {records[searchResult].hash}
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
            <div className="bg-white rounded-xl shadow-lg p-6 border border-emerald-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-emerald-600" />
                Add Record
              </h3>
              <div className="flex gap-3">
                <input
                  type="text"
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => handleKeyPress(e, addRecord)}
                  placeholder="Enter new record..."
                />
                <button
                  onClick={addRecord}
                  disabled={!input.trim()}
                  className="px-6 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
              {input && (
                <div className="mt-2 text-sm text-gray-600">
                  <p className="italic mb-1">🔢 Hash Calculation:</p>
                  {(() => {
                    const { asciiValues, sum, hash } = explainHash(input);
                    return (
                      <p>
                        ASCII: {asciiValues.join(' + ')} = {sum} → {sum} % 10 ={' '}
                        <span className="font-bold text-emerald-600">{hash}</span>
                      </p>
                    );
                  })()}
                </div>
              )}
              {error && (
                <p className="text-sm text-red-600 mt-2">{error}</p>
              )}
            </div>
            

        
            <div className="bg-white rounded-xl shadow-lg p-6 border border-emerald-100">
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
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Array.from({ length: 10 }).map((_, bucket) => (
                    <div key={bucket} className="p-3 bg-gray-50 rounded-lg">
                      <div className="text-sm font-medium text-gray-500 mb-2">Hash {bucket}</div>
                      <div className="space-y-2">
                        {records
                          .filter(record => record.hash === bucket)
                          .map((record, index) => {
                            const isFound = searchResult !== null && records[searchResult].value === record.value;
                            const isInspecting = searchingIndex === record.value;

                            return (
                              <div
                                key={index}
                                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-500 ${
                                  isFound
                                    ? 'bg-green-500 text-white scale-105 shadow-lg'
                                    : isInspecting
                                    ? 'bg-yellow-100 border border-yellow-300 text-yellow-800'
                                    : 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                                }`}
                              >
                                {record.value}
                              </div>
                            );
                          })}
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

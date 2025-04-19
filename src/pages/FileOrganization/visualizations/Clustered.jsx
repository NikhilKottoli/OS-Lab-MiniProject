import React, { useEffect, useState } from 'react';
import {
  Layers, Search, Plus, Info, Trash2, CheckCircle, XCircle
} from 'lucide-react';

export const Clustered = () => {
  const [records, setRecords] = useState([]);
  const [input, setInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [error, setError] = useState('');
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [rangeStart, setRangeStart] = useState('');
  const [rangeEnd, setRangeEnd] = useState('');
  const [rangeResults, setRangeResults] = useState([]);
  const [searchSteps, setSearchSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);

  const MAX_LENGTH = 30;
  const PAGE_SIZE = 4;

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

    const exists = records.includes(trimmedInput.toLowerCase());

    if (exists) {
      setError('Record already exists.');
      return;
    }

    const newRecords = [...records, trimmedInput.toLowerCase()];
    newRecords.sort((a, b) => a.localeCompare(b));
    setRecords(newRecords);
    setInput('');
    setError('');
  };

  const binarySearch = (arr, target) => {
    let low = 0;
    let high = arr.length - 1;
    let steps = [];
    
    while (low <= high) {
      let mid = Math.floor((low + high) / 2);
      steps.push({ low, mid, high });
      
      if (arr[mid] === target) return { index: mid, steps };
      if (arr[mid] < target) low = mid + 1;
      else high = mid - 1;
    }
    return { index: -1, steps };
  };

  const searchRecord = () => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) {
      setError('Please enter a valid record to search.');
      return;
    }

    if (records.length === 0) {
      setError('No records available to search.');
      return;
    }

    setError('');
    setHasSearched(true);
    setSearching(true);
    setSearchResult(null);
    setSearchSteps([]);
    setCurrentStep(0);

    const result = binarySearch(records, term);
    setSearchSteps(result.steps);

 
    let step = 0;
    const interval = setInterval(() => {
      if (step < result.steps.length) {
        setCurrentStep(step);
        step++;
      } else {
        clearInterval(interval);
        setSearchResult(result.index);
        setSearching(false);
      }
    }, 800);
  };

  const handleKeyPress = (e, action) => {
    if (e.key === 'Enter') {
      action();
    }
  };

  useEffect(() => {
    setSearchResult(null);
    setHasSearched(false);
    setError('');
    setSearchSteps([]);
    setCurrentStep(0);
  }, [searchTerm]);

  const clearAll = () => {
    setRecords([]);
    setInput('');
    setSearchTerm('');
    setSearchResult(null);
    setError('');
    setRangeStart('');
    setRangeEnd('');
    setRangeResults([]);
    setSearchSteps([]);
    setCurrentStep(0);
  };

  const rangeSearch = () => {
    const start = rangeStart.trim().toLowerCase();
    const end = rangeEnd.trim().toLowerCase();
    if (!start || !end) {
      setError('Please provide both range values.');
      return;
    }

    const results = records.filter(r => {
      const val = r.toLowerCase();
      return val >= start && val <= end;
    });

    setError('');
    setRangeResults(results);
  };

  const getPages = () => {
    const pages = [];
    for (let i = 0; i < records.length; i += PAGE_SIZE) {
      pages.push(records.slice(i, i + PAGE_SIZE));
    }
    return pages;
  };

  const getRecordStyle = (index) => {
    if (searchResult === index) {
      return 'bg-green-500 text-white';
    }
    if (!searchSteps.length) return '';
    
    const currentSearchStep = searchSteps[currentStep];
    if (!currentSearchStep) return '';

    if (index === currentSearchStep.mid) {
      return 'bg-yellow-500 text-white'; 
    }
    if (index >= currentSearchStep.low && index <= currentSearchStep.high) {
      return 'bg-blue-100 text-blue-800';
    }
    return ''; 
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <Layers className="w-8 h-8 text-purple-600" />
            Clustered File Organization
          </h1>
          <p className="text-gray-600 mt-2">
            A demonstration of clustered file organization, searching, range access and simulated disk pages.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-purple-100">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Info className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    About Clustered Organization
                  </h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    Records with similar keys are stored physically close together to improve performance of sequential access.
                  </p>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-lg font-semibold text-green-700 flex items-center gap-2 mb-2">
                        <CheckCircle className="w-5 h-5" />
                        Advantages
                      </h4>
                      <ul className="list-disc list-inside text-gray-600 space-y-1 ml-2">
                        <li>Efficient for range and sorted queries</li>
                        <li>Improves I/O performance for sequential access</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-red-700 flex items-center gap-2 mb-2">
                        <XCircle className="w-5 h-5" />
                        Disadvantages
                      </h4>
                      <ul className="list-disc list-inside text-gray-600 space-y-1 ml-2">
                        <li>Costly to insert/delete in sorted order</li>
                        <li>Requires maintenance of order</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

     
            <div className="bg-white rounded-xl shadow-lg p-6 border border-purple-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Search className="w-5 h-5 text-purple-600" />
                Search Records
              </h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <input
                    type="text"
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    onKeyDown={e => handleKeyPress(e, searchRecord)}
                    placeholder="Enter record to search..."
                  />
                  <button
                    onClick={searchRecord}
                    disabled={searching || !searchTerm.trim()}
                    className="px-6 py-2 bg-purple-600 text-white rounded-lg"
                  >
                    {searching ? 'Searching...' : 'Search'}
                  </button>
                </div>
                {searching && (
                  <div className="text-sm">
                    <p className="text-purple-600 font-medium">
                      Step {currentStep + 1} of {searchSteps.length}
                    </p>
                    <p className="text-gray-500 italic">
                      Checking middle element...
                    </p>
                  </div>
                )}
                {searchResult !== null && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700">
                    ✅ Record found at position {searchResult}
                  </div>
                )}
                {!searching && hasSearched && searchResult === -1 && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
                    ❌ Record not found
                  </div>
                )}
              </div>
            </div>

          
            
          </div>


          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-purple-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-purple-600" />
                Add Record
              </h3>
              <div className="flex gap-3">
                <input
                  type="text"
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => handleKeyPress(e, addRecord)}
                  placeholder="Enter new record..."
                />
                <button
                  onClick={addRecord}
                  disabled={!input.trim()}
                  className="px-6 py-2 bg-indigo-600 text-white rounded-lg"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
              {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-purple-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Sorted Records ({records.length})</h3>
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
                <div className="text-center py-8 text-gray-500">No records added yet.</div>
              ) : (
                <div className="space-y-4">
                  {getPages().map((page, i) => (
                    <div
                      key={i}
                      className="p-3 border rounded-xl bg-gray-50 shadow-sm"
                    >
                      <h4 className="font-medium text-purple-700 mb-2">Disk Page {i + 1}</h4>
                      <div className="grid grid-cols-2 gap-2">
                        {page.map((record, idx) => {
                          const globalIndex = i * PAGE_SIZE + idx;
                          const isFound = searchResult === globalIndex;
                          const searchStyle = getRecordStyle(globalIndex);
                          return (
                            <div
                              key={globalIndex}
                              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
                                searchStyle || (isFound
                                  ? 'bg-green-500 text-white'
                                  : 'bg-indigo-50 text-indigo-700 border border-indigo-100')
                              }`}
                            >
                              {record}
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
import React, { useState, useEffect } from 'react';
import { fcfs, sstf, scan, cscan, look, clook } from './components/Algorithms';
import DiskHead from './components/DiskHead';
import DiskTrack from './components/DiskTrack';
import AlgorithmSelector from './components/AlgorithmSelector';
import RequestInput from './components/RequestInput';
import Statistics from './components/Statistics';
import RequestGraph from './components/RequestGraph';

const MAX_POSITION = 199;

function DiskMain() {
  const [requests, setRequests] = useState([]);
  const [algorithm, setAlgorithm] = useState('fcfs');
  const [initialPosition, setInitialPosition] = useState(0);
  const [direction, setDirection] = useState('right');
  const [currentPosition, setCurrentPosition] = useState(0);
  const [result, setResult] = useState({ sequence: [], totalSeekTime: 0, path: [] });
  const [visitedPositions, setVisitedPositions] = useState([]);
  const [isAnimating, setIsAnimating] = useState(false);

  const algorithms = {
    fcfs: (reqs, init) => fcfs(reqs, init),
    sstf: (reqs, init) => sstf(reqs, init),
    scan: (reqs, init) => scan(reqs, init, MAX_POSITION, direction),
    cscan: (reqs, init) => cscan(reqs, init, MAX_POSITION),
    look: (reqs, init) => look(reqs, init, direction),
    clook: (reqs, init) => clook(reqs, init)
  };

  useEffect(() => {
    if (requests.length > 0) {
      const result = algorithms[algorithm](
        requests.map((pos, i) => ({ position: pos, order: i })),
        initialPosition
      );
      setResult(result);
      animatePath(result.path);
    }
  }, [algorithm, requests, initialPosition, direction]);

  const animatePath = async (path) => {
    setIsAnimating(true);
    setVisitedPositions([]);
    
    for (let i = 0; i < path.length; i++) {
      setCurrentPosition(path[i]);
      setVisitedPositions(prev => [...prev, path[i]]);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    setIsAnimating(false);
  };

  const handleAddRequest = (positions) => {
    if (!isAnimating) {
      if (Array.isArray(positions)) {
        setRequests(positions);
      }
    }
  };

  const handleReset = () => {
    if (!isAnimating) {
      setRequests([]);
      setVisitedPositions([]);
      setCurrentPosition(initialPosition);
      setResult({ sequence: [], totalSeekTime: 0, path: [] });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">
            Disk Scheduling Visualization
          </h1>

          <div className="space-y-8">
            <AlgorithmSelector 
              algorithm={algorithm}
              onAlgorithmChange={setAlgorithm}
            />

            <div className="space-y-4">
              <RequestInput
                onAddRequest={handleAddRequest}
                maxPosition={MAX_POSITION}
              />

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Initial Head Position (0-{MAX_POSITION})
                  </label>
                  <input
                    type="number"
                    min="0"
                    max={MAX_POSITION}
                    value={initialPosition}
                    onChange={(e) => setInitialPosition(parseInt(e.target.value))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>

                {(algorithm === 'scan' || algorithm === 'look') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Head Direction
                    </label>
                    <select
                      value={direction}
                      onChange={(e) => setDirection(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    >
                      <option value="right">Right</option>
                      <option value="left">Left</option>
                    </select>
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  onClick={handleReset}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                  disabled={isAnimating}
                >
                  Reset
                </button>
              </div>

              <div className="relative h-20 border-2 border-gray-200 rounded-lg p-4">
                <DiskTrack
                  requests={requests.map((pos, i) => ({ position: pos, order: i }))}
                  maxPosition={MAX_POSITION}
                  selectedPositions={visitedPositions}
                />
                <DiskHead
                  position={currentPosition}
                  maxPosition={MAX_POSITION}
                />
              </div>

              {requests.length > 0 && (
                <>
                  <Statistics
                    totalSeekTime={result.totalSeekTime}
                    sequence={result.sequence}
                    averageSeekTime={result.totalSeekTime / (result.sequence.length || 1)}
                  />
                  <RequestGraph
                    sequence={result.sequence}
                    initialPosition={initialPosition}
                  />
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DiskMain;
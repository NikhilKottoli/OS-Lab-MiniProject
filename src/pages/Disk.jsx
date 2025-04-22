import React, { useState, useEffect } from 'react';
import { fcfs, sstf, scan, cscan, look, clook } from './components/Algorithms';
import DiskHead from './components/DiskHead';
import DiskTrack from './components/DiskTrack';
import AlgorithmSelector from './components/AlgorithmSelector';
import RequestInput from './components/RequestInput';
import Statistics from './components/Statistics';
import RequestGraph from './components/RequestGraph';

// Algorithm descriptions component
const AlgorithmInfo = ({ algorithm }) => {
  const descriptions = {
    fcfs: {
      title: "First-Come, First-Served (FCFS)",
      description: "The simplest disk scheduling algorithm that services requests in the exact order they arrive in the queue. While fair, it often results in longer seek times as the disk head moves back and forth across the disk, causing high average seek time and increased rotational latency.",
      pros: ["Simple to implement", "Fair (no starvation)", "Low CPU overhead"],
      cons: ["Can cause wild head movements", "Higher average seek time", "No optimization for efficiency"]
    },
    sstf: {
      title: "Shortest Seek Time First (SSTF)",
      description: "A greedy algorithm that selects the request closest to the current head position. This minimizes seek time for the current request but may cause starvation of some requests and is not optimal in the long run.",
      pros: ["Better average seek time than FCFS", "Favorable for systems with many requests close together"],
      cons: ["Possible starvation of distant requests", "Not optimal for overall performance", "Higher CPU overhead than FCFS"]
    },
    scan: {
      title: "SCAN (Elevator Algorithm)",
      description: "The disk arm moves in one direction (left to right or right to left) servicing requests until it reaches the end, then reverses direction. This prevents starvation and provides more uniform wait times than SSTF.",
      pros: ["Lower average wait time than FCFS", "No starvation", "Good for high disk loads"],
      cons: ["Favors tracks at the edges", "Recently visited areas wait the longest", "Some overhead when changing direction"]
    },
    cscan: {
      title: "Circular SCAN (C-SCAN)",
      description: "A variant of SCAN that moves from one end to the other servicing requests, but when reaching the end, it immediately returns to the beginning without servicing requests on the return trip. This provides more uniform wait times.",
      pros: ["More uniform wait times than SCAN", "Better for systems with uniformly distributed requests"],
      cons: ["More head movement than SCAN", "Slightly higher implementation complexity", "May perform worse when requests are clustered"]
    },
    look: {
      title: "LOOK Algorithm",
      description: "A variation of SCAN that moves in one direction servicing all requests until no more requests exist in that direction, then reverses to service requests in the opposite direction. Unlike SCAN, it doesn't go all the way to the disk boundaries.",
      pros: ["More efficient than SCAN", "Reduces unnecessary movement to disk edges", "Good balance of simplicity and performance"],
      cons: ["Slightly more complex than SCAN", "Possible favoritism to middle tracks", "May perform worse under certain request patterns"]
    },
    clook: {
      title: "C-LOOK Algorithm",
      description: "A variation of C-SCAN that only goes as far as the last request in each direction, then immediately returns to service requests at the other end. This eliminates unnecessary head movements to the disk boundaries.",
      pros: ["More efficient than C-SCAN", "Good average seek time", "Uniform wait times without wasted movements"],
      cons: ["More complex implementation", "May perform worse under certain workloads", "Higher CPU overhead"]
    }
  };

  const info = descriptions[algorithm];

  return (
    <div className="bg-gray-50 p-4 rounded-lg shadow-inner mt-4">
      <h3 className="text-xl font-semibold text-indigo-700">{info.title}</h3>
      <p className="mt-2 text-gray-700">{info.description}</p>
      <div className="mt-3">
        <h4 className="font-medium text-green-700">Advantages:</h4>
        <ul className="list-disc list-inside pl-2 text-gray-700">
          {info.pros.map((pro, index) => (
            <li key={`pro-${index}`}>{pro}</li>
          ))}
        </ul>
      </div>
      <div className="mt-2">
        <h4 className="font-medium text-red-700">Disadvantages:</h4>
        <ul className="list-disc list-inside pl-2 text-gray-700">
          {info.cons.map((con, index) => (
            <li key={`con-${index}`}>{con}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

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

            <AlgorithmInfo algorithm={algorithm} />

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
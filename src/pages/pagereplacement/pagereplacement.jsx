import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';


const useQuery = () => {
  return new URLSearchParams(useLocation().search);
};


const PageReplacementModule = () => {
  // State management
  const [frames, setFrames] = useState(3);
  const [referenceString, setReferenceString] = useState('7 0 1 2 0 3 0 4 2 3 0 3 2 1 2 0 1 7 0 1');
  const query = useQuery();
  const defaultAlgorithm = query.get("algorithm") || "fifo";
  const [algorithm, setAlgorithm] = useState(defaultAlgorithm);
  const [results, setResults] = useState(null);
  const [isSimulating, setIsSimulating] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [speed, setSpeed] = useState(1000);
  const [autoPlay, setAutoPlay] = useState(false);

  // Process the reference string into an array
  const processReferenceString = (str) => {
    return str.trim().split(/\s+/).map(num => parseInt(num, 10));
  };

  // FIFO (First-In-First-Out) Algorithm
  const fifoAlgorithm = (pages, frameCount) => {
    const frames = new Array(frameCount).fill(-1);
    const states = [];
    let pageFaults = 0;
    let nextToReplace = 0;

    pages.forEach((page, index) => {
      // Check if page already exists in frames
      const existingPageIndex = frames.indexOf(page);
      const currentFrames = [...frames];
      let fault = false;

      if (existingPageIndex === -1) {
        // Page fault
        pageFaults++;
        fault = true;
        frames[nextToReplace] = page;
        nextToReplace = (nextToReplace + 1) % frameCount;
      }

      states.push({
        page,
        frames: [...frames],
        fault,
        replaced: fault ? nextToReplace === 0 ? frameCount - 1 : nextToReplace - 1 : -1
      });
    });

    return { states, pageFaults, hitRatio: (pages.length - pageFaults) / pages.length };
  };

  // Optimal Algorithm
  const optimalAlgorithm = (pages, frameCount) => {
    const frames = new Array(frameCount).fill(-1);
    const states = [];
    let pageFaults = 0;

    for (let i = 0; i < pages.length; i++) {
      const page = pages[i];
      // Check if page already exists in frames
      const existingPageIndex = frames.indexOf(page);
      let fault = false;
      let replaced = -1;

      if (existingPageIndex === -1) {
        // Page fault
        pageFaults++;
        fault = true;

        // Find if there's an empty frame
        const emptyIndex = frames.indexOf(-1);
        if (emptyIndex !== -1) {
          frames[emptyIndex] = page;
          replaced = emptyIndex;
        } else {
          // Find page that will not be used for the longest time
          const nextUseIndexes = frames.map(frameValue => {
            const nextIndex = pages.slice(i + 1).indexOf(frameValue);
            return nextIndex === -1 ? Infinity : nextIndex;
          });
          
          const farthestPageIndex = nextUseIndexes.indexOf(Math.max(...nextUseIndexes));
          replaced = farthestPageIndex;
          frames[farthestPageIndex] = page;
        }
      }

      states.push({
        page,
        frames: [...frames],
        fault,
        replaced
      });
    }

    return { states, pageFaults, hitRatio: (pages.length - pageFaults) / pages.length };
  };

  // LRU (Least Recently Used) Algorithm
  const lruAlgorithm = (pages, frameCount) => {
    const frames = new Array(frameCount).fill(-1);
    const states = [];
    let pageFaults = 0;
    const recency = new Array(frameCount).fill(0); // Lower value means more recently used

    pages.forEach((page, index) => {
      // Check if page already exists in frames
      const existingPageIndex = frames.indexOf(page);
      let fault = false;
      let replaced = -1;

      if (existingPageIndex === -1) {
        // Page fault
        pageFaults++;
        fault = true;

        // Find if there's an empty frame
        const emptyIndex = frames.indexOf(-1);
        if (emptyIndex !== -1) {
          frames[emptyIndex] = page;
          recency[emptyIndex] = 0;
          replaced = emptyIndex;
        } else {
          // Find least recently used page
          const lruIndex = recency.indexOf(Math.max(...recency));
          replaced = lruIndex;
          frames[lruIndex] = page;
          recency[lruIndex] = 0;
        }
      } else {
        // Page hit - update recency
        recency[existingPageIndex] = 0;
      }

      // Increment recency for all pages except the current one
      for (let i = 0; i < frameCount; i++) {
        if (frames[i] !== -1 && frames[i] !== page) {
          recency[i]++;
        }
      }

      states.push({
        page,
        frames: [...frames],
        fault,
        replaced
      });
    });

    return { states, pageFaults, hitRatio: (pages.length - pageFaults) / pages.length };
  };

  // LFU (Least Frequently Used) Algorithm
  const lfuAlgorithm = (pages, frameCount) => {
    const frames = new Array(frameCount).fill(-1);
    const frequency = new Array(frameCount).fill(0);
    const recency = new Array(frameCount).fill(0); // For tie-breaking
    const states = [];
    let pageFaults = 0;

    pages.forEach((page, index) => {
      // Check if page already exists in frames
      const existingPageIndex = frames.indexOf(page);
      let fault = false;
      let replaced = -1;

      if (existingPageIndex === -1) {
        // Page fault
        pageFaults++;
        fault = true;

        // Find if there's an empty frame
        const emptyIndex = frames.indexOf(-1);
        if (emptyIndex !== -1) {
          frames[emptyIndex] = page;
          frequency[emptyIndex] = 1;
          recency[emptyIndex] = index;
          replaced = emptyIndex;
        } else {
          // Find least frequently used page
          const minFreq = Math.min(...frequency);
          const minFreqIndices = frequency.map((f, i) => f === minFreq ? i : -1).filter(i => i !== -1);
          
          // If there are multiple pages with the same frequency, choose the least recently used
          const lfuIndices = minFreqIndices.map(i => ({ index: i, recency: recency[i] }));
          lfuIndices.sort((a, b) => a.recency - b.recency);
          
          replaced = lfuIndices[0].index;
          frames[replaced] = page;
          frequency[replaced] = 1;
          recency[replaced] = index;
        }
      } else {
        // Page hit - update frequency
        frequency[existingPageIndex]++;
        recency[existingPageIndex] = index;
      }

      states.push({
        page,
        frames: [...frames],
        fault,
        replaced
      });
    });

    return { states, pageFaults, hitRatio: (pages.length - pageFaults) / pages.length };
  };

  // Second Chance (Clock) Algorithm
const secondChanceAlgorithm = (pages, frameCount) => {
  const frames = new Array(frameCount).fill(-1);
  const referenceBits = new Array(frameCount).fill(false);
  const states = [];
  let pageFaults = 0;
  let pointer = 0;

  pages.forEach((page, index) => {
    // Check if page already exists in frames
    const existingPageIndex = frames.indexOf(page);
    let fault = false;
    let replaced = -1;

    if (existingPageIndex === -1) {
      // Page fault
      pageFaults++;
      fault = true;

      // Find a page to replace
      while (true) {
        if (referenceBits[pointer]) {
          // Give a second chance
          referenceBits[pointer] = false;
          pointer = (pointer + 1) % frameCount;
        } else {
          // Replace this page
          replaced = pointer;
          frames[pointer] = page;
          referenceBits[pointer] = true;
          pointer = (pointer + 1) % frameCount;
          break;
        }
      }
    } else {
      // Page hit - set reference bit
      referenceBits[existingPageIndex] = true;
    }

    states.push({
      page,
      frames: [...frames],
      fault,
      replaced,
      referenceBits: [...referenceBits],
      pointer
    });
  });

  return { states, pageFaults, hitRatio: (pages.length - pageFaults) / pages.length };
};

// Enhanced Second Chance Algorithm
const enhancedSecondChanceAlgorithm = (pages, frameCount) => {
  const frames = new Array(frameCount).fill(-1);
  const referenceBits = new Array(frameCount).fill(false);
  const modifyBits = new Array(frameCount).fill(false); // Simulating modify bits
  const states = [];
  let pageFaults = 0;
  let pointer = 0;

  pages.forEach((page, index) => {
    // Check if page already exists in frames
    const existingPageIndex = frames.indexOf(page);
    let fault = false;
    let replaced = -1;

    if (existingPageIndex === -1) {
      // Page fault
      pageFaults++;
      fault = true;

      // Find a page to replace
      let found = false;
      for (let i = 0; i < frameCount * 2; i++) {
        const current = pointer % frameCount;
        
        // Class 0: (0, 0) - neither referenced nor modified
        if (!referenceBits[current] && !modifyBits[current]) {
          replaced = current;
          found = true;
          break;
        }
        
        pointer = (pointer + 1) % frameCount;
      }

      if (!found) {
        // Second pass: look for (0, 1)
        for (let i = 0; i < frameCount; i++) {
          const current = pointer % frameCount;
          
          if (!referenceBits[current] && modifyBits[current]) {
            replaced = current;
            found = true;
            break;
          }
          
          pointer = (pointer + 1) % frameCount;
        }
      }

      if (!found) {
        // Third pass: reset reference bits and try again
        for (let i = 0; i < frameCount; i++) {
          referenceBits[i] = false;
        }
        pointer = 0;
        replaced = pointer;
      }

      // Replace the selected page
      frames[replaced] = page;
      referenceBits[replaced] = true;
      // Randomly set modify bit (simulating some pages being modified)
      modifyBits[replaced] = Math.random() > 0.5;
      pointer = (pointer + 1) % frameCount;
    } else {
      // Page hit - set reference bit
      referenceBits[existingPageIndex] = true;
    }

    states.push({
      page,
      frames: [...frames],
      fault,
      replaced,
      referenceBits: [...referenceBits],
      modifyBits: [...modifyBits],
      pointer
    });
  });

  return { states, pageFaults, hitRatio: (pages.length - pageFaults) / pages.length };
};

// Most Frequently Used (MFU) Algorithm
const mfuAlgorithm = (pages, frameCount) => {
  const frames = new Array(frameCount).fill(-1);
  const frequency = new Array(frameCount).fill(0);
  const recency = new Array(frameCount).fill(0); // For tie-breaking
  const states = [];
  let pageFaults = 0;

  pages.forEach((page, index) => {
    // Check if page already exists in frames
    const existingPageIndex = frames.indexOf(page);
    let fault = false;
    let replaced = -1;

    if (existingPageIndex === -1) {
      // Page fault
      pageFaults++;
      fault = true;

      // Find if there's an empty frame
      const emptyIndex = frames.indexOf(-1);
      if (emptyIndex !== -1) {
        frames[emptyIndex] = page;
        frequency[emptyIndex] = 1;
        recency[emptyIndex] = index;
        replaced = emptyIndex;
      } else {
        // Find most frequently used page
        const maxFreq = Math.max(...frequency);
        const maxFreqIndices = frequency.map((f, i) => f === maxFreq ? i : -1).filter(i => i !== -1);
        
        // If there are multiple pages with the same frequency, choose the least recently used
        const mfuIndices = maxFreqIndices.map(i => ({ index: i, recency: recency[i] }));
        mfuIndices.sort((a, b) => a.recency - b.recency);
        
        replaced = mfuIndices[0].index;
        frames[replaced] = page;
        frequency[replaced] = 1;
        recency[replaced] = index;
      }
    } else {
      // Page hit - update frequency
      frequency[existingPageIndex]++;
      recency[existingPageIndex] = index;
    }

    states.push({
      page,
      frames: [...frames],
      fault,
      replaced,
      frequency: [...frequency]
    });
  });

  return { states, pageFaults, hitRatio: (pages.length - pageFaults) / pages.length };
};

// Page Buffering Algorithm
const pageBufferingAlgorithm = (pages, frameCount) => {
  const frames = new Array(frameCount).fill(-1);
  const buffer = []; // Buffer of recently evicted pages
  const states = [];
  let pageFaults = 0;

  pages.forEach((page, index) => {
    // First check if page is in main frames
    const existingPageIndex = frames.indexOf(page);
    let fault = false;
    let replaced = -1;
    let restoredFromBuffer = false;

    if (existingPageIndex === -1) {
      // Check if page is in buffer
      const bufferIndex = buffer.indexOf(page);
      if (bufferIndex !== -1) {
        // Restore from buffer
        restoredFromBuffer = true;
        buffer.splice(bufferIndex, 1);
      } else {
        // Page fault
        pageFaults++;
        fault = true;
      }

      // Find if there's an empty frame
      const emptyIndex = frames.indexOf(-1);
      if (emptyIndex !== -1) {
        frames[emptyIndex] = page;
        replaced = emptyIndex;
      } else {
        // Replace a page (using FIFO for simplicity)
        const pageToEvict = frames[0];
        buffer.push(pageToEvict);
        if (buffer.length > frameCount) buffer.shift(); // Limit buffer size
        
        replaced = 0;
        for (let i = 0; i < frames.length - 1; i++) {
          frames[i] = frames[i + 1];
        }
        frames[frames.length - 1] = page;
      }
    }

    states.push({
      page,
      frames: [...frames],
      fault,
      replaced,
      restoredFromBuffer,
      buffer: [...buffer]
    });
  });

  return { states, pageFaults, hitRatio: (pages.length - pageFaults) / pages.length };
};

// Not Recently Used (NRU) Algorithm
const nruAlgorithm = (pages, frameCount) => {
  const frames = new Array(frameCount).fill(-1);
  const referenceBits = new Array(frameCount).fill(false);
  const modifyBits = new Array(frameCount).fill(false); // Simulating modify bits
  const states = [];
  let pageFaults = 0;
  let clockCounter = 0;

  pages.forEach((page, index) => {
    // Periodically clear reference bits (simulating clock interrupt)
    if (index % 5 === 0) {
      for (let i = 0; i < frameCount; i++) {
        referenceBits[i] = false;
      }
    }

    // Check if page already exists in frames
    const existingPageIndex = frames.indexOf(page);
    let fault = false;
    let replaced = -1;

    if (existingPageIndex === -1) {
      // Page fault
      pageFaults++;
      fault = true;

      // Find if there's an empty frame
      const emptyIndex = frames.indexOf(-1);
      if (emptyIndex !== -1) {
        frames[emptyIndex] = page;
        referenceBits[emptyIndex] = true;
        // Randomly set modify bit (simulating some pages being modified)
        modifyBits[emptyIndex] = Math.random() > 0.3;
        replaced = emptyIndex;
      } else {
        // Find page to replace using NRU classes
        let found = false;
        
        // Class 0: (0, 0) - neither referenced nor modified
        for (let i = 0; i < frameCount && !found; i++) {
          if (!referenceBits[i] && !modifyBits[i]) {
            replaced = i;
            found = true;
          }
        }
        
        // Class 1: (0, 1) - not referenced but modified
        if (!found) {
          for (let i = 0; i < frameCount && !found; i++) {
            if (!referenceBits[i] && modifyBits[i]) {
              replaced = i;
              found = true;
            }
          }
        }
        
        // Class 2: (1, 0) - referenced but not modified
        if (!found) {
          for (let i = 0; i < frameCount && !found; i++) {
            if (referenceBits[i] && !modifyBits[i]) {
              replaced = i;
              found = true;
            }
          }
        }
        
        // Class 3: (1, 1) - referenced and modified
        if (!found) {
          for (let i = 0; i < frameCount && !found; i++) {
            if (referenceBits[i] && modifyBits[i]) {
              replaced = i;
              found = true;
            }
          }
        }
        
        // Replace the selected page
        frames[replaced] = page;
        referenceBits[replaced] = true;
        // Randomly set modify bit (simulating some pages being modified)
        modifyBits[replaced] = Math.random() > 0.3;
      }
    } else {
      // Page hit - set reference bit
      referenceBits[existingPageIndex] = true;
    }

    states.push({
      page,
      frames: [...frames],
      fault,
      replaced,
      referenceBits: [...referenceBits],
      modifyBits: [...modifyBits]
    });
  });

  return { states, pageFaults, hitRatio: (pages.length - pageFaults) / pages.length };
};

  // Run the selected algorithm
  const runAlgorithm = () => {
    const pages = processReferenceString(referenceString);
    let result;
  
    switch (algorithm) {
      case 'fifo':
        result = fifoAlgorithm(pages, frames);
        break;
      case 'optimal':
        result = optimalAlgorithm(pages, frames);
        break;
      case 'lru':
        result = lruAlgorithm(pages, frames);
        break;
      case 'lfu':
        result = lfuAlgorithm(pages, frames);
        break;
      case 'second-chance':
        result = secondChanceAlgorithm(pages, frames);
        break;
      case 'enhanced-second-chance':
        result = enhancedSecondChanceAlgorithm(pages, frames);
        break;
      case 'mfu':
        result = mfuAlgorithm(pages, frames);
        break;
      case 'page-buffering':
        result = pageBufferingAlgorithm(pages, frames);
        break;
      case 'nru':
        result = nruAlgorithm(pages, frames);
        break;
      default:
        result = fifoAlgorithm(pages, frames);
    }
  
    setResults(result);
    setCurrentStep(0);
    setIsSimulating(true);
  };

  // Auto play simulation
  useEffect(() => {
    let timer;
    if (autoPlay && isSimulating && results && currentStep < results.states.length - 1) {
      timer = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, speed);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [autoPlay, currentStep, isSimulating, results, speed]);

  // Handle step navigation
  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleNext = () => {
    if (results && currentStep < results.states.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleReset = () => {
    setIsSimulating(false);
    setResults(null);
    setCurrentStep(0);
    setAutoPlay(false);
  };

  const toggleAutoPlay = () => {
    setAutoPlay(prev => !prev);
  };

  const algorithmFullNames = {
    'fifo': 'First-In-First-Out (FIFO)',
    'optimal': 'Optimal',
    'lru': 'Least Recently Used (LRU)',
    'lfu': 'Least Frequently Used (LFU)',
    'second-chance': 'Second Chance (Clock)',
    'enhanced-second-chance': 'Enhanced Second Chance',
    'mfu': 'Most Frequently Used (MFU)',
    'page-buffering': 'Page Buffering Algorithm',
    'nru': 'Not Recently Used (NRU)'
  };

  return (
    <div className="bg-blue-50 min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">
            <span className="text-gray-800">Operating Systems</span>{" "}
            <span className="text-indigo-600">Algorithms</span>
          </h1>
          <p className="text-xl text-gray-600">
            A comprehensive collection of operating system concepts implemented as interactive modules
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">Page Replacement Algorithms</h2>
          
          {/* Controls Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-gray-700 mb-2">Algorithm</label>
              <select 
                className="w-full p-2 border border-gray-300 rounded"
                value={algorithm}
                onChange={(e) => setAlgorithm(e.target.value)}
                disabled={isSimulating}
              >
                <option value="fifo">First-In-First-Out (FIFO)</option>
                <option value="optimal">Optimal</option>
                <option value="lru">Least Recently Used (LRU)</option>
                <option value="lfu">Least Frequently Used (LFU)</option>
                <option value="second-chance">Second Chance (Clock)</option>
                <option value="enhanced-second-chance">Enhanced Second Chance</option>
                <option value="mfu">Most Frequently Used (MFU)</option>
                <option value="page-buffering">Page Buffering Algorithm</option>
                <option value="nru">Not Recently Used (NRU)</option>
              </select>
            </div>
            
            <div>
              <label className="block text-gray-700 mb-2">Number of Frames</label>
              <input 
                type="number" 
                min="1" 
                max="10"
                className="w-full p-2 border border-gray-300 rounded"
                value={frames}
                onChange={(e) => setFrames(parseInt(e.target.value))}
                disabled={isSimulating}
              />
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-gray-700 mb-2">Reference String (space-separated)</label>
              <input 
                type="text" 
                className="w-full p-2 border border-gray-300 rounded"
                value={referenceString}
                onChange={(e) => setReferenceString(e.target.value)}
                disabled={isSimulating}
              />
            </div>
            
            {isSimulating && (
              <div className="md:col-span-2">
                <label className="block text-gray-700 mb-2">Simulation Speed (ms)</label>
                <input 
                  type="range" 
                  min="200" 
                  max="2000" 
                  step="100"
                  className="w-full"
                  value={speed}
                  onChange={(e) => setSpeed(parseInt(e.target.value))}
                />
                <div className="flex justify-between text-gray-500 text-sm">
                  <span>Fast</span>
                  <span>Slow</span>
                </div>
              </div>
            )}
          </div>
          
          <div className="flex flex-wrap gap-4 mb-8">
            {!isSimulating ? (
              <button 
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                onClick={runAlgorithm}
              >
                Run Simulation
              </button>
            ) : (
              <>
                <button 
                  className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
                  onClick={handlePrev}
                  disabled={currentStep === 0}
                >
                  Previous
                </button>
                
                <button 
                  className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
                  onClick={handleNext}
                  disabled={!results || currentStep === results.states.length - 1}
                >
                  Next
                </button>
                
                <button 
                  className={`px-4 py-2 ${autoPlay ? 'bg-yellow-600' : 'bg-green-600'} text-white rounded hover:${autoPlay ? 'bg-yellow-700' : 'bg-green-700'}`}
                  onClick={toggleAutoPlay}
                >
                  {autoPlay ? 'Pause' : 'Auto Play'}
                </button>
                
                <button 
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                  onClick={handleReset}
                >
                  Reset
                </button>
              </>
            )}
          </div>
          
          {/* Visualization Area */}
          {isSimulating && results && (
            <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">{algorithmFullNames[algorithm]} Simulation</h3>
                <div className="text-gray-600">
                  Step: {currentStep + 1} / {results.states.length}
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="text-lg font-medium mb-3">Reference String:</h4>
                <div className="flex flex-wrap gap-2 mb-4">
                  {processReferenceString(referenceString).map((page, idx) => (
                    <div 
                      key={idx} 
                      className={`w-12 h-12 flex items-center justify-center rounded border ${idx === currentStep ? 'bg-indigo-100 border-indigo-500 font-bold' : 'bg-white border-gray-300'}`}
                    >
                      {page}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="text-lg font-medium mb-3">Frame Status:</h4>
                <div className="grid grid-cols-1 gap-4">
                  {Array(frames).fill().map((_, frameIdx) => {
                    const currentState = results.states[currentStep];
                    const frameValue = currentState.frames[frameIdx];
                    const isReplaced = currentState.replaced === frameIdx && currentState.fault;
                    
                    return (
                      <div 
                        key={frameIdx} 
                        className={`h-16 flex items-center justify-center rounded-lg border-2 
                          ${isReplaced ? 'border-red-500 bg-red-50' : 'border-gray-300 bg-white'} 
                          ${frameValue === -1 ? 'text-gray-400' : 'text-gray-800 font-bold'}`}
                      >
                        <div className="flex flex-col items-center">
                          <div className="text-gray-500 text-sm">Frame {frameIdx}</div>
                          <div className="text-2xl">{frameValue === -1 ? 'Empty' : frameValue}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              
              <div className="mt-6 bg-white p-4 rounded border border-gray-200">
                <h4 className="text-lg font-medium mb-3">Current Step Info:</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-gray-700">
                      Page requested: <span className="font-bold">{results.states[currentStep].page}</span>
                    </p>
                    <p className="text-gray-700">
                      Status: {results.states[currentStep].fault ? (
                        <span className="text-red-600 font-medium">Page Fault</span>
                      ) : (
                        <span className="text-green-600 font-medium">Page Hit</span>
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-700">
                      Total page faults so far: <span className="font-bold">
                        {results.states.slice(0, currentStep + 1).filter(state => state.fault).length}
                      </span>
                    </p>
                    <p className="text-gray-700">
                      Hit ratio so far: <span className="font-bold">
                        {((currentStep + 1 - results.states.slice(0, currentStep + 1).filter(state => state.fault).length) / (currentStep + 1) * 100).toFixed(2)}%
                      </span>
                    </p>
                  </div>
                </div>
              </div>
              
              {currentStep === results.states.length - 1 && (
                <div className="mt-6 p-4 bg-indigo-50 rounded-lg border border-indigo-200">
                  <h4 className="text-lg font-medium text-indigo-700 mb-2">Final Results</h4>
                  <p className="text-gray-700">
                    Total references: <span className="font-bold">{results.states.length}</span>
                  </p>
                  <p className="text-gray-700">
                    Total page faults: <span className="font-bold">{results.pageFaults}</span>
                  </p>
                  <p className="text-gray-700">
                    Final hit ratio: <span className="font-bold">{(results.hitRatio * 100).toFixed(2)}%</span>
                  </p>
                </div>
              )}
            </div>
          )}
          
          {/* Algorithm Explanation */}
          {!isSimulating && (
            <div className="mt-8 bg-gray-50 p-6 rounded-lg border border-gray-200">
              <h3 className="text-xl font-semibold mb-4">About {algorithmFullNames[algorithm]}</h3>
              
              {algorithm === 'fifo' && (
                <div>
                  <p className="mb-4">
                    The First-In-First-Out (FIFO) algorithm is the simplest page replacement algorithm. When a page fault occurs and no empty frames are available, it replaces the page that has been in memory for the longest time.
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>It's easy to implement using a queue data structure</li>
                    <li>It doesn't require any page usage information</li>
                    <li>However, it may remove pages that are heavily used</li>
                    <li>FIFO can exhibit Belady's Anomaly - increasing the number of frames can sometimes increase page faults</li>
                  </ul>
                </div>
              )}
              
              {algorithm === 'optimal' && (
                <div>
                  <p className="mb-4">
                    The Optimal page replacement algorithm (also known as OPT or Belady's algorithm) replaces the page that will not be used for the longest duration in the future. This algorithm provides the best possible page fault rate.
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>It's theoretically optimal - guaranteed to have the lowest page fault rate</li>
                    <li>It requires future knowledge of the reference string, making it impossible to implement in practice</li>
                    <li>It serves as a theoretical benchmark to evaluate other algorithms</li>
                    <li>Does not suffer from Belady's Anomaly</li>
                  </ul>
                </div>
              )}
              
              {algorithm === 'lru' && (
                <div>
                  <p className="mb-4">
                    The Least Recently Used (LRU) algorithm replaces the page that has been unused for the longest period of time. It is based on the principle of locality of reference - if a page has been referenced recently, it's likely to be referenced again soon.
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>It works well in practice because it leverages temporal locality</li>
                    <li>It requires tracking when each page was last accessed</li>
                    <li>Implementation is more complex than FIFO</li>
                    <li>Does not suffer from Belady's Anomaly</li>
                    <li>Often implemented using stack, hash table, or counter-based approaches</li>
                  </ul>
                </div>
              )}
              
              {algorithm === 'lfu' && (
                <div>
                  <p className="mb-4">
                    The Least Frequently Used (LFU) algorithm replaces the page that has been accessed the least number of times. If multiple pages tie for least frequently used, LFU typically evicts the least recently used among them.
                  </p>
                  <ul className="list-disc pl-5 space-y-2">
                    <li>It considers the frequency of page access rather than recency</li>
                    <li>Requires counting page accesses, which adds overhead</li>
                    <li>May retain old pages that were heavily used in the past but are no longer needed</li>
                    <li>Often implemented with a min-heap or counter-based approach</li>
                    <li>Can be combined with aging techniques to address the "historical" problem</li>
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
        
        <div className="text-center text-gray-600 text-sm">
          <p>Operating Systems Algorithms - Page Replacement Module</p>
        </div>
      </div>
    </div>
  );
};

export default PageReplacementModule;

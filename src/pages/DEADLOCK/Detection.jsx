import React, { useState, useEffect } from 'react';

const DeadlockDetectionSimulator = () => {
  const [numProcesses, setNumProcesses] = useState(3);
  const [numResources, setNumResources] = useState(2);
  const [available, setAvailable] = useState([]);
  const [maximum, setMaximum] = useState([]);
  const [allocation, setAllocation] = useState([]);
  const [need, setNeed] = useState([]);
  const [executing, setExecuting] = useState(false);
  const [currentProcess, setCurrentProcess] = useState(null);
  const [safeSequence, setSafeSequence] = useState([]);
  const [finished, setFinished] = useState([]);
  const [resultMessage, setResultMessage] = useState('');
  const [animationStep, setAnimationStep] = useState(0);
  const [animationSpeed, setAnimationSpeed] = useState(1000);
  const [showAnimation, setShowAnimation] = useState(false);

  
  useEffect(() => {
    initializeMatrices();
  }, [numProcesses, numResources]);

  const initializeMatrices = () => {
    
    const avail = Array(numResources).fill(0);
    setAvailable(avail);

    
    const alloc = Array(numProcesses)
      .fill(0)
      .map(() => Array(numResources).fill(0));
    setAllocation(alloc);

    
    const max = Array(numProcesses)
      .fill(0)
      .map(() => Array(numResources).fill(0));
    setMaximum(max);

    
    const nd = Array(numProcesses)
      .fill(0)
      .map(() => Array(numResources).fill(0));
    setNeed(nd);

    
    setFinished(Array(numProcesses).fill(false));
    
    
    setSafeSequence([]);
    setResultMessage('');
    setShowAnimation(false);
    setAnimationStep(0);
  };

  const updateAllocation = (process, resource, value) => {
    const newAllocation = [...allocation];
    newAllocation[process][resource] = parseInt(value, 10) || 0;
    setAllocation(newAllocation);
    updateNeedMatrix(process, resource, maximum[process][resource], parseInt(value, 10) || 0);
  };

  const updateMaximum = (process, resource, value) => {
    const newMaximum = [...maximum];
    newMaximum[process][resource] = parseInt(value, 10) || 0;
    setMaximum(newMaximum);
    updateNeedMatrix(process, resource, parseInt(value, 10) || 0, allocation[process][resource]);
  };

  const updateNeedMatrix = (process, resource, max, alloc) => {
    const newNeed = [...need];
    newNeed[process][resource] = Math.max(0, max - alloc);
    setNeed(newNeed);
  };

  const updateAvailable = (resource, value) => {
    const newAvailable = [...available];
    newAvailable[resource] = parseInt(value, 10) || 0;
    setAvailable(newAvailable);
  };

  const runDeadlockDetection = () => {
    setShowAnimation(true);
    setExecuting(true);
    setAnimationStep(0);
    setSafeSequence([]);
    setCurrentProcess(null);
    setFinished(Array(numProcesses).fill(false));
    setResultMessage('');
    
    
    const work = [...available];
    const finish = Array(numProcesses).fill(false);
    const sequence = [];

    setTimeout(() => {
      runAnimation(work, finish, sequence, 0);
    }, 500);
  };

  const runAnimation = (work, finish, sequence, step) => {
    if (step >= numProcesses * 2) {
      
      const allFinished = finish.every(f => f);
      if (allFinished) {
        setResultMessage(`System is safe. Safe sequence: ${sequence.join(' → ')}`);
      } else {
        setResultMessage('System is deadlocked! Some processes cannot complete.');
      }
      setExecuting(false);
      return;
    }

    
    let found = false;
    for (let i = 0; i < numProcesses; i++) {
      if (!finish[i]) {
        let canAllocate = true;
        for (let j = 0; j < numResources; j++) {
          if (need[i][j] > work[j]) {
            canAllocate = false;
            break;
          }
        }

        if (canAllocate) {
          found = true;
          setCurrentProcess(i);
          
          
          const newFinished = [...finish];
          newFinished[i] = true;
          setFinished(newFinished);
          finish[i] = true;
          
          
          sequence.push(i);
          setSafeSequence([...sequence]);
          
          
          for (let j = 0; j < numResources; j++) {
            work[j] += allocation[i][j];
          }
          
          setAnimationStep(step + 1);
          
          
          setTimeout(() => {
            runAnimation(work, finish, sequence, step + 1);
          }, animationSpeed);
          
          break;
        }
      }
    }

    if (!found) {
     
      const allFinished = finish.every(f => f);
      if (allFinished) {
        setResultMessage(`System is safe. Safe sequence: ${sequence.join(' → ')}`);
      } else {
        setResultMessage('System is deadlocked! Some processes cannot complete.');
      }
      setExecuting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-700">Deadlock Detection Simulator</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">System Configuration</h2>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Number of Processes</label>
              <input
                type="number"
                min="1"
                max="10"
                value={numProcesses}
                onChange={(e) => setNumProcesses(Math.min(10, Math.max(1, parseInt(e.target.value) || 1)))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={executing}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Number of Resources</label>
              <input
                type="number"
                min="1"
                max="10"
                value={numResources}
                onChange={(e) => setNumResources(Math.min(10, Math.max(1, parseInt(e.target.value) || 1)))}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={executing}
              />
            </div>
          </div>
          
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2 text-blue-600">Available Resources</h3>
            <div className="flex flex-wrap gap-2">
              {available.map((val, i) => (
                <div key={`available-${i}`} className="flex items-center">
                  <label className="mr-1 text-sm font-medium text-gray-700">R{i}:</label>
                  <input
                    type="number"
                    min="0"
                    value={val}
                    onChange={(e) => updateAvailable(i, e.target.value)}
                    className="w-16 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    disabled={executing}
                  />
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2 text-blue-600">Animation Speed</h3>
            <input
              type="range"
              min="200"
              max="2000"
              step="100"
              value={animationSpeed}
              onChange={(e) => setAnimationSpeed(parseInt(e.target.value))}
              className="w-full"
              disabled={executing}
            />
            <div className="text-sm text-gray-600 text-center">{animationSpeed}ms</div>
          </div>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">Resource Allocation</h2>
          
          <div className="mb-4">
            <h3 className="text-lg font-medium mb-2 text-blue-600">Maximum Need Matrix</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border border-gray-300 px-3 py-2 bg-gray-100">Process</th>
                    {Array.from({ length: numResources }, (_, i) => (
                      <th key={`max-header-${i}`} className="border border-gray-300 px-3 py-2 bg-gray-100">R{i}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {maximum.map((row, i) => (
                    <tr key={`max-row-${i}`}>
                      <td className="border border-gray-300 px-3 py-2 font-medium">P{i}</td>
                      {row.map((val, j) => (
                        <td key={`max-${i}-${j}`} className="border border-gray-300 px-2 py-1">
                          <input
                            type="number"
                            min="0"
                            value={val}
                            onChange={(e) => updateMaximum(i, j, e.target.value)}
                            className="w-14 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            disabled={executing}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-medium mb-2 text-blue-600">Allocation Matrix</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse">
                <thead>
                  <tr>
                    <th className="border border-gray-300 px-3 py-2 bg-gray-100">Process</th>
                    {Array.from({ length: numResources }, (_, i) => (
                      <th key={`alloc-header-${i}`} className="border border-gray-300 px-3 py-2 bg-gray-100">R{i}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {allocation.map((row, i) => (
                    <tr key={`alloc-row-${i}`}>
                      <td className="border border-gray-300 px-3 py-2 font-medium">P{i}</td>
                      {row.map((val, j) => (
                        <td key={`alloc-${i}-${j}`} className="border border-gray-300 px-2 py-1">
                          <input
                            type="number"
                            min="0"
                            max={maximum[i][j]}
                            value={val}
                            onChange={(e) => updateAllocation(i, j, e.target.value)}
                            className="w-14 px-2 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                            disabled={executing}
                          />
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">Need Matrix (Maximum - Allocation)</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse">
              <thead>
                <tr>
                  <th className="border border-gray-300 px-3 py-2 bg-gray-100">Process</th>
                  {Array.from({ length: numResources }, (_, i) => (
                    <th key={`need-header-${i}`} className="border border-gray-300 px-3 py-2 bg-gray-100">R{i}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {need.map((row, i) => (
                  <tr key={`need-row-${i}`}>
                    <td className="border border-gray-300 px-3 py-2 font-medium">P{i}</td>
                    {row.map((val, j) => (
                      <td key={`need-${i}-${j}`} className="border border-gray-300 px-3 py-2 text-center">{val}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="bg-blue-50 p-4 rounded-lg flex flex-col">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">Results</h2>
          
          <button
            onClick={runDeadlockDetection}
            disabled={executing}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg mb-4 disabled:bg-gray-400 disabled:cursor-not-allowed transition duration-200"
          >
            {executing ? 'Running...' : 'Check for Deadlock'}
          </button>
          
          {showAnimation && (
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-medium mb-2 text-blue-600">Animation Progress</h3>
                <div className="mb-4 flex items-center gap-2">
                  {Array.from({ length: numProcesses }).map((_, i) => (
                    <div 
                      key={`process-${i}`}
                      className={`w-12 h-12 rounded-full flex items-center justify-center font-bold transition-all duration-500 ${
                        currentProcess === i 
                          ? 'bg-yellow-400 text-black transform scale-110'
                          : finished[i]
                            ? 'bg-green-500 text-white'
                            : 'bg-red-500 text-white'
                      }`}
                    >
                      P{i}
                    </div>
                  ))}
                </div>
                
                {safeSequence.length > 0 && (
                  <div className="mb-4">
                    <h3 className="text-lg font-medium mb-2 text-blue-600">Safe Sequence (so far)</h3>
                    <div className="flex items-center gap-2">
                      {safeSequence.map((process, i) => (
                        <React.Fragment key={`seq-${i}`}>
                          <div className="w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center font-bold">
                            P{process}
                          </div>
                          {i < safeSequence.length - 1 && (
                            <div className="text-gray-500">→</div>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className={`mt-4 p-3 rounded-lg font-medium text-lg ${
                resultMessage.includes('safe') 
                  ? 'bg-green-100 text-green-800'
                  : resultMessage.includes('deadlocked')
                    ? 'bg-red-100 text-red-800'
                    : 'hidden'
              }`}>
                {resultMessage}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DeadlockDetectionSimulator;
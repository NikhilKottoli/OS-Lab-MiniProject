import React, { useState } from 'react';

const DeadlockAvoidanceSimulator = () => {
  
  const [numProcesses, setNumProcesses] = useState(3);
  const [numResources, setNumResources] = useState(3);
  const [resourceNames, setResourceNames] = useState(['A', 'B', 'C']);
  const [available, setAvailable] = useState([3, 3, 2]);
  const [processes, setProcesses] = useState([
    { id: 0, name: "P0", allocation: [0, 1, 0], max: [7, 5, 3] },
    { id: 1, name: "P1", allocation: [2, 0, 0], max: [3, 2, 2] },
    { id: 2, name: "P2", allocation: [3, 0, 2], max: [9, 0, 2] }
  ]);
  
  const [safeSequence, setSafeSequence] = useState([]);
  const [isSystemSafe, setIsSystemSafe] = useState(null);
  const [setupComplete, setSetupComplete] = useState(false);
  const [messages, setMessages] = useState([]);

  
  const [setupPhase, setSetupPhase] = useState("initial"); // "initial", "resources", "allocation", "max"
  
  
  const calculateNeed = (procs) => {
    return procs.map(proc => {
      const need = proc.max.map((max, i) => Math.max(0, max - (proc.allocation[i] || 0)));
      return { ...proc, need };
    });
  };

  
  const initializeSystem = () => {
    
    if (numProcesses < 1 || numResources < 1) {
      addMessage("Number of processes and resources must be at least 1", "error");
      return;
    }
    
    if (numProcesses > 10) {
      addMessage("For better UI experience, please use at most 10 processes", "warning");
    }
    
    if (numResources > 10) {
      addMessage("For better UI experience, please use at most 10 resources", "warning");
    }
    
    
    const newResourceNames = Array(numResources).fill(0).map((_, i) => 
      String.fromCharCode(65 + i % 26) + (i >= 26 ? Math.floor(i / 26) : "")
    );
    
    
    const newAvailable = Array(numResources).fill(0);
    
    
    const newProcesses = Array(numProcesses).fill(0).map((_, i) => ({
      id: i,
      name: `P${i}`,
      allocation: Array(numResources).fill(0),
      max: Array(numResources).fill(0)
    }));
    
    setResourceNames(newResourceNames);
    setAvailable(newAvailable);
    setProcesses(newProcesses);
    setSetupPhase("resources");
    
    addMessage(`System initialized with ${numProcesses} processes and ${numResources} resources`, "info");
  };

  
  const updateAvailable = () => {
    
    if (available.some(val => val < 0)) {
      addMessage("All available resource values must be non-negative", "error");
      return;
    }
    
    setSetupPhase("allocation");
    addMessage("Available resources updated", "info");
  };

  
  const updateAllocation = () => {
    
    for (const proc of processes) {
      if (proc.allocation.some(val => val < 0)) {
        addMessage(`Process ${proc.name} has negative allocation values`, "error");
        return;
      }
    }
    
    
    const totalAllocated = processes.reduce((sum, proc) => {
      return sum.map((val, i) => val + proc.allocation[i]);
    }, Array(numResources).fill(0));
    
    const totalResources = available.map((val, i) => val + totalAllocated[i]);
    setSetupPhase("max");
    addMessage("Allocation matrix updated", "info");
  };

  
  const updateMax = () => {
    
    for (const proc of processes) {
      if (proc.max.some(val => val < 0)) {
        addMessage(`Process ${proc.name} has negative maximum values`, "error");
        return;
      }
      
      
      for (let i = 0; i < numResources; i++) {
        if (proc.max[i] < proc.allocation[i]) {
          addMessage(`Process ${proc.name}: Maximum claim (${proc.max[i]}) for resource ${resourceNames[i]} cannot be less than allocation (${proc.allocation[i]})`, "error");
          return;
        }
      }
    }
    
    
    const processesWithNeed = calculateNeed(processes);
    setProcesses(processesWithNeed);
    setSetupComplete(true);
    setSetupPhase("complete");
    
    
    setTimeout(() => {
      runSafetyAlgorithm(processesWithNeed, available);
    }, 100);
  };

  
  const resetSetup = () => {
    setSetupComplete(false);
    setSetupPhase("initial");
    setIsSystemSafe(null);
    setSafeSequence([]);
    setMessages([]);
  };

  
  const runSafetyAlgorithm = (procs = processes, avail = available) => {
    
    let work = [...avail];
    let finish = Array(procs.length).fill(false);
    let processOrder = [];
    
    
    let found;
    do {
      found = false;
      for (let i = 0; i < procs.length; i++) {
        if (!finish[i]) {
          
          let canComplete = true;
          for (let j = 0; j < procs[i].need.length; j++) {
            if (procs[i].need[j] > work[j]) {
              canComplete = false;
              break;
            }
          }
          
          if (canComplete) {
            
            finish[i] = true;
            found = true;
            processOrder.push(i);
            
            for (let j = 0; j < work.length; j++) {
              work[j] += procs[i].allocation[j];
            }
          }
        }
      }
    } while (found);
    
    
    const safe = finish.every(f => f);
    setSafeSequence(safe ? processOrder : []);
    setIsSystemSafe(safe);
    
    if (safe) {
      addMessage(`System is in a safe state with sequence: [${processOrder.map(p => procs[p].name).join(', ')}]`, "success");
    } else {
      addMessage("System is in an unsafe state! Risk of deadlock.", "error");
    }
    
    return safe;
  };

  
  const addMessage = (text, type = "info") => {
    setMessages(prev => [...prev, { text, type, id: Date.now() }]);
  };

  
  const handleNumberChange = (setter, value) => {
    const num = parseInt(value) || 0;
    setter(num);
  };

  
  const handleMatrixChange = (processIndex, resourceIndex, value, matrixType) => {
    const newValue = parseInt(value) || 0;
    const newProcesses = [...processes];
    newProcesses[processIndex][matrixType][resourceIndex] = newValue;
    
    
    if (matrixType === 'allocation' || matrixType === 'max') {
      const newNeed = Math.max(0, newProcesses[processIndex].max[resourceIndex] - 
                               (matrixType === 'allocation' ? newValue : newProcesses[processIndex].allocation[resourceIndex]));
      
      if (newProcesses[processIndex].need) {
        newProcesses[processIndex].need[resourceIndex] = newNeed;
      }
    }
    
    setProcesses(newProcesses);
  };

  
  const handleAvailableChange = (index, value) => {
    const newAvailable = [...available];
    newAvailable[index] = parseInt(value) || 0;
    setAvailable(newAvailable);
  };

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Deadlock Avoidance Simulator</h1>
      <p className="mb-4">Configure your system and check if it's in a safe state using the Banker's Algorithm.</p>
      
      {!setupComplete ? (
        <div className="bg-white p-4 rounded shadow mb-6">
          <h2 className="text-lg font-bold mb-4">System Configuration</h2>
          
          
          {setupPhase === "initial" && (
            <div>
              <h3 className="font-bold mb-2">Step 1: Define system parameters</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Number of Processes:</label>
                  <input 
                    type="number"
                    min="1"
                    value={numProcesses}
                    onChange={(e) => handleNumberChange(setNumProcesses, e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Number of Resource Types:</label>
                  <input 
                    type="number"
                    min="1"
                    value={numResources}
                    onChange={(e) => handleNumberChange(setNumResources, e.target.value)}
                    className="w-full p-2 border rounded"
                  />
                </div>
              </div>
              <button
                onClick={initializeSystem}
                className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
              >
                Continue
              </button>
            </div>
          )}
          
          
          {setupPhase === "resources" && (
            <div>
              <h3 className="font-bold mb-2">Step 2: Define available resources</h3>
              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">Enter the number of available instances for each resource type:</p>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-2">
                  {resourceNames.map((name, idx) => (
                    <div key={idx} className="mb-2">
                      <label className="block text-sm font-medium mb-1">Resource {name}:</label>
                      <input 
                        type="number"
                        min="0"
                        value={available[idx]}
                        onChange={(e) => handleAvailableChange(idx, e.target.value)}
                        className="w-full p-2 border rounded"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={updateAvailable}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                >
                  Continue
                </button>
                <button
                  onClick={resetSetup}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                >
                  Back
                </button>
              </div>
            </div>
          )}
          
          
          {setupPhase === "allocation" && (
            <div>
              <h3 className="font-bold mb-2">Step 3: Define allocation matrix</h3>
              <p className="text-sm text-gray-600 mb-2">Enter the current allocation of each resource type for each process:</p>
              
              <div className="overflow-x-auto mb-4">
                <table className="min-w-full border">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 border">Process</th>
                      {resourceNames.map((name, idx) => (
                        <th key={idx} className="p-2 border">Resource {name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {processes.map((process, processIdx) => (
                      <tr key={processIdx}>
                        <td className="p-2 border font-bold">{process.name}</td>
                        {Array(numResources).fill(0).map((_, resourceIdx) => (
                          <td key={resourceIdx} className="p-2 border">
                            <input 
                              type="number"
                              min="0"
                              value={process.allocation[resourceIdx]}
                              onChange={(e) => handleMatrixChange(processIdx, resourceIdx, e.target.value, 'allocation')}
                              className="w-full p-1 border rounded text-center"
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={updateAllocation}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                >
                  Continue
                </button>
                <button
                  onClick={() => setSetupPhase("resources")}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                >
                  Back
                </button>
              </div>
            </div>
          )}
          
          
          {setupPhase === "max" && (
            <div>
              <h3 className="font-bold mb-2">Step 4: Define maximum need matrix</h3>
              <p className="text-sm text-gray-600 mb-2">Enter the maximum number of each resource that each process may request:</p>
              
              <div className="overflow-x-auto mb-4">
                <table className="min-w-full border">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-2 border">Process</th>
                      {resourceNames.map((name, idx) => (
                        <th key={idx} className="p-2 border">Resource {name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {processes.map((process, processIdx) => (
                      <tr key={processIdx}>
                        <td className="p-2 border font-bold">{process.name}</td>
                        {Array(numResources).fill(0).map((_, resourceIdx) => (
                          <td key={resourceIdx} className="p-2 border">
                            <input 
                              type="number"
                              min={process.allocation[resourceIdx] || 0}
                              value={process.max[resourceIdx]}
                              onChange={(e) => handleMatrixChange(processIdx, resourceIdx, e.target.value, 'max')}
                              className="w-full p-1 border rounded text-center"
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="flex space-x-2">
                <button
                  onClick={updateMax}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                >
                  Complete Setup
                </button>
                <button
                  onClick={() => setSetupPhase("allocation")}
                  className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded"
                >
                  Back
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-lg font-bold mb-2">Available Resources</h2>
              <div className="flex flex-wrap gap-4">
                {available.map((value, idx) => (
                  <div key={idx} className="text-center">
                    <div className="font-bold">Resource {resourceNames[idx]}</div>
                    <div className="bg-green-100 p-2 rounded text-xl font-bold">{value}</div>
                  </div>
                ))}
              </div>
            </div>
            
            
            <div className="bg-white p-4 rounded shadow">
              <h2 className="text-lg font-bold mb-2">System Status</h2>
              {isSystemSafe !== null && (
                <div className={`p-4 rounded ${isSystemSafe ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  <div className="text-xl font-bold mb-2">{isSystemSafe ? 'SAFE STATE' : 'UNSAFE STATE'}</div>
                  {isSystemSafe && safeSequence.length > 0 && (
                    <div>
                      <div className="font-bold mb-1">Safe Sequence:</div>
                      <div className="flex flex-wrap gap-2">
                        {safeSequence.map((procIdx, idx) => (
                          <div key={idx} className="bg-green-200 px-3 py-1 rounded flex items-center">
                            {idx > 0 && <span className="mr-2">→</span>}
                            {processes[procIdx].name}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
              
              <div className="mt-4">
                <button
                  onClick={resetSetup}
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
                >
                  Reconfigure System
                </button>
              </div>
            </div>
          </div>
          
          
          <div className="bg-white p-4 rounded shadow mb-6 overflow-x-auto">
            <h2 className="text-lg font-bold mb-2">Resource Matrices</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              
              <div>
                <h3 className="font-bold mb-2">Allocation Matrix</h3>
                <table className="min-w-full border">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-1 border">Process</th>
                      {resourceNames.map((name, idx) => (
                        <th key={idx} className="p-1 border">{name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {processes.map((process, processIdx) => (
                      <tr key={processIdx}>
                        <td className="p-1 border font-medium">{process.name}</td>
                        {process.allocation.map((value, resourceIdx) => (
                          <td key={resourceIdx} className="p-1 border text-center">{value}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              
              <div>
                <h3 className="font-bold mb-2">Maximum Need Matrix</h3>
                <table className="min-w-full border">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-1 border">Process</th>
                      {resourceNames.map((name, idx) => (
                        <th key={idx} className="p-1 border">{name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {processes.map((process, processIdx) => (
                      <tr key={processIdx}>
                        <td className="p-1 border font-medium">{process.name}</td>
                        {process.max.map((value, resourceIdx) => (
                          <td key={resourceIdx} className="p-1 border text-center">{value}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              
              <div>
                <h3 className="font-bold mb-2">Need Matrix</h3>
                <table className="min-w-full border">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="p-1 border">Process</th>
                      {resourceNames.map((name, idx) => (
                        <th key={idx} className="p-1 border">{name}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {processes.map((process, processIdx) => (
                      <tr key={processIdx} className={safeSequence.includes(processIdx) ? "bg-green-50" : ""}>
                        <td className="p-1 border font-medium">{process.name}</td>
                        {process.need.map((value, resourceIdx) => (
                          <td key={resourceIdx} className="p-1 border text-center">{value}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
      
      
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-bold mb-2">System Log</h2>
        <div className="max-h-40 overflow-y-auto border rounded p-2">
          {messages.length === 0 ? (
            <p className="text-gray-500 italic">No messages yet.</p>
          ) : (
            messages.map(message => (
              <div 
                key={message.id} 
                className={`p-2 mb-1 rounded ${
                  message.type === 'error' ? 'bg-red-100 text-red-800' :
                  message.type === 'success' ? 'bg-green-100 text-green-800' :
                  message.type === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-blue-100 text-blue-800'
                }`}
              >
                {message.text}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default DeadlockAvoidanceSimulator;


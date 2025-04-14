
import { useState, useEffect, useRef } from "react";

export default function NiceValuePrioritySim() {
  const [processes, setProcesses] = useState([
    { id: 1, name: "Browser", priority: 0, color: "bg-blue-500", width: 40, running: false },
    { id: 2, name: "Editor", priority: 0, color: "bg-green-500", width: 30, running: false },
    { id: 3, name: "Terminal", priority: 0, color: "bg-purple-500", width: 25, running: false },
    { id: 4, name: "Music Player", priority: 0, color: "bg-yellow-500", width: 20, running: false },
    { id: 5, name: "File Indexer", priority: 0, color: "bg-red-500", width: 15, running: false }
  ]);
  
  const [isRunning, setIsRunning] = useState(false);
  const [cpuTime, setCpuTime] = useState(0);
  const animationRef = useRef(null);
  const [selectedProcess, setSelectedProcess] = useState(null);
  const [showInfo, setShowInfo] = useState(false);
  
  const priorityColors = {
    "-20": "bg-green-900",
    "-10": "bg-green-700",
    "0": "bg-blue-500",
    "10": "bg-yellow-500",
    "19": "bg-red-500"
  };
  // Handle process priority change (renice)
  const changePriority = (id, newPriority) => {
    setProcesses(processes.map(p => 
      p.id === id ? { ...p, priority: newPriority } : p
    ));
  };

  // Calculate process execution chance based on priority
  const getExecutionChance = (priority) => {
    // Nice values range from -20 (highest priority) to 19 (lowest)
    // Convert to execution probability
    return 100 - ((priority + 20) * (70 / 39)); // Scale to approx 30% - 100% chance
  };

  // Start/stop simulation
  const toggleSimulation = () => {
    setIsRunning(!isRunning);
  };

  // Animation frame loop
  useEffect(() => {
    if (!isRunning) return;

    let lastTime = 0;
    const updateFrame = (timestamp) => {
      if (!lastTime) lastTime = timestamp;
      const elapsed = timestamp - lastTime;
      
      if (elapsed > 150) { // Update every 150ms
        lastTime = timestamp;
        setCpuTime(prev => prev + 1);
        
        // Reset running states
        setProcesses(prev => prev.map(p => ({ ...p, running: false })));
        
        // Randomly select which processes get CPU time based on priority
        setProcesses(prev => {
          return prev.map(p => {
            const chance = getExecutionChance(p.priority);
            const willRun = Math.random() * 100 < chance;
            return {
              ...p,
              running: willRun,
              width: willRun ? Math.min(p.width + 2, 100) : Math.max(p.width - 0.5, 10)
            };
          });
        });
      }
      
      animationRef.current = requestAnimationFrame(updateFrame);
    };

    animationRef.current = requestAnimationFrame(updateFrame);
    
    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isRunning]);

  // Reset simulation
  const resetSimulation = () => {
    setIsRunning(false);
    setCpuTime(0);
    setProcesses(processes.map(p => ({
      ...p,
      priority: 0,
      width: 20 + Math.floor(Math.random() * 30),
      running: false
    })));
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-4">
      <div className="mb-6 bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Process Scheduler Simulator</h1>
        <p className="text-gray-600 mb-4">Visualize how the Linux scheduler prioritizes processes with nice values</p>
        
        <div className="flex space-x-4 mb-4">
          <button 
            onClick={toggleSimulation} 
            className={`px-4 py-2 rounded-md font-medium transition-all duration-200 ${isRunning ? 'bg-red-500 hover:bg-red-600 text-white' : 'bg-green-500 hover:bg-green-600 text-white'}`}
          >
            {isRunning ? 'Pause Simulation' : 'Start Simulation'}
          </button>
          
          <button 
            onClick={resetSimulation}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md font-medium transition-all duration-200"
          >
            Reset
          </button>
          
          <button 
            onClick={() => setShowInfo(!showInfo)}
            className="px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-800 rounded-md font-medium transition-all duration-200"
          >
            {showInfo ? 'Hide Info' : 'Show Info'}
          </button>
        </div>
        
        {showInfo && (
          <div className="bg-blue-50 p-4 rounded-md mb-4 text-sm">
            <h3 className="font-semibold mb-2">About Process Priority (Nice Values):</h3>
            <p className="mb-2">In Linux, process priority is controlled by "nice" values that range from -20 (highest priority) to 19 (lowest priority).</p>
            <p className="mb-2">• Lower nice values get more CPU time</p>
            <p className="mb-2">• Default nice value is 0</p>
            <p>• Only root can assign negative (higher priority) nice values</p>
          </div>
        )}
      </div>
      
      <div className="flex-grow bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">CPU Time: {cpuTime}</h2>
        </div>

        <div className="space-y-6">
          {processes.map((process) => (
            <div 
              key={process.id}
              className={`p-4 rounded-lg border-2 transition-all duration-300 ease-in-out ${process.running ? 'border-green-500 shadow-lg shadow-green-100' : 'border-gray-200'}`}
              onClick={() => setSelectedProcess(process.id === selectedProcess ? null : process.id)}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center">
                  <div className={`w-4 h-4 rounded-full ${process.running ? 'bg-green-500 animate-pulse' : 'bg-gray-300'} mr-2`}></div>
                  <h3 className="font-medium">{process.name}</h3>
                </div>
                <div className="text-sm text-gray-500">
                  Priority: {process.priority} (Nice Value)
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-4 mb-2 overflow-hidden">
                <div 
                  className={`${process.color} h-4 rounded-full transition-all duration-300 ${process.running ? 'animate-pulse' : ''}`} 
                  style={{ width: `${process.width}%` }}
                ></div>
              </div>
              
              {selectedProcess === process.id && (
                <div className="mt-4 p-3 bg-gray-50 rounded-md border border-gray-200 transition-all duration-300 animate-fadeIn">
                  <div className="mb-3">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Adjust Process Priority (Renice)</label>
                    <div className="flex items-center space-x-2">
                      <input
                        type="range"
                        min="-20"
                        max="19"
                        value={process.priority}
                        onChange={(e) => changePriority(process.id, parseInt(e.target.value))}
                        className="w-full"
                      />
                      <span className={`text-sm font-medium px-2 py-1 rounded-md ${
                        process.priority < -10 ? 'bg-green-100 text-green-800' :
                        process.priority < 0 ? 'bg-blue-100 text-blue-800' :
                        process.priority < 10 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {process.priority}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-5 gap-2">
                    {[-20, -10, 0, 10, 19].map(value => (
                      <button
                        key={value}
                        onClick={() => changePriority(process.id, value)}
                        className={`py-1 text-xs rounded-md transition-all ${
                          process.priority === value ? 
                          'bg-blue-500 text-white' : 
                          'bg-gray-200 hover:bg-gray-300 text-gray-800'
                        }`}
                      >
                        {value}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="font-semibold mb-2">How to use this simulator:</h3>
        <ol className="list-decimal list-inside space-y-1 text-gray-700 text-sm">
          <li>Click on a process to select it and adjust its priority</li>
          <li>Use the slider or quick buttons to set nice values (-20 to 19)</li>
          <li>Start the simulation to see how different priorities affect CPU time allocation</li>
          <li>Lower nice values (like -20) get more CPU time, higher values (like 19) get less</li>
        </ol>
      </div>
    </div>
  );
}
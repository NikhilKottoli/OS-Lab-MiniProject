import { useState, useEffect, useRef } from 'react';
import { Edit, Save, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';

export default function SharedMemoryVisualization() {
  // Shared memory state
  const [sharedMemory, setSharedMemory] = useState({
    value1: 0,
    value2: "Hello",
    value3: true,
    lastAccess: null,
    lastModified: null
  });
  
  // Process states
  const [processes, setProcesses] = useState([
    { id: 1, name: "Process A", status: "idle", color: "blue", reading: false, writing: false },
    { id: 2, name: "Process B", status: "idle", color: "green", reading: false, writing: false },
    { id: 3, name: "Process C", status: "idle", color: "purple", reading: false, writing: false }
  ]);
  
  // User input states
  const [selectedProcess, setSelectedProcess] = useState(1);
  const [selectedAction, setSelectedAction] = useState("read");
  const [selectedMemoryKey, setSelectedMemoryKey] = useState("value1");
  const [newValue, setNewValue] = useState("");
  const [executing, setExecuting] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [memoryAnimations, setMemoryAnimations] = useState({});

  const notificationIdCounter = useRef(0);
  
  // Form validation
  const isFormValid = () => {
    if (selectedAction === "write" && newValue.trim() === "") {
      return false;
    }
    return true;
  };

  // Add notification
  const addNotification = (message, type = "info") => {
    const id = notificationIdCounter.current++;
    setNotifications(prev => [...prev, { id, message, type, timestamp: Date.now() }]);
    
    // Auto-remove notification after 5 seconds
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, 5000);
  };
  
  // Execute shared memory action
  const executeAction = () => {
    if (!isFormValid() || executing) return;
    
    setExecuting(true);
    
    // Find the active process
    const processIndex = processes.findIndex(p => p.id === selectedProcess);
    if (processIndex === -1) return;
    
    // Clone processes and update status
    const updatedProcesses = [...processes];
    updatedProcesses[processIndex] = {
      ...updatedProcesses[processIndex],
      status: "active",
      reading: selectedAction === "read",
      writing: selectedAction === "write"
    };
    setProcesses(updatedProcesses);
    
    // Animate the selected memory location
    setMemoryAnimations({
      [selectedMemoryKey]: selectedAction === "read" ? "pulse-read" : "pulse-write"
    });
    
    // Simulate processing delay
    setTimeout(() => {
      if (selectedAction === "read") {
        // Read action
        const value = sharedMemory[selectedMemoryKey];
        addNotification(
          `${updatedProcesses[processIndex].name} read ${selectedMemoryKey} = ${value}`,
          "success"
        );
        
        setSharedMemory({
          ...sharedMemory,
          lastAccess: updatedProcesses[processIndex].name,
        });
      } else {
        // Write action
        let typedValue = newValue;
        
        // Try to convert to appropriate type
        if (selectedMemoryKey === "value1") {
          typedValue = isNaN(Number(newValue)) ? 0 : Number(newValue);
        } else if (selectedMemoryKey === "value3") {
          typedValue = newValue.toLowerCase() === "true";
        }
        
        setSharedMemory({
          ...sharedMemory,
          [selectedMemoryKey]: typedValue,
          lastAccess: updatedProcesses[processIndex].name,
          lastModified: updatedProcesses[processIndex].name
        });
        
        addNotification(
          `${updatedProcesses[processIndex].name} updated ${selectedMemoryKey} to "${typedValue}"`,
          "success"
        );
      }
      
      // Reset process state
      setTimeout(() => {
        const resetProcesses = [...updatedProcesses];
        resetProcesses[processIndex] = {
          ...resetProcesses[processIndex],
          status: "idle",
          reading: false,
          writing: false
        };
        setProcesses(resetProcesses);
        setExecuting(false);
        setNewValue("");
        setMemoryAnimations({});
      }, 1000);
    }, 1500);
  };
  
  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-6 bg-slate-50 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6 text-slate-800">Shared Memory Visualization</h1>
      
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Shared Memory Section */}
        <div className="md:col-span-2 bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-700 mb-4 flex items-center">
            <span className="mr-2">📦</span> Shared Memory Block
          </h2>
          
          <div className="space-y-4">
            {Object.entries(sharedMemory)
              .filter(([key]) => key !== "lastAccess" && key !== "lastModified")
              .map(([key, value]) => (
                <div 
                  key={key} 
                  className={`flex items-center p-3 rounded-lg border-2 ${
                    memoryAnimations[key] === "pulse-read" ? "border-blue-500 bg-blue-50 animate-pulse" :
                    memoryAnimations[key] === "pulse-write" ? "border-amber-500 bg-amber-50 animate-pulse" :
                    "border-slate-200 bg-slate-50"
                  } transition-all duration-300`}
                >
                  <div className="font-mono w-24 text-slate-700">{key}:</div>
                  <div className="flex-1 font-mono bg-white p-2 rounded border border-slate-300">
                    {typeof value === "boolean" ? value.toString() : value}
                  </div>
                  <div className="ml-2 text-xs text-slate-500">
                    {typeof value === "number" ? "Number" : 
                     typeof value === "boolean" ? "Boolean" : "String"}
                  </div>
                </div>
              ))
            }
            
            {/* Memory Status */}
            <div className="mt-6 text-sm text-slate-600 divide-y divide-slate-200">
              <div className="py-2 flex">
                <span className="w-1/2">Last Accessed By:</span>
                <span className="font-medium">
                  {sharedMemory.lastAccess || "None"}
                </span>
              </div>
              <div className="py-2 flex">
                <span className="w-1/2">Last Modified By:</span>
                <span className="font-medium">
                  {sharedMemory.lastModified || "None"}
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Process Control Section */}
        <div className="bg-white p-5 rounded-lg border border-slate-200 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-700 mb-4 flex items-center">
            <span className="mr-2">⚙️</span> Process Control
          </h2>
          
          <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); executeAction(); }}>
            {/* Process Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Select Process
              </label>
              <div className="flex gap-2">
                {processes.map(process => (
                  <button
                    key={process.id}
                    type="button"
                    onClick={() => setSelectedProcess(process.id)}
                    disabled={executing}
                    className={`flex-1 py-2 px-3 rounded-md text-white font-medium transition-colors ${
                      selectedProcess === process.id
                        ? `bg-${process.color}-600 ring-2 ring-${process.color}-300`
                        : `bg-${process.color}-400 hover:bg-${process.color}-500`
                    } ${executing ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {process.name}
                  </button>
                ))}
              </div>
            </div>
            
            {/* Action Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Action
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedAction("read")}
                  disabled={executing}
                  className={`flex-1 py-2 px-4 rounded-md border font-medium flex items-center justify-center gap-2 transition-colors ${
                    selectedAction === "read"
                      ? 'bg-blue-100 border-blue-300 text-blue-700'
                      : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                  } ${executing ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <RefreshCw size={16} /> Read
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedAction("write")}
                  disabled={executing}
                  className={`flex-1 py-2 px-4 rounded-md border font-medium flex items-center justify-center gap-2 transition-colors ${
                    selectedAction === "write"
                      ? 'bg-amber-100 border-amber-300 text-amber-700'
                      : 'bg-white border-slate-300 text-slate-700 hover:bg-slate-50'
                  } ${executing ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <Edit size={16} /> Write
                </button>
              </div>
            </div>
            
            {/* Memory Key Selection */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Memory Address
              </label>
              <select
                value={selectedMemoryKey}
                onChange={(e) => setSelectedMemoryKey(e.target.value)}
                disabled={executing}
                className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-100 disabled:text-slate-400"
              >
                <option value="value1">value1 (Number)</option>
                <option value="value2">value2 (String)</option>
                <option value="value3">value3 (Boolean)</option>
              </select>
            </div>
            
            {/* New Value Input - Only shown for write action */}
            {selectedAction === "write" && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  New Value
                </label>
                <input
                  type={selectedMemoryKey === "value1" ? "number" : "text"}
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  disabled={executing}
                  placeholder={
                    selectedMemoryKey === "value1" ? "Enter a number" :
                    selectedMemoryKey === "value3" ? "Enter true or false" : "Enter a string"
                  }
                  className="w-full bg-white border border-slate-300 rounded-md py-2 px-3 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-slate-100 disabled:text-slate-400"
                />
                {selectedMemoryKey === "value3" && (
                  <p className="mt-1 text-xs text-slate-500">
                    Enter "true" or "false" for boolean values
                  </p>
                )}
              </div>
            )}
            
            {/* Execute Button */}
            <button
              type="submit"
              disabled={!isFormValid() || executing}
              className={`w-full py-2 px-4 rounded-md text-white font-medium flex items-center justify-center gap-2 ${
                !isFormValid() || executing
                  ? 'bg-slate-300 cursor-not-allowed'
                  : selectedAction === "read"
                    ? 'bg-blue-600 hover:bg-blue-700'
                    : 'bg-amber-600 hover:bg-amber-700'
              }`}
            >
              {executing ? (
                <>
                  <RefreshCw size={16} className="animate-spin" />
                  {selectedAction === "read" ? "Reading..." : "Writing..."}
                </>
              ) : (
                <>
                  {selectedAction === "read" ? (
                    <>
                      <RefreshCw size={16} />
                      Read Value
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Write Value
                    </>
                  )}
                </>
              )}
            </button>
          </form>
        </div>
      </div>
      
      {/* Process Visualization */}
      <div className="w-full mb-6">
        <h2 className="text-lg font-semibold text-slate-700 mb-4 flex items-center">
          <span className="mr-2">🔄</span> Process Visualization
        </h2>
        
        <div className="relative py-6">
          {/* Shared Memory Rectangle */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-slate-100 border-4 border-slate-400 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <div className="font-mono text-xs text-slate-500">SHARED</div>
              <div className="font-mono text-xs text-slate-500">MEMORY</div>
            </div>
          </div>
          
          {/* Processes */}
          <div className="flex justify-between items-center">
            {processes.map((process) => (
              <div key={process.id} className="w-1/3 flex flex-col items-center">
                <div 
                  className={`mb-2 w-20 h-20 rounded-full border-4 flex items-center justify-center transition-all duration-300 ${
                    process.status === "active" 
                      ? `border-${process.color}-600 bg-${process.color}-100` 
                      : `border-${process.color}-300 bg-white`
                  }`}
                >
                  <div className="text-center">
                    <div className={`font-bold ${process.status === "active" ? `text-${process.color}-700` : `text-${process.color}-500`}`}>
                      {process.name.split(' ')[1]}
                    </div>
                    {process.status === "active" && (
                      <div className="text-xs">
                        {process.reading ? "Reading" : process.writing ? "Writing" : ""}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Process Status */}
                <div className={`text-xs px-2 py-1 rounded-full ${
                  process.status === "active" 
                    ? `bg-${process.color}-100 text-${process.color}-700` 
                    : "bg-slate-100 text-slate-500"
                }`}>
                  {process.status === "active" ? "Active" : "Idle"}
                </div>
                
                {/* Connection Lines */}
                <div className={`h-16 w-1 ${
                  process.status === "active" 
                    ? process.reading 
                      ? `bg-gradient-to-b from-${process.color}-500 to-transparent` 
                      : `bg-gradient-to-t from-${process.color}-500 to-transparent`
                    : "bg-slate-200"
                }`}></div>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Notifications */}
      <div className="w-full mt-4">
        <h2 className="text-lg font-semibold text-slate-700 mb-4 flex items-center">
          <span className="mr-2">📋</span> Activity Log
        </h2>
        
        <div className="bg-white border border-slate-200 rounded-lg p-4 max-h-40 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="text-slate-400 text-center py-4">No activity yet</div>
          ) : (
            <div className="space-y-2">
              {notifications.map((notification) => (
                <div 
                  key={notification.id}
                  className={`flex items-center px-3 py-2 rounded-md ${
                    notification.type === "success" ? "bg-green-50 text-green-700 border-l-4 border-green-500" :
                    notification.type === "error" ? "bg-red-50 text-red-700 border-l-4 border-red-500" :
                    "bg-blue-50 text-blue-700 border-l-4 border-blue-500"
                  }`}
                >
                  {notification.type === "success" ? (
                    <CheckCircle size={16} className="mr-2 flex-shrink-0" />
                  ) : notification.type === "error" ? (
                    <AlertCircle size={16} className="mr-2 flex-shrink-0" />
                  ) : (
                    <RefreshCw size={16} className="mr-2 flex-shrink-0" />
                  )}
                  <span className="flex-1">{notification.message}</span>
                  <span className="text-xs opacity-60">
                    {new Date(notification.timestamp).toLocaleTimeString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Explanation */}
      <div className="w-full mt-8 p-4 bg-white rounded-md border border-slate-200">
        <h3 className="font-bold text-slate-700 mb-2">How Shared Memory Works:</h3>
        <ul className="list-disc ml-5 text-sm text-slate-600 space-y-1">
          <li>Multiple processes can access the same memory location</li>
          <li>Processes can read the current value from shared memory</li>
          <li>Processes can write new values to shared memory</li>
          <li>Changes made by one process are visible to all other processes</li>
          <li>Shared memory is faster than other IPC methods as it avoids copying data</li>
          <li>In real systems, synchronization mechanisms (mutexes, semaphores) are used to prevent data corruption</li>
        </ul>
      </div>
    </div>
  );
}
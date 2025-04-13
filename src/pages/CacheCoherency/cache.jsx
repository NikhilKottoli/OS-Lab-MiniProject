import { useState, useEffect, useRef } from 'react';

// Main component for the Cache Coherency OS Simulator
export default function CacheCoherencySimulator() {
  // Processor cache states: Modified, Shared, Invalid (MSI protocol)
  const [processors, setProcessors] = useState([
    { id: 0, cache: [{ address: 'A', value: 0, state: 'I' }, { address: 'B', value: 0, state: 'I' }] },
    { id: 1, cache: [{ address: 'A', value: 0, state: 'I' }, { address: 'B', value: 0, state: 'I' }] },
    { id: 2, cache: [{ address: 'A', value: 0, state: 'I' }, { address: 'B', value: 0, state: 'I' }] },
  ]);
  
  // Main memory
  const [mainMemory, setMainMemory] = useState([
    { address: 'A', value: 0 },
    { address: 'B', value: 0 },
  ]);

  // Animation state
  const [animating, setAnimating] = useState(false);
  const [logs, setLogs] = useState([]);
  const [operationType, setOperationType] = useState('read'); // 'read' or 'write'
  const [selectedProcessor, setSelectedProcessor] = useState(0);
  const [selectedAddress, setSelectedAddress] = useState('A');
  const [newValue, setNewValue] = useState(1);
  const [animationSpeed, setAnimationSpeed] = useState(1000); // ms
  
  // Message bus effects
  const [message, setMessage] = useState(null);
  const logsEndRef = useRef(null);

  // Scroll to bottom of logs when logs update
  useEffect(() => {
    if (logsEndRef.current) {
      logsEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs]);

  // Add a log entry
  const addLog = (text) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${text}`]);
  };

  // Handle read operation
  const handleRead = async (processorId, address) => {
    setAnimating(true);
    addLog(`Processor ${processorId} attempts to read address ${address}`);
    
    await animationDelay();
    
    const processor = processors.find(p => p.id === processorId);
    const cacheEntry = processor.cache.find(c => c.address === address);
    
    if (cacheEntry.state === 'I') {
      // Cache miss - need to get data from memory or other caches
      addLog(`Cache miss for processor ${processorId}`);
      
      // Send read miss message
      setMessage({ type: 'ReadMiss', processorId, address });
      await animationDelay();
      
      // Check if any other processor has the data in M or S state
      const otherProcessors = processors.filter(p => p.id !== processorId);
      const sharingProcessor = otherProcessors.find(p => 
        p.cache.find(c => c.address === address && (c.state === 'M' || c.state === 'S'))
      );
      
      if (sharingProcessor) {
        const sharingEntry = sharingProcessor.cache.find(c => c.address === address);
        if (sharingEntry.state === 'M') {
          // Data in modified state in another cache, need to update memory
          addLog(`Processor ${sharingProcessor.id} has modified data, writing back to memory`);
          
          setMessage({ type: 'WriteBack', processorId: sharingProcessor.id, address });
          await animationDelay();
          
          // Update main memory
          setMainMemory(prev => prev.map(item => 
            item.address === address ? { ...item, value: sharingEntry.value } : item
          ));
          
          // Change state to Shared in the other processor
          setProcessors(prev => prev.map(p => 
            p.id === sharingProcessor.id ? {
              ...p,
              cache: p.cache.map(c => 
                c.address === address ? { ...c, state: 'S' } : c
              )
            } : p
          ));
        }
        
        // Get value from the sharing processor
        const memoryValue = sharingEntry.value;
        
        // Update the requesting processor's cache
        setProcessors(prev => prev.map(p => 
          p.id === processorId ? {
            ...p,
            cache: p.cache.map(c => 
              c.address === address ? { ...c, value: memoryValue, state: 'S' } : c
            )
          } : p
        ));
        
        addLog(`Processor ${processorId} updated its cache with shared data`);
      } else {
        // No processor has the data, get from main memory
        const memoryEntry = mainMemory.find(m => m.address === address);
        
        setMessage({ type: 'MemoryRead', address });
        await animationDelay();
        
        // Update the processor's cache
        setProcessors(prev => prev.map(p => 
          p.id === processorId ? {
            ...p,
            cache: p.cache.map(c => 
              c.address === address ? { ...c, value: memoryEntry.value, state: 'S' } : c
            )
          } : p
        ));
        
        addLog(`Processor ${processorId} loaded data from main memory`);
      }
    } else {
      // Cache hit
      addLog(`Cache hit for processor ${processorId}, data already in ${cacheEntry.state} state`);
    }
    
    setMessage(null);
    setAnimating(false);
    return true;
  };

  // Handle write operation
  const handleWrite = async (processorId, address, newValue) => {
    setAnimating(true);
    addLog(`Processor ${processorId} attempts to write value ${newValue} to address ${address}`);
    
    await animationDelay();
    
    const processor = processors.find(p => p.id === processorId);
    const cacheEntry = processor.cache.find(c => c.address === address);
    
    // Different actions based on current state
    if (cacheEntry.state === 'M') {
      // Already in modified state, just update the value
      setProcessors(prev => prev.map(p => 
        p.id === processorId ? {
          ...p,
          cache: p.cache.map(c => 
            c.address === address ? { ...c, value: newValue } : c
          )
        } : p
      ));
      
      addLog(`Processor ${processorId} updated value in modified state`);
    } else {
      // Need to invalidate copies in other processors
      setMessage({ type: 'Invalidate', processorId, address });
      await animationDelay();
      
      // Invalidate all other copies
      const otherProcessors = processors.filter(p => p.id !== processorId);
      const processorWithModified = otherProcessors.find(p => 
        p.cache.find(c => c.address === address && c.state === 'M')
      );
      
      if (processorWithModified) {
        // Another processor has this in M state, need to write back first
        const modifiedEntry = processorWithModified.cache.find(c => c.address === address);
        
        addLog(`Processor ${processorWithModified.id} has data in modified state, writing back to memory`);
        setMessage({ type: 'WriteBack', processorId: processorWithModified.id, address });
        await animationDelay();
        
        // Update main memory with the value from the modified cache
        setMainMemory(prev => prev.map(item => 
          item.address === address ? { ...item, value: modifiedEntry.value } : item
        ));
      }
      
      // Invalidate all copies in other processors
      setProcessors(prev => prev.map(p => 
        p.id !== processorId ? {
          ...p,
          cache: p.cache.map(c => 
            c.address === address ? { ...c, state: 'I' } : c
          )
        } : p
      ));
      
      addLog(`Invalidated all other copies of address ${address}`);
      await animationDelay();
      
      // Set the writing processor's cache entry to Modified with the new value
      setProcessors(prev => prev.map(p => 
        p.id === processorId ? {
          ...p,
          cache: p.cache.map(c => 
            c.address === address ? { ...c, value: newValue, state: 'M' } : c
          )
        } : p
      ));
      
      addLog(`Processor ${processorId} now has exclusive modified access to address ${address}`);
    }
    
    setMessage(null);
    setAnimating(false);
    return true;
  };

  // Function to add delay for animations
  const animationDelay = () => {
    return new Promise(resolve => setTimeout(resolve, animationSpeed));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (animating) return;
    
    if (operationType === 'read') {
      await handleRead(parseInt(selectedProcessor), selectedAddress);
    } else {
      await handleWrite(parseInt(selectedProcessor), selectedAddress, parseInt(newValue));
    }
  };

  // Reset simulator
  const handleReset = () => {
    setProcessors([
      { id: 0, cache: [{ address: 'A', value: 0, state: 'I' }, { address: 'B', value: 0, state: 'I' }] },
      { id: 1, cache: [{ address: 'A', value: 0, state: 'I' }, { address: 'B', value: 0, state: 'I' }] },
      { id: 2, cache: [{ address: 'A', value: 0, state: 'I' }, { address: 'B', value: 0, state: 'I' }] },
    ]);
    setMainMemory([
      { address: 'A', value: 0 },
      { address: 'B', value: 0 },
    ]);
    setLogs([]);
    setMessage(null);
  };

  // Get color for cache state
  const getStateColor = (state) => {
    switch (state) {
      case 'M': return 'bg-red-200';
      case 'S': return 'bg-green-200';
      case 'I': return 'bg-gray-200';
      default: return 'bg-white';
    }
  };

  // Get explanation for cache state
  const getStateExplanation = (state) => {
    switch (state) {
      case 'M': return 'Modified: Exclusive access, data modified';
      case 'S': return 'Shared: Multiple readers, data consistent';
      case 'I': return 'Invalid: Data not present or invalidated';
      default: return '';
    }
  };

  return (
    <div className="flex flex-col h-full max-w-6xl mx-auto p-4 bg-white">
      <h1 className="text-3xl font-bold mb-4 text-center">Cache Coherency Simulator</h1>
      <p className="text-sm text-gray-600 mb-4 text-center">
        MSI Protocol: Modified (exclusive, dirty), Shared (clean, multiple readers), Invalid (not in cache)
      </p>

      {/* Control Panel */}
      <div className="mb-6 p-4 bg-gray-100 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-3">Control Panel</h2>
        <form onSubmit={handleSubmit} className="flex flex-wrap gap-3">
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium">Operation</label>
            <select 
              value={operationType} 
              onChange={(e) => setOperationType(e.target.value)}
              className="border rounded p-2 bg-white"
              disabled={animating}
            >
              <option value="read">Read</option>
              <option value="write">Write</option>
            </select>
          </div>
          
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium">Processor</label>
            <select 
              value={selectedProcessor} 
              onChange={(e) => setSelectedProcessor(e.target.value)}
              className="border rounded p-2 bg-white"
              disabled={animating}
            >
              {processors.map(p => (
                <option key={p.id} value={p.id}>CPU {p.id}</option>
              ))}
            </select>
          </div>
          
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium">Address</label>
            <select 
              value={selectedAddress} 
              onChange={(e) => setSelectedAddress(e.target.value)}
              className="border rounded p-2 bg-white"
              disabled={animating}
            >
              {mainMemory.map(m => (
                <option key={m.address} value={m.address}>{m.address}</option>
              ))}
            </select>
          </div>
          
          {operationType === 'write' && (
            <div className="flex flex-col">
              <label className="mb-1 text-sm font-medium">New Value</label>
              <input 
                type="number" 
                value={newValue} 
                onChange={(e) => setNewValue(parseInt(e.target.value))}
                className="border rounded p-2 w-20"
                disabled={animating}
              />
            </div>
          )}
          
          <div className="flex flex-col">
            <label className="mb-1 text-sm font-medium">Speed (ms)</label>
            <input 
              type="range" 
              min="200" 
              max="2000" 
              step="100" 
              value={animationSpeed} 
              onChange={(e) => setAnimationSpeed(parseInt(e.target.value))}
              className="w-32"
              disabled={animating}
            />
            <span className="text-xs text-gray-500">{animationSpeed}ms</span>
          </div>
          
          <div className="flex items-end">
            <button
              type="submit"
              className={`px-4 py-2 rounded-md ${animating ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'} text-white font-medium`}
              disabled={animating}
            >
              Execute
            </button>
          </div>
          
          <div className="flex items-end">
            <button
              type="button"
              onClick={handleReset}
              className="px-4 py-2 rounded-md bg-gray-500 hover:bg-gray-600 text-white font-medium"
              disabled={animating}
            >
              Reset
            </button>
          </div>
        </form>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-4">
        {/* Processor Caches */}
        <div className="flex-1">
          <h2 className="text-xl font-semibold mb-3">Processor Caches</h2>
          <div className="flex flex-col gap-4">
            {processors.map(processor => (
              <div 
                key={processor.id}
                className={`p-3 border rounded-lg shadow ${
                  parseInt(selectedProcessor) === processor.id ? 'border-blue-500 border-2' : ''
                }`}
              >
                <h3 className="font-medium mb-2">CPU {processor.id}</h3>
                <div className="flex gap-3">
                  {processor.cache.map(entry => (
                    <div 
                      key={entry.address}
                      className={`flex-1 p-2 rounded border ${getStateColor(entry.state)} ${
                        message && (
                          (message.type === 'Invalidate' && message.address === entry.address && processor.id !== message.processorId) ||
                          (message.type === 'WriteBack' && message.processorId === processor.id && message.address === entry.address)
                        ) ? 'animate-pulse' : ''
                      }`}
                    >
                      <div className="flex justify-between">
                        <span className="font-bold">{entry.address}</span>
                        <span className="text-sm px-1 rounded bg-white border">{entry.state}</span>
                      </div>
                      <div className="text-center text-lg font-mono mt-1">{entry.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Memory */}
        <div className="md:w-64">
          <h2 className="text-xl font-semibold mb-3">Main Memory</h2>
          <div className="border rounded-lg shadow p-4">
            <div className="flex flex-col gap-2">
              {mainMemory.map(entry => (
                <div 
                  key={entry.address} 
                  className={`p-2 border rounded flex justify-between items-center ${
                    message && message.type === 'MemoryRead' && message.address === entry.address ? 'bg-yellow-100 animate-pulse' : 'bg-white'
                  }`}
                >
                  <span className="font-bold">{entry.address}</span>
                  <span className="text-lg font-mono">{entry.value}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* State Legend */}
          <div className="mt-4 border rounded-lg shadow p-3">
            <h3 className="font-medium mb-2">Cache States</h3>
            <div className="flex flex-col gap-1 text-sm">
              <div className="flex gap-2 items-center">
                <div className="w-6 h-6 rounded bg-red-200"></div>
                <span>M: Modified</span>
              </div>
              <div className="flex gap-2 items-center">
                <div className="w-6 h-6 rounded bg-green-200"></div>
                <span>S: Shared</span>
              </div>
              <div className="flex gap-2 items-center">
                <div className="w-6 h-6 rounded bg-gray-200"></div>
                <span>I: Invalid</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bus Messages */}
      {message && (
        <div className="mb-4 p-3 bg-yellow-100 border border-yellow-300 rounded-lg shadow-sm animate-pulse">
          <h3 className="font-medium">Bus Message:</h3>
          <div className="flex items-center gap-2">
            <span className="bg-yellow-200 px-2 py-1 rounded text-sm font-mono">{message.type}</span>
            {message.processorId !== undefined && <span>Processor: {message.processorId}</span>}
            {message.address && <span>Address: {message.address}</span>}
          </div>
        </div>
      )}

      {/* Event Log */}
      <div className="flex-1 overflow-hidden flex flex-col">
        <h2 className="text-xl font-semibold mb-2">Event Log</h2>
        <div className="border rounded-lg shadow flex-1 overflow-hidden">
          <div className="h-48 overflow-y-auto p-3 bg-gray-50 font-mono text-sm">
            {logs.length === 0 ? (
              <div className="text-gray-500 italic">No events yet. Start by executing an operation.</div>
            ) : (
              logs.map((log, i) => (
                <div key={i} className="mb-1">{log}</div>
              ))
            )}
            <div ref={logsEndRef}></div>
          </div>
        </div>
      </div>
    </div>
  );
}
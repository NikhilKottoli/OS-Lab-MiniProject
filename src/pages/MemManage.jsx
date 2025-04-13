import { useState } from 'react';

export default function MemoryAllocationVisualizer() {
  const [heapBlocks, setHeapBlocks] = useState([]);
  const [stackBlocks, setStackBlocks] = useState([]);
  const [log, setLog] = useState([]);
  const [animating, setAnimating] = useState(false);
  const [heapSize, setHeapSize] = useState(0);
  const [nextId, setNextId] = useState(1);

  const MAX_MEMORY = 1024; // Simulated total memory in bytes
  
  const addLogMessage = (message) => {
    setLog(prev => [...prev, { message, time: new Date().toLocaleTimeString() }].slice(-5));
  };

  const malloc = (size) => {
    if (animating) return;
    setAnimating(true);
    
    // Simulate malloc operation
    const id = nextId;
    setNextId(id + 1);
    
    const newBlock = {
      id,
      size,
      address: heapSize,
      color: getRandomColor(),
      type: 'malloc'
    };
    
    addLogMessage(`malloc(${size}) → allocated at 0x${heapSize.toString(16).padStart(8, '0')}`);
    setHeapBlocks(prev => [...prev, newBlock]);
    setHeapSize(prev => prev + size);
    
    setTimeout(() => setAnimating(false), 1000);
  };
  
  const free = (id) => {
    if (animating) return;
    setAnimating(true);
    
    const blockToFree = heapBlocks.find(block => block.id === id);
    if (blockToFree) {
      addLogMessage(`free(0x${blockToFree.address.toString(16).padStart(8, '0')}) → released ${blockToFree.size} bytes`);
      
      setHeapBlocks(prev => prev.filter(block => block.id !== id));
      
      // We don't actually reduce heapSize to simulate fragmentation
      // In a real system, a memory manager would handle this
    }
    
    setTimeout(() => setAnimating(false), 1000);
  };
  
  const pushStack = () => {
    if (animating) return;
    setAnimating(true);
    
    const stackSize = Math.floor(Math.random() * 30) + 10; // Random stack frame size
    const id = nextId;
    setNextId(id + 1);
    
    const newStackFrame = {
      id,
      size: stackSize,
      type: 'stack'
    };
    
    addLogMessage(`function_call() → pushed ${stackSize} bytes to stack`);
    setStackBlocks(prev => [...prev, newStackFrame]);
    
    setTimeout(() => setAnimating(false), 1000);
  };
  
  const popStack = () => {
    if (animating || stackBlocks.length === 0) return;
    setAnimating(true);
    
    const poppedFrame = stackBlocks[stackBlocks.length - 1];
    addLogMessage(`function_return() → popped ${poppedFrame.size} bytes from stack`);
    
    setStackBlocks(prev => prev.slice(0, -1));
    
    setTimeout(() => setAnimating(false), 1000);
  };
  
  // Helper function to get a random color
  const getRandomColor = () => {
    const colors = ['#4287f5', '#42f5a7', '#f54242', '#f5d142', '#d142f5', '#8f42f5', '#f59342'];
    return colors[Math.floor(Math.random() * colors.length)];
  };
  
  const heapUsage = heapBlocks.reduce((sum, block) => sum + block.size, 0);
  const stackUsage = stackBlocks.reduce((sum, block) => sum + block.size, 0);
  
  return (
    <div className="max-w-4xl mx-auto p-4 font-sans">
      <h1 className="text-2xl font-bold mb-4 text-center">Memory Allocation Visualization</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Controls Panel */}
        <div className="bg-white p-4 rounded-lg shadow col-span-1">
          <h2 className="text-lg font-bold mb-4">Memory Operations</h2>
          
          <div className="space-y-4">
            <div>
              <h3 className="font-bold mb-2">Heap Operations</h3>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => malloc(16)} 
                  disabled={animating}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded disabled:opacity-50"
                >
                  malloc(16)
                </button>
                <button 
                  onClick={() => malloc(32)} 
                  disabled={animating}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded disabled:opacity-50"
                >
                  malloc(32)
                </button>
                <button 
                  onClick={() => malloc(64)} 
                  disabled={animating}
                  className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded disabled:opacity-50"
                >
                  malloc(64)
                </button>
              </div>
            </div>
            
            <div>
              <h3 className="font-bold mb-2">Free Memory</h3>
              {heapBlocks.length > 0 ? (
                <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
                  {heapBlocks.map(block => (
                    <button 
                      key={block.id}
                      onClick={() => free(block.id)} 
                      disabled={animating}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded disabled:opacity-50 text-sm"
                      style={{ backgroundColor: block.color }}
                    >
                      free(#{block.id})
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-gray-500 text-sm">No allocated blocks</div>
              )}
            </div>
            
            <div>
              <h3 className="font-bold mb-2">Stack Operations</h3>
              <div className="flex gap-2">
                <button 
                  onClick={pushStack} 
                  disabled={animating}
                  className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded disabled:opacity-50"
                >
                  Push Stack
                </button>
                <button 
                  onClick={popStack} 
                  disabled={animating || stackBlocks.length === 0}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded disabled:opacity-50"
                >
                  Pop Stack
                </button>
              </div>
            </div>
          </div>
          
          <div className="mt-4">
            <h3 className="font-bold mb-2">Operation Log</h3>
            <div className="bg-gray-100 p-2 rounded-lg h-32 overflow-y-auto text-sm">
              {log.length > 0 ? (
                log.map((entry, index) => (
                  <div key={index} className="mb-1">
                    <span className="text-gray-500 text-xs">{entry.time}</span> {entry.message}
                  </div>
                ))
              ) : (
                <div className="text-gray-500">No operations yet</div>
              )}
            </div>
          </div>
        </div>
        
        {/* Memory Visualization */}
        <div className="bg-white p-4 rounded-lg shadow col-span-2">
          <h2 className="text-lg font-bold mb-2">Memory Layout</h2>
          
          <div className="flex justify-between text-sm mb-1">
            <span>Memory Usage: {heapUsage + stackUsage} / {MAX_MEMORY} bytes</span>
            <span>Heap: {heapUsage} bytes | Stack: {stackUsage} bytes</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
            <div 
              className="bg-blue-600 h-2.5 rounded-full transition-all duration-500" 
              style={{ width: `${((heapUsage + stackUsage) / MAX_MEMORY) * 100}%` }}
            ></div>
          </div>
          
          <div className="flex flex-col h-96 bg-gray-100 rounded-lg overflow-hidden border border-gray-300">
            <div className="border-b border-gray-400">
              <div className="bg-gray-300 p-2 text-center font-bold">
                Stack (High Address - grows downward)
              </div>
              <div className="p-2 flex flex-col">
                {stackBlocks.map((block, index) => (
                  <div 
                    key={block.id}
                    className="w-full transition-all duration-500 ease-out mb-1 flex items-center justify-center text-white text-xs p-1"
                    style={{ 
                      height: `${Math.max(20, block.size / 2)}px`,
                      backgroundColor: '#8bc34a',
                      opacity: animating && index === stackBlocks.length - 1 ? 0.7 : 1
                    }}
                  >
                    Stack Frame #{block.id}: {block.size} bytes
                  </div>
                ))}
                {stackBlocks.length > 0 && (
                  <div className="w-full border-t-2 border-red-500 text-center text-xs text-red-500 mb-1">
                    Stack Pointer (ESP/RSP)
                  </div>
                )}
              </div>
            </div>
            
            {/* Middle region - unallocated/free memory */}
            <div className="flex-1 flex items-center justify-center text-gray-500 text-sm border-b border-gray-400 relative">
              <div className="absolute inset-0 flex items-center justify-center">
                Unallocated Memory
              </div>
              
              {/* Collision detection */}
              {heapUsage + stackUsage > MAX_MEMORY * 0.7 && (
                <div className="absolute inset-0 bg-red-100 bg-opacity-30 flex items-center justify-center">
                  <div className="bg-red-500 text-white px-4 py-2 rounded-lg">
                    Warning: Stack and Heap Approaching Collision!
                  </div>
                </div>
              )}
            </div>
            
            {/* Heap region at the bottom - grows upward */}
            <div>
              <div className="p-2">
                {heapBlocks.length > 0 && (
                  <div className="w-full border-b-2 border-red-500 text-center text-xs text-red-500 mb-1">
                    Program Break (brk)
                  </div>
                )}
                <div className="flex flex-col-reverse">
                  {heapBlocks.map((block, index) => (
                    <div 
                      key={block.id}
                      className="w-full transition-all duration-500 ease-out mb-1 flex items-center justify-center text-white text-xs p-1"
                      style={{ 
                        height: `${Math.max(20, block.size / 2)}px`,
                        backgroundColor: block.color,
                        opacity: animating && index === heapBlocks.length - 1 ? 0.7 : 1
                      }}
                    >
                      Heap Block #{block.id}: {block.size} bytes
                    </div>
                  ))}
                </div>
              </div>
            </div>
            {/* Fixed code and data segments */}
            <div className="border-b border-gray-400">
              <div className="h-10 flex">
                <div className="w-1/2 bg-gray-200 flex items-center justify-center text-xs border-r border-gray-300">
                  BSS Segment (Uninitialized Data)
                </div>
                <div className="w-1/2 bg-gray-300 flex items-center justify-center text-xs">
                  Data Segment (Initialized Data)
                </div>
              </div>
              <div className="h-10 bg-gray-400 flex items-center justify-center text-xs border-b border-gray-500">
                Text Segment (Program Code)
              </div>
            </div>
          </div>
          
          <div className="mt-4 text-sm text-gray-700">
            <p>This visualization shows the classic memory layout with stack at high addresses growing downward and heap at low addresses growing upward. The middle represents unallocated memory that both regions can grow into until they risk collision.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
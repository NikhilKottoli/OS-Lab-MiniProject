import React, { useState } from "react";

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

const FirstFitDynamic = () => {
  const [blocks, setBlocks] = useState([]);
  const [processes, setProcesses] = useState([]);
  const [allocations, setAllocations] = useState([]);
  const [remainingSpace, setRemainingSpace] = useState([]);
  const [newBlock, setNewBlock] = useState("");
  const [newProcess, setNewProcess] = useState("");
  const [metrics, setMetrics] = useState({
    memoryUtilization: 0,
    externalFragmentation: 0,
    internalFragmentation: 0,
    successfulAllocations: 0,
    failedAllocations: 0,
  });
  const [timeline, setTimeline] = useState([]);
  const [highlight, setHighlight] = useState({ process: -1, block: -1, success: false });
  const [isSimulating, setIsSimulating] = useState(false);
  const [strategy, setStrategy] = useState("first");
  const [showCompactionModal, setShowCompactionModal] = useState(false);
  const [compactionResults, setCompactionResults] = useState(null);
  const [autoMergeHoles, setAutoMergeHoles] = useState(false);

  const loadExample = () => {
    const exampleBlocks = [100, 500, 200, 300, 600];
    const exampleProcesses = [212, 417, 112, 426];
    setBlocks(exampleBlocks);
    setProcesses(exampleProcesses);
    setAllocations([]);
    setRemainingSpace([]);
    setTimeline([]);
    setHighlight({ process: -1, block: -1, success: false });
    setMetrics({
      memoryUtilization: 0,
      externalFragmentation: 0,
      internalFragmentation: 0,
      successfulAllocations: 0,
      failedAllocations: 0,
    });
  };
  
  const reset = () => {
    setAllocations([]);
    setRemainingSpace([]);
    setTimeline([]);
    setHighlight({ process: -1, block: -1, success: false });
    setMetrics({
      memoryUtilization: 0,
      externalFragmentation: 0,
      internalFragmentation: 0,
      successfulAllocations: 0,
      failedAllocations: 0,
    });
    setCompactionResults(null);
  };

  const addBlock = () => {
    const size = parseInt(newBlock);
    if (!isNaN(size) && size > 0) {
      setBlocks([...blocks, size]);
      setNewBlock("");
    }
  };

  const addProcess = () => {
    const size = parseInt(newProcess);
    if (!isNaN(size) && size > 0) {
      setProcesses([...processes, size]);
      setNewProcess("");
    }
  };

  const removeBlock = (index) => {
    setBlocks(blocks.filter((_, i) => i !== index));
  };

  const removeProcess = (index) => {
    setProcesses(processes.filter((_, i) => i !== index));
  };

  const getBlockIndex = (strategy, mem, processSize, lastIndex = 0) => {
    let bestIdx = -1;
    switch (strategy) {
      case "first":
        for (let i = 0; i < mem.length; i++) {
          if (mem[i] >= processSize) return i;
        }
        break;
      case "best":
        let min = Infinity;
        for (let i = 0; i < mem.length; i++) {
          if (mem[i] >= processSize && mem[i] - processSize < min) {
            min = mem[i] - processSize;
            bestIdx = i;
          }
        }
        return bestIdx;
      case "worst":
        let max = -1;
        for (let i = 0; i < mem.length; i++) {
          if (mem[i] >= processSize && mem[i] - processSize > max) {
            max = mem[i] - processSize;
            bestIdx = i;
          }
        }
        return bestIdx;
      case "next":
        // Start searching from the last allocated block
        for (let i = 0; i < mem.length; i++) {
          const idx = (lastIndex + i) % mem.length;
          if (mem[idx] >= processSize) return idx;
        }
        case "buddy":
  // Find the smallest power of 2 >= processSize
  const requiredSize = Math.pow(2, Math.ceil(Math.log2(processSize)));
  for (let i = 0; i < mem.length; i++) {
    if (mem[i] >= requiredSize) return i;
  }
  break;
  case "quick":
    const quickSizes = [100, 200, 300]; // Customize this list as needed
    const preferredSize = quickSizes.find(size => size >= processSize);
    if (!preferredSize) break;
    for (let i = 0; i < mem.length; i++) {
      if (mem[i] >= preferredSize) return i;
    }
    break;
  
        
      default:
        return -1;
    }
    return -1;
  };

  // Function to merge adjacent free blocks
  const mergeHoles = (mem, alloc) => {
    // Create a map of which blocks are in use
    const blockInUse = new Array(mem.length).fill(false);
    for (const blockIndex of alloc) {
      if (blockIndex !== -1) {
        blockInUse[blockIndex] = true;
      }
    }

    // Identify adjacent free blocks and merge them
    let merged = false;
    let mergedTimeline = [];
    
    for (let i = 0; i < mem.length - 1; i++) {
      // If both current block and next block are free (not in use)
      if (!blockInUse[i] && !blockInUse[i+1]) {
        // Merge the blocks
        mergedTimeline.push(`Merged Block ${i + 1} (${mem[i]}K) with Block ${i + 2} (${mem[i+1]}K)`);
        mem[i] += mem[i+1];
        // Remove the merged block
        mem.splice(i+1, 1);
        blockInUse.splice(i+1, 1);
        
        // Update allocations indices after the merged block
        for (let j = 0; j < alloc.length; j++) {
          if (alloc[j] > i) {
            alloc[j]--;
          }
        }
        
        merged = true;
        i--; // Check this position again in case we can merge more
      }
    }
    
    return { 
      mem, 
      alloc, 
      merged, 
      mergedTimeline 
    };
  };

  // Function to perform memory compaction
  const compactMemory = () => {
    if (allocations.length === 0) return;
    
    // Deep clone the current state to avoid mutation
    let compactedMem = [...remainingSpace];
    let compactedAlloc = [...allocations];
    let processesInMemory = [];
    let compactionTimeline = [];
    let freeSpace = 0;
    
    // Collect all allocated processes and their sizes
    for (let i = 0; i < processes.length; i++) {
      if (compactedAlloc[i] !== -1) {
        processesInMemory.push({
          processIndex: i,
          size: processes[i],
          blockIndex: compactedAlloc[i]
        });
      }
    }
    
    // Sort processes by current block location to maintain relative positioning
    processesInMemory.sort((a, b) => a.blockIndex - b.blockIndex);
    
    // Calculate total free space
    for (let i = 0; i < compactedMem.length; i++) {
      freeSpace += compactedMem[i];
    }
    
    // Create a single consolidated memory block
    const totalMemory = blocks.reduce((sum, val) => sum + val, 0);
    const totalUsedMemory = totalMemory - freeSpace;
    
    // Create new compacted block structure with one big free hole at the end
    const newBlocks = [];
    const newAlloc = new Array(processes.length).fill(-1);
    let currentIndex = 0;
    
    // Place all processes at the beginning
    for (const proc of processesInMemory) {
      newBlocks.push(proc.size);
      newAlloc[proc.processIndex] = currentIndex;
      compactionTimeline.push(`Process ${proc.processIndex + 1} (${proc.size}K) moved to Block ${currentIndex + 1}`);
      currentIndex++;
    }
    
    // Add the consolidated free space as a single block at the end
    if (freeSpace > 0) {
      newBlocks.push(freeSpace);
      compactionTimeline.push(`Consolidated ${freeSpace}K free memory into Block ${currentIndex + 1}`);
    }
    
    // Calculate new remaining space
    const newRemainingSpace = newBlocks.map((_, index) => {
      // If it's the last block (free space), return its size
      if (index === newBlocks.length - 1 && freeSpace > 0) {
        return freeSpace;
      }
      // For blocks with processes, remaining space is 0
      return 0;
    });
    
    setCompactionResults({
      previousBlocks: blocks,
      previousRemainingSpace: remainingSpace,
      previousAllocations: allocations,
      newBlocks: newBlocks,
      newRemainingSpace: newRemainingSpace,
      newAllocations: newAlloc,
      timeline: compactionTimeline
    });
    
    setShowCompactionModal(true);
  };
  
  // Apply compaction results
  const applyCompaction = () => {
    if (!compactionResults) return;
    
    setBlocks(compactionResults.newBlocks);
    setRemainingSpace(compactionResults.newRemainingSpace);
    setAllocations(compactionResults.newAllocations);
    setTimeline([...timeline, ...compactionResults.timeline]);
    setShowCompactionModal(false);
    
    // Recalculate metrics after compaction
    const totalMemory = compactionResults.newBlocks.reduce((sum, val) => sum + val, 0);
    const totalUsed = processes.reduce((sum, proc, i) => {
      return sum + (compactionResults.newAllocations[i] !== -1 ? proc : 0);
    }, 0);
    const totalFree = compactionResults.newRemainingSpace.reduce((sum, val) => sum + val, 0);
    const largestFree = Math.max(...compactionResults.newRemainingSpace, 0);
    const externalFrag = totalFree - largestFree;
    
    setMetrics({
      ...metrics,
      memoryUtilization: ((totalUsed / totalMemory) * 100).toFixed(2),
      externalFragmentation: externalFrag,
    });
  };

  // Cancel compaction
  const cancelCompaction = () => {
    setShowCompactionModal(false);
    setCompactionResults(null);
  };

  const runSimulation = async () => {
    setIsSimulating(true);
    let mem = [...blocks];
    let alloc = new Array(processes.length).fill(-1);
    let internalFrag = 0;
    let totalUsed = 0;
    let successful = 0;
    let failed = 0;
    let stepTimeline = [];
    let lastAllocatedIndex = 0;

    for (let i = 0; i < processes.length; i++) {
      let allocated = false;
      
      // Try to merge holes first if auto-merge is enabled
      if (autoMergeHoles && i > 0) {
        const mergeResult = mergeHoles(mem, alloc);
        mem = mergeResult.mem;
        alloc = mergeResult.alloc;
        
        if (mergeResult.merged) {
          stepTimeline = [...stepTimeline, ...mergeResult.mergedTimeline];
        }
      }
      
      const index = strategy === "next" 
        ? getBlockIndex(strategy, mem, processes[i], lastAllocatedIndex)
        : getBlockIndex(strategy, mem, processes[i]);

      for (let j = 0; j < mem.length; j++) {
        setHighlight({ process: i, block: j, success: false });
        await delay(400);
      }

      if (index !== -1) {
        alloc[i] = index;
        stepTimeline.push(`Process ${i + 1} (${processes[i]}K) allocated to Block ${index + 1}`);
        internalFrag += mem[index] - processes[i];
        totalUsed += processes[i];
        mem[index] -= processes[i];
        successful++;
        lastAllocatedIndex = index; // Update the last allocated index for next-fit
        setHighlight({ process: i, block: index, success: true });
        await delay(700);
        allocated = true;
      }

      if (!allocated) {
        stepTimeline.push(`Process ${i + 1} (${processes[i]}K) not allocated`);
        failed++;
      }
    }

    const totalMemory = blocks.reduce((sum, val) => sum + val, 0);
    const totalFree = mem.reduce((sum, val) => sum + val, 0);
    const largestFree = Math.max(...mem, 0);
    const externalFrag = totalFree - largestFree;

    setHighlight({ process: -1, block: -1, success: false });
    setIsSimulating(false);
    setAllocations(alloc);
    setRemainingSpace(mem);
    setTimeline(stepTimeline);
    setMetrics({
      memoryUtilization: ((totalUsed / totalMemory) * 100).toFixed(2),
      externalFragmentation: externalFrag,
      internalFragmentation: internalFrag,
      successfulAllocations: successful,
      failedAllocations: failed,
    });
  };

  // Manual hole merging function to be called by button click
  const handleMergeHoles = () => {
    if (allocations.length === 0) return;
    
    const mergeResult = mergeHoles([...remainingSpace], [...allocations]);
    
    if (mergeResult.merged) {
      setRemainingSpace(mergeResult.mem);
      setAllocations(mergeResult.alloc);
      setTimeline([...timeline, ...mergeResult.mergedTimeline]);
      
      // Recalculate metrics after merging
      const totalMemory = blocks.reduce((sum, val) => sum + val, 0);
      const totalUsed = processes.reduce((sum, proc, i) => {
        return sum + (mergeResult.alloc[i] !== -1 ? proc : 0);
      }, 0);
      const totalFree = mergeResult.mem.reduce((sum, val) => sum + val, 0);
      const largestFree = Math.max(...mergeResult.mem, 0);
      const externalFrag = totalFree - largestFree;
      
      setMetrics({
        ...metrics,
        memoryUtilization: ((totalUsed / totalMemory) * 100).toFixed(2),
        externalFragmentation: externalFrag,
      });
    } else {
      setTimeline([...timeline, "No adjacent free blocks found for merging"]);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-4xl font-bold mb-6 text-center text-indigo-800">Memory Allocation Simulator</h1>

      <div className="flex flex-wrap gap-4 justify-center mb-6">
        <select value={strategy} onChange={(e) => setStrategy(e.target.value)} className="px-4 py-2 rounded border">
          <option value="first">First Fit</option>
          <option value="best">Best Fit</option>
          <option value="worst">Worst Fit</option>
          <option value="next">Next Fit</option>
          <option value="quick">quick Fit</option>
          <option value="buddy">buddy Fit</option>

        </select>
        <button onClick={loadExample} className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded">Load Example</button>
        <button onClick={reset} className="bg-gray-400 hover:bg-gray-500 text-white px-4 py-2 rounded">Reset</button>
        <button 
          onClick={runSimulation} 
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded" 
          disabled={blocks.length === 0 || processes.length === 0 || isSimulating}
        >
          {isSimulating ? 'Simulating...' : 'Start Simulation'}
        </button>
      </div>

      <div className="flex flex-wrap gap-4 justify-center mb-6">
        <div className="flex items-center">
          <input 
            type="checkbox" 
            id="autoMergeHoles" 
            checked={autoMergeHoles} 
            onChange={(e) => setAutoMergeHoles(e.target.checked)}
            className="mr-2" 
          />
          <label htmlFor="autoMergeHoles">Auto-merge Adjacent Holes</label>
        </div>
        
        <button 
          onClick={handleMergeHoles}
          disabled={allocations.length === 0}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded disabled:bg-purple-300"
        >
          Merge Adjacent Holes
        </button>
        
        <button 
          onClick={compactMemory}
          disabled={allocations.length === 0}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded disabled:bg-indigo-300"
        >
          Compact Memory
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div>
          <h2 className="text-xl font-semibold mb-2">Memory Blocks</h2>
          <div className="flex gap-2 mb-3">
            <input 
              type="number" 
              value={newBlock} 
              onChange={(e) => setNewBlock(e.target.value)} 
              placeholder="Enter block size (K)" 
              className="border px-3 py-2 w-full rounded shadow-sm" 
            />
            <button onClick={addBlock} className="bg-blue-600 text-white px-4 py-2 rounded">Add</button>
          </div>
          <ul className="space-y-2">
            {blocks.map((size, i) => {
              let highlightClass = "bg-blue-100";
              if (highlight.block === i) {
                highlightClass = highlight.success ? "bg-green-300 ring-2 ring-green-600" : "bg-yellow-200 ring-2 ring-yellow-500";
              }
              return (
                <li key={i} className={`flex justify-between px-3 py-2 rounded shadow ${highlightClass}`}>
                  <span>Block {i + 1}: {size}K</span>
                  <button onClick={() => removeBlock(i)} className="text-red-500">Remove</button>
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Processes</h2>
          <div className="flex gap-2 mb-3">
            <input 
              type="number" 
              value={newProcess} 
              onChange={(e) => setNewProcess(e.target.value)} 
              placeholder="Enter process size (K)" 
              className="border px-3 py-2 w-full rounded shadow-sm" 
            />
            <button onClick={addProcess} className="bg-green-600 text-white px-4 py-2 rounded">Add</button>
          </div>
          <ul className="space-y-2">
            {processes.map((size, i) => (
              <li 
                key={i} 
                className={`flex justify-between px-3 py-2 rounded shadow ${
                  highlight.process === i ? 'bg-yellow-200 ring-2 ring-yellow-500' : 'bg-green-100'
                }`}
              >
                <span>Process {i + 1}: {size}K</span>
                <button onClick={() => removeProcess(i)} className="text-red-500">Remove</button>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {allocations.length > 0 && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <h2 className="text-xl font-semibold mb-2">Allocation Result</h2>
              <ul className="space-y-2">
                {allocations.map((block, i) => (
                  <li key={i} className={`px-4 py-2 rounded shadow ${block !== -1 ? 'bg-green-50' : 'bg-red-50'}`}>
                    Process {i + 1} ({processes[i]}K): {block !== -1 ? `Block ${block + 1}` : 'Not Allocated'}
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Remaining Memory</h2>
              <ul className="space-y-2">
                {remainingSpace.map((space, i) => (
                  <li key={i} className="px-4 py-2 bg-blue-50 rounded shadow">
                    Block {i + 1}: {space}K remaining
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="bg-yellow-50 p-4 rounded shadow mb-6">
            <h3 className="text-lg font-bold mb-2">Memory Metrics</h3>
            <ul className="text-sm space-y-1">
              <li><strong>Memory Utilization:</strong> {metrics.memoryUtilization}%</li>
              <li><strong>Internal Fragmentation:</strong> {metrics.internalFragmentation}K</li>
              <li><strong>External Fragmentation:</strong> {metrics.externalFragmentation}K</li>
              <li><strong>Successful Allocations:</strong> {metrics.successfulAllocations}</li>
              <li><strong>Failed Allocations:</strong> {metrics.failedAllocations}</li>
            </ul>
          </div>

          <div className="bg-white p-4 rounded shadow">
            <h3 className="text-lg font-bold mb-2">Timeline</h3>
            <ul className="text-sm space-y-1 list-disc list-inside">
              {timeline.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ul>
          </div>
        </>
      )}
      
      {showCompactionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-2xl max-h-screen overflow-auto">
            <h2 className="text-2xl font-bold mb-4">Memory Compaction Results</h2>
            
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Changes:</h3>
              <ul className="list-disc pl-6 mb-4">
                {compactionResults.timeline.map((step, i) => (
                  <li key={i}>{step}</li>
                ))}
              </ul>
            </div>
            
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-2">Compaction Benefits:</h3>
              <p>External Fragmentation before: {metrics.externalFragmentation}K</p>
              <p>External Fragmentation after: 0K (All free memory consolidated)</p>
            </div>
            
            <div className="flex justify-end gap-4 mt-4">
              <button 
                onClick={cancelCompaction} 
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
              >
                Cancel
              </button>
              <button 
                onClick={applyCompaction} 
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
              >
                Apply Compaction
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FirstFitDynamic;
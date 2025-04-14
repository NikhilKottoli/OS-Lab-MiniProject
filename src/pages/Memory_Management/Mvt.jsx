import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MVT = () => {
  const [step, setStep] = useState(1); 
  const [totalMemory, setTotalMemory] = useState(1000);
  const [processCount, setProcessCount] = useState(3);
  const [currentProcessIndex, setCurrentProcessIndex] = useState(0);
  const [processes, setProcesses] = useState([]);
  const [currentProcessSize, setCurrentProcessSize] = useState(0);
  const [allocatedMemory, setAllocatedMemory] = useState(0);
  const [externalFragmentation, setExternalFragmentation] = useState(0);
  const [message, setMessage] = useState('');
  const [rejectedProcesses, setRejectedProcesses] = useState([]);
  const [showMessageAnimation, setShowMessageAnimation] = useState(false);

  useEffect(() => {

    const total = processes.reduce((sum, process) => sum + process.size, 0);
    setAllocatedMemory(total);
    

    calculateExternalFragmentation();
  }, [processes]);

  useEffect(() => {
    if (message) {
      setShowMessageAnimation(true);
      const timer = setTimeout(() => {
        setShowMessageAnimation(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [message]);

  const calculateExternalFragmentation = () => {
    const sortedProcesses = [...processes].sort((a, b) => a.startAddress - b.startAddress);
    
    let totalFragmentation = 0;
    let currentAddress = 0;
    
    for (const process of sortedProcesses) {
      const holeSize = process.startAddress - currentAddress;
      if (holeSize > 0) {
        totalFragmentation += holeSize;
      }
      currentAddress = process.startAddress + process.size;
    }
    
    if (currentAddress < totalMemory) {
      totalFragmentation += (totalMemory - currentAddress);
    }
    
    setExternalFragmentation(totalFragmentation);
  };

  const handleSetMemory = () => {
    if (totalMemory <= 0) {
      setMessage('Total memory must be greater than 0');
      return;
    }
    
    setMessage(`Total memory set to ${totalMemory} KB`);
    setStep(2);
  };

  const handleSetProcessCount = () => {
    if (processCount <= 0) {
      setMessage('Number of processes must be greater than 0');
      return;
    }
    
    setMessage(`Ready to add ${processCount} processes`);
    setStep(3);
  };

  const handleAddProcess = () => {
    if (currentProcessSize <= 0) {
      setMessage('Process size must be greater than 0');
      return;
    }

    const startAddress = getStartAddress(currentProcessSize);
    const availableContiguousMemory = getMaxContiguousBlock();
    
    if (startAddress === -1 || currentProcessSize > availableContiguousMemory) {
      setMessage(`Not enough contiguous memory to allocate Process P${currentProcessIndex + 1}. Process rejected.`);

      setRejectedProcesses([...rejectedProcesses, {
        id: currentProcessIndex + 1,
        size: currentProcessSize,
      }]);
      
      moveToNextProcess();
      return;
    }

    const newProcess = {
      id: currentProcessIndex + 1,
      size: currentProcessSize,
      startAddress: startAddress,
      color: getRandomColor(),
    };
    
    setProcesses([...processes, newProcess]);
    setMessage(`Process P${newProcess.id} allocated successfully at address ${newProcess.startAddress}`);
    
    moveToNextProcess();
  };
  
  const moveToNextProcess = () => {
    if (currentProcessIndex + 1 < processCount) {
      setCurrentProcessIndex(currentProcessIndex + 1);
      setCurrentProcessSize(0);
    } else {
      setStep(4);
    }
  };

  const getMaxContiguousBlock = () => {
    if (processes.length === 0) return totalMemory;
    
    const sortedProcesses = [...processes].sort((a, b) => a.startAddress - b.startAddress);
    let maxBlock = 0;
    let currentAddress = 0;
    
    for (const process of sortedProcesses) {
      const blockSize = process.startAddress - currentAddress;
      if (blockSize > maxBlock) {
        maxBlock = blockSize;
      }
      currentAddress = process.startAddress + process.size;
    }
    
    const lastBlockSize = totalMemory - currentAddress;
    if (lastBlockSize > maxBlock) {
      maxBlock = lastBlockSize;
    }
    
    return maxBlock;
  };

  const handleReset = () => {
    setStep(1);
    setProcesses([]);
    setRejectedProcesses([]);
    setCurrentProcessIndex(0);
    setCurrentProcessSize(0);
    setAllocatedMemory(0);
    setExternalFragmentation(0);
    setMessage('');
  };

  const getStartAddress = (size) => {
    if (processes.length === 0) return 0;

    let currentAddress = 0;
    const sortedProcesses = [...processes].sort((a, b) => a.startAddress - b.startAddress);
    
    for (const process of sortedProcesses) {
      if (process.startAddress - currentAddress >= size) {
        return currentAddress; 
      }
      currentAddress = process.startAddress + process.size;
    }
    
    if (totalMemory - currentAddress >= size) {
      return currentAddress;
    }
    
    return -1;
  };

  const getRandomColor = () => {
    const colors = [
      'bg-blue-500', 'bg-green-500', 'bg-purple-500', 
      'bg-pink-500', 'bg-indigo-500', 'bg-teal-500', 
      'bg-red-500', 'bg-amber-500', 'bg-cyan-500'
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const getLargestMemoryGap = () => {
    return getMaxContiguousBlock();
  };

  const getMemoryChunks = () => {
    if (processes.length === 0) return [{ type: 'free', start: 0, end: totalMemory, size: totalMemory }];
    
    const sortedProcesses = [...processes].sort((a, b) => a.startAddress - b.startAddress);
    const chunks = [];
    let currentAddress = 0;
    
    for (const process of sortedProcesses) {
      if (process.startAddress > currentAddress) {
        chunks.push({
          type: 'free',
          start: currentAddress,
          end: process.startAddress,
          size: process.startAddress - currentAddress
        });
      }
      

      chunks.push({
        type: 'process',
        id: process.id,
        start: process.startAddress,
        end: process.startAddress + process.size,
        size: process.size,
        color: process.color
      });
      
      currentAddress = process.startAddress + process.size;
    }
    

    if (currentAddress < totalMemory) {
      chunks.push({
        type: 'free',
        start: currentAddress,
        end: totalMemory,
        size: totalMemory - currentAddress
      });
    }
    
    return chunks;
  };

  const getStepProgressPercentage = () => {
    return ((step - 1) / 3) * 100;
  };

  return (
    <div className="max-w-5xl mx-auto p-6 bg-gray-50 min-h-screen">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Memory Allocation Simulator</h1>
        <h2 className="text-xl text-blue-600 font-medium">Multiprogramming with Variable number of Tasks (MVT)</h2>
      </div>
      
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-8">
        <motion.div 
          className="bg-blue-600 h-2.5 rounded-full" 
          initial={{ width: `${getStepProgressPercentage()}%` }}
          animate={{ width: `${getStepProgressPercentage()}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      
      <div className="flex justify-between mb-8">
        {[1, 2, 3, 4].map((num) => (
          <div key={num} className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${num <= step ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
              {num}
            </div>
            <span className="text-xs mt-1 text-gray-600">
              {num === 1 ? 'Memory' : num === 2 ? 'Processes' : num === 3 ? 'Allocation' : 'Results'}
            </span>
          </div>
        ))}
      </div>
      

      <AnimatePresence>
        {message && (
          <motion.div 
            className={`mb-6 p-4 ${showMessageAnimation ? 'bg-blue-200' : 'bg-blue-100'} text-blue-800 rounded-lg shadow-sm border-l-4 border-blue-500`}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"></path>
              </svg>
              {message}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {step === 1 && (
          <motion.div 
            className="mb-8 p-6 bg-white rounded-lg shadow-md border border-gray-100"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-xl font-semibold mb-6 text-gray-800">Step 1: Set Total Memory</h3>
            <div className="flex items-center space-x-4 mb-6">
              <label className="w-40 text-gray-700">Total Memory (KB):</label>
              <input
                type="number"
                value={totalMemory}
                onChange={(e) => setTotalMemory(Number(e.target.value))}
                className="px-4 py-2 border border-gray-300 rounded-md flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
            <button
              onClick={handleSetMemory}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition transform hover:scale-105"
            >
              Next
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    
      <AnimatePresence>
        {step === 2 && (
          <motion.div 
            className="mb-8 p-6 bg-white rounded-lg shadow-md border border-gray-100"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-xl font-semibold mb-6 text-gray-800">Step 2: How Many Processes?</h3>
            <div className="flex items-center space-x-4 mb-6">
              <label className="w-40 text-gray-700">Number of Processes:</label>
              <input
                type="number"
                value={processCount}
                onChange={(e) => setProcessCount(Number(e.target.value))}
                className="px-4 py-2 border border-gray-300 rounded-md flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
            <button
              onClick={handleSetProcessCount}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition transform hover:scale-105"
            >
              Next
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      

      <AnimatePresence>
        {step === 3 && (
          <motion.div 
            className="mb-8 p-6 bg-white rounded-lg shadow-md border border-gray-100"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="text-xl font-semibold mb-6 text-gray-800">
              <span className="text-blue-600">Step 3:</span> Add Process {currentProcessIndex + 1}/{processCount}
            </h3>
            
            <div className="flex items-center space-x-4 mb-4">
              <label className="w-40 text-gray-700">Process ID:</label>
              <span className="px-4 py-2 border border-gray-200 bg-gray-50 rounded-md flex-1 font-medium">P{currentProcessIndex + 1}</span>
            </div>
            
            <div className="flex items-center space-x-4 mb-6">
              <label className="w-40 text-gray-700">Process Size (KB):</label>
              <input
                type="number"
                value={currentProcessSize}
                onChange={(e) => setCurrentProcessSize(Number(e.target.value))}
                className="px-4 py-2 border border-gray-300 rounded-md flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              />
            </div>
            
            <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="font-medium mb-2 text-gray-700">Memory Status</h4>
              <div className="grid grid-cols-3 gap-4 text-sm">
                <div className="flex flex-col">
                  <span className="text-gray-500">Available Memory:</span>
                  <span className="font-medium">{totalMemory - allocatedMemory} KB</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-500">Largest Contiguous Block:</span>
                  <span className="font-medium">{getLargestMemoryGap()} KB</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-gray-500">External Fragmentation:</span>
                  <span className="font-medium">{externalFragmentation} KB</span>
                </div>
              </div>
            </div>
            
            <button
              onClick={handleAddProcess}
              className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              disabled={currentProcessSize <= 0}
            >
              Allocate Process
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {(step === 3 || step === 4) && (
          <motion.div 
            className="p-6 bg-white rounded-lg shadow-md border border-gray-100 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h3 className="text-xl font-semibold mb-6 text-gray-800">Memory Visualization</h3>
            

            <div className="mb-8">
              <div className="h-14 flex items-center space-x-2">
                <span className="w-16 text-sm text-gray-500">0 KB</span>
                <div className="flex-1 relative h-10 bg-gray-100 rounded-lg overflow-hidden border border-gray-200">
                  {getMemoryChunks().map((chunk, index) => (
                    <motion.div
                      key={`chunk-${index}`}
                      className={`absolute h-full ${chunk.type === 'process' ? chunk.color : 'bg-gray-200'} ${chunk.type === 'free' ? 'pattern-diagonal-lines pattern-gray-300 pattern-bg-gray-100 pattern-size-2 pattern-opacity-20' : ''} rounded-md flex items-center justify-center text-sm font-medium ${chunk.type === 'process' ? 'text-white' : 'text-gray-400'}`}
                      style={{
                        left: `${(chunk.start / totalMemory) * 100}%`,
                        width: `${(chunk.size / totalMemory) * 100}%`,
                      }}
                      initial={{ opacity: 0, height: '0%' }}
                      animate={{ opacity: 1, height: '100%' }}
                      transition={{ duration: 0.5 }}
                    >
                      {chunk.type === 'process' ? `P${chunk.id}` : (chunk.size > totalMemory * 0.05 ? `${chunk.size}KB` : '')}
                    </motion.div>
                  ))}
                </div>
                <span className="w-16 text-sm text-gray-500 text-right">{totalMemory} KB</span>
              </div>
              
              <div className="flex items-center justify-between mt-1 px-16">
                {processes.length > 0 && processes.sort((a, b) => a.startAddress - b.startAddress).map((process) => (
                  <motion.div
                    key={`addr-${process.id}`}
                    className="text-xs text-gray-500"
                    style={{
                      position: 'absolute',
                      left: `calc(${(process.startAddress / totalMemory) * 100}% + 16px)`
                    }}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    {process.startAddress}
                  </motion.div>
                ))}
              </div>
            </div>
            
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium">Memory Usage</span>
                <span className="text-sm text-gray-600">{allocatedMemory} KB / {totalMemory} KB ({Math.round((allocatedMemory/totalMemory) * 100)}%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <motion.div 
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(allocatedMemory/totalMemory) * 100}%` }}
                  transition={{ duration: 0.8 }}
                ></motion.div>
              </div>
            </div>
        
            {processes.length > 0 && (
              <div className="mb-4">
                <h4 className="font-medium mb-2 text-gray-700">Allocated Processes</h4>
                <div className="flex flex-wrap gap-2">
                  {processes.sort((a, b) => a.id - b.id).map((process) => (
                    <motion.div
                      key={`chip-${process.id}`}
                      className={`px-3 py-1 rounded-full text-white text-sm ${process.color} shadow-sm`}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    >
                      P{process.id}: {process.size}KB
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
      
      <AnimatePresence>
        {step === 4 && (
          <>
            <motion.div 
              className="p-6 bg-white rounded-lg shadow-md border border-gray-100 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="text-xl font-semibold mb-6 text-gray-800">External Fragmentation Analysis</h3>
              
              <div className="mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">External Fragmentation</span>
                  <span className="text-sm text-gray-600">{externalFragmentation} KB ({Math.round((externalFragmentation/totalMemory) * 100)}% of total memory)</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <motion.div 
                    className="bg-gradient-to-r from-orange-400 to-orange-500 h-3 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(externalFragmentation/totalMemory) * 100}%` }}
                    transition={{ duration: 0.8 }}
                  ></motion.div>
                </div>
              </div>

              <div className="p-4 bg-blue-50 rounded-lg border border-blue-100">
                <h4 className="font-medium mb-2 text-blue-800">Understanding External Fragmentation</h4>
                <p className="text-sm text-blue-700">External fragmentation occurs when free memory is available in non-contiguous blocks, making it unusable for process allocation even though the total free memory might be sufficient. This reduces memory utilization efficiency.</p>
              </div>
            </motion.div>
            
            <motion.div 
              className="p-6 bg-white rounded-lg shadow-md border border-gray-100 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <h3 className="text-xl font-semibold mb-6 text-gray-800">Allocated Processes Detail</h3>
              
              <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
                <table className="w-full table-auto">
                  <thead>
                    <tr className="bg-gray-50 text-left">
                      <th className="px-4 py-3 text-gray-600 font-medium">Process ID</th>
                      <th className="px-4 py-3 text-gray-600 font-medium">Size (KB)</th>
                      <th className="px-4 py-3 text-gray-600 font-medium">Start Address</th>
                      <th className="px-4 py-3 text-gray-600 font-medium">End Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    {processes.sort((a, b) => a.id - b.id).map((process, index) => (
                      <motion.tr 
                        key={process.id} 
                        className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                      >
                        <td className="px-4 py-3 border-t">
                          <span className={`inline-block w-6 h-6 rounded-full ${process.color} text-white text-xs font-medium flex items-center justify-center mr-2`}>
                            {process.id}
                          </span>
                          <span className="font-medium">P{process.id}</span>
                        </td>
                        <td className="px-4 py-3 border-t">{process.size}</td>
                        <td className="px-4 py-3 border-t">{process.startAddress}</td>
                        <td className="px-4 py-3 border-t">{process.startAddress + process.size}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
            
            <AnimatePresence>
              {rejectedProcesses.length > 0 && (
                <motion.div 
                  className="p-6 bg-white rounded-lg shadow-md border border-gray-100 mb-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.6 }}
                >
                  <h3 className="text-xl font-semibold mb-6 text-gray-800">Rejected Processes</h3>
                  
                  <div className="overflow-x-auto bg-white rounded-lg border border-gray-200">
                    <table className="w-full table-auto">
                      <thead>
                        <tr className="bg-gray-50 text-left">
                          <th className="px-4 py-3 text-gray-600 font-medium">Process ID</th>
                          <th className="px-4 py-3 text-gray-600 font-medium">Size (KB)</th>
                          <th className="px-4 py-3 text-gray-600 font-medium">Reason</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rejectedProcesses.map((process, index) => (
                          <motion.tr 
                            key={`rejected-${process.id}`} 
                            className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                          >
                            <td className="px-4 py-3 border-t">
                              <span className="inline-block w-6 h-6 rounded-full bg-red-500 text-white text-xs font-medium flex items-center justify-center mr-2">
                                {process.id}
                              </span>
                              <span className="font-medium">P{process.id}</span>
                            </td>
                            <td className="px-4 py-3 border-t">{process.size}</td>
                            <td className="px-4 py-3 border-t text-red-600">No suitable contiguous memory block available</td>
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            
            <motion.div 
              className="p-6 bg-white rounded-lg shadow-md border border-gray-100 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              <div className="flex flex-col sm:flex-row justify-between items-center bg-blue-50 p-4 rounded-lg mb-6">
                <div className="mb-4 sm:mb-0">
                  <h3 className="text-xl font-semibold text-blue-800">Memory Allocation Summary</h3>
                  <p className="text-blue-700">Total Memory: {totalMemory} KB | Used: {allocatedMemory} KB | Free: {totalMemory - allocatedMemory} KB</p>
                </div>
                <button
                  onClick={handleReset}
                  className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition transform hover:scale-105"
                >
                  Start New Simulation
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <span className="text-3xl font-bold text-gray-800">{processes.length}</span>
                  <p className="text-gray-600">Process{processes.length !== 1 ? 'es' : ''} Allocated</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <span className="text-3xl font-bold text-gray-800">{Math.round((allocatedMemory/totalMemory) * 100)}%</span>
                  <p className="text-gray-600">Memory Utilization</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                  <span className="text-3xl font-bold text-gray-800">{getLargestMemoryGap()}</span>
                  <p className="text-gray-600">Largest Free Block (KB)</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
      
      <div className="text-center text-gray-500 text-sm mt-8 pt-4 border-t border-gray-200">
        <p>Memory Allocation Simulator - MVT (Multiprogramming with Variable number of Tasks)</p>
      </div>
    </div>
  );
};

export default MVT;
import { useState, useEffect } from 'react';
import { ArrowRight, ArrowDown, Cpu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function MemoryManagementUnit() {
  const navigate = useNavigate();
  const [pageSize, setPageSize] = useState(64);
  const [virtualAddrBits, setVirtualAddrBits] = useState(8);
  const [ramSize, setRamSize] = useState(512);
  
  const physicalAddrBits = Math.log2(ramSize);
  const totalFrames = ramSize / pageSize;
  
  const [logicalAddress, setLogicalAddress] = useState('');
  
  const [pageNumber, setPageNumber] = useState(null);
  const [offset, setOffset] = useState(null);
  const [frameNumber, setFrameNumber] = useState(null);
  const [physicalAddress, setPhysicalAddress] = useState(null);
  
  const [animationState, setAnimationState] = useState('idle');
  const [animationStep, setAnimationStep] = useState(0);
  const [showPageTable, setShowPageTable] = useState(false);
  const [showPhysicalMemory, setShowPhysicalMemory] = useState(false);
  const [showZoomedBlock, setShowZoomedBlock] = useState(false);
  const [storeInProgress, setStoreInProgress] = useState(false);
  const [storeComplete, setStoreComplete] = useState(false);
  const [animationProgress, setAnimationProgress] = useState(0);
  
  const [pageTable, setPageTable] = useState({});
  
  // Initialize page table with unique random frame numbers
  useEffect(() => {
    const numberOfPages = Math.pow(2, virtualAddrBits) / pageSize;
    const numberOfFrames = ramSize / pageSize;
    
    // Create array of all possible frame numbers and shuffle them
    const frames = Array.from({ length: numberOfFrames }, (_, i) => i);
    const shuffledFrames = [...frames].sort(() => Math.random() - 0.5);
    
    const newPageTable = {};
    for (let i = 0; i < numberOfPages; i++) {
      // Use modulo to wrap around if more pages than frames
      newPageTable[i] = shuffledFrames[i % numberOfFrames];
    }
    
    setPageTable(newPageTable);
  }, [virtualAddrBits, pageSize, ramSize]);
  
  const offsetBits = Math.log2(pageSize);
  const pageNumberBits = virtualAddrBits - offsetBits;
  
  // Effect to handle the animation in Step 4
  useEffect(() => {
    let animationTimer;
    
    if (storeInProgress && animationProgress < 100) {
      animationTimer = setTimeout(() => {
        const newProgress = animationProgress + 5;
        setAnimationProgress(newProgress);
        
        if (newProgress >= 100) {
          setStoreInProgress(false);
          setStoreComplete(true);
          setShowZoomedBlock(true);
        }
      }, 50);
    }
    
    return () => {
      if (animationTimer) clearTimeout(animationTimer);
    };
  }, [storeInProgress, animationProgress]);
  
  const handleNextStep = () => {
    if (animationState !== 'calculating') return;
    
    const nextStep = animationStep + 1;
    setAnimationStep(nextStep);
    
    // Execute actions for the current step
    switch (nextStep - 1) { // We're about to move to nextStep, so current is nextStep-1
      case 0:
        // Initial calculation already done
        break;
      case 1:
        setShowPageTable(true);
        break;
      case 2:
        const frame = pageTable[pageNumber];
        setFrameNumber(frame);
        const physAddr = (frame * pageSize) + offset;
        setPhysicalAddress(physAddr);
        break;
      case 3:
        setShowPhysicalMemory(true);
        // Start the animation process automatically in Step 4
        setStoreInProgress(true);
        setAnimationProgress(0);
        break;
      case 4:
        // Skip this step as we'll handle it with the animation
        setAnimationState('complete');
        break;
      default:
        break;
    }
  };
  
  const handleAddressTranslation = () => {
    if (!logicalAddress) return;
    
    // Reset animation state
    setAnimationState('calculating');
    setAnimationStep(0);
    setShowPageTable(false);
    setShowPhysicalMemory(false);
    setShowZoomedBlock(false);
    setStoreInProgress(false);
    setStoreComplete(false);
    setAnimationProgress(0);
    
    // Parse logical address
    const logicalAddressNum = parseInt(logicalAddress, 10);
    
    // Calculate page number and offset
    const pageNum = Math.floor(logicalAddressNum / pageSize);
    const pageOffset = logicalAddressNum % pageSize;
    
    setPageNumber(pageNum);
    setOffset(pageOffset);
    
    // First step is automatically shown
    setAnimationStep(1);
  };
  
  const resetSimulation = () => {
    setAnimationState('idle');
    setAnimationStep(0);
    setShowPageTable(false);
    setShowPhysicalMemory(false);
    setShowZoomedBlock(false);
    setStoreInProgress(false);
    setStoreComplete(false);
    setAnimationProgress(0);
    setPageNumber(null);
    setOffset(null);
    setFrameNumber(null);
    setPhysicalAddress(null);
  };
  
  const formatBinary = (num, bits) => {
    if (num === null) return '';
    return num.toString(2).padStart(bits, '0');
  };
  
  const generateByteContent = (address) => {
    if (address === null) return "00";
    const hash = (address * 1234567) % 256;
    return hash.toString(16).padStart(2, '0');
  };
  
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      <header className="w-full flex flex-col items-center max-w-5xl mb-8">
        <h1 className="text-3xl font-bold text-center text-blue-700">
          Memory Management Unit (MMU) Address Translation
        </h1>
        <p className="text-center text-gray-600 mt-2">
          Simplified visualization with reduced memory sizes
        </p>
        <p className="mt-3">
          <a 
            onClick={()=>{navigate('/mmuinfo')}}
            className="text-blue-500 hover:underline font-medium cursor-pointer"
          >
            Learn more about Memory Management Unit
          </a>
        </p>
      </header>
      
      <div className="w-full max-w-5xl bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Configuration</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-700">Virtual Address Bits</label>
            <select 
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm p-2 border"
              value={virtualAddrBits}
              onChange={(e) => {
                setVirtualAddrBits(parseInt(e.target.value));
                resetSimulation();
              }}
            >
              <option value={8}>8 bits (256 bytes)</option>
              <option value={10}>10 bits (1KB)</option>
              <option value={12}>12 bits (4KB)</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Page Size</label>
            <select 
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm p-2 border"
              value={pageSize}
              onChange={(e) => {
                setPageSize(parseInt(e.target.value));
                resetSimulation();
              }}
            >
              <option value={16}>16 bytes</option>
              <option value={32}>32 bytes</option>
              <option value={64}>64 bytes</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700">Physical Memory Size</label>
            <select 
              className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm p-2 border"
              value={ramSize}
              onChange={(e) => {
                setRamSize(parseInt(e.target.value));
                resetSimulation();
              }}
            >
              <option value={256}>256 bytes</option>
              <option value={512}>512 bytes</option>
              <option value={1024}>1 KB</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="w-full max-w-5xl bg-white rounded-lg shadow-lg p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Enter Logical Address</h2>
        <div className="flex items-end gap-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Logical Address (0 to {Math.pow(2, virtualAddrBits) - 1})
            </label>
            <input
              type="number"
              className="w-full p-2 border rounded-lg"
              placeholder="Enter decimal address"
              min="0"
              max={Math.pow(2, virtualAddrBits) - 1}
              value={logicalAddress}
              onChange={(e) => setLogicalAddress(e.target.value)}
            />
          </div>
          <button
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            onClick={handleAddressTranslation}
            disabled={animationState === 'calculating'}
          >
            Translate Address
          </button>
          {animationState !== 'idle' && (
            <button
              className="bg-gray-300 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
              onClick={resetSimulation}
            >
              Reset
            </button>
          )}
        </div>
      </div>
      
      {animationState !== 'idle' && (
        <div className="w-full max-w-5xl bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Address Translation Process</h2>
          
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <h3 className="text-lg font-medium mb-2">Step 1: Divide Logical Address</h3>
            <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
              <div className="text-center md:text-right">
                <div className="text-sm text-gray-500 mb-1">Logical Address (Decimal)</div>
                <div className="text-lg font-mono">{logicalAddress}</div>
              </div>
              <ArrowRight className="rotate-90 md:rotate-0 text-blue-600" />
              <div className="grid grid-cols-2 gap-2 flex-1">
                <div className="border border-blue-500 bg-blue-50 p-2 rounded-xl text-center">
                  <div className="text-sm text-gray-500 mb-1">Page Number</div>
                  <div className="text-lg font-mono">{pageNumber}</div>
                  <div className="text-xs text-gray-400 mt-1">({pageNumberBits} bits)</div>
                </div>
                <div className="border border-green-500 bg-green-50 p-2 rounded-xl text-center">
                  <div className="text-sm text-gray-500 mb-1">Offset</div>
                  <div className="text-lg font-mono">{offset}</div>
                  <div className="text-xs text-gray-400 mt-1">({offsetBits} bits)</div>
                </div>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <strong>Formula:</strong> Page Number = ⌊Logical Address ÷ Page Size⌋, Offset = Logical Address mod Page Size
            </div>
          </div>
          
          {animationStep >= 2 && showPageTable && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6 transition-opacity duration-500">
              <h3 className="text-lg font-medium mb-2">Step 2: Page Table Lookup</h3>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col md:flex-row items-center gap-4 mb-2">
                  <div className="text-center md:text-right">
                    <div className="text-sm text-gray-500 mb-1">Page Number</div>
                    <div className="text-lg font-mono font-bold text-blue-600">{pageNumber}</div>
                  </div>
                  <ArrowRight className="rotate-90 md:rotate-0 text-blue-600" />
                  <div className="border border-gray-300 rounded-xl p-2 bg-white flex-1 max-h-60 overflow-y-auto">
                    <div className="text-sm text-gray-500 mb-2 sticky top-0 bg-white py-1">Page Table</div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-2">
                      {Object.entries(pageTable).map(([page, frame]) => (
                        <div 
                          key={page} 
                          className={`p-2 rounded-lg text-xs flex justify-between items-center ${
                            parseInt(page) === pageNumber 
                              ? 'bg-yellow-100 border border-yellow-400' 
                              : 'bg-gray-100'
                          }`}
                        >
                          <span className="font-medium">Page {page}:</span>
                          <span className="bg-white px-2 py-1 rounded-lg">Frame {frame}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <ArrowRight className="rotate-90 md:rotate-0 text-blue-600" />
                  <div className="text-center md:text-left">
                    <div className="text-sm text-gray-500 mb-1">Frame Number</div>
                    <div className="text-lg font-mono font-bold text-purple-600">{frameNumber}</div>
                  </div>
                </div>
                <div className="text-sm text-gray-600 text-center">
                  The MMU looks up page {pageNumber} in the page table and finds it maps to frame {frameNumber}
                </div>
              </div>
            </div>
          )}
          
          {animationStep >= 3 && frameNumber !== null && (
            <div className="bg-gray-50 p-4 rounded-lg mb-6 transition-opacity duration-500">
              <h3 className="text-lg font-medium mb-2">Step 3: Calculate Physical Address</h3>
              <div className="flex flex-col items-center gap-4">
                <div className="flex items-center gap-4 w-full">
                  <div className="border border-purple-500 bg-purple-50 p-2 rounded-xl text-center flex-1">
                    <div className="text-sm text-gray-500">Frame Number</div>
                    <div className="text-lg font-mono">{frameNumber}</div>
                  </div>
                  <div className="text-2xl">×</div>
                  <div className="border border-gray-500 bg-gray-50 p-2 rounded-xl text-center flex-1">
                    <div className="text-sm text-gray-500">Page Size</div>
                    <div className="text-lg font-mono">{pageSize}</div>
                  </div>
                  <div className="text-2xl">+</div>
                  <div className="border border-green-500 bg-green-50 p-2 rounded-xl text-center flex-1">
                    <div className="text-sm text-gray-500">Offset</div>
                    <div className="text-lg font-mono">{offset}</div>
                  </div>
                </div>
                <ArrowDown className="text-blue-600" />
                <div className="border border-red-500 bg-red-50 p-4 rounded-xl text-center w-full">
                  <div className="text-sm text-gray-500 mb-1">Physical Address</div>
                  <div className="text-2xl font-mono font-bold">{physicalAddress}</div>
                  <div className="text-xs text-gray-500 mt-1">Binary: {formatBinary(physicalAddress, physicalAddrBits)}</div>
                </div>
                <div className="text-sm text-gray-600 w-full">
                  <strong>Formula:</strong> Physical Address = (Frame Number × Page Size) + Offset
                </div>
              </div>
            </div>
          )}
          
          {animationStep >= 4 && showPhysicalMemory && (
            <div className="bg-gray-50 p-4 rounded-lg transition-opacity duration-500">
              <h3 className="text-lg font-medium mb-4">Step 4: Physical Memory Access</h3>
              
              <div className="flex flex-col">
                <div className="relative w-full flex flex-col md:flex-row gap-6 items-center md:items-stretch">
                  <div className="flex flex-col items-center justify-center w-full md:w-1/6">
                    <div className="bg-blue-100 border border-blue-300 rounded-xl p-3 w-full flex flex-col items-center">
                      <Cpu className="text-blue-700 mb-2" size={32} />
                      <div className="text-center text-sm font-medium">CPU</div>
                      <div className="text-center text-xs mt-1">Requests address {logicalAddress}</div>
                    </div>
                    <div className="h-6 w-1 bg-gray-300"></div>
                    <div className="bg-purple-100 border border-purple-300 rounded-xl p-3 w-full flex flex-col items-center">
                      <div className="text-center text-sm font-medium">MMU</div>
                      <div className="text-center text-xs mt-1">Translates to physical address {physicalAddress}</div>
                      <div className={`mt-2 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${storeInProgress ? 'bg-yellow-500' : storeComplete ? 'bg-green-500' : 'bg-gray-400'}`}>
                        {storeComplete ? '✓' : storeInProgress ? '...' : '?'}
                      </div>
                    </div>
                    <div className="h-6 w-1 bg-gray-300"></div>
                    <ArrowDown className={`text-${storeInProgress || storeComplete ? 'green' : 'gray'}-600`} />
                  </div>
                  
                  <div className="w-full md:w-5/6 flex flex-col">
                    <div className="text-center mb-2 font-medium text-gray-700">
                      Physical Memory ({ramSize} bytes) - {totalFrames} Frames
                    </div>
                    
                    <div className="relative bg-white border-2 border-gray-300 rounded-xl h-96 p-2 overflow-y-auto">
                      <div className="flex flex-col gap-1">
                        {Array.from({ length: totalFrames }).map((_, i) => {
                          const frameNum = i;
                          const isTargetFrame = frameNum === frameNumber;
                          const frameStart = frameNum * pageSize;
                          const frameEnd = (frameNum + 1) * pageSize - 1;
                          
                          return (
                            <div 
                              key={i}
                              className={`flex items-center p-2 border rounded-lg ${
                                isTargetFrame 
                                  ? storeComplete 
                                    ? 'bg-green-100 border-green-500' 
                                    : storeInProgress 
                                      ? 'bg-yellow-100 border-yellow-500 animate-pulse' 
                                      : 'bg-red-100 border-red-500'
                                  : 'bg-gray-50 border-gray-200'
                              }`}
                            >
                              <div className="w-24 font-medium">Frame {frameNum}</div>
                              <div className="flex-1 h-6 bg-white rounded-full border border-gray-300 relative mx-4">
                                {isTargetFrame && (
                                  <div 
                                    className={`absolute h-full rounded-full transition-all duration-1000 ease-in-out ${
                                      storeComplete 
                                        ? 'bg-green-500' 
                                        : storeInProgress 
                                          ? 'bg-yellow-500' 
                                          : 'bg-red-500'
                                    }`}
                                    style={{
                                      width: storeInProgress || storeComplete 
                                        ? `${Math.min(animationProgress, (offset / pageSize) * 100)}%` 
                                        : '0%',
                                      left: 0
                                    }}
                                  >
                                    <div className="absolute -right-2 -top-2 w-4 h-4 rounded-full bg-white border border-gray-400 flex items-center justify-center text-xs">
                                      {storeComplete ? '✓' : storeInProgress ? '⟳' : '!'}
                                    </div>
                                  </div>
                                )}
                              </div>
                              <div className="text-xs w-48 text-right">
                                {frameStart} - {frameEnd}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    
                    <div className="flex justify-between text-xs text-gray-500 mt-1">
                      <span>Address 0</span>
                      <span>Address {ramSize - 1}</span>
                    </div>
                  </div>
                </div>
                
                {storeComplete && (
                  <div className="mt-8 border-t-2 border-dashed border-gray-300 pt-6">
                    <div className="flex flex-col lg:flex-row items-center lg:items-start gap-4">
                      <div className="w-full lg:w-1/2 flex flex-col">
                        <div className="text-center font-medium text-gray-700 mb-2">
                          Physical Memory Block (Zoomed)
                        </div>
                        
                        <div className="border-2 border-green-500 bg-green-50 p-4 rounded-xl">
                          <div className="mb-3 text-center">
                            <span className="font-medium">Frame {frameNumber}</span>
                            <span className="text-xs text-gray-600 ml-2">
                              (Addresses {frameNumber * pageSize} to {(frameNumber + 1) * pageSize - 1})
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-8 gap-1 bg-white border border-gray-200 rounded-lg p-2">
                            {Array.from({ length: pageSize }).map((_, i) => {
                              const byteAddress = (frameNumber * pageSize) + i;
                              const isExactTarget = byteAddress === physicalAddress;
                              const isWithinOffset = byteAddress >= physicalAddress && byteAddress < physicalAddress + 4;
                              
                              return (
                                <div
                                  key={i}
                                  className={`p-1 text-center text-xs border rounded-md ${
                                    isExactTarget 
                                      ? 'border-red-500 bg-red-100' 
                                      : isWithinOffset 
                                        ? 'border-gray-100'
                                        : 'border-gray-100'
                                  }`}
                                >
                                  {generateByteContent(byteAddress)}
                                </div>
                              );
                            })}
                          </div>
                          
                          <div className="mt-4 text-center">
                            <div className="inline-flex items-center bg-blue-100 px-3 py-1 rounded-full text-blue-800 text-sm">
                              <span className="mr-1">Offset:</span>
                              <span className="font-medium">{offset} bytes</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="w-full lg:w-1/2 flex flex-col">
                        <div className="text-center font-medium text-gray-700 mb-2">
                          Specific Memory Location Detail
                        </div>
                        
                        <div className="border-2 border-blue-500 rounded-xl bg-blue-50 p-4 h-full">
                          <div className="bg-white border border-blue-200 rounded-lg p-4 mb-4">
                            <div className="grid grid-cols-4 gap-2">
                              <div className="col-span-1 text-right text-sm font-medium">Logical Address:</div>
                              <div className="col-span-3 font-mono bg-gray-100 px-2 rounded-lg">{logicalAddress}</div>
                              
                              <div className="col-span-1 text-right text-sm font-medium">Page Number:</div>
                              <div className="col-span-3 font-mono bg-blue-100 px-2 rounded-lg">{pageNumber}</div>
                              
                              <div className="col-span-1 text-right text-sm font-medium">Offset:</div>
                              <div className="col-span-3 font-mono bg-green-100 px-2 rounded-lg">{offset}</div>
                              
                              <div className="col-span-1 text-right text-sm font-medium">Frame Number:</div>
                              <div className="col-span-3 font-mono bg-purple-100 px-2 rounded-lg">{frameNumber}</div>
                              
                              <div className="col-span-1 text-right text-sm font-medium">Physical Address:</div>
                              <div className="col-span-3 font-mono bg-red-100 px-2 rounded-lg">{physicalAddress}</div>
                              
                              <div className="col-span-1 text-right text-sm font-medium">Binary Address:</div>
                              <div className="col-span-3 font-mono text-xs bg-gray-100 px-2 rounded-lg overflow-auto">
                                {formatBinary(physicalAddress, physicalAddrBits)}
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-white border border-blue-200 rounded-lg p-4">
                            <h4 className="text-center text-sm font-medium mb-2">Memory Access Details</h4>
                            <div className="grid grid-cols-1 gap-2">
                              <div className="flex justify-between">
                                <span>Byte Value (Hex):</span>
                                <span className="font-mono">{generateByteContent(physicalAddress)}</span>
                              </div>
                              <div className="flex justify-between">
                                <span>Byte Value (Decimal):</span>
                                <span className="font-mono">{parseInt(generateByteContent(physicalAddress), 16)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {animationState !== 'complete' && animationStep < 4 && (
            <div className="flex justify-center mt-6">
              <button
                className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                onClick={handleNextStep}
              >
                Next Step
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
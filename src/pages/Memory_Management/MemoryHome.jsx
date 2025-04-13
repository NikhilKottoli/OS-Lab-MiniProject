import React, { useState, useEffect } from 'react';
import { ChevronRight, Divide, Layers, Move } from 'lucide-react';
import { Brain } from "lucide-react";
import { useNavigate } from 'react-router-dom';


const MemoryAllocationHome = () => {
    const navigate = useNavigate();
  const [showMFT, setShowMFT] = useState(false);
  const [showMVT, setShowMVT] = useState(false);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    setTimeout(() => setShowContent(true), 300);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div 
        className={`max-w-5xl mx-auto transition-all duration-1000 ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
      >
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-blue-800 mb-6">Memory Allocation Techniques</h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto">
            Explore how operating systems manage memory through different allocation strategies
          </p>
        </div>

        <div className="flex justify-center mb-16">
          <div className="w-64 h-64 relative">
            <div className="absolute inset-0 border-4 border-blue-700 rounded-lg overflow-hidden flex flex-col">
              <div className="w-full bg-blue-800 text-white px-3 py-1 text-sm font-semibold">
                Memory
              </div>
              <div className="flex-1 bg-gray-100 p-2 relative">
                <MemoryAnimation />
              </div>
            </div>
          </div>
        </div>
        <div className="mb-16 bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <Brain className="mr-2 text-blue-600" />
              Understanding Memory Allocation
            </h2>
            <p className="text-gray-700 mb-6 leading-relaxed">
              Memory allocation is a critical aspect of operating systems that involves assigning portions of computer memory to various programs and processes. Efficient memory allocation ensures optimal utilization of available resources, prevents memory leaks, and minimizes fragmentation.
            </p>
            
            <div className="grid md:grid-cols-2 gap-8">
              <div 
                className={`bg-blue-50 rounded-lg p-6 transition-all duration-500 transform ${showMFT ? 'scale-105' : 'scale-100'}`}
                onMouseEnter={() => setShowMFT(true)}
                onMouseLeave={() => setShowMFT(false)}
              >
                <h3 className="text-xl font-semibold text-blue-800 mb-3 flex items-center">
                  <Divide className="mr-2 text-blue-600" />
                  MFT (Multiprogramming with Fixed Tasks)
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  MFT divides memory into fixed-size partitions. Each partition can contain exactly one process. This approach is simple to implement but can lead to internal fragmentation when a process doesn't use all the allocated space in its partition.
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-green-500 mr-1 shrink-0" />
                    <span className="text-gray-600">Fixed partition sizes determined at system initialization</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-green-500 mr-1 shrink-0" />
                    <span className="text-gray-600">Simple allocation and deallocation</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-red-500 mr-1 shrink-0" />
                    <span className="text-gray-600">Suffers from internal fragmentation</span>
                  </li>
                </ul>
              </div>

              <div 
                className={`bg-indigo-50 rounded-lg p-6 transition-all duration-500 transform ${showMVT ? 'scale-105' : 'scale-100'}`}
                onMouseEnter={() => setShowMVT(true)}
                onMouseLeave={() => setShowMVT(false)}
              >
                <h3 className="text-xl font-semibold text-indigo-800 mb-3 flex items-center">
                  <Layers className="mr-2 text-indigo-600" />
                  MVT (Multiprogramming with Variable Tasks)
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  MVT allocates exactly as much memory as required by a process. This dynamic approach optimizes memory usage but can lead to external fragmentation as processes are loaded and removed, creating small, unusable gaps in memory.
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-green-500 mr-1 shrink-0" />
                    <span className="text-gray-600">Dynamic partition sizes based on process needs</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-green-500 mr-1 shrink-0" />
                    <span className="text-gray-600">Better memory utilization</span>
                  </li>
                  <li className="flex items-start">
                    <ChevronRight className="h-5 w-5 text-red-500 mr-1 shrink-0" />
                    <span className="text-gray-600">Suffers from external fragmentation</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          <SimulatorCard 
            title="MFT Simulator"
            description="Explore memory allocation with fixed partition sizes"
            color="blue"
            icon={<Divide className="h-6 w-6" />}
            onClick={() => navigate('/mft')}
          />
          
          <SimulatorCard 
            title="MVT Simulator"
            description="Explore memory allocation with variable partition sizes"
            color="indigo"
            icon={<Move className="h-6 w-6" />}
            onClick={() => navigate('/mvt')}
            
          />
        </div>
        <div className="bg-white rounded-xl shadow-xl overflow-hidden mb-16">
          <div className="p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">MFT vs MVT Comparison</h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border px-4 py-2 text-left">Feature</th>
                    <th className="border px-4 py-2 text-center">MFT</th>
                    <th className="border px-4 py-2 text-center">MVT</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border px-4 py-2 font-medium">Partition Size</td>
                    <td className="border px-4 py-2 text-center">Fixed</td>
                    <td className="border px-4 py-2 text-center">Variable</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2 font-medium">Internal Fragmentation</td>
                    <td className="border px-4 py-2 text-center">Yes</td>
                    <td className="border px-4 py-2 text-center">No</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2 font-medium">External Fragmentation</td>
                    <td className="border px-4 py-2 text-center">No</td>
                    <td className="border px-4 py-2 text-center">Yes</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2 font-medium">Memory Utilization</td>
                    <td className="border px-4 py-2 text-center">Lower</td>
                    <td className="border px-4 py-2 text-center">Higher</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2 font-medium">Implementation Complexity</td>
                    <td className="border px-4 py-2 text-center">Simple</td>
                    <td className="border px-4 py-2 text-center">Complex</td>
                  </tr>
                  <tr>
                    <td className="border px-4 py-2 font-medium">Allocation Speed</td>
                    <td className="border px-4 py-2 text-center">Fast</td>
                    <td className="border px-4 py-2 text-center">Slower</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MemoryAnimation = () => {
  const [blocks, setBlocks] = useState([]);
  
  useEffect(() => {

    generateBlocks();
    const interval = setInterval(generateBlocks, 5000);
    return () => clearInterval(interval);
  }, []);
  
  const generateBlocks = () => {
    const types = ['mft', 'mvt'];
    const newBlocks = [];
    
    if (Math.random() > 0.5) {
      const blockSize = 20;
      const numBlocks = Math.floor(60 / blockSize);
      
      for (let i = 0; i < numBlocks; i++) {
        newBlocks.push({
          id: i,
          top: i * blockSize,
          height: blockSize - 2,
          type: 'mft',
          process: Math.random() > 0.3
        });
      }
    } else {
      let currentTop = 0;
      
      while (currentTop < 60) {
        const height = 8 + Math.floor(Math.random() * 15);
        newBlocks.push({
          id: currentTop,
          top: currentTop,
          height: Math.min(height, 60 - currentTop - 2),
          type: 'mvt',
          process: Math.random() > 0.3
        });
        currentTop += height;
      }
    }
    
    setBlocks(newBlocks);
  };
  
  return (
    <>
      {blocks.map((block) => (
        <div
          key={block.id}
          className={`absolute left-2 right-2 transition-all duration-1000 ${
            block.process 
              ? block.type === 'mft' ? 'bg-blue-500' : 'bg-indigo-500' 
              : 'bg-gray-300'
          }`}
          style={{
            top: block.top + 'px',
            height: block.height + 'px',
            opacity: block.process ? 0.9 : 0.4,
          }}
        ></div>
      ))}
    </>
  );
};

const SimulatorCard = ({ title, description, color, icon, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  
  const baseClasses = 'rounded-xl shadow-lg overflow-hidden transition-all duration-500 transform';
  const hoverClasses = isHovered ? 'shadow-2xl -translate-y-2' : '';
  const colorClasses = color === 'blue' 
    ? 'bg-gradient-to-br from-blue-500 to-blue-700' 
    : 'bg-gradient-to-br from-indigo-500 to-indigo-700';
  
  return (
    <div 
      className={`${baseClasses} ${hoverClasses} ${colorClasses}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-6 text-white">
        <div className={`h-16 w-16 rounded-full bg-white/20 flex items-center justify-center mb-6 ${
          isHovered ? 'animate-pulse' : ''
        }`}>
          {icon}
        </div>
        
        <h3 className="text-2xl font-bold mb-3">{title}</h3>
        <p className="mb-6 opacity-90">{description}</p>
        
        <button className={`inline-flex items-center px-4 py-2 rounded-lg bg-white text-${color}-700 font-medium transition-transform duration-200 ${
          isHovered ? 'transform translate-x-2' : ''
        }`} 
        onClick={onClick}
        >
          Launch Simulator
          <ChevronRight className="ml-1 h-5 w-5" />
        </button>
      </div>
    </div>
  );
};

export default MemoryAllocationHome;
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Cpu,MemoryStick, HardDrive, Layers, Binary } from 'lucide-react';

export default function MMUInfoPage() {

  const [activeTab, setActiveTab] = useState('overview');
  const navigate = useNavigate();
  
  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      <header className="w-full max-w-5xl mb-8">
        <h1 className="text-3xl font-bold text-center text-blue-700">
          Memory Management Unit (MMU)
        </h1>
        <p className="text-center text-gray-600 mt-2">
          Understanding the hardware component that handles virtual memory and address translation
        </p>
      </header>
      
      <div className="w-full max-w-5xl bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex flex-wrap gap-2 mb-6">
          <button
            className={`px-4 py-2 rounded-md transition-colors ${activeTab === 'overview' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`px-4 py-2 rounded-md transition-colors ${activeTab === 'functions' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
            onClick={() => setActiveTab('functions')}
          >
            Functions
          </button>
          <button
            className={`px-4 py-2 rounded-md transition-colors ${activeTab === 'translation' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
            onClick={() => navigate('/mmu')}
          >
            Address Translation
          </button>
          <button
            className={`px-4 py-2 rounded-md transition-colors ${activeTab === 'benefits' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'}`}
            onClick={() => setActiveTab('benefits')}
          >
            Benefits
          </button>
        </div>
        
        {activeTab === 'overview' && (
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 p-3 rounded-full">
                <Cpu className="text-blue-700" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2">What is an MMU?</h2>
                <p className="text-gray-700">
                  The Memory Management Unit (MMU) is a computer hardware component that handles all memory and caching operations associated with the processor. 
                  It sits between the CPU and main memory, translating virtual addresses into physical addresses.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="bg-purple-100 p-3 rounded-full">
                <Layers className="text-purple-700" size={24} />
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-2">Key Concepts</h2>
                <ul className="list-disc pl-5 space-y-2 text-gray-700">
                  <li><strong>Virtual Memory:</strong> Provides the illusion of a large, contiguous memory space</li>
                  <li><strong>Physical Memory:</strong> The actual RAM hardware in the computer</li>
                  <li><strong>Address Translation:</strong> Converting virtual addresses to physical addresses</li>
                  <li><strong>Memory Protection:</strong> Preventing processes from accessing each other's memory</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-2">MMU in the Computer Architecture</h3>
              <div className="flex flex-col items-center">
                <div className="w-full max-w-md bg-white border border-gray-300 rounded-lg p-4">
                  <div className="flex justify-center mb-4">
                    <div className="bg-blue-100 border border-blue-300 rounded-lg p-3 text-center w-32">
                      <Cpu className="mx-auto text-blue-700 mb-1" size={20} />
                      <div className="text-sm font-medium">CPU</div>
                    </div>
                  </div>
                  <div className="flex justify-center mb-4">
                    <div className="h-6 w-1 bg-gray-300"></div>
                  </div>
                  <div className="flex justify-center mb-4">
                    <div className="bg-purple-100 border border-purple-300 rounded-lg p-3 text-center w-32">
                      <div className="text-sm font-medium">MMU</div>
                    </div>
                  </div>
                  <div className="flex justify-center mb-4">
                    <div className="h-6 w-1 bg-gray-300"></div>
                  </div>
                  <div className="flex justify-center">
                    <div className="bg-green-100 border border-green-300 rounded-lg p-3 text-center w-32">
                      <MemoryStick className="mx-auto text-green-700 mb-1" size={20} />
                      <div className="text-sm font-medium">RAM</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'functions' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="text-lg font-medium mb-3 flex items-center gap-2 text-blue-700">
                  <Binary className="inline" size={20} />
                  Address Translation
                </h3>
                <p className="text-gray-700">
                  The MMU translates virtual addresses generated by the CPU into physical addresses in RAM. 
                  This allows programs to use a virtual address space that's larger than the actual physical memory.
                </p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h3 className="text-lg font-medium mb-3 flex items-center gap-2 text-purple-700">
                  <Layers className="inline" size={20} />
                  Memory Protection
                </h3>
                <p className="text-gray-700">
                  The MMU enforces memory protection by preventing processes from accessing memory locations they're not authorized to use, 
                  improving system stability and security.
                </p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h3 className="text-lg font-medium mb-3 flex items-center gap-2 text-green-700">
                  <HardDrive className="inline" size={20} />
                  Cache Control
                </h3>
                <p className="text-gray-700">
                  Many MMUs manage CPU cache operations, determining what data is cached and how memory accesses interact with the cache hierarchy.
                </p>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h3 className="text-lg font-medium mb-3 flex items-center gap-2 text-yellow-700">
                  <MemoryStick className="inline" size={20} />
                  Page Fault Handling
                </h3>
                <p className="text-gray-700">
                  When a page isn't in physical memory, the MMU generates a page fault exception, allowing the operating system to load the required page from disk.
                </p>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'translation' && (
          <div className="space-y-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Address Translation Process</h2>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">1. Virtual Address Generation</h3>
                <p className="text-gray-700 mb-4">
                  The CPU generates a virtual address when accessing memory. This address is part of the program's virtual address space.
                </p>
                <div className="bg-white border border-gray-300 rounded-md p-3 max-w-md mx-auto">
                  <div className="text-center font-mono bg-blue-100 p-2 rounded">
                    Virtual Address: 0x{Math.floor(Math.random() * 0xFFFF).toString(16).padStart(4, '0')}
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">2. Page Table Lookup</h3>
                <p className="text-gray-700 mb-4">
                  The MMU uses the virtual address to look up the page table (managed by the OS) to find the corresponding physical frame.
                </p>
                <div className="bg-white border border-gray-300 rounded-md p-3 max-w-lg mx-auto">
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="font-medium bg-gray-100 p-2 rounded text-center">Page Number</div>
                    <div className="font-medium bg-gray-100 p-2 rounded text-center">Frame Number</div>
                    <div className="font-medium bg-gray-100 p-2 rounded text-center">Flags</div>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <React.Fragment key={i}>
                        <div className="p-2 border-b text-center">{i}</div>
                        <div className="p-2 border-b text-center">{Math.floor(Math.random() * 16)}</div>
                        <div className="p-2 border-b text-center">RWX</div>
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <h3 className="text-lg font-medium mb-2">3. Physical Address Formation</h3>
                <p className="text-gray-700 mb-4">
                  The MMU combines the physical frame number from the page table with the offset from the virtual address to form the physical address.
                </p>
                <div className="bg-white border border-gray-300 rounded-md p-3 max-w-md mx-auto">
                  <div className="text-center">
                    <div className="font-mono bg-purple-100 p-2 rounded mb-2">
                      Frame Number: 0x{Math.floor(Math.random() * 0xFF).toString(16).padStart(2, '0')}
                    </div>
                    <div className="text-xl">+</div>
                    <div className="font-mono bg-green-100 p-2 rounded mt-2">
                      Offset: 0x{Math.floor(Math.random() * 0xFFF).toString(16).padStart(3, '0')}
                    </div>
                    <div className="text-xl my-2">=</div>
                    <div className="font-mono bg-red-100 p-2 rounded font-bold">
                      Physical Address: 0x{Math.floor(Math.random() * 0xFFFF).toString(16).padStart(4, '0')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {activeTab === 'benefits' && (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <h3 className="text-lg font-medium mb-3 text-blue-700">Virtual Memory</h3>
                <p className="text-gray-700">
                  Allows systems to use disk storage as an extension of RAM, enabling programs to use more memory than physically available.
                </p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-lg border border-purple-200">
                <h3 className="text-lg font-medium mb-3 text-purple-700">Memory Protection</h3>
                <p className="text-gray-700">
                  Prevents programs from interfering with each other's memory, improving system stability and security.
                </p>
              </div>
              
              <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                <h3 className="text-lg font-medium mb-3 text-green-700">Memory Organization</h3>
                <p className="text-gray-700">
                  Allows programs to view memory as a contiguous space while physical memory can be fragmented.
                </p>
              </div>
              
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h3 className="text-lg font-medium mb-3 text-yellow-700">Shared Memory</h3>
                <p className="text-gray-700">
                  Enables multiple processes to share the same physical memory for efficient communication and resource usage.
                </p>
              </div>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium mb-3">Performance Considerations</h3>
              <p className="text-gray-700 mb-4">
                While MMUs provide many benefits, they also introduce some overhead:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-gray-700">
                <li>Address translation requires additional memory accesses (TLB helps mitigate this)</li>
                <li>Page table management consumes memory resources</li>
                <li>Page faults can significantly impact performance when accessing disk</li>
              </ul>
            </div>
          </div>
        )}
      </div>
      
    </div>
  );
}
import React from 'react';
import { Link } from 'react-router-dom';

const PageReplacementTheory = () => {
  const blueColor = '#3b82f6';
  
  const algorithms = [
    {
      id: 'fifo',
      name: 'First-In-First-Out (FIFO)',
      shortDesc: 'Replaces the page that has been in memory for the longest time.',
      description: `The First-In-First-Out (FIFO) algorithm is one of the simplest page replacement policies. It treats the page frames as a queue, where the oldest page (first in) is the first candidate for replacement when a page fault occurs.`,
      advantages: [
        'Simple to understand and implement',
        'Low overhead - only requires tracking page entry order',
        'No need for usage information or access history'
      ],
      disadvantages: [
        'May remove frequently used pages simply because they are old',
        'Does not take advantage of locality of reference',
        'Subject to Belady\'s Anomaly - increasing frames can increase page faults',
        'Generally performs worse than more sophisticated algorithms'
      ],
      example: 'With reference string "1 2 3 4 1 2 5" and 3 frames, FIFO would replace page 1 when page 4 arrives, page 2 when page 5 arrives, causing 6 page faults.',
      diagram: 'fifo-diagram',
      color: 'blue'
    },
    {
      id: 'optimal',
      name: 'Optimal (OPT)',
      shortDesc: 'Replaces the page that will not be used for the longest period in the future.',
      description: `The Optimal page replacement algorithm (also known as OPT or Belady's algorithm) is a theoretical algorithm that provides the best possible page fault rate. It works by replacing the page that will not be used for the longest period in the future.`,
      advantages: [
        'Guaranteed to have the minimum possible page faults',
        'Serves as a theoretical benchmark for other algorithms',
        'Immune to Belady\'s Anomaly',
        'Makes the best use of available memory'
      ],
      disadvantages: [
        'Impossible to implement in practice as it requires future knowledge',
        'Used mainly for theoretical comparison',
        'Computationally expensive to simulate even in learning environments'
      ],
      example: 'With reference string "1 2 3 4 1 2 5" and 3 frames, OPT would replace page 3 when page 5 arrives (as 3 is not used again), causing only 5 page faults.',
      diagram: 'optimal-diagram',
      color: 'green'
    },
    {
      id: 'lru',
      name: 'Least Recently Used (LRU)',
      shortDesc: 'Replaces the page that has not been used for the longest period of time.',
      description: `The Least Recently Used (LRU) algorithm is based on the principle of temporal locality - if a page has been used recently, it's likely to be used again soon. LRU replaces the page that hasn't been accessed for the longest time when a page fault occurs.`,
      advantages: [
        'Exploits temporal locality of reference',
        'Generally performs well in practice',
        'Does not suffer from Belady\'s Anomaly',
        'Often close to optimal algorithm in performance'
      ],
      disadvantages: [
        'More complex to implement than FIFO',
        'Requires tracking the last access time for each page',
        'Can be expensive in terms of hardware requirements',
        'Pure implementations often require specialized hardware support'
      ],
      example: 'With reference string "1 2 3 4 1 2 5" and 3 frames, LRU would replace page 3 when page 1 returns, page 4 when page 5 arrives, causing 6 page faults.',
      diagram: 'lru-diagram',
      color: 'purple'
    },
    {
      id: 'lfu',
      name: 'Least Frequently Used (LFU)',
      shortDesc: 'Replaces the page with the smallest number of accesses.',
      description: `The Least Frequently Used (LFU) algorithm replaces the page that has been accessed the least number of times. It counts how often each page is referenced, and the page with the smallest count is replaced when a page fault occurs.`,
      advantages: [
        'Can work well for workloads with clear frequency patterns',
        'Takes advantage of the frequency aspect of locality',
        'Retains pages that are heavily used, even if not recently',
        'Can perform better than LRU for certain access patterns'
      ],
      disadvantages: [
        'Does not consider recency of access, only frequency',
        'May keep old, formerly popular pages too long',
        'Requires counting all references to each page',
        'Complex to implement efficiently',
        'Slow to adapt to changing access patterns'
      ],
      example: 'With reference string "1 2 3 1 2 3 4 5" and 3 frames, LFU would keep pages 1, 2, and 3 (each accessed 3 times) and replace them only when necessary.',
      diagram: 'lfu-diagram',
      color: 'orange'
    }
  ];

  // For diagrams - simple visualization of how each algorithm works
  const renderDiagram = (id) => {
    switch (id) {
      case 'fifo-diagram':
        return (
          <div className="flex flex-col items-center">
            <div className="flex space-x-2 mb-4">
              <div className="w-20 h-16 border-2 border-blue-500 rounded-lg flex items-center justify-center bg-blue-50 relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-white px-2 text-blue-600 text-xs font-bold">
                  Oldest
                </div>
                <span className="text-2xl font-bold">A</span>
              </div>
              <div className="w-20 h-16 border-2 border-blue-400 rounded-lg flex items-center justify-center bg-blue-50">
                <span className="text-2xl font-bold">B</span>
              </div>
              <div className="w-20 h-16 border-2 border-blue-300 rounded-lg flex items-center justify-center bg-blue-50 relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-white px-2 text-blue-600 text-xs font-bold">
                  Newest
                </div>
                <span className="text-2xl font-bold">C</span>
              </div>
            </div>
            <div className="flex items-center">
              <div className="h-8 w-8 bg-red-100 border border-red-400 rounded-full flex items-center justify-center">
                <span className="text-lg font-bold">D</span>
              </div>
              <div className="h-0 w-8 border-t-2 border-red-400"></div>
              <div className="text-center bg-red-50 p-2 rounded border border-red-300">
                <p className="text-sm">Page fault: D replaces A (oldest)</p>
              </div>
            </div>
          </div>
        );
      case 'optimal-diagram':
        return (
          <div className="flex flex-col items-center">
            <div className="flex space-x-2 mb-4">
              <div className="w-20 h-16 border-2 border-green-500 rounded-lg flex items-center justify-center bg-green-50 flex-col">
                <span className="text-2xl font-bold">A</span>
                <span className="text-xs">Used at t+2</span>
              </div>
              <div className="w-20 h-16 border-2 border-green-400 rounded-lg flex items-center justify-center bg-green-50 flex-col relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-white px-2 text-green-600 text-xs font-bold">
                  Not used again
                </div>
                <span className="text-2xl font-bold">B</span>
                <span className="text-xs">Not used</span>
              </div>
              <div className="w-20 h-16 border-2 border-green-300 rounded-lg flex items-center justify-center bg-green-50 flex-col">
                <span className="text-2xl font-bold">C</span>
                <span className="text-xs">Used at t+3</span>
              </div>
            </div>
            <div className="flex items-center">
              <div className="h-8 w-8 bg-red-100 border border-red-400 rounded-full flex items-center justify-center">
                <span className="text-lg font-bold">D</span>
              </div>
              <div className="h-0 w-8 border-t-2 border-red-400"></div>
              <div className="text-center bg-red-50 p-2 rounded border border-red-300">
                <p className="text-sm">Page fault: D replaces B (not used again)</p>
              </div>
            </div>
          </div>
        );
      case 'lru-diagram':
        return (
          <div className="flex flex-col items-center">
            <div className="flex space-x-2 mb-4">
              <div className="w-20 h-16 border-2 border-purple-500 rounded-lg flex items-center justify-center bg-purple-50 flex-col relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-white px-2 text-purple-600 text-xs font-bold">
                  Least Recent
                </div>
                <span className="text-2xl font-bold">A</span>
                <span className="text-xs">t-10</span>
              </div>
              <div className="w-20 h-16 border-2 border-purple-400 rounded-lg flex items-center justify-center bg-purple-50 flex-col">
                <span className="text-2xl font-bold">B</span>
                <span className="text-xs">t-5</span>
              </div>
              <div className="w-20 h-16 border-2 border-purple-300 rounded-lg flex items-center justify-center bg-purple-50 flex-col relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-white px-2 text-purple-600 text-xs font-bold">
                  Most Recent
                </div>
                <span className="text-2xl font-bold">C</span>
                <span className="text-xs">t-1</span>
              </div>
            </div>
            <div className="flex items-center">
              <div className="h-8 w-8 bg-red-100 border border-red-400 rounded-full flex items-center justify-center">
                <span className="text-lg font-bold">D</span>
              </div>
              <div className="h-0 w-8 border-t-2 border-red-400"></div>
              <div className="text-center bg-red-50 p-2 rounded border border-red-300">
                <p className="text-sm">Page fault: D replaces A (least recently used)</p>
              </div>
            </div>
          </div>
        );
      case 'lfu-diagram':
        return (
          <div className="flex flex-col items-center">
            <div className="flex space-x-2 mb-4">
              <div className="w-20 h-16 border-2 border-orange-500 rounded-lg flex items-center justify-center bg-orange-50 flex-col relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-white px-2 text-orange-600 text-xs font-bold">
                  Least Frequent
                </div>
                <span className="text-2xl font-bold">A</span>
                <span className="text-xs">Count: 1</span>
              </div>
              <div className="w-20 h-16 border-2 border-orange-400 rounded-lg flex items-center justify-center bg-orange-50 flex-col">
                <span className="text-2xl font-bold">B</span>
                <span className="text-xs">Count: 3</span>
              </div>
              <div className="w-20 h-16 border-2 border-orange-300 rounded-lg flex items-center justify-center bg-orange-50 flex-col relative">
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-white px-2 text-orange-600 text-xs font-bold">
                  Most Frequent
                </div>
                <span className="text-2xl font-bold">C</span>
                <span className="text-xs">Count: 5</span>
              </div>
            </div>
            <div className="flex items-center">
              <div className="h-8 w-8 bg-red-100 border border-red-400 rounded-full flex items-center justify-center">
                <span className="text-lg font-bold">D</span>
              </div>
              <div className="h-0 w-8 border-t-2 border-red-400"></div>
              <div className="text-center bg-red-50 p-2 rounded border border-red-300">
                <p className="text-sm">Page fault: D replaces A (least frequently used)</p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-blue-50 min-h-screen p-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">
            <span className="text-gray-800">Operating Systems</span>{" "}
            <span className="text-indigo-600">Algorithms</span>
          </h1>
          <p className="text-xl text-gray-600">
            A comprehensive collection of operating system concepts implemented as interactive modules
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Page Replacement Algorithms</h2>
          
          <div className="mb-8 bg-indigo-50 p-6 rounded-lg border border-indigo-100">
            <h3 className="text-xl font-semibold mb-4 text-indigo-800">Introduction to Page Replacement</h3>
            <p className="mb-4">
              Page replacement is a critical component of virtual memory management in operating systems. When a page fault occurs and memory is full, the operating system must decide which page to evict from memory to make room for the new page.
            </p>
            <p className="mb-4">
              The efficiency of a page replacement algorithm significantly impacts system performance. An ideal algorithm would minimize page faults and maximize memory utilization.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-medium text-lg mb-2 text-indigo-700">Key Concepts</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  <li>Page fault: occurs when a requested page is not in memory</li>
                  <li>Page frame: physical memory block that holds a page</li>
                  <li>Replacement policy: strategy to select victim pages</li>
                  <li>Locality of reference: principle that memory references cluster</li>
                  <li>Belady's Anomaly: phenomenon where increasing frames can increase faults</li>
                </ul>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-medium text-lg mb-2 text-indigo-700">Performance Metrics</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  <li>Page fault rate: percentage of memory accesses that cause page faults</li>
                  <li>Hit ratio: percentage of memory accesses found in physical memory</li>
                  <li>Memory utilization: effective use of available physical memory</li>
                  <li>Overhead: computational cost of the replacement algorithm itself</li>
                  <li>Thrashing: excessive paging activity that degrades system performance</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Algorithm Comparison</h3>
              <Link to="/page-replacement/simulation" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">
                View All Simulations
              </Link>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-4 text-left">Algorithm</th>
                    <th className="py-3 px-4 text-left">Principle</th>
                    <th className="py-3 px-4 text-left">Complexity</th>
                    <th className="py-3 px-4 text-left">Performance</th>
                    <th className="py-3 px-4 text-left">Belady's Anomaly</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="py-3 px-4">FIFO</td>
                    <td className="py-3 px-4">Replace oldest page</td>
                    <td className="py-3 px-4">O(1)</td>
                    <td className="py-3 px-4">Poor to moderate</td>
                    <td className="py-3 px-4">Yes</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">Optimal</td>
                    <td className="py-3 px-4">Replace page used farthest in future</td>
                    <td className="py-3 px-4">O(n)</td>
                    <td className="py-3 px-4">Best possible</td>
                    <td className="py-3 px-4">No</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">LRU</td>
                    <td className="py-3 px-4">Replace least recently used page</td>
                    <td className="py-3 px-4">O(1) to O(log n)</td>
                    <td className="py-3 px-4">Good</td>
                    <td className="py-3 px-4">No</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">LFU</td>
                    <td className="py-3 px-4">Replace least frequently used page</td>
                    <td className="py-3 px-4">O(log n)</td>
                    <td className="py-3 px-4">Good for static workloads</td>
                    <td className="py-3 px-4">No</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
          
          {/* Detailed Algorithm Sections */}
          {algorithms.map((algo) => (
            <div 
              key={algo.id} 
              className={`mb-12 pl-6 border-l-4`} style={{ borderColor: `${algo.color}` }}
              id={algo.id}
            >
              <h3 className={`text-2xl font-bold mb-4 text-${algo.color}-700`}>{algo.name}</h3>
              <p className="mb-6 text-lg">{algo.shortDesc}</p>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-6">
                <div>
                  <h4 className="text-xl font-semibold mb-3">How It Works</h4>
                  <p className="mb-4 text-gray-700">{algo.description}</p>
                  
                  <div className="mb-6">
                    <h5 className="font-medium text-lg mb-2">Advantages</h5>
                    <ul className="list-disc pl-5 space-y-1 text-gray-700">
                      {algo.advantages.map((adv, idx) => (
                        <li key={idx}>{adv}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-lg mb-2">Disadvantages</h5>
                    <ul className="list-disc pl-5 space-y-1 text-gray-700">
                      {algo.disadvantages.map((disadv, idx) => (
                        <li key={idx}>{disadv}</li>
                      ))}
                    </ul>
                  </div>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="text-xl font-semibold mb-4">Visual Representation</h4>
                  {renderDiagram(algo.diagram)}
                  
                  <div className="mt-6">
                    <h5 className="font-medium text-lg mb-2">Example</h5>
                    <p className="text-gray-700">{algo.example}</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-center mt-8">
                <Link 
                  to={`/page-replacement/simulation?algorithm=${algo.id}`} 
                  className="px-6 py-3 text-white rounded-lg transition flex items-center"
                  style={{ backgroundColor: algo.color }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                  </svg>
                  Try {algo.name} Simulation
                </Link>
              </div>
            </div>
          ))}

            <div className="mt-12 text-center">
              <Link
                to="/page-replacement/simulation"
                className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition text-lg font-medium"
              >
                View All Simulations
              </Link>
            </div>

          
          {/* Further Reading */}
          <div className="p-6 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-xl font-bold mb-4">Further Reading</h3>
            <p className="mb-4">
              Page replacement is a rich area of study in operating systems research. Below are some related topics to explore:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-white rounded shadow-sm">
                <h4 className="font-medium mb-2">Advanced Algorithms</h4>
                <ul className="list-disc pl-5 text-gray-700">
                  <li>Clock Algorithm (Second Chance)</li>
                  <li>Working Set Model</li>
                  <li>WSClock Algorithm</li>
                  <li>Page Buffering</li>
                  <li>Adaptive Replacement Cache (ARC)</li>
                </ul>
              </div>
              <div className="p-4 bg-white rounded shadow-sm">
                <h4 className="font-medium mb-2">Related OS Concepts</h4>
                <ul className="list-disc pl-5 text-gray-700">
                  <li>Virtual Memory Management</li>
                  <li>Page Tables and TLB</li>
                  <li>Demand Paging</li>
                  <li>Thrashing Prevention</li>
                  <li>Memory-Mapped Files</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center text-gray-600 text-sm">
          <p>Operating Systems Algorithms - Page Replacement Theory Module</p>
        </div>
      </div>
    </div>
  );
};

export default PageReplacementTheory;
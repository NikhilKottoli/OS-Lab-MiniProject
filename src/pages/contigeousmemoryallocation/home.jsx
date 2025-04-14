import React from "react";
import { Link } from "react-router-dom";

const MemoryAllocationCard = ({ title, description, details, icon, color, to }) => (
  <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow border-t-4" style={{ borderColor: color }}>
    <div className="flex items-start mb-4">
      <div className="p-3 rounded-full" style={{ backgroundColor: `${color}20` }}>
        {icon}
      </div>
      <div className="ml-4">
        <h3 className="font-bold text-xl mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
    
    <div className="mb-5">
      <h4 className="font-medium text-lg mb-2 text-gray-700">How it Works:</h4>
      <p className="text-gray-600 mb-3">{details.howItWorks}</p>
      
      <div className="grid grid-cols-1 gap-4">
        <div>
          <h5 className="font-medium mb-1 text-gray-700">Advantages:</h5>
          <ul className="list-disc pl-5 text-gray-600">
            {details.advantages.map((adv, i) => (
              <li key={i}>{adv}</li>
            ))}
          </ul>
        </div>
        
        <div>
          <h5 className="font-medium mb-1 text-gray-700">Disadvantages:</h5>
          <ul className="list-disc pl-5 text-gray-600">
            {details.disadvantages.map((disadv, i) => (
              <li key={i}>{disadv}</li>
            ))}
          </ul>
        </div>
        
        <div>
          <h5 className="font-medium mb-1 text-gray-700">Use Cases:</h5>
          <p className="text-gray-600">{details.useCases}</p>
        </div>
      </div>
    </div>
    
    <div className="text-center">
      <Link 
        to={to} 
        className="inline-flex items-center px-6 py-2 rounded-lg text-white transition-colors bg-indigo-600 hover:bg-indigo-700"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
        </svg>
        Try Simulation
      </Link>
    </div>
  </div>
);

export default function MemoryAllocationHomepage() {
  const algorithms = [
    {
      title: "First Fit Algorithm",
      description: "Allocates the first memory block that is large enough to accommodate a process.",
      details: {
        howItWorks: "First Fit scans the memory from the beginning and allocates the first block that is large enough to satisfy the request. When it finds a suitable block, it immediately allocates it without searching the entire memory space for a potentially better fit.",
        advantages: [
          "Simple implementation with minimal overhead",
          "Fast allocation as it stops searching once the first suitable block is found",
          "Works well for general-purpose applications with varied allocation sizes",
          "Generally performs better than Best Fit for average case scenarios"
        ],
        disadvantages: [
          "Can lead to external fragmentation, especially at the start of memory",
          "May leave many small unusable gaps throughout memory",
          "Performance degrades as memory becomes fragmented over time",
          "Early blocks in memory get checked more frequently, potentially causing uneven wear"
        ],
        useCases: "First Fit is ideal for systems where allocation speed is more important than memory utilization efficiency, such as embedded systems with limited processing power or real-time operating systems with strict timing constraints."
      },
      color: "#3b82f6",
      to: "/memory-allocation/first-fit",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="#3b82f6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
      )
    },
    {
      title: "Best Fit Algorithm",
      description: "Allocates the smallest memory block that can accommodate a process.",
      details: {
        howItWorks: "Best Fit examines all free blocks and selects the one that is closest in size to the requested allocation. It aims to minimize wasted space by finding the most precise fit, even if it means scanning the entire memory space for each allocation.",
        advantages: [
          "Minimizes internal fragmentation by finding the closest size match",
          "Conserves larger blocks for processes that require them",
          "Generally achieves better memory utilization than First Fit",
          "Reduces wastage within allocated blocks"
        ],
        disadvantages: [
          "Slower allocation as it must examine all available blocks before deciding",
          "Creates many small, unusable fragments throughout memory",
          "These tiny fragments often become unusable for future allocations",
          "Implementation requires more complex data structures to track and compare block sizes"
        ],
        useCases: "Best Fit is particularly useful in environments where memory is limited and utilization efficiency is prioritized over allocation speed, such as large server systems running multiple applications or embedded systems with constrained memory resources."
      },
      color: "#10b981",
      to: "/memory-allocation/best-fit",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="#10b981">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    {
      title: "Worst Fit Algorithm",
      description: "Allocates the largest memory block available for a process.",
      details: {
        howItWorks: "Worst Fit searches the entire memory space and allocates the largest available block for each request. After allocation, it splits the block and returns the remainder to the free list, with the goal of leaving behind fragments large enough to be useful for future allocations.",
        advantages: [
          "Leaves behind larger remaining fragments that are more likely to be useful",
          "Reduces the likelihood of having many tiny unusable fragments",
          "Works well when process sizes vary significantly",
          "Can perform better than Best Fit in scenarios with frequent allocation and deallocation"
        ],
        disadvantages: [
          "Rapidly depletes large blocks of memory",
          "Often has poor memory utilization for smaller processes",
          "Like Best Fit, it requires scanning all blocks before allocation",
          "Performance degrades when many processes of similar size are allocated"
        ],
        useCases: "Worst Fit is beneficial in dynamic environments where process sizes are unpredictable and highly variable, or in systems where large processes are infrequent but must be accommodated when they arrive."
      },
      color: "#f59e0b",
      to: "/memory-allocation/worst-fit",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="#f59e0b">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      )
    },
    {
      title: "Next Fit Algorithm",
      description: "Similar to First Fit but starts searching from the last allocated position.",
      details: {
        howItWorks: "Next Fit is a variation of First Fit that maintains a pointer to the location where the previous search ended. When a new allocation request arrives, it begins searching from this position rather than always starting from the beginning of memory, effectively treating the memory as a circular buffer.",
        advantages: [
          "More uniform memory usage compared to First Fit",
          "Faster allocation than First Fit in many scenarios",
          "Reduces the 'clustering' problem at the start of memory",
          "Distributes allocations more evenly across the entire memory space"
        ],
        disadvantages: [
          "May skip optimal blocks if they are before the current position",
          "Can still lead to significant external fragmentation",
          "Slightly more complex to implement than First Fit",
          "May perform worse than First Fit in certain workload patterns"
        ],
        useCases: "Next Fit is well-suited for systems with frequent allocations and deallocations where memory access patterns benefit from distributing the allocations throughout memory, such as multitasking operating systems or long-running server applications."
      },
      color: "#8b5cf6",
      to: "/memory-allocation/next-fit",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="#8b5cf6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    },
    {
      title: "Buddy Fit Algorithm",
      description: "Allocates memory blocks in power-of-two sizes for efficient merging.",
      details: {
        howItWorks: "The Buddy System divides memory into partitions that are powers of two in size. When allocating, it finds the smallest power of two that is large enough to satisfy the request. If no block of that size is available, it splits larger blocks recursively. When freeing memory, it checks if the 'buddy' block is also free and merges them back together.",
        advantages: [
          "Efficient merging of free blocks due to power-of-two sizes",
          "Fast allocation and deallocation operations",
          "Reduces external fragmentation through buddy merging",
          "Simple implementation using binary trees or arrays"
        ],
        disadvantages: [
          "Can suffer from significant internal fragmentation (up to 50%)",
          "Not suitable for systems with many small allocations",
          "Requires memory sizes to be powers of two",
          "May waste space when allocation sizes don't match block sizes"
        ],
        useCases: "Buddy System is commonly used in kernel memory allocation and in systems where fast allocation/deallocation is more important than perfect memory utilization, such as in graphics processing or network buffer management."
      },
      color: "#ec4899",
      to: "/memory-allocation/buddy-fit",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="#ec4899">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      )
    },
    {
      title: "Quick Fit Algorithm",
      description: "Uses pre-defined size classes for faster allocation.",
      details: {
        howItWorks: "Quick Fit maintains separate free lists for commonly requested sizes. When an allocation request arrives, it first checks if the request matches one of the predefined size classes. If so, it allocates from that list directly. Otherwise, it falls back to a standard allocation strategy like First Fit.",
        advantages: [
          "Extremely fast for common allocation sizes",
          "Reduces search time for frequent allocation patterns",
          "Can be combined with other allocation strategies",
          "Good for systems with predictable allocation sizes"
        ],
        disadvantages: [
          "Requires knowledge of common allocation sizes in advance",
          "Inefficient for uncommon allocation sizes",
          "Can lead to fragmentation if size classes are poorly chosen",
          "Requires additional memory to maintain multiple free lists"
        ],
        useCases: "Quick Fit is ideal for systems with known, predictable allocation patterns such as database systems, web servers handling requests of standard sizes, or any application where most allocations fall into a few common size categories."
      },
      color: "#14b8a6",
      to: "/memory-allocation/quick-fit",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="#14b8a6">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4">
            <span className="text-gray-800">Operating Systems</span>{" "}
            <span className="text-indigo-600">Algorithms</span>
          </h1>
          <p className="text-xl text-gray-600">
            Interactive simulations of contiguous memory allocation algorithms
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Contiguous Memory Allocation</h2>
          
          <div className="mb-8 bg-indigo-50 p-6 rounded-lg border border-indigo-100">
            <h3 className="text-xl font-semibold mb-4 text-indigo-800">Introduction to Memory Allocation</h3>
            <p className="mb-4">
              Contiguous memory allocation is a fundamental memory management technique in operating systems. It involves allocating a contiguous block of memory to a process based on specific strategies.
            </p>
            <p className="mb-4">
              The efficiency of memory allocation significantly impacts system performance, affecting how well memory resources are utilized and how processes are managed.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-medium text-lg mb-2 text-indigo-700">Key Concepts</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  <li>Memory Block: Contiguous region of memory available for allocation</li>
                  <li>Process Size: Amount of memory required by a process</li>
                  <li>Allocation Strategy: Method to decide which block to allocate</li>
                  <li>Internal Fragmentation: Unused memory within an allocated block</li>
                  <li>External Fragmentation: Total free memory split into unusable small chunks</li>
                </ul>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-medium text-lg mb-2 text-indigo-700">Performance Metrics</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  <li>Memory Utilization: Percentage of allocated memory being used</li>
                  <li>Allocation Success Rate: Percentage of processes successfully allocated</li>
                  <li>Fragmentation Level: Amount of memory wasted due to fragmentation</li>
                  <li>Allocation Speed: Time taken to find and assign memory blocks</li>
                  <li>Search Overhead: Computational cost of finding suitable blocks</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mb-12">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold text-gray-800">Algorithm Comparison</h3>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white rounded-lg overflow-hidden">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="py-3 px-4 text-left">Algorithm</th>
                    <th className="py-3 px-4 text-left">Principle</th>
                    <th className="py-3 px-4 text-left">Complexity</th>
                    <th className="py-3 px-4 text-left">Advantages</th>
                    <th className="py-3 px-4 text-left">Disadvantages</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="py-3 px-4">First Fit</td>
                    <td className="py-3 px-4">First big enough block</td>
                    <td className="py-3 px-4">O(n)</td>
                    <td className="py-3 px-4">Simple, fast</td>
                    <td className="py-3 px-4">May create small fragments at beginning</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">Best Fit</td>
                    <td className="py-3 px-4">Smallest sufficient block</td>
                    <td className="py-3 px-4">O(n)</td>
                    <td className="py-3 px-4">Reduces internal fragmentation</td>
                    <td className="py-3 px-4">Creates tiny unusable fragments</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">Worst Fit</td>
                    <td className="py-3 px-4">Largest available block</td>
                    <td className="py-3 px-4">O(n)</td>
                    <td className="py-3 px-4">Leaves usable remainders</td>
                    <td className="py-3 px-4">Uses large blocks inefficiently</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">Next Fit</td>
                    <td className="py-3 px-4">First fit from last position</td>
                    <td className="py-3 px-4">O(n)</td>
                    <td className="py-3 px-4">More uniform memory usage</td>
                    <td className="py-3 px-4">Can skip optimal blocks</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">Buddy Fit</td>
                    <td className="py-3 px-4">Power-of-two block sizes</td>
                    <td className="py-3 px-4">O(log n)</td>
                    <td className="py-3 px-4">Fast merging of free blocks</td>
                    <td className="py-3 px-4">High internal fragmentation</td>
                  </tr>
                  <tr>
                    <td className="py-3 px-4">Quick Fit</td>
                    <td className="py-3 px-4">Predefined size classes</td>
                    <td className="py-3 px-4">O(1) for common sizes</td>
                    <td className="py-3 px-4">Very fast for common sizes</td>
                    <td className="py-3 px-4">Inefficient for uncommon sizes</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {algorithms.map((algo, index) => (
              <MemoryAllocationCard 
                key={index}
                title={algo.title}
                description={algo.description}
                details={algo.details}
                color={algo.color}
                to={algo.to}
                icon={algo.icon}
              />
            ))}
          </div>

          {/* Fragmentation Management Techniques */}
          <div className="mt-12 p-6 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-xl font-bold mb-4">Fragmentation Management Techniques</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-lg mb-3">Hole Merging (Coalescing)</h4>
                <p className="mb-3 text-gray-700">
                  Hole merging combines adjacent free memory blocks into larger contiguous blocks. This helps reduce external fragmentation by creating larger usable memory regions.
                </p>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  <li><strong>Immediate Merging:</strong> Merge adjacent holes whenever a block is freed</li>
                  <li><strong>Deferred Merging:</strong> Merge holes periodically or when needed</li>
                  <li><strong>Advantages:</strong> Simple to implement, reduces external fragmentation</li>
                  <li><strong>Limitations:</strong> Doesn't help if free blocks aren't adjacent</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium text-lg mb-3">Memory Compaction</h4>
                <p className="mb-3 text-gray-700">
                  Compaction moves all allocated memory blocks to one end of memory, creating one large contiguous free block. This eliminates external fragmentation completely.
                </p>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  <li><strong>Full Compaction:</strong> Moves all processes to one end</li>
                  <li><strong>Partial Compaction:</strong> Only moves some processes to create larger blocks</li>
                  <li><strong>Advantages:</strong> Completely eliminates external fragmentation</li>
                  <li><strong>Limitations:</strong> Requires process relocation, can be expensive</li>
                </ul>
              </div>
            </div>
            <div className="mt-6 bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-medium text-lg mb-2 text-indigo-700">Comparison of Techniques</h4>
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="py-2 px-4 text-left">Feature</th>
                    <th className="py-2 px-4 text-left">Hole Merging</th>
                    <th className="py-2 px-4 text-left">Compaction</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 px-4">Complexity</td>
                    <td className="py-2 px-4">Low (O(1) per merge)</td>
                    <td className="py-2 px-4">High (O(n) for full compaction)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-4">Effectiveness</td>
                    <td className="py-2 px-4">Partial (only adjacent blocks)</td>
                    <td className="py-2 px-4">Complete (eliminates all external fragmentation)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-4">Overhead</td>
                    <td className="py-2 px-4">Minimal</td>
                    <td className="py-2 px-4">Significant (requires moving processes)</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-4">When to Use</td>
                    <td className="py-2 px-4">Always (low cost, some benefit)</td>
                    <td className="py-2 px-4">When severe fragmentation occurs</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* How Memory Allocation Works */}
          <div className="mt-6 p-6 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-xl font-bold mb-4">How Memory Allocation Works</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium text-lg mb-3">Allocation Process</h4>
                <ol className="list-decimal pl-5 space-y-2 text-gray-700">
                  <li>The operating system maintains a list of free and allocated memory blocks</li>
                  <li>When a process requests memory, the OS checks if there's a suitable block</li>
                  <li>Based on the allocation algorithm, a specific block is selected</li>
                  <li>The block is split if it's larger than needed, with the remainder returned to the free list</li>
                  <li>When a process terminates, its memory is returned to the free list</li>
                </ol>
              </div>
              <div>
                <h4 className="font-medium text-lg mb-3">Fragmentation Issues</h4>
                <p className="mb-3 text-gray-700">
                  <strong>Internal Fragmentation:</strong> Occurs when allocated memory is slightly larger than requested, resulting in wasted space within allocated regions.
                </p>
                <p className="mb-3 text-gray-700">
                  <strong>External Fragmentation:</strong> Occurs when free memory is divided into small pieces, making it impossible to allocate contiguous blocks for large processes despite having enough total free memory.
                </p>
                <p className="text-gray-700">
                  Memory compaction and garbage collection are techniques used to combat fragmentation problems, though they introduce overhead.
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-6 bg-indigo-50 rounded-lg border border-indigo-100">
            <h3 className="text-xl font-semibold mb-4 text-indigo-800">Memory Allocation in Modern Systems</h3>
            <p className="mb-4">
              While these fundamental algorithms form the basis of memory management, modern operating systems implement more sophisticated variations and hybrid approaches to address the limitations of basic contiguous allocation.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-medium text-lg mb-2 text-indigo-700">Advanced Techniques</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  <li><strong>Buddy System:</strong> Memory blocks are split into buddies of equal size, simplifying allocation and recombination</li>
                  <li><strong>Slab Allocation:</strong> Pre-allocates memory for objects of specific sizes, reducing fragmentation</li>
                  <li><strong>Segregated Free Lists:</strong> Maintains separate lists for different sized blocks</li>
                  <li><strong>Memory Pools:</strong> Dedicated regions for specific purposes to improve locality</li>
                  <li><strong>Compaction:</strong> Periodically rearranges memory to eliminate external fragmentation</li>
                </ul>
              </div>
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-medium text-lg mb-2 text-indigo-700">Real-World Considerations</h4>
                <ul className="list-disc pl-5 space-y-1 text-gray-700">
                  <li>Most modern systems use virtual memory with paging rather than pure contiguous allocation</li>
                  <li>Allocation algorithms must balance between time efficiency and space efficiency</li>
                  <li>Memory hierarchies (cache, RAM, disk) add complexity to allocation decisions</li>
                  <li>NUMA architectures require consideration of memory location relative to processors</li>
                  <li>Garbage collection in managed languages introduces different allocation challenges</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        
        <div className="text-center text-gray-600 text-sm">
          <p>Operating Systems Algorithms - Contiguous Memory Allocation Module</p>
        </div>
      </div>
    </div>
  );
}
import React from 'react';
import { useNavigate } from 'react-router-dom';

const DeadlockHomepage = () => {
  
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      
      <header className="max-w-4xl mx-auto mb-12">
        <div className="bg-indigo-900 rounded-lg shadow-lg p-8 text-white text-center">
          <h1 className="text-4xl font-bold mb-2">Understanding Deadlocks</h1>
          <p className="text-xl">Resource Allocation and Process Management</p>
        </div>
      </header>

      
      <main className="max-w-4xl mx-auto">
      
        <section className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-indigo-900">What is a Deadlock?</h2>
          <p className="mb-4">
            A deadlock is a situation in which two or more competing actions are waiting for the other to finish, 
            and thus neither ever does. In an operating system, a deadlock occurs when a process or thread enters 
            a waiting state because a requested system resource is held by another waiting process, which in turn 
            is waiting for another resource held by another waiting process.
          </p>
          <p>
            Four conditions must be present for a deadlock to occur: Mutual Exclusion, Hold and Wait, No Preemption, 
            and Circular Wait. The Banker's Algorithm is a resource allocation and deadlock avoidance algorithm that 
            tests for safety by simulating the allocation of predetermined maximum possible amounts of all resources.
          </p>
        </section>

        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
         
          <div 
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition hover:scale-105"
            onClick={() => navigate('/avoidance')}
          >
            <div className="bg-green-600 p-4">
              <h3 className="text-xl font-bold text-white">Deadlock Avoidance</h3>
            </div>
            <div className="p-6">
              <p className="mb-4">
                Deadlock avoidance requires additional information about how resources are going to be requested,
                using the Banker's Algorithm to determine if a state is safe or unsafe.
              </p>
              <ul className="list-disc pl-5 mb-4">
                <li>Prevents deadlocks before they occur</li>
                <li>Uses resource allocation state to make safe decisions</li>
                <li>Requires knowing maximum resource needs in advance</li>
              </ul>
              <div className="mt-4 text-green-700 font-semibold flex items-center justify-between">
                <span>Try Avoidance Simulator</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>

          
          <div 
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition hover:scale-105"
            onClick={() => navigate('/detection')}
          >
            <div className="bg-blue-600 p-4">
              <h3 className="text-xl font-bold text-white">Deadlock Detection</h3>
            </div>
            <div className="p-6">
              <p className="mb-4">
                Deadlock detection involves examining the state of the system to determine whether a deadlock 
                has occurred and identifying the processes and resources involved in the deadlock.
              </p>
              <ul className="list-disc pl-5 mb-4">
                <li>Identifies existing deadlocks in the system</li>
                <li>Uses resource allocation graph or matrix algorithms</li>
                <li>Can be followed by recovery mechanisms</li>
              </ul>
              <div className="mt-4 text-blue-700 font-semibold flex items-center justify-between">
                <span>Try Detection Simulator</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        
        <section className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold mb-4 text-indigo-900">The Banker's Algorithm</h2>
          <p className="mb-4">
            The Banker's Algorithm is a resource allocation and deadlock avoidance algorithm developed by Edsger Dijkstra. 
            It tests for safety by simulating the allocation of predetermined maximum possible amounts of all resources.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold text-lg mb-2 text-indigo-800">Data Structures Used:</h3>
              <ul className="list-disc pl-5">
                <li>Available: Vector of available resources</li>
                <li>Max: Matrix defining maximum demand of each process</li>
                <li>Allocation: Matrix defining resources allocated to each process</li>
                <li>Need: Matrix indicating remaining resource needs</li>
              </ul>
            </div>
            
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-bold text-lg mb-2 text-indigo-800">Algorithm Steps:</h3>
              <ol className="list-decimal pl-5">
                <li>Initialize the system state</li>
                <li>Check if request can be granted</li>
                <li>Modify state temporarily</li>
                <li>Run safety algorithm</li>
                <li>If safe, allocate resources</li>
                <li>If unsafe, revert to previous state</li>
              </ol>
            </div>
          </div>
        </section>
      </main>

      
      <footer className="max-w-4xl mx-auto mt-12 text-center text-gray-600">
        <p>© 2025 Deadlock Simulator - Operating Systems Educational Tool</p>
      </footer>
    </div>
  );
};

export default DeadlockHomepage;
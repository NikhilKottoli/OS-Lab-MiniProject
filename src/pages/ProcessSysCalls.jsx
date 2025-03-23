import React, { useState, useEffect } from 'react';
import { Play, GitFork, Clock, LogOut } from 'lucide-react';

const ProcessSystemCalls = () => {
  const [processes, setProcesses] = useState([
    { id: 1, name: 'Parent Process', status: 'running', command: null, children: [], exitCode: null }
  ]);
  const [activeCall, setActiveCall] = useState(null);
  const [selectedProcess, setSelectedProcess] = useState(1);
  const [nextId, setNextId] = useState(2);
  const [animation, setAnimation] = useState('');
  const [log, setLog] = useState(['System started. Parent process is running.']);
  
  const systemCalls = [
    { 
      name: 'execl()', 
      id: 'execl', 
      description: 'Replaces current process image with a new one', 
      icon: <Play size={20} />, 
      color: 'bg-green-500' 
    },
    { 
      name: 'fork()', 
      id: 'fork', 
      description: 'Creates a new process (child) by duplicating the parent process', 
      icon: <GitFork size={20} />, 
      color: 'bg-blue-500' 
    },
    { 
      name: 'wait()', 
      id: 'wait', 
      description: 'Parent process waits for child process to terminate', 
      icon: <Clock size={20} />, 
      color: 'bg-purple-500' 
    },
    { 
      name: 'exit()', 
      id: 'exit', 
      description: 'Terminates the current process', 
      icon: <LogOut size={20} />, 
      color: 'bg-red-500' 
    }
  ];
  
  const commands = [
    'ls -la', 
    'echo "Hello World"', 
    'cat /etc/passwd', 
    'ps aux'
  ];
  
  useEffect(() => {
    if (animation) {
      const timer = setTimeout(() => {
        setAnimation('');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [animation]);
  
  const addLogEntry = (entry) => {
    setLog(prevLog => [...prevLog, entry]);
  };
  
  const handleCallClick = (callId) => {
    setActiveCall(callId);
    setAnimation(`animate-pulse`);
    
    // Handle different system calls
    switch(callId) {
      case 'execl':
        handleExecl();
        break;
      case 'fork':
        handleFork();
        break;
      case 'wait':
        handleWait();
        break;
      case 'exit':
        handleExit();
        break;
      default:
        break;
    }
  };
  
  const handleExecl = () => {
    const process = processes.find(p => p.id === selectedProcess);
    if (process && process.status === 'running') {
      const randomCommand = commands[Math.floor(Math.random() * commands.length)];
      setProcesses(prevProcesses => 
        prevProcesses.map(p => 
          p.id === selectedProcess 
            ? { ...p, command: randomCommand } 
            : p
        )
      );
      addLogEntry(`Process ${selectedProcess} executed new command: ${randomCommand}`);
    } else {
      addLogEntry(`Cannot execute: Process ${selectedProcess} is not running`);
    }
  };
  
  const handleFork = () => {
    const parentProcess = processes.find(p => p.id === selectedProcess);
    if (parentProcess && parentProcess.status === 'running') {
      const childId = nextId;
      setNextId(prev => prev + 1);
      
      const childProcess = {
        id: childId,
        name: `Child of ${parentProcess.name}`,
        status: 'running',
        command: parentProcess.command,
        children: [],
        parent: parentProcess.id,
        exitCode: null
      };
      
      setProcesses(prevProcesses => [
        ...prevProcesses.map(p => 
          p.id === selectedProcess 
            ? { ...p, children: [...p.children, childId] } 
            : p
        ),
        childProcess
      ]);
      
      addLogEntry(`Process ${selectedProcess} forked a new child process with PID ${childId}`);
    } else {
      addLogEntry(`Cannot fork: Process ${selectedProcess} is not running`);
    }
  };
  
  const handleWait = () => {
    const process = processes.find(p => p.id === selectedProcess);
    if (process && process.status === 'running' && process.children.length > 0) {
      setProcesses(prevProcesses => 
        prevProcesses.map(p => 
          p.id === selectedProcess 
            ? { ...p, status: 'waiting' } 
            : p
        )
      );
      addLogEntry(`Process ${selectedProcess} is now waiting for children to terminate`);
    } else {
      addLogEntry(`Cannot wait: Process ${selectedProcess} has no running children or is not running itself`);
    }
  };
  
  const handleExit = () => {
    const process = processes.find(p => p.id === selectedProcess);
    if (process && process.status !== 'terminated') {
      const exitCodes = [0, 0, 0, 1, 2, 127, 134, 139, 255];
      const exitCode = exitCodes[Math.floor(Math.random() * exitCodes.length)];
      
      setProcesses(prevProcesses => 
        prevProcesses.map(p => {
          if (p.id === selectedProcess) {
            return { ...p, status: 'terminated', exitCode };
          } else if (p.id === process.parent && p.status === 'waiting') {
            // If parent was waiting, it can continue running
            return { ...p, status: 'running' };
          }
          return p;
        })
      );
      
      addLogEntry(`Process ${selectedProcess} terminated with exit code ${exitCode}`);
      
      if (process.parent) {
        setSelectedProcess(process.parent);
      } else if (processes.filter(p => p.status === 'running').length > 0) {
        // Otherwise select any running process
        const runningProcess = processes.find(p => p.status === 'running' && p.id !== selectedProcess);
        if (runningProcess) {
          setSelectedProcess(runningProcess.id);
        }
      }
    } else {
      addLogEntry(`Process ${selectedProcess} is already terminated`);
    }
  };
  
  const getProcessStatusColor = (status) => {
    switch(status) {
      case 'running':
        return 'bg-green-100 border-green-500';
      case 'waiting':
        return 'bg-yellow-100 border-yellow-500';
      case 'terminated':
        return 'bg-red-100 border-red-500';
      default:
        return 'bg-gray-100 border-gray-500';
    }
  };
  
  const isCallAllowed = (callId, process) => {
    if (!process || process.status === 'terminated') {
      return false;
    }
    
    if (callId === 'wait' && (process.children.length === 0 || 
        !processes.some(p => process.children.includes(p.id) && p.status !== 'terminated'))) {
      return false;
    }
    
    return true;
  };

  return (
    <div className="flex flex-col items-center p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">Process-Related System Calls</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8 w-full">
        {systemCalls.map((call) => {
          const currentProcess = processes.find(p => p.id === selectedProcess);
          const isAllowed = isCallAllowed(call.id, currentProcess);
          
          return (
            <button
              key={call.id}
              onClick={() => handleCallClick(call.id)}
              className={`${call.color} text-white p-4 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 
                ${activeCall === call.id ? 'ring-4 ring-opacity-50 ring-white' : ''} 
                ${!isAllowed ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={!isAllowed}
            >
              <div className="flex flex-col items-center">
                <div className="text-2xl mb-2">{call.icon}</div>
                <div className="font-bold">{call.name}</div>
                <div className="text-xs mt-2 text-center">{call.description}</div>
              </div>
            </button>
          );
        })}
      </div>
      
      <div className="w-full flex flex-col md:flex-row gap-6">
        {/* Process Tree Visualization */}
        <div className="w-full md:w-1/2 p-4 border rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">Process Tree</h2>
          
          <div className="overflow-auto max-h-96">
            {processes.map((process) => (
              <div 
                key={process.id} 
                className={`p-3 my-2 border-2 rounded-lg cursor-pointer transition-all duration-300 ${
                  getProcessStatusColor(process.status)
                } ${
                  selectedProcess === process.id ? 'ring-4 ring-blue-400' : ''
                } ${animation && selectedProcess === process.id ? animation : ''}`}
                onClick={() => process.status !== 'terminated' && setSelectedProcess(process.id)}
                style={{ marginLeft: process.parent ? '2rem' : '0' }}
              >
                <div className="flex justify-between items-center">
                  <div>
                    <span className="font-bold">PID: {process.id}</span> - {process.name}
                  </div>
                  <div className="text-xs px-2 py-1 rounded bg-white">
                    {process.status.toUpperCase()}
                  </div>
                </div>
                
                {process.command && (
                  <div className="mt-2 text-sm bg-black text-green-400 p-2 rounded">
                    $ {process.command}
                  </div>
                )}
                
                {process.exitCode !== null && (
                  <div className="mt-2 text-sm">
                    Exit Code: <span className={process.exitCode === 0 ? 'text-green-600' : 'text-red-600'}>
                      {process.exitCode}
                    </span>
                  </div>
                )}
                
                {process.children.length > 0 && (
                  <div className="mt-2 text-sm">
                    Children: {process.children.join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        <div className="w-full md:w-1/2 p-4 border rounded-lg shadow-md">
          <h2 className="text-xl font-bold mb-4">System Log</h2>
          
          <div className="bg-black text-green-400 p-4 rounded-lg font-mono text-sm h-96 overflow-auto">
            {log.map((entry, index) => (
              <div key={index} className="mb-1 flex gap-2">
                <span className="text-gray-500">[{index}]</span> <p className='text-white'>{entry}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-gray-100 rounded-lg w-full">
        <h2 className="text-xl font-bold mb-2">System Calls Explained:</h2>
        <ul className="space-y-2">
          <li><span className="font-bold text-green-500">execl()</span> - Replaces the current process image with a new program. In our visualization, this changes the command a process is running.</li>
          <li><span className="font-bold text-blue-500">fork()</span> - Creates a child process by duplicating the calling process. The child is an exact copy of the parent initially.</li>
          <li><span className="font-bold text-purple-500">wait()</span> - Suspends the calling process until one of its children terminates. The parent process will change to "waiting" status.</li>
          <li><span className="font-bold text-red-500">exit()</span> - Terminates the calling process and returns an exit code to the parent process. If the parent was waiting, it will resume execution.</li>
        </ul>
        
        <div className="mt-4 text-sm text-gray-600">
          <p><strong>How to use:</strong> Click on a process in the tree to select it, then use the system call buttons to perform operations. The system log shows the history of actions.</p>
        </div>
      </div>
    </div>
  );
};

export default ProcessSystemCalls;
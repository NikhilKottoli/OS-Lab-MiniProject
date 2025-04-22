import React, { useState, useEffect } from 'react';
import { Play, GitFork, Clock, LogOut } from 'lucide-react';

const ProcessSystemCalls = () => {
  const [processes, setProcesses] = useState([
    { id: 1, name: 'Parent Process', status: 'running', command: null, children: [], exitCode: null }
  ]);
  const [activeCall, setActiveCall] = useState(null);
  const [selectedProcess, setSelectedProcess] = useState(1);
  const [nextId, setNextId] = useState(2);
  const [log, setLog] = useState(['System started. Parent process is running.']);
  
  const systemCalls = [
    { 
      name: 'execl()', 
      id: 'execl', 
      description: 'Replaces current process with a new one', 
      icon: <Play size={18} />
    },
    { 
      name: 'fork()', 
      id: 'fork', 
      description: 'Creates a child process by duplicating the parent', 
      icon: <GitFork size={18} />
    },
    { 
      name: 'wait()', 
      id: 'wait', 
      description: 'Parent waits for child to terminate', 
      icon: <Clock size={18} />
    },
    { 
      name: 'exit()', 
      id: 'exit', 
      description: 'Terminates the current process', 
      icon: <LogOut size={18} />
    }
  ];
  
  const commands = [
    'gcc main.c -o main', 
    'echo "Hello World"', 
    'cat /etc/passwd', 
    'ps aux'
  ];
  
  const addLogEntry = (entry) => {
    setLog(prevLog => [...prevLog, entry]);
  };
  
  const handleCallClick = (callId) => {
    setActiveCall(callId);
    
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
    
    setTimeout(() => {
      setActiveCall(null);
    }, 500);
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
        return 'bg-green-100';
      case 'waiting':
        return 'bg-yellow-100';
      case 'terminated':
        return 'bg-red-100';
      default:
        return 'bg-gray-100';
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
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Process System Calls</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {systemCalls.map((call) => {
          const currentProcess = processes.find(p => p.id === selectedProcess);
          const isAllowed = isCallAllowed(call.id, currentProcess);
          
          let buttonColor;
          switch(call.id) {
            case 'execl': buttonColor = 'bg-green-500'; break;
            case 'fork': buttonColor = 'bg-blue-500'; break;
            case 'wait': buttonColor = 'bg-purple-500'; break;
            case 'exit': buttonColor = 'bg-red-500'; break;
            default: buttonColor = 'bg-gray-500';
          }
          
          return (
            <button
              key={call.id}
              onClick={() => handleCallClick(call.id)}
              className={`${buttonColor} text-white p-3 rounded ${activeCall === call.id ? 'ring-2' : ''} ${!isAllowed ? 'opacity-50' : ''}`}
              disabled={!isAllowed}
            >
              <div className="flex flex-col items-center">
                <div className="mb-1">{call.icon}</div>
                <div className="font-bold text-sm">{call.name}</div>
                <div className="text-xs mt-1 text-center">{call.description}</div>
              </div>
            </button>
          );
        })}
      </div>
      
      <div className="flex flex-col md:flex-row gap-4">
        {/* Process Tree */}
        <div className="w-full md:w-1/2 border p-3 rounded">
          <h2 className="text-lg font-bold mb-3">Process Tree</h2>
          
          <div className="overflow-auto max-h-80">
            {processes.map((process) => (
              <div 
                key={process.id} 
                className={`p-2 my-1 border rounded cursor-pointer ${
                  getProcessStatusColor(process.status)
                } ${
                  selectedProcess === process.id ? 'border-2 border-blue-500' : ''
                }`}
                onClick={() => process.status !== 'terminated' && setSelectedProcess(process.id)}
                style={{ marginLeft: process.parent ? '1.5rem' : '0' }}
              >
                <div className="flex justify-between">
                  <div>
                    <span className="font-bold">PID: {process.id}</span> - {process.name}
                  </div>
                  <div className="text-xs px-1 py-0.5 bg-white rounded">
                    {process.status}
                  </div>
                </div>
                
                {process.command && (
                  <div className="mt-1 text-sm bg-black text-green-400 p-1 rounded">
                    $ {process.command}
                  </div>
                )}
                
                {process.exitCode !== null && (
                  <div className="mt-1 text-sm">
                    Exit Code: <span className={process.exitCode === 0 ? 'text-green-600' : 'text-red-600'}>
                      {process.exitCode}
                    </span>
                  </div>
                )}
                
                {process.children.length > 0 && (
                  <div className="mt-1 text-sm">
                    Children: {process.children.join(', ')}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {/* System Log */}
        <div className="w-full md:w-1/2 border p-3 rounded">
          <h2 className="text-lg font-bold mb-3">System Log</h2>
          
          <div className="bg-black text-green-400 p-3 rounded font-mono text-sm h-80 overflow-auto">
            {log.map((entry, index) => (
              <div key={index} className="mb-1 text-white">
                <span className="text-white">[{index}]</span> {entry}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProcessSystemCalls;
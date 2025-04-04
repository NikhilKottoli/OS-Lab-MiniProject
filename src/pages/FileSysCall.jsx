import React, { useState } from 'react';
import { FileText, FolderOpen, X, RefreshCw, Edit } from 'lucide-react';

const SystemCallsVisualization = () => {
  const [activeCall, setActiveCall] = useState(null);
  const [fileStatus, setFileStatus] = useState('closed');
  const [fileContent, setFileContent] = useState('');
  const [fileName, setFileName] = useState('example.txt');
  const [animation, setAnimation] = useState('');
  
  const handleCallClick = (call) => {
    setActiveCall(call);
    setAnimation(`animate-pulse`);
    
    setTimeout(() => {
      setAnimation('');
    }, 1000);
    
    switch(call) {
      case 'creat':
        setFileStatus('created');
        setFileContent('');
        break;
      case 'open':
        setFileStatus('open');
        break;
      case 'close':
        setFileStatus('closed');
        break;
      case 'read':
        if (fileStatus === 'open') {
          // Simulate reading operation
          setAnimation('animate-bounce');
        }
        break;
      case 'write':
        if (fileStatus === 'open') {
          setFileContent((prev) => prev + 'Hello, this is sample text. ');
          setAnimation('animate-ping');
        }
        break;
      default:
        break;
    }
  };
  
  const systemCalls = [
    { name: 'creat()', id: 'creat', description: 'Creates a new file or truncates an existing one', icon: <FileText />, color: 'bg-green-500' },
    { name: 'open()', id: 'open', description: 'Opens a file and returns a file descriptor', icon: <FolderOpen />, color: 'bg-blue-500' },
    { name: 'close()', id: 'close', description: 'Closes an open file descriptor', icon: <X />, color: 'bg-red-500' },
    { name: 'read()', id: 'read', description: 'Reads data from an open file descriptor', icon: <RefreshCw />, color: 'bg-purple-500' },
    { name: 'write()', id: 'write', description: 'Writes data to an open file descriptor', icon: <Edit />, color: 'bg-yellow-500' }
  ];
  
  const getFileStatusColor = () => {
    switch(fileStatus) {
      case 'created':
        return 'border-green-500';
      case 'open':
        return 'border-blue-500';
      case 'closed':
        return 'border-gray-500';
      default:
        return 'border-gray-500';
    }
  };
  
  const isOperationAllowed = (call) => {
    if (call === 'creat' || call === 'open') return true;
    return fileStatus === 'open';
  };

  return (
    <div className="flex flex-col items-center p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">File Structure System Calls</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8 w-full">
        {systemCalls.map((call) => (
          <button
            key={call.id}
            onClick={() => handleCallClick(call.id)}
            className={`${call.color} text-white p-4 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 ${activeCall === call.id ? 'ring-4 ring-opacity-50 ring-white' : ''} ${!isOperationAllowed(call.id) && call.id !== 'creat' && call.id !== 'open' ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={!isOperationAllowed(call.id) && call.id !== 'creat' && call.id !== 'open'}
          >
            <div className="flex flex-col items-center">
              <div className="text-2xl mb-2">{call.icon}</div>
              <div className="font-bold">{call.name}</div>
              <div className="text-xs mt-2 text-center">{call.description}</div>
            </div>
          </button>
        ))}
      </div>
      
      <div className="w-full flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/3 p-4">
          <h2 className="text-xl font-bold mb-4">File Status</h2>
          <div className={`border-4 ${getFileStatusColor()} rounded-lg p-4 transition-all duration-500`}>
            <div className="text-lg font-semibold mb-2">
              {fileName}
            </div>
            <div className="text-sm bg-gray-100 p-2 rounded mb-2">
              Status: <span className="font-bold">{fileStatus.toUpperCase()}</span>
            </div>
            <div className="text-sm bg-gray-100 p-2 rounded">
              Actions: {activeCall ? <span className="font-bold uppercase">{activeCall}()</span> : 'None'}
            </div>
          </div>
        </div>
        
        <div className="w-full md:w-2/3 p-4">
          <h2 className="text-xl font-bold mb-4">File Content</h2>
          <div className={`min-h-64 border-2 border-gray-300 rounded-lg p-4 transition-all duration-300 ${animation}`}>
            {fileContent ? (
              <div className="whitespace-pre-wrap">{fileContent}</div>
            ) : (
              <div className="text-gray-400 italic">Empty file</div>
            )}
          </div>
        </div>
      </div>
      
      <div className="mt-8 p-4 bg-gray-100 rounded-lg w-full">
        <h2 className="text-xl font-bold mb-2">Instructions:</h2>
        <ol className="list-decimal pl-6">
          <li>Click <span className="font-bold text-green-500">creat()</span> to create a new file</li>
          <li>Click <span className="font-bold text-blue-500">open()</span> to open the file before reading or writing</li>
          <li>Click <span className="font-bold text-purple-500">read()</span> to read from the file </li>
          <li>Click <span className="font-bold text-yellow-500">write()</span> to add text to the file</li>
          <li>Click <span className="font-bold text-red-500">close()</span> when done to close the file</li>
        </ol>
        <div className="mt-4 text-sm text-gray-600">
          Note: Try To Write Content, Try Finding out the correct order of system calls
        </div>
      </div>
    </div>
  );
};

export default SystemCallsVisualization;
import React, { useState, useRef, useEffect } from 'react';
import { RefreshCw, Activity, Package, ArrowRightCircle, ArrowLeftCircle, BarChart, Clock, AlertCircle, Plus, Minus } from 'lucide-react';

const ProducerConsumer = () => {
  const [buffer, setBuffer] = useState([]);
  const [maxSize, setMaxSize] = useState(5);
  const [producers, setProducers] = useState(1);
  const [consumers, setConsumers] = useState(1);
  const [activityLog, setActivityLog] = useState([]);
  const [stats, setStats] = useState({
    produced: 0,
    consumed: 0,
    bufferFull: 0,
    bufferEmpty: 0
  });
  
  const logContainerRef = useRef(null);

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [activityLog]);

  const formatTime = () => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}.${now.getMilliseconds().toString().padStart(3, '0')}`;
  };

  const addLogEntry = (message, type) => {
    const newEntry = {
      id: Date.now() + Math.random(), 
      time: formatTime(),
      message,
      type 
    };
    
    setActivityLog(prevLog => {
      const updatedLog = [...prevLog, newEntry];
      if (updatedLog.length > 100) {
        return updatedLog.slice(-100);
      }
      return updatedLog;
    });
  };

  const getRandomColor = () => {
    const colors = [
      'bg-blue-100 border-blue-300 text-blue-800',
      'bg-green-100 border-green-300 text-green-800',
      'bg-purple-100 border-purple-300 text-purple-800',
      'bg-yellow-100 border-yellow-300 text-yellow-800',
      'bg-pink-100 border-pink-300 text-pink-800',
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const produceItem = (producerId) => {
    if (buffer.length >= maxSize) {
      setStats(s => ({...s, bufferFull: s.bufferFull + 1}));
      addLogEntry(`Producer ${producerId} attempted to add item but buffer is full (${buffer.length}/${maxSize})`, 'warning');
      return;
    }
    
    const itemId = `Item-${Date.now().toString().substring(6)}`;
    const newItem = {
      id: itemId,
      color: getRandomColor(),
      timestamp: Date.now(),
      producerId
    };
    
    setBuffer(prev => [...prev, newItem]);
    setStats(s => ({...s, produced: s.produced + 1}));
    addLogEntry(`Producer ${producerId} added ${itemId} to buffer (${buffer.length + 1}/${maxSize})`, 'produce');
  };

  const consumeItem = (consumerId) => {
    if (buffer.length === 0) {
      setStats(s => ({...s, bufferEmpty: s.bufferEmpty + 1}));
      addLogEntry(`Consumer ${consumerId} attempted to consume but buffer is empty`, 'warning');
      return;
    }
    
    const consumedItem = buffer[0];
    setBuffer(prev => prev.slice(1));
    setStats(s => ({...s, consumed: s.consumed + 1}));
    addLogEntry(`Consumer ${consumerId} consumed ${consumedItem.id} from buffer (${buffer.length - 1}/${maxSize})`, 'consume');
  };

  const resetSimulation = () => {
    setBuffer([]);
    setActivityLog([]);
    setStats({
      produced: 0,
      consumed: 0,
      bufferFull: 0,
      bufferEmpty: 0
    });
    addLogEntry('Simulation reset', 'info');
  };

  const bufferUtilization = buffer.length / maxSize * 100;

  const getLogEntryColor = (type) => {
    switch (type) {
      case 'produce':
        return 'text-green-600 border-l-green-500';
      case 'consume':
        return 'text-blue-600 border-l-blue-500';
      case 'warning':
        return 'text-amber-600 border-l-amber-500';
      case 'info':
      default:
        return 'text-gray-600 border-l-gray-400';
    }
  };

  const getLogEntryIcon = (type) => {
    switch (type) {
      case 'produce':
        return <ArrowRightCircle className="w-4 h-4 text-green-500 flex-shrink-0" />;
      case 'consume':
        return <ArrowLeftCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />;
      case 'warning':
        return <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />;
      case 'info':
      default:
        return <Clock className="w-4 h-4 text-gray-500 flex-shrink-0" />;
    }
  };

  const renderProducerButtons = () => {
    const buttons = [];
    for (let i = 1; i <= producers; i++) {
      buttons.push(
        <button
          key={`producer-${i}`}
          onClick={() => produceItem(i)}
          className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg font-medium flex items-center justify-center transition-all duration-300 m-1"
        >
          <Plus className="w-4 h-4 mr-1" />
          P{i}
        </button>
      );
    }
    return (
      <div className="flex flex-wrap justify-center">
        {buttons}
      </div>
    );
  };

  const renderConsumerButtons = () => {
    const buttons = [];
    for (let i = 1; i <= consumers; i++) {
      buttons.push(
        <button
          key={`consumer-${i}`}
          onClick={() => consumeItem(i)}
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-medium flex items-center justify-center transition-all duration-300 m-1"
        >
          <Minus className="w-4 h-4 mr-1" />
          C{i}
        </button>
      );
    }
    return (
      <div className="flex flex-wrap justify-center">
        {buttons}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-blue-700">Producer-Consumer Simulation</h1>
          <p className="text-gray-600">Interactive Producer-Consumer demonstration - You control when items are produced and consumed</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <div className="md:col-span-3">
            <div className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
              <div className="flex items-center mb-4">
                <Activity className="w-5 h-5 text-blue-500 mr-2" />
                <h2 className="text-xl font-semibold text-gray-800">Controls</h2>
              </div>
              
              <div className="space-y-5">
                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm font-medium text-gray-700">Buffer Size</label>
                    <span className="text-blue-600 font-medium">{maxSize}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={maxSize}
                    onChange={(e) => setMaxSize(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm font-medium text-gray-700">Producers</label>
                    <span className="text-blue-600 font-medium">{producers}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={producers}
                    onChange={(e) => setProducers(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <label className="text-sm font-medium text-gray-700">Consumers</label>
                    <span className="text-blue-600 font-medium">{consumers}</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={consumers}
                    onChange={(e) => setConsumers(parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex justify-center mt-6">
                <button
                  onClick={resetSimulation}
                  className="px-5 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium flex items-center transition-all duration-300"
                >
                  <RefreshCw className="w-4 h-4 mr-1" />
                  Reset
                </button>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl mt-6">
              <div className="flex items-center mb-4">
                <BarChart className="w-5 h-5 text-blue-500 mr-2" />
                <h2 className="text-xl font-semibold text-gray-800">Statistics</h2>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 p-3 rounded-lg text-center transform transition-all duration-300 hover:scale-105">
                  <p className="text-sm font-medium text-blue-800 mb-1">Produced</p>
                  <p className="text-xl font-bold text-blue-600">{stats.produced}</p>
                </div>
                
                <div className="bg-green-50 p-3 rounded-lg text-center transform transition-all duration-300 hover:scale-105">
                  <p className="text-sm font-medium text-green-800 mb-1">Consumed</p>
                  <p className="text-xl font-bold text-green-600">{stats.consumed}</p>
                </div>
                
                <div className="bg-yellow-50 p-3 rounded-lg text-center transform transition-all duration-300 hover:scale-105">
                  <p className="text-sm font-medium text-yellow-800 mb-1">Buffer Full</p>
                  <p className="text-xl font-bold text-yellow-600">{stats.bufferFull}</p>
                </div>
                
                <div className="bg-red-50 p-3 rounded-lg text-center transform transition-all duration-300 hover:scale-105">
                  <p className="text-sm font-medium text-red-800 mb-1">Buffer Empty</p>
                  <p className="text-xl font-bold text-red-600">{stats.bufferEmpty}</p>
                </div>
              </div>

            </div>
          </div>

          <div className="md:col-span-5">
            <div className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <Package className="w-5 h-5 text-blue-500 mr-2" />
                  <h2 className="text-xl font-semibold text-gray-800">Buffer Visualization</h2>
                </div>
                <div className="text-sm font-medium text-gray-500">
                  {buffer.length}/{maxSize} items
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-gray-700">Buffer Utilization</span>
                  <span className="text-sm font-medium text-gray-700">{Math.round(bufferUtilization)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div 
                    className={`h-4 rounded-full transition-all duration-500 ease-in-out ${
                      bufferUtilization > 80 ? 'bg-red-500' : 
                      bufferUtilization > 50 ? 'bg-yellow-500' : 
                      'bg-green-500'
                    }`}
                    style={{ width: `${bufferUtilization}%` }}
                  ></div>
                </div>
              </div>

              <div className="mb-6">
                <h3 className="text-lg font-semibold text-green-700 mb-2">Producers</h3>
                {renderProducerButtons()}
              </div>

              <div className="mt-6 mb-6">
                <div className="w-full border-4 border-gray-300 rounded-xl p-3 bg-gray-50 flex flex-col items-center justify-center min-h-78">
                  <div className="font-medium text-gray-700 mb-2">Buffer ({buffer.length}/{maxSize})</div>
                  
                  {buffer.length === 0 ? (
                    <div className="text-center p-4 text-gray-500 italic">Empty</div>
                  ) : (
                    <div className="w-full space-y-2">
                      {buffer.map((item) => (
                        <div 
                          key={item.id} 
                          className={`${item.color} px-3 py-2 rounded-lg flex items-center justify-between shadow-sm
                                    transform transition-all duration-500 animate-slideIn`}
                        >
                          <div className="flex items-center">
                            <span className="mr-2">📦</span>
                            <span>{item.id}</span>
                          </div>
                          <span className="text-xs">P{item.producerId}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-lg font-semibold text-blue-700 mb-2">Consumers</h3>
                {renderConsumerButtons()}
              </div>
            </div>
          </div>
          
          <div className="md:col-span-4">
            <div className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl h-full flex flex-col">
              <div className="flex items-center mb-4">
                <Activity className="w-5 h-5 text-blue-500 mr-2" />
                <h2 className="text-xl font-semibold text-gray-800">Activity Log</h2>
              </div>
              
              <div 
                ref={logContainerRef} 
                className="flex-grow overflow-y-auto pr-2 border border-gray-200 rounded-lg p-2 bg-gray-50 h-78"
                style={{ maxHeight: "600px" }}
              >
                {activityLog.length === 0 ? (
                  <div className="text-center p-4 text-gray-500 italic">No activity yet. Use the producer and consumer buttons to see log entries.</div>
                ) : (
                  <div className="space-y-2">
                    {activityLog.map((entry) => (
                      <div 
                        key={entry.id}
                        className={`border-l-4 pl-2 py-1 text-sm rounded bg-white shadow-sm 
                                  ${getLogEntryColor(entry.type)} animate-fadeIn`}
                      >
                        <div className="flex items-start">
                          <div className="mr-2 mt-1">
                            {getLogEntryIcon(entry.type)}
                          </div>
                          <div className="flex-grow">
                            <div className="text-xs text-gray-500">{entry.time}</div>
                            <div className="font-medium">{entry.message}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="mt-4 pt-3 border-t border-gray-200">
                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center text-xs text-gray-600">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                    <span>Producer</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-600">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
                    <span>Consumer</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-600">
                    <div className="w-3 h-3 bg-amber-500 rounded-full mr-1"></div>
                    <span>Warning</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-600">
                    <div className="w-3 h-3 bg-gray-400 rounded-full mr-1"></div>
                    <span>Info</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>The Producer-Consumer problem demonstrates how processes synchronize and communicate using a shared memory buffer.</p>
          <p className="mt-2">Click producer buttons to add items, consumer buttons to remove them.</p>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        
        .animate-slideIn {
          animation: slideIn 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default ProducerConsumer;









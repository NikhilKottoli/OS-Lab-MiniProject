
import React, { useState, useEffect, useRef } from "react";
import { Play, Pause, SkipForward, Settings, Info, X } from "lucide-react";

export default function CFSSimulation() {
  // Configuration state
  const [isRunning, setIsRunning] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [numProcesses, setNumProcesses] = useState(5);
  const [timeSlice, setTimeSlice] = useState(3);
  const [currentTime, setCurrentTime] = useState(0);
  const [selectedProcess, setSelectedProcess] = useState(null);

  // Process state
  const [processes, setProcesses] = useState([]);
  const [executionHistory, setExecutionHistory] = useState([]);
  const [rbTree, setRbTree] = useState({ nodes: [], links: [] });

  // Animation frame reference
  const animationRef = useRef(null);

  // Colors for processes
  const colors = [
    "bg-red-500",
    "bg-blue-500",
    "bg-green-500",
    "bg-yellow-500",
    "bg-purple-500",
    "bg-pink-500",
    "bg-indigo-500",
    "bg-teal-500",
    "bg-orange-500",
    "bg-cyan-500",
  ];

  // Initialize processes
  useEffect(() => {
    initializeProcesses();
  }, [numProcesses]);

  const initializeProcesses = () => {
    setCurrentTime(0);

    const newProcesses = Array.from({ length: numProcesses }, (_, i) => ({
      id: i + 1,
      name: `Process ${i + 1}`,
      color: colors[i % colors.length],
      priority: Math.floor(Math.random() * 10) + 1,
      remainingTime: Math.floor(Math.random() * 15) + 5,
      totalTime: Math.floor(Math.random() * 15) + 5,
      vruntime: 0,
      state: "ready",
    }));

    setProcesses(newProcesses);
    setExecutionHistory([]);
    updateRBTree(newProcesses);
  };

  // Red-Black Tree implementation
  const NIL = { id: -1, isRed: false, left: null, right: null, parent: null };

  const createNode = (process) => ({
    id: process.id,
    name: process.name,
    vruntime: process.vruntime,
    color: process.color,
    isRed: true, // New nodes are always red
    left: NIL,
    right: NIL,
    parent: null,
  });

  const rotateLeft = (tree, node) => {
    const rightChild = node.right;
    node.right = rightChild.left;
    
    if (rightChild.left !== NIL) {
      rightChild.left.parent = node;
    }
    
    rightChild.parent = node.parent;
    
    if (node.parent === null) {
      tree.root = rightChild;
    } else if (node === node.parent.left) {
      node.parent.left = rightChild;
    } else {
      node.parent.right = rightChild;
    }
    
    rightChild.left = node;
    node.parent = rightChild;
  };

  const rotateRight = (tree, node) => {
    const leftChild = node.left;
    node.left = leftChild.right;
    
    if (leftChild.right !== NIL) {
      leftChild.right.parent = node;
    }
    
    leftChild.parent = node.parent;
    
    if (node.parent === null) {
      tree.root = leftChild;
    } else if (node === node.parent.right) {
      node.parent.right = leftChild;
    } else {
      node.parent.left = leftChild;
    }
    
    leftChild.right = node;
    node.parent = leftChild;
  };

  const fixInsert = (tree, node) => {
    while (node.parent && node.parent.isRed) {
      if (node.parent === node.parent.parent.left) {
        const uncle = node.parent.parent.right;
        if (uncle.isRed) {
          // Case 1: Uncle is red
          node.parent.isRed = false;
          uncle.isRed = false;
          node.parent.parent.isRed = true;
          node = node.parent.parent;
        } else {
          if (node === node.parent.right) {
            // Case 2: Uncle is black and node is right child
            node = node.parent;
            rotateLeft(tree, node);
          }
          // Case 3: Uncle is black and node is left child
          node.parent.isRed = false;
          node.parent.parent.isRed = true;
          rotateRight(tree, node.parent.parent);
        }
      } else {
        // Mirror cases
        const uncle = node.parent.parent.left;
        if (uncle.isRed) {
          node.parent.isRed = false;
          uncle.isRed = false;
          node.parent.parent.isRed = true;
          node = node.parent.parent;
        } else {
          if (node === node.parent.left) {
            node = node.parent;
            rotateRight(tree, node);
          }
          node.parent.isRed = false;
          node.parent.parent.isRed = true;
          rotateLeft(tree, node.parent.parent);
        }
      }
    }
    tree.root.isRed = false;
  };

  const insertNode = (tree, process) => {
    const newNode = createNode(process);
    
    if (tree.root === null || tree.root === NIL) {
      tree.root = newNode;
      newNode.isRed = false; // Root is always black
      return newNode;
    }
    
    let current = tree.root;
    let parent = null;
    
    while (current !== NIL) {
      parent = current;
      if (newNode.vruntime < current.vruntime) {
        current = current.left;
      } else {
        current = current.right;
      }
    }
    
    newNode.parent = parent;
    
    if (newNode.vruntime < parent.vruntime) {
      parent.left = newNode;
    } else {
      parent.right = newNode;
    }
    
    fixInsert(tree, newNode);
    return newNode;
  };

  const transplant = (tree, u, v) => {
    if (u.parent === null) {
      tree.root = v;
    } else if (u === u.parent.left) {
      u.parent.left = v;
    } else {
      u.parent.right = v;
    }
    v.parent = u.parent;
  };

  const findMin = (node) => {
    while (node.left !== NIL) {
      node = node.left;
    }
    return node;
  };

  const fixDelete = (tree, node) => {
    while (node !== tree.root && !node.isRed) {
      if (node === node.parent.left) {
        let sibling = node.parent.right;
        if (sibling.isRed) {
          // Case 1: Sibling is red
          sibling.isRed = false;
          node.parent.isRed = true;
          rotateLeft(tree, node.parent);
          sibling = node.parent.right;
        }
        
        if (!sibling.left.isRed && !sibling.right.isRed) {
          // Case 2: Both sibling's children are black
          sibling.isRed = true;
          node = node.parent;
        } else {
          if (!sibling.right.isRed) {
            // Case 3: Sibling's right child is black
            sibling.left.isRed = false;
            sibling.isRed = true;
            rotateRight(tree, sibling);
            sibling = node.parent.right;
          }
          // Case 4: Sibling's right child is red
          sibling.isRed = node.parent.isRed;
          node.parent.isRed = false;
          sibling.right.isRed = false;
          rotateLeft(tree, node.parent);
          node = tree.root;
        }
      } else {
        // Mirror cases
        let sibling = node.parent.left;
        if (sibling.isRed) {
          sibling.isRed = false;
          node.parent.isRed = true;
          rotateRight(tree, node.parent);
          sibling = node.parent.left;
        }
        
        if (!sibling.right.isRed && !sibling.left.isRed) {
          sibling.isRed = true;
          node = node.parent;
        } else {
          if (!sibling.left.isRed) {
            sibling.right.isRed = false;
            sibling.isRed = true;
            rotateLeft(tree, sibling);
            sibling = node.parent.left;
          }
          sibling.isRed = node.parent.isRed;
          node.parent.isRed = false;
          sibling.left.isRed = false;
          rotateRight(tree, node.parent);
          node = tree.root;
        }
      }
    }
    node.isRed = false;
  };

  const deleteNode = (tree, node) => {
    let y = node;
    let yOriginalColor = y.isRed;
    let x;
    
    if (node.left === NIL) {
      x = node.right;
      transplant(tree, node, node.right);
    } else if (node.right === NIL) {
      x = node.left;
      transplant(tree, node, node.left);
    } else {
      y = findMin(node.right);
      yOriginalColor = y.isRed;
      x = y.right;
      
      if (y.parent === node) {
        x.parent = y;
      } else {
        transplant(tree, y, y.right);
        y.right = node.right;
        y.right.parent = y;
      }
      
      transplant(tree, node, y);
      y.left = node.left;
      y.left.parent = y;
      y.isRed = node.isRed;
    }
    
    if (!yOriginalColor) {
      fixDelete(tree, x);
    }
  };

  const findNode = (root, id) => {
    let stack = [root];
    while (stack.length > 0) {
      const node = stack.pop();
      if (node === NIL) continue;
      if (node.id === id) return node;
      stack.push(node.right);
      stack.push(node.left);
    }
    return null;
  };

  // Update red-black tree visualization
  const updateRBTree = (currentProcesses) => {
    // First build a proper Red-Black Tree structure
    const tree = { root: null };
    
    // Insert processes into the RB Tree
    currentProcesses
      .filter((p) => p.state === "ready" || p.state === "running")
      .forEach((process) => {
        insertNode(tree, process);
      });
  
    // Convert to visualization format
    const nodes = [];
    const links = [];
    let maxDepth = 0;
  
    // Track node indices for linking
    const nodeIndices = new Map();
  
    // Calculate positions using modified BFS for better visualization
    const queue = [];
    if (tree.root) {
      tree.root.depth = 0;
      tree.root.x = 400; // Start at center
      queue.push(tree.root);
    }
  
    while (queue.length > 0) {
      const node = queue.shift();
      maxDepth = Math.max(maxDepth, node.depth);
    
      const vizNode = {
        id: node.id,
        name: node.name,
        vruntime: node.vruntime,
        color: node.color,
        x: node.x,
        y: node.depth * 100 + 50,
        isRed: node.isRed,
        index: nodes.length,
      };
    
      nodes.push(vizNode);
      nodeIndices.set(node.id, vizNode.index);
    
      const horizontalSpacing = 200 / (node.depth + 2);
    
      if (node.left !== NIL) {
        node.left.depth = node.depth + 1;
        node.left.x = node.x - horizontalSpacing;
    
        const leftVizNode = {
          id: node.left.id,
          name: node.left.name,
          vruntime: node.left.vruntime,
          color: node.left.color,
          x: node.left.x,
          y: node.left.depth * 100 + 50,
          isRed: node.left.isRed,
          index: nodes.length,
        };
    
        nodes.push(leftVizNode);
        nodeIndices.set(node.left.id, leftVizNode.index);
    
        links.push({
          source: vizNode.index,
          target: leftVizNode.index,
          isLeft: true,
        });
    
        queue.push(node.left);
      }
    
      if (node.right !== NIL) {
        node.right.depth = node.depth + 1;
        node.right.x = node.x + horizontalSpacing;
    
        const rightVizNode = {
          id: node.right.id,
          name: node.right.name,
          vruntime: node.right.vruntime,
          color: node.right.color,
          x: node.right.x,
          y: node.right.depth * 100 + 50,
          isRed: node.right.isRed,
          index: nodes.length,
        };
    
        nodes.push(rightVizNode);
        nodeIndices.set(node.right.id, rightVizNode.index);
    
        links.push({
          source: vizNode.index,
          target: rightVizNode.index,
          isLeft: false,
        });
    
        queue.push(node.right);
      }
    }
  
    // Center the tree horizontally
    if (nodes.length > 0) {
      const minX = Math.min(...nodes.map(n => n.x));
      const maxX = Math.max(...nodes.map(n => n.x));
      const treeWidth = maxX - minX;
      const containerWidth = 800;
      const centerOffset = (containerWidth - treeWidth) / 2 - minX;
      
      nodes.forEach(node => {
        node.x += centerOffset;
      });
    }
  
    setRbTree({ nodes, links });
  };
  useEffect(() => {
    console.log("RB Tree Links:", rbTree.links);
  }, [rbTree]);
  // Main simulation step
  const simulationStep = () => {
    if (!isRunning) return;

    setCurrentTime((prev) => prev + 1);

    setProcesses((prevProcesses) => {
      // Create copy for manipulation
      const updatedProcesses = [...prevProcesses];

      // Get runnable processes
      const runnableProcesses = updatedProcesses.filter(
        (p) => p.state === "ready" || p.state === "running"
      );

      // Update states
      updatedProcesses.forEach((process) => {
        if (process.state === "running") {
          process.state = "ready";
        }
      });

      // If there are runnable processes, run the one with lowest vruntime
      if (runnableProcesses.length > 0) {
        // Sort by vruntime to find next process to run
        runnableProcesses.sort((a, b) => a.vruntime - b.vruntime);
        
        const nextProcess = runnableProcesses[0];
        const processIndex = updatedProcesses.findIndex(
          (p) => p.id === nextProcess.id
        );

        if (processIndex !== -1) {
          updatedProcesses[processIndex].state = "running";
          updatedProcesses[processIndex].vruntime +=
            1000 / updatedProcesses[processIndex].priority;
          updatedProcesses[processIndex].remainingTime -= 1;

          // Check if process is complete
          if (updatedProcesses[processIndex].remainingTime <= 0) {
            updatedProcesses[processIndex].state = "completed";
          }

          // Add to execution history
          setExecutionHistory((prev) => [
            ...prev,
            {
              time: currentTime,
              processId: nextProcess.id,
              color: nextProcess.color,
            },
          ]);
        }
      }

      // Update RB tree
      updateRBTree(updatedProcesses);

      return updatedProcesses;
    });
  };

  // Animation loop
  useEffect(() => {
    if (isRunning) {
      animationRef.current = setTimeout(() => {
        simulationStep();
      }, 1000 / speed);
    }

    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, [isRunning, currentTime, speed]);

  // Handle process selection
  const handleProcessClick = (process) => {
    setSelectedProcess(process);
  };

  // Control buttons
  const handlePlayPause = () => {
    setIsRunning(!isRunning);
  };

  const handleReset = () => {
    setIsRunning(false);
    initializeProcesses();
  };

  const handleSpeedChange = (newSpeed) => {
    setSpeed(newSpeed);
  };

  return (
    <div className="flex flex-col bg-gray-100 p-4 rounded-lg shadow-lg font-sans w-full max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Completely Fair Scheduler Simulation
        </h1>
        <div className="flex space-x-2">
          <button
            onClick={handlePlayPause}
            className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center"
          >
            {isRunning ? (
              <Pause size={16} className="mr-1" />
            ) : (
              <Play size={16} className="mr-1" />
            )}
            {isRunning ? "Pause" : "Play"}
          </button>
          <button
            onClick={handleReset}
            className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md flex items-center"
          >
            <SkipForward size={16} className="mr-1" />
            Reset
          </button>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md flex items-center"
          >
            <Settings size={16} className="mr-1" />
            Settings
          </button>
          <button
            onClick={() => setShowInfo(!showInfo)}
            className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-md flex items-center"
          >
            <Info size={16} className="mr-1" />
            Info
          </button>
        </div>
      </div>

      <div className="flex mb-4 space-x-2">
        <div className="text-gray-700">Time: {currentTime}</div>
        <div className="text-gray-700">
          Speed:
          <button
            onClick={() => handleSpeedChange(1)}
            className={`ml-2 px-2 py-1 rounded ${
              speed === 1 ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            1x
          </button>
          <button
            onClick={() => handleSpeedChange(2)}
            className={`ml-2 px-2 py-1 rounded ${
              speed === 2 ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            2x
          </button>
          <button
            onClick={() => handleSpeedChange(5)}
            className={`ml-2 px-2 py-1 rounded ${
              speed === 5 ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
          >
            5x
          </button>
        </div>
      </div>

      {/* Main content area */}
      <div className="flex space-x-4">
        <div className="w-1/3 bg-white p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-3">Processes</h2>
          <div className="space-y-2">
            {processes.map((process) => (
              <div
                key={process.id}
                onClick={() => handleProcessClick(process)}
                className={`p-3 rounded-md cursor-pointer transition-all ${
                  process.state === "running"
                    ? "border-2 border-black"
                    : "border border-gray-200"
                } ${
                  selectedProcess?.id === process.id
                    ? "ring-2 ring-blue-500"
                    : ""
                }`}
              >
                <div className="flex items-center">
                  <div
                    className={`w-4 h-4 rounded-full mr-2 ${process.color}`}
                  ></div>
                  <span className="font-medium">{process.name}</span>
                  <span
                    className={`ml-auto px-2 py-1 text-xs rounded-full ${
                      process.state === "running"
                        ? "bg-green-100 text-green-800"
                        : process.state === "ready"
                        ? "bg-blue-100 text-blue-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {process.state}
                  </span>
                </div>
                <div className="mt-2 text-sm text-gray-600">
                  <div>Priority: {process.priority}</div>
                  <div>Virtual Runtime: {process.vruntime.toFixed(2)}</div>
                  <div>
                    Remaining: {process.remainingTime} / {process.totalTime}
                  </div>
                </div>
                <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${process.color}`}
                    style={{
                      width: `${
                        ((process.totalTime - process.remainingTime) /
                          process.totalTime) *
                        100
                      }%`,
                    }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-2/3 space-y-4">
          {/* Gantt Chart */}
          <div className="bg-white p-4 rounded-lg shadow">
            <h2 className="text-lg font-semibold mb-3">
              CPU Execution (Gantt Chart)
            </h2>
            <div className="relative h-16 bg-gray-100 rounded border border-gray-200">
              {executionHistory.map((entry, index) => (
                <div
                  key={index}
                  className={`absolute h-full ${entry.color} border-r border-white`}
                  style={{
                    left: `${
                      (entry.time / Math.max(50, currentTime + 10)) * 100
                    }%`,
                    width: `${(1 / Math.max(50, currentTime + 10)) * 100}%`,
                  }}
                  title={`Process ${entry.processId} at time ${entry.time}`}
                ></div>
              ))}
            </div>
            <div className="mt-2 flex justify-between text-xs text-gray-500">
              <span>0</span>
              <span>{Math.floor(Math.max(50, currentTime + 10) / 4)}</span>
              <span>{Math.floor(Math.max(50, currentTime + 10) / 2)}</span>
              <span>
                {Math.floor((3 * Math.max(50, currentTime + 10)) / 4)}
              </span>
              <span>{Math.max(50, currentTime + 10)}</span>
            </div>
          </div>

          {/* Red-Black Tree Visualization */}
          <div className="bg-white p-4 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-3">
          Red-Black Tree (Virtual Runtime)
        </h2>
        <div className="relative h-96 border border-gray-200 rounded overflow-auto">
          {/* Tree connections */}
          <svg
            className="absolute inset-0 w-full h-full"
            style={{ zIndex: 1 }}
          >
            {rbTree.links.map((link, index) => {
              const sourceNode = rbTree.nodes[link.source];
              const targetNode = rbTree.nodes[link.target];
              if (!sourceNode || !targetNode) return null;
              return (
                <line
                  key={index}
                  x1={sourceNode.x}
                  y1={sourceNode.y}
                  x2={targetNode.x}
                  y2={targetNode.y}
                  stroke={sourceNode.isRed ? "#f87171" : "#000"}
                  strokeWidth="2"
                  strokeDasharray={link.isLeft ? "0" : "0"} 
                />
              );
            })}
          </svg>

          {/* Tree nodes */}
          {rbTree.nodes.map((node, index) => (
            <div
              key={index}
              className={`absolute w-20 h-16 rounded-md flex items-center justify-center transition-all duration-300 ${
                node.isRed ? "bg-red-400 text-white" : "bg-black text-white"
              } ${
                node.id === selectedProcess?.id
                  ? "ring-4 ring-blue-500"
                  : ""
              }`}
              style={{
                left: `${node.x - 40}px`,
                top: `${node.y - 30}px`,
                zIndex: 2,
              }}
            >
              <div className="text-center">
                <div className="font-bold text-sm">{node.name}</div>
                <div className="text-xs">{node.vruntime.toFixed(1)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
          
        </div>
      </div>

      {/* Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Simulation Settings</h2>
              <button
                onClick={() => setShowSettings(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Number of Processes
                </label>
                <input
                  type="range"
                  min="2"
                  max="10"
                  value={numProcesses}
                  onChange={(e) => setNumProcesses(parseInt(e.target.value))}
                  className="w-full mt-1"
                />
                <div className="text-right">{numProcesses}</div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Time Slice (ms)
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={timeSlice}
                  onChange={(e) => setTimeSlice(parseInt(e.target.value))}
                  className="w-full mt-1"
                />
                <div className="text-right">{timeSlice}</div>
              </div>
              <div className="flex justify-end pt-4">
                <button
                  onClick={() => {
                    setShowSettings(false);
                    handleReset();
                  }}
                  className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md"
                >
                  Apply & Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Info Modal */}
      {showInfo && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-10">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl max-h-screen overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">About CFS</h2>
              <button
                onClick={() => setShowInfo(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={20} />
              </button>
            </div>
            <div className="prose">
              <h3>Completely Fair Scheduler (CFS)</h3>
              <p>
                The Completely Fair Scheduler (CFS) is the default Linux process
                scheduler introduced in kernel 2.6.23. It handles CPU resource
                allocation for executing processes, and aims to maximize overall
                CPU utilization while providing a good interactive experience.
              </p>

              <h4>Key Concepts</h4>
              <ul>
                <li>
                  <strong>Virtual Runtime (vruntime)</strong>: A metric that
                  represents how much CPU time a process has received, weighted
                  by process priority.
                </li>
                <li>
                  <strong>Red-Black Tree</strong>: A self-balancing binary
                  search tree that CFS uses to efficiently track and select
                  processes based on their vruntime.
                </li>
                <li>
                  <strong>Time Slice</strong>: The amount of time a process runs
                  before the scheduler re-evaluates.
                </li>
                <li>
                  <strong>Priority (Nice Value)</strong>: Affects how quickly a
                  process's vruntime increases.
                </li>
              </ul>

              <h4>How CFS Works</h4>
              <ol>
                <li>
                  All runnable processes are stored in a red-black tree sorted
                  by vruntime.
                </li>
                <li>
                  The process with the smallest vruntime (leftmost node in the
                  tree) is selected to run next.
                </li>
                <li>
                  As a process runs, its vruntime increases proportionally to
                  its running time and inversely to its priority.
                </li>
                <li>
                  This ensures that processes with high priority (low nice
                  value) have their vruntime increase more slowly.
                </li>
                <li>
                  The scheduler periodically preempts the running process and
                  picks the next one with the lowest vruntime.
                </li>
              </ol>

              <p>
                This simulation demonstrates these concepts visually, showing
                how CFS maintains fairness by always selecting the process that
                has received the least amount of CPU time relative to its
                priority.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
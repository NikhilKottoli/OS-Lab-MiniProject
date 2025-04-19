import React, { useEffect, useState, useRef } from 'react';
import { BookOpen, Search, Plus, Info, Trash2, CheckCircle, XCircle, GitBranch } from 'lucide-react';


class BPlusNode {
  constructor(leaf = false) {
    this.leaf = leaf;
    this.keys = [];
    this.children = [];
    this.next = null; 
  }
}


class BPlusTree {
  
  
   
  constructor(order) {
    this.order = order;
    this.root = new BPlusNode(true);
  }

  insert(key) {
    let root = this.root;
  
    if (root.keys.length === this.order) {
      const newRoot = new BPlusNode(false);
      newRoot.children.push(root);
      this._splitChild(newRoot, 0);
      this.root = newRoot;
    }
    this._insertNonFull(this.root, key);
  }

  _insertNonFull(node, key) {
    if (node.leaf) {
     
      const idx = node.keys.findIndex(k => k >= key);
      if (idx === -1) node.keys.push(key);
      else node.keys.splice(idx, 0, key);
    } else {
      
      let i = node.keys.findIndex(k => key < k);
      if (i === -1) i = node.keys.length;
    
      if (node.children[i].keys.length === this.order) {
        this._splitChild(node, i);
     
        if (key > node.keys[i]) i++;
      }
      this._insertNonFull(node.children[i], key);
    }
  }

  _splitChild(parent, index) {
    const order = this.order;
    const child = parent.children[index];
    const newNode = new BPlusNode(child.leaf);

    if (child.leaf) {
      
      newNode.keys = child.keys.splice(Math.ceil(order / 2));
 
      newNode.next = child.next;
      child.next = newNode;
   
      parent.keys.splice(index, 0, newNode.keys[0]);
      parent.children.splice(index + 1, 0, newNode);
    } else {
     
      const mid = Math.ceil(order / 2) - 1;
      const upKey = child.keys[mid];
      
      newNode.keys = child.keys.splice(mid + 1);
 
      child.keys.splice(mid, 1);
      
      newNode.children = child.children.splice(mid + 1);
      
      parent.keys.splice(index, 0, upKey);
      parent.children.splice(index + 1, 0, newNode);
    }
  }

  search(key, node = this.root) {
    let i = 0;
    
    while (i < node.keys.length && key > node.keys[i]) i++;

    if (node.leaf) {
      const idx = node.keys.indexOf(key);
      return { found: idx !== -1, node, index: idx };
    }
    return this.search(key, node.children[i]);
  }
}

export const BTreeC = () => {
  const [btree] = useState(new BPlusTree(3));
  const [records, setRecords] = useState([]);
  const [input, setInput] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [searching, setSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState('');
  const MAX_LENGTH = 30;
  const treeContainerRef = useRef(null);

  const addRecord = () => {
    const trimmedInput = input.trim();
    if (!trimmedInput) {
      setError('Record cannot be empty.');
      return;
    }
    if (trimmedInput.length > MAX_LENGTH) {
      setError(`Record too long. Max ${MAX_LENGTH} characters.`);
      return;
    }
    if (records.includes(trimmedInput)) {
      setError('Record already exists.');
      return;
    }

    btree.insert(trimmedInput);
    setRecords([...records, trimmedInput].sort());
    setInput('');
    setError('');
  };

  const searchRecord = async () => {
    const trimmedSearch = searchTerm.trim();
    if (!trimmedSearch) {
      setError('Please enter a valid record to search.');
      return;
    }

    setSearchResult(null);
    setSearching(true);
    setHasSearched(true);
    setError('');

    await new Promise(resolve => setTimeout(resolve, 500));

    const result = btree.search(trimmedSearch);
    setSearching(false);
    setSearchResult(result.found ? result : null);
  };

  const handleKeyPress = (e, action) => {
    if (e.key === 'Enter') {
      action();
    }
  };

  useEffect(() => {
    setSearchResult(null);
    setHasSearched(false);
  }, [searchTerm]);

  const clearAll = () => {
    setRecords([]);
    setInput('');
    setSearchTerm('');
    setSearchResult(null);
    setError('');
    btree.root = new BPlusNode(true);
  };

  // Get tree structure for rendering calculation
  const getTreeStructure = (node, level = 0) => {
    if (!node) return { depth: 0, leafCount: 0 };
    
    if (node.leaf) {
      return { depth: level, leafCount: 1 };
    }
    
    let maxDepth = level;
    let totalLeaves = 0;
    
    for (const child of node.children) {
      const childInfo = getTreeStructure(child, level + 1);
      maxDepth = Math.max(maxDepth, childInfo.depth);
      totalLeaves += childInfo.leafCount;
    }
    
    return { depth: maxDepth, leafCount: totalLeaves || 1 };
  };

  const treeInfo = getTreeStructure(btree.root);
  
 
  const getNodeWidth = (keys) => {
    return Math.max(80, keys.length * 40); 
  };

  const renderTree = () => {
    const containerWidth = Math.max(treeContainerRef.current?.clientWidth || 800, 800);
    const treeDepth = treeInfo.depth;
    const leafCount = Math.max(1, treeInfo.leafCount);
    
 
    const positions = {};
    
    const positionNodes = (node, level = 0, leftBound = 0, rightBound = containerWidth) => {
      if (!node) return null;
      
      if (!positions[level]) positions[level] = [];
      
      const nodeWidth = getNodeWidth(node.keys);
      let nodeX;
      let nodeY = level * 80;
      
      if (node.leaf) {
      
        nodeX = leftBound + (rightBound - leftBound) / 2;
      } else {
      
        const childCount = node.children.length;
        const segmentWidth = (rightBound - leftBound) / childCount;
        

        node.children.forEach((child, index) => {
          const childLeftBound = leftBound + (segmentWidth * index);
          const childRightBound = childLeftBound + segmentWidth;
          positionNodes(child, level + 1, childLeftBound, childRightBound);
        });
        
    
        nodeX = leftBound + (rightBound - leftBound) / 2;
      }
      
      const position = { 
        x: nodeX, 
        y: nodeY, 
        node,
        width: nodeWidth
      };
      positions[level].push(position);
      
      return position;
    };
    
   
    positionNodes(btree.root);
    
    
    const renderNodesAtLevel = (level) => {
      if (!positions[level]) return null;
      
      return positions[level].map((pos, index) => {
        const nodeWidth = pos.width;
        
        return (
          <div 
            key={`node-${level}-${index}`} 
            className="absolute transition-all duration-300"
            style={{
              left: pos.x - nodeWidth / 2,
              top: pos.y,
              width: nodeWidth,
            }}
          >
            <div className="flex flex-col items-center">
              <div className="text-xs text-gray-500 mb-1">
                {pos.node.leaf ? 'Leaf' : 'Internal'} (Level {level})
              </div>
              <div className="flex gap-1 p-1.5 bg-gray-50 rounded-lg border border-gray-200 shadow-sm z-10 relative">
                {pos.node.keys.map((key, keyIndex) => (
                  <div
                    key={keyIndex}
                    className={`px-1.5 py-0.5 rounded border ${
                      searchResult?.node === pos.node && searchResult?.index === keyIndex
                        ? 'bg-green-100 border-green-300'
                        : pos.node.leaf
                        ? 'bg-blue-100 border-blue-300'
                        : 'bg-white border-gray-200'
                    } text-xs font-mono min-w-[24px] text-center`}
                  >
                    {key}
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      });
    };
    

    const renderConnections = () => {
      const connections = [];
      
    
      for (let level = 0; level < treeDepth; level++) {
        if (!positions[level]) continue;
        
        positions[level].forEach((parentPos) => {
          const parentNode = parentPos.node;
          if (!parentNode.leaf && parentNode.children.length > 0) {
            const parentCenterX = parentPos.x;
            const parentBottomY = parentPos.y + 35;
            
            parentNode.children.forEach((child) => {
              const childPos = positions[level + 1]?.find(pos => pos.node === child);
              if (childPos) {
                const childCenterX = childPos.x;
                const childTopY = childPos.y;
                
                connections.push(
                  <line
                    key={`conn-${parentCenterX}-${parentBottomY}-${childCenterX}-${childTopY}`}
                    x1={parentCenterX}
                    y1={parentBottomY}
                    x2={childCenterX}
                    y2={childTopY}
                    stroke="#94a3b8"
                    strokeWidth="1"
                  />
                );
              }
            });
          }
        });
      }
      
     
      if (positions[treeDepth]) {
        for (let i = 0; i < positions[treeDepth].length - 1; i++) {
          const current = positions[treeDepth][i];
          const next = positions[treeDepth][i + 1];
          
          if (current && next && current.node.leaf && next.node.leaf) {
            connections.push(
              <line
                key={`leaf-conn-${i}`}
                x1={current.x + current.width / 2}
                y1={current.y + 20}
                x2={next.x - next.width / 2}
                y2={next.y + 20}
                stroke="#94a3b8"
                strokeWidth="1"
                strokeDasharray="4"
              />
            );
          }
        }
      }
      
      return connections;
    };
    
    const treeHeight = (treeDepth + 1) * 80;
    
    return (
      <div 
        className="relative"
        style={{ 
          width: '100%', 
          height: treeHeight,
          minHeight: 200,
          minWidth: 800
        }}
      >
        <svg className="absolute inset-0 w-full h-full">
          {renderConnections()}
        </svg>
        
        {Array.from({ length: treeDepth + 1 }).map((_, level) => renderNodesAtLevel(level))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-indigo-600" />
            B+ Tree File Organization
          </h1>
          <p className="text-gray-600 mt-2">Visualize how records are stored in a B+ tree structure</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-indigo-100">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-indigo-100 rounded-lg">
                  <Info className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">About B+ Tree Storage</h3>
                  <p className="text-gray-600 leading-relaxed mb-6">
                    In a B+ tree, all records are stored in leaf nodes, which are linked sequentially for range queries.
                    Internal nodes contain keys for navigation, ensuring efficient searches and balanced structure.
                  </p>
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-lg font-semibold text-green-700 flex items-center gap-2 mb-2">
                        <CheckCircle className="w-5 h-5" />
                        Advantages
                      </h4>
                      <ul className="list-disc list-inside text-gray-600 space-y-1 ml-2">
                        <li>Efficient for range queries via linked leaves</li>
                        <li>Fast searches with logarithmic time</li>
                        <li>Optimized for disk access with all data in leaves</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-lg font-semibold text-red-700 flex items-center gap-2 mb-2">
                        <XCircle className="w-5 h-5" />
                        Disadvantages
                      </h4>
                      <ul className="list-disc list-inside text-gray-600 space-y-1 ml-2">
                        <li>More complex than sequential storage</li>
                        <li>Extra space for leaf linking</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-indigo-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Search className="w-5 h-5 text-indigo-600" />
                Search Records
              </h3>
              <div className="space-y-4">
                <div className="flex gap-3">
                  <input
                    type="text"
                    className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    onKeyDown={e => handleKeyPress(e, searchRecord)}
                    placeholder="Enter record to search..."
                  />
                  <button
                    onClick={searchRecord}
                    disabled={searching || !searchTerm.trim()}
                    className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                  >
                    <Search className="w-4 h-4" />
                    {searching ? 'Searching...' : 'Search'}
                  </button>
                </div>

                {searching && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <GitBranch className="w-4 h-4 animate-pulse" />
                    Traversing B+ tree...
                  </div>
                )}

                {searchResult?.found && (
                  <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-green-700 flex items-center gap-2">
                    <CheckCircle className="w-5 h-5" />
                    Record found in leaf node
                  </div>
                )}

                {!searching && hasSearched && !searchResult?.found && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 flex items-center gap-2">
                    <XCircle className="w-5 h-5" />
                    Record not found
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6 border border-indigo-100">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-indigo-600" />
                Add Record
              </h3>
              <div className="flex gap-3">
                <input
                  type="text"
                  className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => handleKeyPress(e, addRecord)}
                  placeholder="Enter new record..."
                />
                <button
                  onClick={addRecord}
                  disabled={!input.trim()}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>
              {error && (
                <p className="text-sm text-red-600 mt-2">{error}</p>
              )}
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-indigo-100 relative"
            style={{ width: '800px' }}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-gray-800">Records ({records.length})</h3>
                {records.length > 0 && (
                  <button
                    onClick={clearAll}
                    className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" /> Clear All
                  </button>
                )}
              </div>

              {records.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No records added yet. Add your first record above.
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <h4 className="text-sm font-semibold text-gray-700 mb-2">B+ Tree Storage Structure</h4>
                    <div 
                      ref={treeContainerRef}
                      className="overflow-auto border border-gray-300 rounded"
                      style={{ 
                        height: '60vh',
                      }}
                    >
                      {renderTree()}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BTreeC;
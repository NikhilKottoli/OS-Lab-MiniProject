import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const FileAllocation = () => {
  const navigate = useNavigate();
  const [allocationType, setAllocationType] = useState('sequential');
  const [totalBlocks, setTotalBlocks] = useState(20);
  const [fileSize, setFileSize] = useState(5);
  const [files, setFiles] = useState([]);
  const [nextFileId, setNextFileId] = useState(1);
  const [errorMessage, setErrorMessage] = useState('');
  const [animatingBlockId, setAnimatingBlockId] = useState(null);

  const getBlocksState = () => {
    const blocks = Array(totalBlocks).fill('free');
    files.forEach(file => {
      file.blocks.forEach(blockIndex => {
        blocks[blockIndex] = file.id;
      });
      if (file.allocationType === 'indexed' && file.indexBlock !== undefined) {
        blocks[file.indexBlock] = `index-${file.id}`;
      }
    });
    return blocks;
  };

  const getBlockColor = (block) => {
    if (block === 'free') return 'bg-gray-200';
    if (block.toString().startsWith('index-')) return 'bg-yellow-400 border border-yellow-600';
    const colors = ['bg-blue-400', 'bg-green-400', 'bg-purple-400', 'bg-pink-400', 'bg-indigo-400'];
    return colors[(parseInt(block) - 1) % colors.length];
  };

  const getTextColor = (block) => {
    return block === 'free' ? 'text-gray-600' : 'text-white';
  };

  const getBlockTitle = (block, index) => {
    if (block === 'free') return `Free Block ${index}`;
    if (block.toString().startsWith('index-')) {
      return `Index Block for File ${block.split('-')[1]} (Block ${index})`;
    }
    return `Block ${index} - File ${block}`;
  };

  const getFileDetailsForDisplay = (file) => {
    switch (file.allocationType) {
      case 'sequential':
        return `Contiguous blocks from ${file.blocks[0]} to ${file.blocks[file.blocks.length - 1]}`;
      case 'linked':
        return 'Blocks are linked sequentially';
      case 'indexed':
        return `All blocks referenced by index block ${file.indexBlock}`;
      default:
        return '';
    }
  };

  const findFreeBlocks = (size, needsContiguous = false) => {
    const blocks = getBlocksState();
    const freeBlocks = [];
    
    if (needsContiguous) {
      for (let i = 0; i <= blocks.length - size; i++) {
        const sequence = blocks.slice(i, i + size);
        if (sequence.every(block => block === 'free')) {
          return Array.from({ length: size }, (_, index) => i + index);
        }
      }
      return null;
    }
    
    blocks.forEach((block, index) => {
      if (block === 'free') freeBlocks.push(index);
    });
    
    return freeBlocks.length >= size ? freeBlocks : null;
  };

  const getRandomFreeBlocks = (size) => {
    const freeBlocks = findFreeBlocks(size);
    if (!freeBlocks) return null;
    
    // Fisher-Yates shuffle algorithm
    for (let i = freeBlocks.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [freeBlocks[i], freeBlocks[j]] = [freeBlocks[j], freeBlocks[i]];
    }
    
    return freeBlocks.slice(0, size);
  };

  const addFile = () => {
    setErrorMessage('');
    let newBlocks;
    let indexBlock;

    if (allocationType === 'sequential') {
      newBlocks = findFreeBlocks(fileSize, true);
      if (!newBlocks) {
        setErrorMessage('Not enough contiguous blocks available');
        return;
      }
    } else if (allocationType === 'indexed') {
      // Get all free blocks by scanning the disk
      const blocksState = getBlocksState();
      const allFreeBlocks = [];
      blocksState.forEach((block, index) => {
        if (block === 'free') allFreeBlocks.push(index);
      });

      // Need one block for the index and fileSize blocks for file data
      if (allFreeBlocks.length < fileSize + 1) {
        setErrorMessage('Not enough blocks available (including index block)');
        return;
      }
      
      // Randomly select the index block
      const randomIdx = Math.floor(Math.random() * allFreeBlocks.length);
      indexBlock = allFreeBlocks[randomIdx];
      
      // Get remaining free blocks excluding the index block
      const remainingFreeBlocks = allFreeBlocks.filter(b => b !== indexBlock);
      
      // Shuffle remaining free blocks using Fisher-Yates algorithm
      for (let i = remainingFreeBlocks.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [remainingFreeBlocks[i], remainingFreeBlocks[j]] = [remainingFreeBlocks[j], remainingFreeBlocks[i]];
      }
      newBlocks = remainingFreeBlocks.slice(0, fileSize);
    } else { // linked
      newBlocks = getRandomFreeBlocks(fileSize);
      if (!newBlocks) {
        setErrorMessage('Not enough blocks available');
        return;
      }
    }

    const newFile = {
      id: nextFileId,
      size: fileSize,
      blocks: newBlocks,
      allocationType,
      ...(allocationType === 'indexed' && { indexBlock })
    };

    setFiles(prev => [...prev, newFile]);
    setNextFileId(prev => prev + 1);
    setAnimatingBlockId(nextFileId);
    setTimeout(() => setAnimatingBlockId(null), 1000);
  };

  const removeFile = (fileId) => {
    setFiles(prev => prev.filter(file => file.id !== fileId));
    setAnimatingBlockId(fileId);
    setTimeout(() => setAnimatingBlockId(null), 1000);
  };

  const blocks = getBlocksState();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="container max-w-6xl mx-auto">
        <div className="header text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">File Allocation Simulator</h1>
          <p className="text-gray-600">Explore different methods of file allocation in operating systems</p>
          <p className="mt-3">
            <a 
              onClick={()=>{navigate('/fileallocationinfo')}}
              className="text-blue-500 hover:underline font-medium cursor-pointer"
            >
              Learn more about File Allocation Methods
            </a>
          </p>
        </div>
        
        <div className="info-cards grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            {
              title: 'Sequential Allocation',
              color: 'blue',
              description: 'Files are stored in contiguous blocks. Simple but can lead to fragmentation.',
              type: 'sequential'
            },
            {
              title: 'Linked Allocation',
              color: 'green',
              description: 'Each block points to the next block. No external fragmentation but random access is slow.',
              type: 'linked'
            },
            {
              title: 'Indexed Allocation',
              color: 'yellow',
              description: 'Uses an index block that contains pointers to all blocks. Supports direct access.',
              type: 'indexed'
            }
          ].map(card => (
            <div 
              key={card.type}
              onClick={() => setAllocationType(card.type)}
              className={`
                p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300
                ${allocationType === card.type ? 
                  `bg-${card.color}-50 border-2 border-${card.color}-500` : 
                  'bg-white border border-gray-200'
                }
                cursor-pointer transform hover:-translate-y-1
              `}
            >
              <h2 className="text-xl font-bold mb-3 flex items-center">
                <span className={`w-4 h-4 rounded-full mr-3 bg-${card.color}-500`}></span>
                {card.title}
              </h2>
              <p className="text-gray-600">{card.description}</p>
            </div>
          ))}
        </div>
        
        <div className="blocks-section bg-white rounded-xl shadow-lg p-6 mb-12">
          <h2 className="text-2xl font-bold mb-6">Disk Blocks Visualization</h2>
          <div className="blocks-grid grid grid-cols-10 gap-3">
            {blocks.map((block, index) => {
              const isAnimating = (block !== 'free' && 
                (block === animatingBlockId || 
                 (block.toString().startsWith('index-') && 
                  block.split('-')[1] == animatingBlockId)));
              
              return (
                <div 
                  key={index}
                  className={`
                     h-12 flex items-center justify-center text-sm font-bold rounded-lg
                    transition-all duration-300 shadow-sm
                    ${getBlockColor(block)} ${getTextColor(block)}
                    ${isAnimating ? 'animate-pulse shadow-lg scale-110' : ''}
                    hover:scale-105 hover:shadow-md
                  `}
                  title={getBlockTitle(block, index)}
                >
                  {block.toString().startsWith('index-') ? 'I' : ''}{index}
                </div>
              );
            })}
          </div>
          <div className="blocks-info mt-4 text-sm text-gray-600 flex flex-wrap justify-between items-center">
            <span className="font-medium">{blocks.filter(block => block === 'free').length} of {totalBlocks} blocks free</span>
            <div className="blocks-legend flex items-center space-x-6">
              <span className="legend-item flex items-center">
                <span className="legend-indicator w-4 h-4 rounded-md mr-2 bg-yellow-400 border border-yellow-600"></span>
                <span>Index Block</span>
              </span>
              <span className="legend-item flex items-center">
                <span className="legend-indicator w-4 h-4 rounded-md mr-2 bg-gray-200"></span>
                <span>Free Block</span>
              </span>
            </div>
          </div>
        </div>
        
        <div className="controls-section grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="panel-add bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Add New File</h2>
            
            <div className="space-y-6">
              <div className="form-group">
                <label className="block text-gray-700 font-medium mb-2">Total Disk Blocks</label>
                <input
                  type="number"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  value={totalBlocks}
                  onChange={(e) => setTotalBlocks(Math.max(5, Math.min(50, parseInt(e.target.value) || 5)))}
                  min="5"
                  max="50"
                />
                <input 
                  type="range" 
                  min="5" 
                  max="50" 
                  value={totalBlocks}
                  onChange={(e) => setTotalBlocks(parseInt(e.target.value))}
                  className="w-full mt-2 accent-blue-500"
                />
              </div>
              
              <div className="form-group">
                <label className="block text-gray-700 font-medium mb-2">File Size (blocks)</label>
                <input
                  type="number"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  value={fileSize}
                  onChange={(e) => setFileSize(parseInt(e.target.value) || 1)}
                  min="1"
                  max={totalBlocks - 1}
                />
                <input 
                  type="range" 
                  min="1" 
                  max={totalBlocks - 1} 
                  value={fileSize}
                  onChange={(e) => setFileSize(parseInt(e.target.value))}
                  className="w-full mt-2 accent-blue-500"
                />
              </div>
              
              <button
                className="w-full py-3 px-6 bg-blue-500 text-white rounded-lg font-medium
                  shadow-lg hover:bg-blue-600 transform hover:-translate-y-1 transition-all duration-300"
                onClick={addFile}
              >
                Add File
              </button>
              
              {errorMessage && (
                <div className="error-message text-red-600 mt-4 p-4 bg-red-50 rounded-lg border border-red-200 animate-pulse">
                  {errorMessage}
                </div>
              )}
            </div>
          </div>
          
          <div className="panel-files bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Current Files</h2>
            
            {files.length === 0 ? (
              <div className="no-files text-gray-500 p-6 border-2 border-dashed border-gray-200 rounded-lg text-center">
                <p className="text-lg">No files allocated yet</p>
                <p className="text-sm mt-2">Add a new file to see it here</p>
              </div>
            ) : (
              <div className="files-list space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {files.map(file => {
                  const isAnimating = file.id === animatingBlockId;
                  
                  return (
                    <div 
                      key={file.id} 
                      className={`
                        file-item p-5 border border-gray-200 rounded-lg shadow-sm
                        ${isAnimating ? 'animate-pulse' : ''} 
                        hover:shadow-md transition-all duration-300
                      `}
                    >
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-xl font-bold flex items-center">
                          <span className={`w-5 h-5 rounded-full mr-3 ${getBlockColor(file.id)}`}></span>
                          File {file.id}
                        </span>
                        <button
                          className="py-2 px-4 bg-red-500 text-white rounded-lg hover:bg-red-600 
                            transform hover:-translate-y-1 transition-all duration-300"
                          onClick={() => removeFile(file.id)}
                        >
                          Delete
                        </button>
                      </div>
                      <div className="space-y-2 text-gray-600">
                        <p>Size: {file.size} blocks</p>
                        <p>Method: {file.allocationType}</p>
                        {file.allocationType === 'indexed' && (
                          <p>Index Block: {file.indexBlock}</p>
                        )}
                        <p>{getFileDetailsForDisplay(file)}</p>
                        <div className="mt-3 p-3 bg-gray-50 rounded-lg text-sm">
                          <span className="font-medium">Blocks: </span>
                          <span className="font-mono">{file.blocks.join(', ')}</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
        
        <footer className="mt-12 text-center text-gray-500">
          <p className="text-sm">File Allocation Methods Simulator © 2025</p>
        </footer>
      </div>
    </div>
  );
};

export default FileAllocation;

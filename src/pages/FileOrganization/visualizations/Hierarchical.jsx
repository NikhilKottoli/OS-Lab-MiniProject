import React, { useState, useEffect, useRef } from 'react';
import AnsiToHtml from 'ansi-to-html';
import { Folder, FileText, ChevronRight, ChevronDown, Terminal, Trash2 } from 'lucide-react';
const ansiConverter = new AnsiToHtml();
const fileStructure = [
  {
    name: 'Documents',
    type: 'folder',
    children: [
      { name: 'Resume.pdf', type: 'file' },
      
    ],
  },
  {
    name: 'Pictures',
    type: 'folder',
    children: [{ name: 'OperatingSystems.jpg', type: 'file' }],
  },
  { name: 'todo.txt', type: 'file' },
];

const generateId = () => Math.random().toString(36).substr(2, 9);

const processNode = (node, parentId = null) => ({
  ...node,
  id: generateId(),
  parentId,
  children: node.children?.map(child => processNode(child, node.id)) || [],
});

const initialNodes = fileStructure.map(node => processNode(node));

const TreeNode = ({ node, onContextMenu }) => {
  const [expanded, setExpanded] = useState(false);
  const isFolder = node.type === 'folder';

  return (
    <div
      className="group relative ml-4"
      onContextMenu={(e) => onContextMenu(e, node)}
    >
      <div className="flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-purple-50 transition-colors">
        {isFolder && (
          <button
            className="text-purple-600"
            onClick={() => setExpanded(!expanded)}
          >
            {expanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
          </button>
        )}

        {isFolder ? (
          <Folder className="text-purple-500" size={20} />
        ) : (
          <FileText className="text-gray-500" size={20} />
        )}

        <span className="text-gray-700 text-base flex-1">
          {node.name}
        </span>
      </div>

      {isFolder && expanded && (
        <div className="ml-6 border-l-2 border-purple-100 pl-2">
          {node.children.map(child => (
            <TreeNode
              key={child.id}
              node={child}
              onContextMenu={onContextMenu}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const Hierarchical = () => {
  const [nodes, setNodes] = useState(initialNodes);
  const [contextMenu, setContextMenu] = useState(null);
  const [commandHistory, setCommandHistory] = useState([]);
  const [currentPath, setCurrentPath] = useState([]);
  const [commandInput, setCommandInput] = useState('');
  const terminalEndRef = useRef(null);

  const getDirectoryListing = (nodes, path) => {
    let currentFolder = nodes;
    
    for (const segment of path) {
      const folder = currentFolder.find(n => n.name === segment && n.type === 'folder');
      if (!folder) return 'Directory not found';
      currentFolder = folder.children || [];
    }
    
    if (!currentFolder || currentFolder.length === 0) {
      return 'Empty directory';
    }
    
    return currentFolder.map(child => {
      const isDir = child.type === 'folder';
      return isDir ? `\x1b[1;32m${child.name}/\x1b[0m` : child.name;
    }).join('  ');
  };

  const findNode = (id, arr) => {
    for (const node of arr) {
      if (node.id === id) return node;
      if (node.children?.length) {
        const found = findNode(id, node.children);
        if (found) return found;
      }
    }
    return null;
  };

  const findNodeById = (id) => findNode(id, nodes);

  const findNodeByName = (name, parentId) => {
    const parent = parentId ? findNodeById(parentId) : { children: nodes };
    return parent?.children?.find(child => child.name === name);
  };

  const updateNodes = (id, arr, callback) => {
    return arr.map(node => {
      if (node.id === id) return callback(node);
      if (node.children?.length) {
        return { ...node, children: updateNodes(id, node.children, callback) };
      }
      return node;
    });
  };

  const getFullPath = (nodeId) => {
    const path = [];
    let current = findNodeById(nodeId);
    
    while (current) {
      path.unshift(current.name);
      current = current.parentId ? findNodeById(current.parentId) : null;
    }
    
    return path;
  };

  const getPathString = (path = currentPath) => {
    return path.length === 0 ? '~' : `~/${path.join('/')}`;
  };

 

  const handleAdd = (parentId, type, name) => {
    const parent = parentId ? findNodeById(parentId) : { children: nodes };
    if (!parent) throw new Error('Parent folder not found');
    if (parent.children?.some(child => child.name === name)) {
      throw new Error(`A node with the name "${name}" already exists in this folder.`);
    }
    if (name.includes('/')) {
      throw new Error('Name cannot contain slashes.');
    }

    const newNode = {
      id: generateId(),
      name,
      type,
      parentId,
      children: type === 'folder' ? [] : undefined,
    };

    setNodes(prev => parentId 
      ? updateNodes(parentId, prev, node => ({
          ...node,
          children: [...node.children, newNode],
        })) 
      : [...prev, newNode]
    );

    
    
  };

  const handleDelete = (id) => {
    const nodeToDelete = findNodeById(id);
    if (!nodeToDelete) return;
    
  
    setNodes(prev => {
      if (!nodeToDelete.parentId) {
        return prev.filter(node => node.id !== id);
      }
      
      return updateNodes(nodeToDelete.parentId, prev, parent => ({
        ...parent,
        children: parent.children.filter(child => child.id !== id),
      }));
    });
    
    
  };

  const executeCommand = (command) => {
    const cmd = command.trim().split(' ');
    const [action, ...args] = cmd;
    let output = '';
    let newPath = [...currentPath];
    
    try {
      switch(action.toLowerCase()) {
        case 'mkdir':
          if (!args[0]) throw new Error('Missing folder name');
          handleAdd(getCurrentFolderId(), 'folder', args[0]);
          break;
          
        case 'touch':
          if (!args[0]) throw new Error('Missing file name');
          handleAdd(getCurrentFolderId(), 'file', args[0]);
          break;
          
        case 'rm':
          if (!args[0]) throw new Error('Missing file/folder name');
          const nodeToDelete = findNodeByName(args[0], getCurrentFolderId());
          if (!nodeToDelete) throw new Error('File/folder not found');
          handleDelete(nodeToDelete.id);
          break;
          
        case 'cd':
          if (!args[0] || args[0] === '~') {
            newPath = [];
          } else if (args[0] === '..') {
            if (newPath.length > 0) {
              newPath = newPath.slice(0, -1);
            } else {
              throw new Error('Already at root directory');
            }
          } else {
            const folder = findNodeByName(args[0], getCurrentFolderId());
            if (!folder) throw new Error(`Directory not found: ${args[0]}`);
            if (folder.type !== 'folder') throw new Error(`Not a directory: ${args[0]}`);
            newPath = [...newPath, folder.name];
          }
          setCurrentPath(newPath);
          output = '';
          break;
          
        case 'ls':
          output = getDirectoryListing(nodes, currentPath);
          break;
          
        case 'pwd':
          output = `/${currentPath.join('/')}`;
          break;
          
        default:
          output = `Command not found: ${action}`;
      }
    } catch (error) {
      output = `Error: ${error.message}`;
    }
    
    setCommandHistory(prev => [
      ...prev, 
      { command, output, path: newPath }
    ]);
  };

  const getCurrentFolderId = () => {
    if (currentPath.length === 0) return null;

    let currentFolder = nodes.find(n => n.name === currentPath[0]);
    if (!currentFolder) return null;

    for (let i = 1; i < currentPath.length; i++) {
      currentFolder = currentFolder.children?.find(c => c.name === currentPath[i]);
      if (!currentFolder) return null;
    }

    return currentFolder.id;
  };

  const handleTerminalSubmit = (e) => {
    e.preventDefault();
    if (!commandInput) return;
    executeCommand(commandInput);
    setCommandInput('');
  };

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [commandHistory]);

  useEffect(() => {
    const handleClickOutside = () => {
      if (contextMenu) setContextMenu(null);
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [contextMenu]);

  useEffect(() => {
   
    if (commandHistory.length === 0) {
      setCommandHistory([{
        command: 'ls',
        output: getDirectoryListing(nodes, []),
        path: []
      }]);
    }
  }, []);

  return (
    <div className="flex gap-6 p-6 max-w-6xl mx-auto h-[90vh]">
    
      <div className="flex-1 bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-purple-600 flex items-center gap-3">
            <Folder size={24} /> File Explorer
          </h2>
        </div>

        <div className="space-y-1 border rounded-lg p-3 bg-gray-50">
          {nodes.map(node => (
            <TreeNode
              key={node.id}
              node={node}
              onContextMenu={(e, node) => {
                e.preventDefault();
                setContextMenu({
                  x: e.clientX,
                  y: e.clientY,
                  node,
                });
              }}
            />
          ))}
        </div>

        {contextMenu && (
          <div
            className="absolute bg-white border rounded-lg shadow-xl p-2 z-50 min-w-[160px]"
            style={{ left: contextMenu.x, top: contextMenu.y }}
          >
            <button
              className="flex items-center gap-3 w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-md"
              onClick={() => {
                executeCommand(`rm ${contextMenu.node.type === 'folder' ? '-r ' : ''}${contextMenu.node.name}`);
                setContextMenu(null);
              }}
            >
              <Trash2 size={16} /> Delete (via terminal)
            </button>
          </div>
        )}
      </div>

      
      <div className="flex-1 bg-gray-900 rounded-xl shadow-lg flex flex-col">
        <div className="p-4 border-b border-gray-800 flex items-center gap-2">
          <Terminal className="text-green-400" size={20} />
          <span className="text-gray-300 font-mono">Terminal</span>
        </div>
        
        <div className="flex-1 overflow-auto p-4 font-mono text-sm">
          {commandHistory.map((entry, idx) => (
            <div key={idx} className="mb-2">
              <div className="flex items-center text-sm">
                <span className="text-blue-400 mr-2">
                  {entry.path ? `~/${entry.path.join('/')}` : '~'}
                </span>
                <span className="text-green-400 mr-2">$</span>
                <span className="text-gray-300">{entry.command}</span>
              </div>
              {entry.output && (
                <div className="text-gray-300 whitespace-pre-wrap mt-1 ml-4">
                  <div
  style={{
    whiteSpace: 'pre-wrap',
    fontFamily: 'monospace',
  }}
  dangerouslySetInnerHTML={{
    __html: ansiConverter.toHtml(entry.output || ''),
  }}
/>

                </div>
              )}
            </div>
          ))}
          <div ref={terminalEndRef} />
        </div>

        <form onSubmit={handleTerminalSubmit} className="p-4 border-t border-gray-800">
          <div className="flex items-center gap-2">
            <span className="text-blue-400">{getPathString()}</span>
            <span className="text-green-400">$</span>
            <input
              type="text"
              value={commandInput}
              onChange={(e) => setCommandInput(e.target.value)}
              className="flex-1 bg-transparent text-gray-300 outline-none font-mono"
              placeholder="Enter command (mkdir, touch, rm, cd, ls, pwd)..."
            />
          </div>
        </form>
      </div>
    </div>
  );
};
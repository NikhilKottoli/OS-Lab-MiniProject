import React, { useState, useEffect, useRef } from 'react';
import { Folder, FileText, Plus, Trash2, Edit3, ChevronRight, ChevronDown, File, FolderPlus, Terminal, X } from 'lucide-react';

const fileStructure = [
  {
    name: 'Documents',
    type: 'folder',
    children: [
      { name: 'Resume.pdf', type: 'file' },
      {
        name: 'Project',
        type: 'folder',
        children: [{ name: 'report.docx', type: 'file' }],
      },
    ],
  },
  {
    name: 'Pictures',
    type: 'folder',
    children: [{ name: 'Vacation.jpg', type: 'file' }],
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

const TreeNode = ({ node, onAdd, onDelete, onRename, onContextMenu }) => {
  const [expanded, setExpanded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(node.name);
  const isFolder = node.type === 'folder';

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newName.trim()) {
      onRename(node.id, newName);
      setIsEditing(false);
    }
  };

  return (
    <div
      className="group relative ml-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onContextMenu={(e) => onContextMenu(e, node)}
    >
      <div className="flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-purple-50 transition-colors">
        <button
          className={`text-purple-600 ${!isFolder && 'invisible'}`}
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
        </button>

        {isFolder ? (
          <Folder className="text-purple-500" size={20} />
        ) : (
          <FileText className="text-gray-500" size={20} />
        )}

        {isEditing ? (
          <form onSubmit={handleSubmit} className="flex-1">
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              autoFocus
              className="w-full border-b-2 border-purple-500 bg-transparent outline-none text-gray-700"
              onBlur={handleSubmit}
            />
          </form>
        ) : (
          <span 
            className="text-gray-700 text-base flex-1"
            onDoubleClick={() => setIsEditing(true)}
          >
            {node.name}
          </span>
        )}

        <div className={`flex items-center gap-2 ml-2 ${isHovered ? 'opacity-100' : 'opacity-0'} transition-opacity`}>
          {isFolder && (
            <>
              <button
                className="text-gray-400 hover:text-purple-600 p-1.5 rounded-md hover:bg-purple-100"
                onClick={() => onAdd(node.id, 'file')}
                title="Add File"
              >
                <File size={16} />
              </button>
              <button
                className="text-gray-400 hover:text-purple-600 p-1.5 rounded-md hover:bg-purple-100"
                onClick={() => onAdd(node.id, 'folder')}
                title="Add Folder"
              >
                <FolderPlus size={16} />
              </button>
            </>
          )}
          <button
            className="text-gray-400 hover:text-purple-600 p-1.5 rounded-md hover:bg-purple-100"
            onClick={() => setIsEditing(true)}
            title="Rename"
          >
            <Edit3 size={16} />
          </button>
          <button
            className="text-gray-400 hover:text-red-600 p-1.5 rounded-md hover:bg-red-100"
            onClick={() => onDelete(node.id)}
            title="Delete"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {isFolder && expanded && (
        <div className="ml-6 border-l-2 border-purple-100 pl-2">
          {node.children.map(child => (
            <TreeNode
              key={child.id}
              node={child}
              onAdd={onAdd}
              onDelete={onDelete}
              onRename={onRename}
              onContextMenu={onContextMenu}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const NamePromptModal = ({ isOpen, onClose, type, onSubmit }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setName('');
      setError('');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name cannot be empty');
      return;
    }
    if (name.includes('/')) {
      setError('Name cannot contain slashes');
      return;
    }
    onSubmit(name);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-96 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            {type === 'folder' ? (
              <><FolderPlus size={20} className="text-purple-600" /> New Folder</>
            ) : (
              <><File size={20} className="text-blue-600" /> New File</>
            )}
          </h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              ref={inputRef}
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              className={`w-full p-3 border rounded-lg ${
                error ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm`}
              placeholder={`Enter ${type} name...`}
            />
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
          </div>
          
          <div className="mt-6 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg border border-gray-300"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2"
            >
              <Plus size={16} /> Create {type === 'folder' ? 'Folder' : 'File'}
            </button>
          </div>
        </form>
      </div>
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
  const [showNameModal, setShowNameModal] = useState({
    open: false,
    type: null,
    parentId: null,
    pathCommands: '',
  });

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

  // Get the full path to a node
  const getFullPath = (nodeId) => {
    const path = [];
    let current = findNodeById(nodeId);
    
    while (current) {
      path.unshift(current.name);
      current = current.parentId ? findNodeById(current.parentId) : null;
    }
    
    return path;
  };

  // Format the current path string for display
  const getPathString = (path = currentPath) => {
    return path.length === 0 ? '~' : `~/${path.join('/')}`;
  };

  // Add path navigation commands to command history
  const addPathNavigationCommands = (nodeId) => {
    if (!nodeId) return [];
    
    const targetPath = getFullPath(nodeId);
    if (targetPath.length === 0) return [];
    
    // Start with a fresh path
    const commands = [{ command: 'cd', output: '', path: [] }];
    
    // Navigate through each segment
    const pathSoFar = [];
    targetPath.forEach(segment => {
      pathSoFar.push(segment);
      commands.push({ 
        command: `cd ${segment}`, 
        output: '', 
        path: [...pathSoFar] 
      });
    });
    
    return commands;
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

    // Add path navigation and creation commands to history
    const pathCommands = addPathNavigationCommands(parentId);
    const targetPath = parentId ? getFullPath(parentId) : [];
    const cmd = type === 'folder' ? `mkdir ${name}` : `touch ${name}`;
    
    setCommandHistory(prev => [
      ...prev, 
      ...pathCommands, 
      { command: cmd, output: '', path: targetPath }
    ]);
  };

  const handleDelete = (id) => {
    const nodeToDelete = findNodeById(id);
    if (!nodeToDelete) return;
    
    // Add path navigation commands to history
    const targetPath = nodeToDelete.parentId ? getFullPath(nodeToDelete.parentId) : [];
    const pathCommands = nodeToDelete.parentId 
      ? addPathNavigationCommands(nodeToDelete.parentId) 
      : [];
    
    setNodes(prev => {
      // Handle top-level node
      if (!nodeToDelete.parentId) {
        return prev.filter(node => node.id !== id);
      }
      
      // Handle nested node
      return updateNodes(nodeToDelete.parentId, prev, parent => ({
        ...parent,
        children: parent.children.filter(child => child.id !== id),
      }));
    });
    
    setCommandHistory(prev => [
      ...prev, 
      ...pathCommands, 
      { 
        command: `rm ${nodeToDelete.type === 'folder' ? '-r ' : ''}${nodeToDelete.name}`, 
        output: '', 
        path: targetPath 
      }
    ]);
  };

  const handleRename = (id, newName) => {
    const node = findNodeById(id);
    if (!node) return;
    
    const parent = node.parentId ? findNodeById(node.parentId) : { children: nodes };
    if (parent.children.some(child => child.id !== id && child.name === newName)) {
      throw new Error(`A node with the name "${newName}" already exists in this folder.`);
    }
    if (newName.includes('/')) {
      throw new Error('Name cannot contain slashes.');
    }

    // Add path navigation commands to history
    const targetPath = node.parentId ? getFullPath(node.parentId) : [];
    const pathCommands = node.parentId 
      ? addPathNavigationCommands(node.parentId) 
      : [];
    
    setNodes(prev => updateNodes(id, prev, node => ({
      ...node,
      name: newName,
    })));
    
    setCommandHistory(prev => [
      ...prev, 
      ...pathCommands, 
      { 
        command: `mv ${node.name} ${newName}`, 
        output: '', 
        path: targetPath 
      }
    ]);
  };

  const handleAddWithModal = (parentId, type) => {
    const pathCommands = parentId 
      ? getFullPath(parentId).join('/') 
      : '';
    
    setShowNameModal({
      open: true,
      type,
      parentId,
      pathCommands,
    });
  };

  const handleModalSubmit = (name) => {
    const { parentId, type } = showNameModal;
    
    try {
      handleAdd(parentId, type, name);
      setShowNameModal({ open: false, type: null, parentId: null, pathCommands: '' });
    } catch (error) {
      alert(error.message);
    }
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
          break;
          
        case 'ls':
          const currentFolder = currentPath.length === 0 
            ? { children: nodes } 
            : findNodeById(getCurrentFolderId());
            
          if (!currentFolder || !currentFolder.children) {
            output = 'No files or directories';
          } else {
            const listItems = currentFolder.children.map(child => {
              const isDir = child.type === 'folder';
              return isDir ? `\x1b[1;34m${child.name}/\x1b[0m` : child.name;
            });
            output = listItems.length > 0 ? listItems.join('  ') : 'Empty directory';
          }
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
      { command, output, path: currentPath }
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

  // Handle clicking outside of context menu
  useEffect(() => {
    const handleClickOutside = () => {
      if (contextMenu) setContextMenu(null);
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [contextMenu]);

  return (
    <div className="flex gap-6 p-6 max-w-6xl mx-auto h-[90vh]">
      {/* File Explorer Panel */}
      <div className="flex-1 bg-white rounded-xl shadow-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-purple-600 flex items-center gap-3">
            <Folder size={24} /> File Explorer
          </h2>
          <div className="flex gap-2">
            <button
              className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
              onClick={() => handleAddWithModal(null, 'folder')}
            >
              <FolderPlus size={18} /> New Folder
            </button>
            <button
              className="flex items-center gap-2 px-4 py-2 bg-purple-100 text-purple-600 rounded-lg hover:bg-purple-200 transition-colors"
              onClick={() => handleAddWithModal(null, 'file')}
            >
              <File size={18} /> New File
            </button>
          </div>
        </div>

        <div className="space-y-1 border rounded-lg p-3 bg-gray-50">
          {nodes.map(node => (
            <TreeNode
              key={node.id}
              node={node}
              onAdd={handleAddWithModal}
              onDelete={handleDelete}
              onRename={handleRename}
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
            {contextMenu.node.type === 'folder' && (
              <>
                <button
                  className="flex items-center gap-3 w-full px-4 py-2 hover:bg-purple-50 rounded-md"
                  onClick={() => {
                    handleAddWithModal(contextMenu.node.id, 'folder');
                    setContextMenu(null);
                  }}
                >
                  <FolderPlus size={16} /> New Folder
                </button>
                <button
                  className="flex items-center gap-3 w-full px-4 py-2 hover:bg-purple-50 rounded-md"
                  onClick={() => {
                    handleAddWithModal(contextMenu.node.id, 'file');
                    setContextMenu(null);
                  }}
                >
                  <File size={16} /> New File
                </button>
                <div className="border-t my-1" />
              </>
            )}
            <button
              className="flex items-center gap-3 w-full px-4 py-2 hover:bg-purple-50 rounded-md"
              onClick={() => {
                const newName = prompt("New name:", contextMenu.node.name);
                if (newName && newName !== contextMenu.node.name) {
                  try {
                    handleRename(contextMenu.node.id, newName);
                  } catch (error) {
                    alert(error.message);
                  }
                }
                setContextMenu(null);
              }}
            >
              <Edit3 size={16} /> Rename
            </button>
            <button
              className="flex items-center gap-3 w-full px-4 py-2 text-red-600 hover:bg-red-50 rounded-md"
              onClick={() => {
                handleDelete(contextMenu.node.id);
                setContextMenu(null);
              }}
            >
              <Trash2 size={16} /> Delete
            </button>
          </div>
        )}
      </div>

      {/* Terminal Panel */}
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
              {entry.output && <div className="text-gray-300 whitespace-pre-wrap mt-1 ml-4">{entry.output}</div>}
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
              placeholder="Enter command (mkdir, touch, rm, cd, ls)..."
            />
          </div>
        </form>
      </div>
      
      {/* Name Prompt Modal */}
      <NamePromptModal
        isOpen={showNameModal.open}
        onClose={() => setShowNameModal({ open: false, type: null, parentId: null, pathCommands: '' })}
        type={showNameModal.type}
        onSubmit={handleModalSubmit}
      />
    </div>
  );
};
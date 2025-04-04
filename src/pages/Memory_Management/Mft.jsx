import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const MFT = () => {
    const [totalMemory, setTotalMemory] = useState(1000);
    const [blockSize, setBlockSize] = useState(300);
    const [numProcesses, setNumProcesses] = useState(5);
    const [processMemory, setProcessMemory] = useState({
        1: 275,
        2: 400,
        3: 290,
        4: 293,
        5: 100
    });
    const [results, setResults] = useState(null);
    const [showInputForm, setShowInputForm] = useState(true);
    const [animationComplete, setAnimationComplete] = useState(false);

    const handleProcessMemoryChange = (processId, value) => {
        setProcessMemory({
            ...processMemory,
            [processId]: parseInt(value) || 0
        });
    };

    const calculateAllocation = () => {
        const numBlocks = Math.floor(totalMemory / blockSize);

        const externalFragmentation = totalMemory - (numBlocks * blockSize);


        const blocks = Array(numBlocks).fill().map((_, index) => ({
            id: index + 1,
            size: blockSize,
            process: null,
            internalFragmentation: 0
        }));


        const allocationResults = [];
        let totalInternalFragmentation = 0;
        let allocatedBlocks = 0;


        for (let i = 1; i <= numProcesses; i++) {
            const requiredMemory = processMemory[i];
            let allocated = false;
            let blockId = null;
            let internalFrag = 0;


            if (requiredMemory <= blockSize && allocatedBlocks < numBlocks) {
                blockId = allocatedBlocks + 1;
                internalFrag = blockSize - requiredMemory;
                totalInternalFragmentation += internalFrag;


                blocks[allocatedBlocks].process = i;
                blocks[allocatedBlocks].internalFragmentation = internalFrag;
                allocatedBlocks++;
                allocated = true;
            }


            allocationResults.push({
                processId: i,
                memoryRequired: requiredMemory,
                allocated,
                blockId,
                internalFragmentation: allocated ? internalFrag : 0
            });
        }

        setResults({
            blocks,
            allocationResults,
            totalInternalFragmentation,
            externalFragmentation,
            unusedBlocks: numBlocks - allocatedBlocks
        });

        setShowInputForm(false);
        setAnimationComplete(false);

        setTimeout(() => {
            setAnimationComplete(true);
        }, 500);
    };

    const resetSimulation = () => {
        setResults(null);
        setShowInputForm(true);
        setAnimationComplete(false);
    };

    const getProcessColor = (processId) => {
        const colors = [
            '#4299E1', '#48BB78', '#9F7AEA',
            '#ECC94B', '#ED64A6', '#667EEA'
        ];
        return colors[(processId - 1) % colors.length];
    };

    const getProcessColorClass = (processId) => {
        const colors = [
            'bg-blue-500', 'bg-green-500', 'bg-purple-500',
            'bg-yellow-500', 'bg-pink-500', 'bg-indigo-500'
        ];
        return colors[(processId - 1) % colors.length];
    };

    return (
        <div className="max-w-6xl mx-auto p-6 font-sans bg-gray-50 min-h-screen">
            <motion.h1
                className="text-3xl font-bold mb-8 text-center text-indigo-800"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                MFT Memory Allocation Simulator
            </motion.h1>

            {showInputForm ? (
                <motion.div
                    className="bg-white p-8 rounded-xl shadow-lg"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                >
                    <h2 className="text-2xl font-semibold mb-6 text-center text-indigo-700">Simulation Parameters</h2>

                    <div className="grid gap-6 mb-8">
                        <motion.div
                            className="flex items-center"
                            whileHover={{ scale: 1.01 }}
                            transition={{ duration: 0.2 }}
                        >
                            <label className="w-80 text-gray-700 font-medium">Total memory available (Bytes):</label>
                            <input
                                type="number"
                                value={totalMemory}
                                onChange={(e) => setTotalMemory(parseInt(e.target.value) || 0)}
                                className="px-4 py-3 border border-indigo-200 rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                            />
                        </motion.div>

                        <motion.div
                            className="flex items-center"
                            whileHover={{ scale: 1.01 }}
                            transition={{ duration: 0.2 }}
                        >
                            <label className="w-80 text-gray-700 font-medium">Block size (Bytes):</label>
                            <input
                                type="number"
                                value={blockSize}
                                onChange={(e) => setBlockSize(parseInt(e.target.value) || 0)}
                                className="px-4 py-3 border border-indigo-200 rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                            />
                        </motion.div>

                        <motion.div
                            className="flex items-center"
                            whileHover={{ scale: 1.01 }}
                            transition={{ duration: 0.2 }}
                        >
                            <label className="w-80 text-gray-700 font-medium">Number of processes:</label>
                            <input
                                type="number"
                                value={numProcesses}
                                onChange={(e) => {
                                    const value = parseInt(e.target.value) || 0;
                                    setNumProcesses(value);

                                    const newProcessMemory = { ...processMemory };
                                    for (let i = 1; i <= value; i++) {
                                        if (!newProcessMemory[i]) {
                                            newProcessMemory[i] = 0;
                                        }
                                    }
                                    setProcessMemory(newProcessMemory);
                                }}
                                className="px-4 py-3 border border-indigo-200 rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                                min="1"
                            />
                        </motion.div>
                    </div>

                    <h3 className="font-medium mb-4 text-lg text-indigo-700">Memory required for each process:</h3>
                    <div className="grid gap-4 mb-8">
                        {Array.from({ length: numProcesses }).map((_, index) => (
                            <motion.div
                                key={index}
                                className="flex items-center"
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3, delay: index * 0.1 }}
                                whileHover={{ scale: 1.01 }}
                            >
                                <div className="w-8 h-8 rounded-full mr-4 flex items-center justify-center text-white font-medium" style={{ backgroundColor: getProcessColor(index + 1) }}>
                                    P{index + 1}
                                </div>
                                <label className="w-72 text-gray-700">Memory required for process {index + 1} (Bytes):</label>
                                <input
                                    type="number"
                                    value={processMemory[index + 1] || ''}
                                    onChange={(e) => handleProcessMemoryChange(index + 1, e.target.value)}
                                    className="px-4 py-3 border border-indigo-200 rounded-lg flex-1 focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
                                    min="1"
                                />
                            </motion.div>
                        ))}
                    </div>

                    <motion.div
                        className="flex items-center p-4 bg-indigo-50 rounded-lg"
                        whileHover={{ scale: 1.01 }}
                        transition={{ duration: 0.2 }}
                    >
                        <label className="w-80 text-gray-700 font-medium">Blocks available in memory:</label>
                        <span className="px-4 py-3 bg-white rounded-lg flex-1 font-semibold text-indigo-700">
                            {Math.floor(totalMemory / blockSize)}
                        </span>
                    </motion.div>

                    <div className="mt-8 text-center">
                        <motion.button
                            onClick={calculateAllocation}
                            className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-md"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Run Memory Allocation
                        </motion.button>
                    </div>
                </motion.div>
            ) : (
                <div>
                    <motion.div
                        className="bg-white p-8 rounded-xl shadow-lg mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-2xl font-semibold mb-6 text-center text-indigo-700">Memory Allocation Results</h2>

                        <div className="mb-10">
                            <h3 className="text-xl font-medium mb-4 text-indigo-600">Process Allocation Status</h3>
                            <div className="overflow-x-auto rounded-lg border border-indigo-100">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="bg-indigo-50">
                                            <th className="border-b border-indigo-100 px-6 py-3 text-left">Process</th>
                                            <th className="border-b border-indigo-100 px-6 py-3 text-left">Memory Required</th>
                                            <th className="border-b border-indigo-100 px-6 py-3 text-left">Status</th>
                                            <th className="border-b border-indigo-100 px-6 py-3 text-left">Internal Fragmentation</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {results.allocationResults.map((result) => (
                                            <motion.tr
                                                key={result.processId}
                                                initial={{ opacity: 0, backgroundColor: "#EBF4FF" }}
                                                animate={{
                                                    opacity: 1,
                                                    backgroundColor: "#ffffff"
                                                }}
                                                transition={{ duration: 0.5, delay: result.processId * 0.2 }}
                                            >
                                                <td className="border-b border-indigo-50 px-6 py-4">
                                                    <div className="flex items-center">
                                                        <div className="w-8 h-8 rounded-full mr-3 flex items-center justify-center text-white font-medium" style={{ backgroundColor: getProcessColor(result.processId) }}>
                                                            P{result.processId}
                                                        </div>
                                                        <span>Process {result.processId}</span>
                                                    </div>
                                                </td>
                                                <td className="border-b border-indigo-50 px-6 py-4">{result.memoryRequired} Bytes</td>
                                                <td className="border-b border-indigo-50 px-6 py-4">
                                                    {result.allocated ? (
                                                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full font-medium">Allocated</span>
                                                    ) : (
                                                        <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full font-medium">Not Allocated</span>
                                                    )}
                                                </td>
                                                <td className="border-b border-indigo-50 px-6 py-4">
                                                    {result.allocated ? (
                                                        <span>{result.internalFragmentation} Bytes</span>
                                                    ) : (
                                                        <span className="text-gray-400">—</span>
                                                    )}
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {results.allocationResults.some(r => !r.allocated) && (
                                <motion.p
                                    className="mt-4 font-medium p-3 bg-amber-50 border-l-4 border-amber-500 text-amber-800 rounded-r"
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.5, delay: 0.8 }}
                                >
                                    Memory is full! Remaining processes cannot be accommodated.
                                </motion.p>
                            )}

                            <motion.div
                                className="mt-6 grid grid-cols-2 gap-4"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.5, delay: 1 }}
                            >
                                <div className="p-4 bg-indigo-50 rounded-lg">
                                    <span className="font-medium">Total Internal Fragmentation:</span> {results.totalInternalFragmentation} Bytes
                                </div>
                                <div className="p-4 bg-purple-50 rounded-lg">
                                    <span className="font-medium">Total External Fragmentation:</span> {results.externalFragmentation} Bytes
                                </div>
                            </motion.div>
                        </div>

                        <h3 className="text-xl font-medium mb-4 text-indigo-600">Memory Visualization</h3>
                        <div className="mb-8">
                            <div className="flex flex-col space-y-4">
                                {results.blocks.map((block, index) => (
                                    <div key={index} className="flex items-center">
                                        <div className="w-32 text-right pr-4 font-medium text-gray-600">
                                            Block {block.id}:
                                        </div>
                                        <div className="flex-1 h-16 bg-gray-100 border border-gray-200 rounded-lg overflow-hidden relative">
                                            {block.process ? (
                                                <div className="flex h-full">
                                                    <motion.div
                                                        className={`${getProcessColorClass(block.process)} h-full flex items-center justify-center text-white font-medium`}
                                                        style={{ width: `${(processMemory[block.process] / blockSize) * 100}%` }}
                                                        initial={{ width: 0 }}
                                                        animate={{
                                                            width: animationComplete ? `${(processMemory[block.process] / blockSize) * 100}%` : 0
                                                        }}
                                                        transition={{
                                                            duration: 0.8,
                                                            type: "spring",
                                                            delay: 0.2 * index
                                                        }}
                                                    >
                                                        P{block.process} ({processMemory[block.process]} B)
                                                    </motion.div>
                                                    {block.internalFragmentation > 0 && (
                                                        <motion.div
                                                            className="bg-gray-400 h-full flex items-center justify-center text-white font-medium"
                                                            style={{ width: `${(block.internalFragmentation / blockSize) * 100}%` }}
                                                            initial={{ width: 0, opacity: 0 }}
                                                            animate={{
                                                                width: animationComplete ? `${(block.internalFragmentation / blockSize) * 100}%` : 0,
                                                                opacity: animationComplete ? 0.7 : 0
                                                            }}
                                                            transition={{
                                                                duration: 0.5,
                                                                delay: 0.2 * index + 0.8
                                                            }}
                                                        >
                                                            Frag ({block.internalFragmentation} B)
                                                        </motion.div>
                                                    )}
                                                </div>
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center text-gray-500 font-medium">
                                                    Free Block ({blockSize} B)
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {results.externalFragmentation > 0 && (
                                <motion.div
                                    className="flex items-center mt-4"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ duration: 0.5, delay: 1.2 }}
                                >
                                    <div className="w-32 text-right pr-4 font-medium text-gray-600">
                                        Unused:
                                    </div>
                                    <div
                                        className="flex-1 h-12 bg-gray-200 border border-gray-300 rounded-lg flex items-center justify-center text-gray-700 font-medium"
                                    >
                                        External Fragmentation ({results.externalFragmentation} B)
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        <div className="mt-8 text-center">
                            <motion.button
                                onClick={resetSimulation}
                                className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition-colors shadow-md"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Run New Simulation
                            </motion.button>
                        </div>
                    </motion.div>

                    <motion.div
                        className="bg-white p-8 rounded-xl shadow-lg"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <h3 className="text-xl font-medium mb-4 text-indigo-600">Memory Statistics</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <motion.div
                                className="p-4 bg-blue-50 rounded-lg shadow-sm"
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="text-sm text-blue-500 font-medium">Total Memory</div>
                                <div className="text-2xl font-bold text-blue-700">{totalMemory} Bytes</div>
                            </motion.div>

                            <motion.div
                                className="p-4 bg-green-50 rounded-lg shadow-sm"
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="text-sm text-green-500 font-medium">Block Size</div>
                                <div className="text-2xl font-bold text-green-700">{blockSize} Bytes</div>
                            </motion.div>

                            <motion.div
                                className="p-4 bg-yellow-50 rounded-lg shadow-sm"
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="text-sm text-yellow-600 font-medium">Number of Blocks</div>
                                <div className="text-2xl font-bold text-yellow-700">{Math.floor(totalMemory / blockSize)}</div>
                            </motion.div>

                            <motion.div
                                className="p-4 bg-purple-50 rounded-lg shadow-sm"
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="text-sm text-purple-500 font-medium">Allocated Blocks</div>
                                <div className="text-2xl font-bold text-purple-700">
                                    {results.blocks.filter(b => b.process !== null).length}
                                </div>
                            </motion.div>

                            <motion.div
                                className="p-4 bg-indigo-50 rounded-lg shadow-sm"
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="text-sm text-indigo-500 font-medium">Free Blocks</div>
                                <div className="text-2xl font-bold text-indigo-700">{results.unusedBlocks}</div>
                            </motion.div>

                            <motion.div
                                className="p-4 bg-pink-50 rounded-lg shadow-sm"
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="text-sm text-pink-500 font-medium">Internal Fragmentation</div>
                                <div className="text-2xl font-bold text-pink-700">{results.totalInternalFragmentation} Bytes</div>
                            </motion.div>

                            <motion.div
                                className="p-4 bg-red-50 rounded-lg shadow-sm"
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="text-sm text-red-500 font-medium">External Fragmentation</div>
                                <div className="text-2xl font-bold text-red-700">{results.externalFragmentation} Bytes</div>
                            </motion.div>

                            <motion.div
                                className="p-4 bg-teal-50 rounded-lg shadow-sm"
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.2 }}
                            >
                                <div className="text-sm text-teal-500 font-medium">Memory Utilization</div>
                                <div className="text-2xl font-bold text-teal-700">
                                    {Math.round(((totalMemory - results.totalInternalFragmentation - results.externalFragmentation) / totalMemory) * 100)}%
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            )}

            <div className="text-center text-gray-500 text-sm mt-8 pt-4 border-t border-gray-200">
                <p>Memory Allocation Simulator - MFT (Multiprogramming with Fixed number of Tasks)</p>
            </div>
        </div>
    );
};

export default MFT;
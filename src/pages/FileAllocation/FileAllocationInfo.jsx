import React from "react";
import { useNavigate } from "react-router-dom";

const FileAllocationInfo = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="container max-w-6xl mx-auto">
        <div className="header text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-3">File Allocation Methods</h1>
          <p className="text-gray-600">
            Understanding different approaches to file storage in operating systems
          </p>
          <button 
            onClick={() => navigate('/fileallocation')}
            className="mt-6 px-6 py-3 bg-blue-500 text-white rounded-lg font-medium shadow-lg hover:bg-blue-600 transform hover:-translate-y-1 transition-all duration-300"
          >
            Back to Simulator
          </button>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {/* Contiguous Allocation Section */}
          <section className="bg-white rounded-xl shadow-lg p-8 transform hover:-translate-y-1 transition-all duration-300" role="article">
            <div className="flex items-center mb-6">
              <span className="w-4 h-4 rounded-full bg-blue-500 mr-3"></span>
              <h2 className="text-2xl font-bold text-gray-800">Contiguous Allocation</h2>
            </div>
            <p className="text-gray-600 mb-6">
              In contiguous allocation, each file occupies a set of contiguous blocks on the disk.
              This method is simple and fast for both sequential and direct access. However, it can lead
              to external fragmentation and may make it difficult to expand file size once allocated.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-blue-800 mb-4">Advantages</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-blue-400 mr-2"></span>
                    Simple implementation
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-blue-400 mr-2"></span>
                    Fast access for sequential reading
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-blue-400 mr-2"></span>
                    Efficient for large, sequentially-read files
                  </li>
                </ul>
              </div>
              <div className="bg-red-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-red-800 mb-4">Disadvantages</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-red-400 mr-2"></span>
                    External fragmentation issues
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-red-400 mr-2"></span>
                    Difficulties in file expansion
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-red-400 mr-2"></span>
                    Potential waste of disk space if over-allocated
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Linked Allocation Section */}
          <section className="bg-white rounded-xl shadow-lg p-8 transform hover:-translate-y-1 transition-all duration-300" role="article">
            <div className="flex items-center mb-6">
              <span className="w-4 h-4 rounded-full bg-green-500 mr-3"></span>
              <h2 className="text-2xl font-bold text-gray-800">Linked Allocation</h2>
            </div>
            <p className="text-gray-600 mb-6">
              In linked allocation, files are stored as a linked list of disk blocks, which may reside anywhere on the disk.
              Each block contains a pointer to the next block, ensuring flexibility in file storage.
              This minimizes external fragmentation but can result in slower random access.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-green-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-green-800 mb-4">Advantages</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-green-400 mr-2"></span>
                    Eliminates external fragmentation
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-green-400 mr-2"></span>
                    Flexibility in growing files dynamically
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-green-400 mr-2"></span>
                    Efficient utilization of disk space
                  </li>
                </ul>
              </div>
              <div className="bg-red-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-red-800 mb-4">Disadvantages</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-red-400 mr-2"></span>
                    Slow direct (random) access
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-red-400 mr-2"></span>
                    Additional overhead for storing pointers in each block
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-red-400 mr-2"></span>
                    Vulnerability if a pointer is corrupted
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Indexed Allocation Section */}
          <section className="bg-white rounded-xl shadow-lg p-8 transform hover:-translate-y-1 transition-all duration-300" role="article">
            <div className="flex items-center mb-6">
              <span className="w-4 h-4 rounded-full bg-yellow-500 mr-3"></span>
              <h2 className="text-2xl font-bold text-gray-800">Indexed Allocation</h2>
            </div>
            <p className="text-gray-600 mb-6">
              In indexed allocation, each file has its own index block containing pointers to all its data blocks. This
              method supports both direct and sequential access while eliminating external fragmentation. Variants of
              indexed allocation (like multi-level indexing) help manage very large files.
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-yellow-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-yellow-800 mb-4">Advantages</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-yellow-400 mr-2"></span>
                    Supports both direct and sequential access
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-yellow-400 mr-2"></span>
                    No external fragmentation
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-yellow-400 mr-2"></span>
                    Flexible management of variable-length files
                  </li>
                </ul>
              </div>
              <div className="bg-red-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-red-800 mb-4">Disadvantages</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-red-400 mr-2"></span>
                    Pointer overhead due to the index block
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-red-400 mr-2"></span>
                    Index block limits for very large files (unless multi-level indexing is used)
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 rounded-full bg-red-400 mr-2"></span>
                    Additional complexity in maintaining the index structure
                  </li>
                </ul>
              </div>
            </div>
          </section>
        </div>

        <footer className="mt-12 text-center text-gray-500">
          <p className="text-sm">File Allocation Methods Guide © 2025</p>
        </footer>
      </div>
    </div>
  );
};

export default FileAllocationInfo;

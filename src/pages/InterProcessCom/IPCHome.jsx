import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function IPCHomepage() {
  // In a real app, you would use React Router's useNavigate
  // Since we can't import react-router here, we'll simulate navigation
  const handleNavigation = (path) => {
    //alert(`Navigating to ${path}`);
    // In a real app with React Router:
    navigateto(path);
  };

  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-blue-800 text-white p-6">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold">
            Interprocess Communication (IPC)
          </h1>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">
            What is Interprocess Communication?
          </h2>
          <p className="text-gray-700">
            Interprocess Communication (IPC) refers to mechanisms that allow
            processes to communicate with each other and synchronize their
            actions. These mechanisms are crucial for systems where multiple
            processes need to coordinate, share data, or distribute tasks.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* IPC Card */}
          <div
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition hover:scale-105"
            onClick={() => navigate("/IPC")}
          >
            <div className="bg-blue-600 h-2"></div>
            <div className="p-6">
              <h3 className="text-lg font-bold mb-2">Message Passing</h3>
              <p className="text-gray-600">
                Message passing in interprocess communication is a method where
                processes communicate and synchronize by sending and receiving
                messages without sharing memory.
              </p>
              <div className="mt-4 text-blue-600 font-medium">Learn more →</div>
            </div>
          </div>

          {/* Shared Memory Card */}
          <div
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition hover:scale-105"
            onClick={() => navigate("/SM")}
          >
            <div className="bg-green-600 h-2"></div>
            <div className="p-6">
              <h3 className="text-lg font-bold mb-2">Shared Memory</h3>
              <p className="text-gray-600">
                Shared memory in interprocess communication allows multiple
                processes to access a common memory space for fast data exchange
                and coordination.
              </p>
              <div className="mt-4 text-green-600 font-medium">
                Learn more →
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

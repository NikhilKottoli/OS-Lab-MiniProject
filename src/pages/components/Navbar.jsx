import React, { useState } from "react";
import { Link } from "react-router-dom";

// Dropdown component
const Dropdown = ({ title, links }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen((prev) => !prev);
  };

  return (
    <div className="relative inline-block text-left">
      <button
        className="flex items-center space-x-1 px-4 py-2 text-lg font-medium hover:text-indigo-600 focus:outline-none"
        onClick={toggleDropdown}
      >
        <span>{title}</span>
        <span
          className={`transform transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        >
          &#8595; {/* Down arrow (rotate on open) */}
        </span>
      </button>
      {isOpen && (
        <div className="absolute z-50 mt-2 w-48 bg-white shadow-lg rounded-md py-2">
          {links.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
            >
              {link.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-indigo-600">OS Lab Sim</h1>
        <div className="space-x-6 text-gray-700 font-medium flex items-center">
          <Link to="/" className="hover:text-indigo-600">
            Home
          </Link>

          {/* Dropdown for Deadlock-related topics */}
          <Dropdown
            title="Synchronization"
            links={[
              { to: "/avoidance", label: "Avoidance" },
              { to: "/detection", label: "Detection" },
              { to: "/cachehome", label: "Cache Coherency" },
            ]}
          />

          {/* Dropdown for Memory-related topics */}
          <Dropdown
            title="Memory"
            links={[
              { to: "/memoryhome", label: "Memory Management" },
              { to: "/memmanage", label: "Memory Management System Calls" },
              { to: "/mmu", label: "Memory Management Unit" },
              { to: "/memory_allocation_home", label: "Memory Allocation" },
              { to: "/theory", label: "Page Replacement" },
            ]}
          />

          {/* Dropdown for Process-related topics */}
          <Dropdown
            title="Process"
            links={[
              { to: "/syscalls", label: "Process System Call" },
              { to: "/processsync", label: "Process Sync" },
              { to: "/IPCHome", label: "Inter Process Communication" },
            ]}
          />

          {/* Dropdown for File System-related topics */}
          <Dropdown
            title="File System"
            links={[
              { to: "/syscalls", label: "File System Call" },
              { to: "/disk", label: "Disk" },
              { to: "/techniques", label: "File Organization Techniques" },
              { to: "/fileallocation", label: "File Allocation" },
            ]}
          />
          <Dropdown
            title="Scheduling"
            links={[
              { to: "/nice-cfs", label: "Nice Value Simulator" },
              { to: "/cfs", label: "Completely Fair Scheduler (CFS)" },
            ]}
          />
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

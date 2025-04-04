import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-indigo-600">OS Lab Sim</h1>
        <div className="space-x-6 text-gray-700 font-medium">
          <Link to="/" className="hover:text-indigo-600">Home</Link>
          <Link to="/avoidance" className="hover:text-indigo-600">Avoidance</Link>
          <Link to="/detection" className="hover:text-indigo-600">Detection</Link>
          <Link to="/process" className="hover:text-indigo-600">Process</Link>
          <Link to="/syscalls" className="hover:text-indigo-600">Syscalls</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

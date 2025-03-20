import React, { useState, useEffect } from 'react';
import { ArrowRightCircle, Cpu, HardDrive, Network, FileCode, UsersRound, Lock, Database, Layers, Maximize2, FilePlus } from 'lucide-react';
import membersData from './members.json';
const About = () => {
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setModules(membersData);
    setLoading(false);
  }, []);

  const getIconComponent = (moduleId) => {
    const icons = {
      1: <FileCode className="h-8 w-8 text-indigo-600" />,
      2: <Network className="h-8 w-8 text-blue-600" />,
      3: <Cpu className="h-8 w-8 text-purple-600" />,
      4: <UsersRound className="h-8 w-8 text-green-600" />,
      5: <Lock className="h-8 w-8 text-red-600" />,
      6: <Maximize2 className="h-8 w-8 text-amber-600" />,
      7: <Database className="h-8 w-8 text-emerald-600" />,
      8: <HardDrive className="h-8 w-8 text-cyan-600" />,
      9: <Layers className="h-8 w-8 text-fuchsia-600" />,
      10: <FilePlus className="h-8 w-8 text-rose-600" />
    };
    
    return icons[moduleId] || <FileCode className="h-8 w-8 text-gray-600" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Operating Systems <span className="text-indigo-600">Algorithms</span>
          </h1>
          <p className="mt-5 max-w-3xl mx-auto text-xl text-gray-500">
            A comprehensive collection of operating system concepts implemented as interactive modules
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-16">
          <div className="px-6 py-8 sm:p-10">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Project Overview</h2>
            <p className="text-gray-600 mb-6">
              This mini-project covers fundamental operating system algorithms and concepts through a series of
              interactive lab modules. Each module focuses on a specific area of OS design and implementation,
              providing hands-on experience with core computer science principles.
            </p>
            <div className="flex items-center text-indigo-600 font-medium">
              <span>Explore the modules below</span>
              <ArrowRightCircle className="ml-2 h-5 w-5" />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {modules.map((module) => (
              <div 
                key={module.id} 
                className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col"
              >
                <div className="p-6 flex-grow">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-indigo-50 rounded-lg">
                      {getIconComponent(module.id)}
                    </div>
                    <span className="bg-indigo-100 text-indigo-800 text-xs font-semibold px-3 py-1 rounded-full">
                      LAB-{module.id}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{module.title}</h3>
                  <p className="text-gray-600 mb-4">{module.description}</p>
                </div>
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-100">
                  <div>
                    <h4 className="text-sm font-medium text-gray-500">Module Designer</h4>
                    <div className="flex items-center mt-1">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center text-indigo-800 font-bold text-sm">
                        {module.designer.split(' ').map(name => name[0]).join('')}
                      </div>
                      <div className="ml-3">
                        <p className="text-sm font-medium text-gray-900">{module.designer}</p>
                        <p className="text-xs text-gray-500">{module.designerRollNumber}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default About;
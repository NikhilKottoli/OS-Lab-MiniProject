import React, { useState } from "react";
import { ArrowRight, Cpu, BookOpen, Coffee, Cigarette } from "lucide-react";
import ReaderWriterSimulation from "./ReaderWriter";
import ProducerConsumer from "./ProducerConsumer";
import DiningPhilosophers from "./DiningPhilosopher";
import CigaretteSmokers from "./CigaretteSmokers";

const ProcessSyncProblems = () => {
  const [activeCard, setActiveCard] = useState(null);
  const [activeComponent, setActiveComponent] = useState(null);
  
  const problems = [
    {
      id: "producer-consumer",
      title: "Producer-Consumer",
      color: "green",
      icon: <Cpu className="w-12 h-12 mb-4" />,
      description: "Producers create data that consumers use. They synchronize to prevent buffer overflow/underflow.",
      component: <ProducerConsumer />,
      position: "left"
    },
    {
      id: "reader-writer",
      title: "Reader-Writer",
      color: "blue",
      icon: <BookOpen className="w-12 h-12 mb-4" />,
      description: "Multiple readers can access data simultaneously, but writers need exclusive access.",
      component: <ReaderWriterSimulation />,
      position: "right"
    },
    {
      id: "dining-philosopher",
      title: "Dining-Philosopher",
      color: "purple",
      icon: <Coffee className="w-12 h-12 mb-4" />,
      description: "Philosophers must acquire two forks to eat, illustrating resource allocation challenges.",
      component: <DiningPhilosophers />,
      position: "left"
    },
    {
      id: "cigarette-smokers",
      title: "Cigarette-Smokers",
      color: "red",
      icon: <Cigarette className="w-12 h-12 mb-4" />,
      description: "Smokers need three ingredients to make a cigarette, but only have one. Illustrates resource allocation and deadlock avoidance.",
      component: <CigaretteSmokers />,
      position: "right"
    }
  ];

  const handleCardClick = (id) => {
    setActiveCard(activeCard === id ? null : id);
  };

  const handleExplore = (id, e) => {
    e.stopPropagation(); 
    setActiveComponent(id);
  };

  const handleBack = () => {
    setActiveComponent(null);
  };

  const leftProblems = problems.filter(p => p.position === "left");
  const rightProblems = problems.filter(p => p.position === "right");

  return (
    <div className="flex flex-col overflow-hidden">
      <div className="w-full items-center p-8 animate-fade-in pt-16">
        <h1 className="text-5xl font-bold text-gray-800 text-center mb-2">
          Classical Process Synchronization Problems
        </h1>
        <p className="text-center text-gray-600 max-w-2xl mx-auto">
          Understanding fundamental concurrency challenges in operating systems and distributed computing
        </p>
      </div>

      {activeComponent ? (
        <div className="flex-1 p-6">
          <button 
            className="mb-6 px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-md flex items-center gap-2 transition-colors"
            onClick={handleBack}
          >
            <ArrowRight className="w-4 h-4 transform rotate-180" /> Back to overview
          </button>
          <div className="border border-gray-200 rounded-xl shadow-lg">
            {problems.find(p => p.id === activeComponent)?.component}
          </div>
        </div>
      ) : (
        <div className="flex flex-col my-10 items-center justify-center px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl">
            <div className="flex flex-col gap-6">
              {leftProblems.map((problem) => (
                <div
                  key={problem.id}
                  onClick={() => handleCardClick(problem.id)}
                  className={`bg-${problem.color}-100 p-7 rounded-xl shadow-md transform transition-all duration-500 cursor-pointer
                    ${activeCard === problem.id ? `bg-${problem.color}-100 shadow-lg scale-105 ml-6` : "hover:scale-102 hover:shadow"}
                    flex flex-col items-center`}
                >
                  <div className={`text-${problem.color}-500 transition-all duration-300`}>
                    {problem.icon}
                  </div>
                  <h2 className={`text-2xl font-semibold text-${problem.color}-700 mb-2`}>
                    {problem.title}
                  </h2>
                  
                  <div className={`overflow-hidden transition-all duration-500 ${activeCard === problem.id ? "max-h-48 opacity-100 mt-3" : "max-h-0 opacity-0"}`}>
                    <p className={`text-${problem.color}-600 text-center`}>
                      {problem.description}
                    </p>
                    <button 
                      className={`mt-4 px-4 py-2 bg-${problem.color}-500 hover:bg-${problem.color}-600 text-white rounded-md flex items-center gap-2 transition-colors`}
                      onClick={(e) => handleExplore(problem.id, e)}
                    >
                      Explore <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="flex flex-col gap-6">
              {rightProblems.map((problem) => (
                <div
                  key={problem.id}
                  onClick={() => handleCardClick(problem.id)}
                  className={`bg-${problem.color}-100 p-7 rounded-xl shadow-md transform transition-all duration-500 cursor-pointer
                    ${activeCard === problem.id ? `bg-${problem.color}-100 shadow-lg scale-105 mr-6` : "hover:scale-102 hover:shadow"}
                    flex flex-col items-center`}
                >
                  <div className={`text-${problem.color}-500 transition-all duration-300`}>
                    {problem.icon}
                  </div>
                  <h2 className={`text-2xl font-semibold text-${problem.color}-700 mb-2`}>
                    {problem.title}
                  </h2>
                  
                  <div className={`overflow-hidden transition-all duration-500 ${activeCard === problem.id ? "max-h-48 opacity-100 mt-3" : "max-h-0 opacity-0"}`}>
                    <p className={`text-${problem.color}-600 text-center`}>
                      {problem.description}
                    </p>
                    <button 
                      className={`mt-4 px-4 py-2 bg-${problem.color}-500 hover:bg-${problem.color}-600 text-white rounded-md flex items-center gap-2 transition-colors`}
                      onClick={(e) => handleExplore(problem.id, e)}
                    >
                      Explore <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProcessSyncProblems;
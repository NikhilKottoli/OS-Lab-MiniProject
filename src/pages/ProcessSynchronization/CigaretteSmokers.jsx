import React, { useState, useRef, useEffect } from "react";
import {
  RefreshCw,
  Activity,
  Cigarette,
  AlertCircle,
  Clock,
  Flame,
  PlusCircle,
  Coffee,
  Sparkles,
} from "lucide-react";

const CigaretteSmokers = () => {
  // Define the three ingredients
  const INGREDIENTS = ["tobacco", "paper", "matches"];
  
  // States for the application
  const [smokers, setSmokers] = useState([
    { id: 1, name: "Alice", ingredient: "tobacco", smoking: false, waitingTime: 0, cigarettesSmoked: 0 },
    { id: 2, name: "Bob", ingredient: "paper", smoking: false, waitingTime: 0, cigarettesSmoked: 0 },
    { id: 3, name: "Charlie", ingredient: "matches", smoking: false, waitingTime: 0, cigarettesSmoked: 0 }
  ]);
  
  const [agentState, setAgentState] = useState({
    active: false,
    ingredientsOnTable: [],
    lastServingTime: null,
    canServe: true // NEW: Controls when agent can serve
  });
  
  const [activityLog, setActivityLog] = useState([]);
  const [stats, setStats] = useState({
    totalCigarettesSmoked: 0,
    agentServings: 0,
    longestWait: 0
  });
  
  const [simulationConfig, setSimulationConfig] = useState({
    smokingDuration: 5,
    agentDelay: 3,
    autoRun: false
  });
  
  // References to manage timers
  const logContainerRef = useRef(null);
  const smokingTimers = useRef({});
  const agentTimer = useRef(null);
  
  // Scroll to bottom of log when new entries are added
  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [activityLog]);
  
  // Clean up timers when component unmounts
  useEffect(() => {
    return () => {
      Object.keys(smokingTimers.current).forEach((key) => {
        clearTimeout(smokingTimers.current[key]);
      });
      if (agentTimer.current) {
        clearTimeout(agentTimer.current);
      }
    };
  }, []);
  
  // Effect for auto-run mode
  useEffect(() => {
    if (simulationConfig.autoRun && !agentState.active && agentState.ingredientsOnTable.length === 0) {
      agentTimer.current = setTimeout(() => {
        serveRandomIngredients();
      }, simulationConfig.agentDelay * 1000);
    }
    
    return () => {
      if (agentTimer.current) {
        clearTimeout(agentTimer.current);
      }
    };
  }, [simulationConfig.autoRun, agentState, smokers]);
  
  // Format time for logs
  const formatTime = () => {
    const now = new Date();
    return `${now.getHours().toString().padStart(2, "0")}:${now
      .getMinutes()
      .toString()
      .padStart(2, "0")}:${now.getSeconds().toString().padStart(2, "0")}.${now
      .getMilliseconds()
      .toString()
      .padStart(3, "0")}`;
  };
  
  // Add log entry
  const addLogEntry = (message, type) => {
    const newEntry = {
      id: Date.now() + Math.random(),
      time: formatTime(),
      message,
      type,
    };

    setActivityLog((prevLog) => {
      const updatedLog = [...prevLog, newEntry];
      if (updatedLog.length > 100) {
        return updatedLog.slice(-100);
      }
      return updatedLog;
    });
  };
  
  // Function to serve random ingredients by the agent
  const serveRandomIngredients = () => {
    if (!agentState.canServe || agentState.active || agentState.ingredientsOnTable.length > 0) {
      addLogEntry("Agent cannot serve right now", "warning");
      return;
    }
    
    // Select a random smoker to serve (by not providing their ingredient)
    const randomSmokerIndex = Math.floor(Math.random() * smokers.length);
    const missingIngredient = smokers[randomSmokerIndex].ingredient;
    
    // Place the other two ingredients on the table
    const ingredientsToServe = INGREDIENTS.filter(ing => ing !== missingIngredient);
    
    setAgentState((prev) => ({
      ...prev,
      active: true,
      ingredientsOnTable: ingredientsToServe,
      lastServingTime: Date.now(),
      canServe: false // NEW: Prevent new servings until smoking completes
    }));
    
    setStats((prev) => ({
      ...prev,
      agentServings: prev.agentServings + 1
    }));
    
    addLogEntry(`Agent placed ${ingredientsToServe[0]} and ${ingredientsToServe[1]} on the table`, "agent");
    
    // After a short animation delay, set agent to inactive
    setTimeout(() => {
      setAgentState((prev) => ({
        ...prev,
        active: false
      }));
    }, 1000);
  };
  
  // Function for smoker to take ingredients and smoke
  const takeIngredientsAndSmoke = (smokerId) => {
    const smoker = smokers.find(s => s.id === smokerId);
    if (!smoker || smoker.smoking) return;
    
    // Check if the table has the ingredients this smoker needs
    const hasBothIngredients = agentState.ingredientsOnTable.length === 2 && 
                            !agentState.ingredientsOnTable.includes(smoker.ingredient);
    
    if (!hasBothIngredients) {
      addLogEntry(`${smoker.name} cannot smoke - doesn't have the required ingredients`, "warning");
      return;
    }
    
    // Clear any existing smoking timer for this smoker
    if (smokingTimers.current[smokerId]) {
      clearTimeout(smokingTimers.current[smokerId]);
    }
    
    // Calculate waiting time
    const waitTime = agentState.lastServingTime ? 
      (Date.now() - agentState.lastServingTime) / 1000 : 0;
    
    // Update smoker state
    setSmokers(prevSmokers => 
      prevSmokers.map(s => 
        s.id === smokerId ? 
          { ...s, smoking: true, waitingTime: s.waitingTime + waitTime } : s
      )
    );
    
    // Clear ingredients from table
    setAgentState(prev => ({
      ...prev,
      ingredientsOnTable: []
    }));
    
    addLogEntry(`${smoker.name} took the ingredients and started smoking`, "smoking");
    
    // Set timeout to finish smoking
    smokingTimers.current[smokerId] = setTimeout(() => {
      finishSmoking(smokerId);
    }, simulationConfig.smokingDuration * 1000);
  };
  
  // Function to finish smoking
  const finishSmoking = (smokerId) => {
    setSmokers(prevSmokers => 
      prevSmokers.map(s => 
        s.id === smokerId ? 
          { ...s, smoking: false, cigarettesSmoked: s.cigarettesSmoked + 1 } : s
      )
    );
    
    setStats(prev => ({
      ...prev,
      totalCigarettesSmoked: prev.totalCigarettesSmoked + 1,
      longestWait: Math.max(prev.longestWait, 
        smokers.find(s => s.id === smokerId)?.waitingTime || 0)
    }));
    
    const smoker = smokers.find(s => s.id === smokerId);
    addLogEntry(`${smoker.name} finished smoking a cigarette`, "finished");
    
    // Allow agent to serve again
    setAgentState(prev => ({
      ...prev,
      canServe: true
    }));
    
    // If auto-run is enabled, prepare for next round
    if (simulationConfig.autoRun) {
      agentTimer.current = setTimeout(() => {
        serveRandomIngredients();
      }, simulationConfig.agentDelay * 1000);
    }
  };
  // Reset the simulation
  const resetSimulation = () => {
    // Clear all timers
    Object.keys(smokingTimers.current).forEach((key) => {
      clearTimeout(smokingTimers.current[key]);
    });
    if (agentTimer.current) {
      clearTimeout(agentTimer.current);
    }
    
    smokingTimers.current = {};
    agentTimer.current = null;
    
    // Reset smokers
    setSmokers([
      { id: 1, name: "Alice", ingredient: "tobacco", smoking: false, waitingTime: 0, cigarettesSmoked: 0 },
      { id: 2, name: "Bob", ingredient: "paper", smoking: false, waitingTime: 0, cigarettesSmoked: 0 },
      { id: 3, name: "Charlie", ingredient: "matches", smoking: false, waitingTime: 0, cigarettesSmoked: 0 }
    ]);
    
    // Reset agent state
    setAgentState({
      active: false,
      ingredientsOnTable: [],
      lastServingTime: null
    });
    
    // Reset stats
    setStats({
      totalCigarettesSmoked: 0,
      agentServings: 0,
      longestWait: 0
    });
    
    // Reset log
    setActivityLog([{
      id: Date.now(),
      time: formatTime(),
      message: "Simulation reset",
      type: "info",
    }]);
  };
  
  // Get color for smoker state
  const getSmokerStateColor = (smoking) => {
    return smoking 
      ? "bg-orange-100 border-orange-500 text-orange-800" 
      : "bg-blue-100 border-blue-500 text-blue-800";
  };
  
  // Get ingredient icon
  const getIngredientIcon = (ingredient) => {
    switch (ingredient) {
      case "tobacco":
        return <Coffee className="w-5 h-5 text-brown-600" />;
      case "paper":
        return <PlusCircle className="w-5 h-5 text-gray-600" />;
      case "matches":
        return <Flame className="w-5 h-5 text-red-600" />;
      default:
        return null;
    }
  };
  
  // Get log entry styling
  const getLogEntryColor = (type) => {
    switch (type) {
      case "agent":
        return "text-purple-600 border-l-purple-500";
      case "smoking":
        return "text-orange-600 border-l-orange-500";
      case "finished":
        return "text-green-600 border-l-green-500";
      case "warning":
        return "text-amber-600 border-l-amber-500";
      case "info":
      default:
        return "text-gray-600 border-l-gray-400";
    }
  };
  
  // Get log entry icon
  const getLogEntryIcon = (type) => {
    switch (type) {
      case "agent":
        return <Sparkles className="w-4 h-4 text-purple-500 flex-shrink-0" />;
      case "smoking":
        return <Cigarette className="w-4 h-4 text-orange-500 flex-shrink-0" />;
      case "finished":
        return <Cigarette className="w-4 h-4 text-green-500 flex-shrink-0" />;
      case "warning":
        return <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />;
      case "info":
      default:
        return <Clock className="w-4 h-4 text-gray-500 flex-shrink-0" />;
    }
  };

  return (
    <div className="min-h-screen font-sans w-full bg-gray-50">
      <div className="w-full mx-auto p-6">
        <div className="text-center mb-2">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-orange-700">
            Cigarette Smokers Simulation
          </h1>
          <p className="text-gray-600">
            A classic synchronization problem where smokers need complementary ingredients to smoke.
          </p>
        </div>
        
        <div className="flex flex-row gap-6">
          {/* Smokers column */}
          <div className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl w-1/3">
            <h3 className="text-lg font-semibold text-orange-700 mb-3">
              Smokers
            </h3>
            <div className="space-y-4 w-full">
              {smokers.map((smoker) => (
                <div
                  key={smoker.id}
                  className={`border-2 rounded-lg p-3 ${getSmokerStateColor(smoker.smoking)}`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-medium flex items-center">
                      {smoker.name}
                      <div className="ml-2 p-1 bg-white rounded-full">
                        {getIngredientIcon(smoker.ingredient)}
                      </div>
                    </div>
                    <div className="text-sm capitalize font-semibold">
                      {smoker.smoking ? "Smoking" : "Waiting"}
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-sm">
                      Has: <span className="font-medium">{smoker.ingredient}</span>
                    </div>
                    <div className="text-sm">
                      Smoked: <span className="font-medium">{smoker.cigarettesSmoked}</span>
                    </div>
                  </div>

                  <div className="flex justify-center mt-2">
                    <button
                      onClick={() => takeIngredientsAndSmoke(smoker.id)}
                      disabled={smoker.smoking || agentState.ingredientsOnTable.includes(smoker.ingredient) || agentState.ingredientsOnTable.length !== 2}
                      className={`w-full px-2 py-1 text-sm font-medium rounded
                        ${smoker.smoking || agentState.ingredientsOnTable.includes(smoker.ingredient) || agentState.ingredientsOnTable.length !== 2
                          ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                          : "bg-orange-500 hover:bg-orange-600 text-white"
                        }`}
                    >
                      {smoker.smoking ? "Smoking..." : "Take & Smoke"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Middle column - visualization and controls */}
          <div className="w-1/3 space-y-6">
            {/* Table visualization */}
            <div className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <Cigarette className="w-5 h-5 text-orange-500 mr-2" />
                  <h2 className="text-xl font-semibold text-gray-800">
                    Table Visualization
                  </h2>
                </div>
              </div>

              <div className="relative mb-6">
                {/* Table representation */}
                <div className="w-64 h-64 bg-orange-100 rounded-full mx-auto relative border-4 border-orange-300">
                  {/* Smokers visualization */}
                  {smokers.map((smoker, index) => {
                    const angle = (index / smokers.length) * 2 * Math.PI;
                    const radius = 100;
                    const xPos = Math.sin(angle) * radius + 124;
                    const yPos = -Math.cos(angle) * radius + 124;

                    return (
                      <div
                        key={smoker.id}
                        className={`absolute w-16 h-16 -mt-8 -ml-8 rounded-full flex items-center justify-center shadow-md border-2
                        ${getSmokerStateColor(smoker.smoking)} transition-all duration-500`}
                        style={{
                          left: `${xPos}px`,
                          top: `${yPos}px`,
                          transform: smoker.smoking ? 'scale(1.1)' : 'scale(1)',
                        }}
                      >
                        <div className="text-center">
                          <div className="text-xs font-semibold">
                            {smoker.name}
                          </div>
                          <div className="text-xs capitalize">
                            {smoker.ingredient}
                          </div>
                          {smoker.smoking && (
                            <div className="absolute -top-2 -right-2">
                              <div className="animate-smoke">
                                <div className="w-2 h-2 bg-gray-300 rounded-full opacity-80"></div>
                              </div>
                              <div className="animate-smoke animation-delay-300">
                                <div className="w-2 h-2 bg-gray-300 rounded-full opacity-80"></div>
                              </div>
                              <div className="animate-smoke animation-delay-600">
                                <div className="w-2 h-2 bg-gray-300 rounded-full opacity-80"></div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {/* Agent visualization */}
                  <div 
                    className={`absolute w-20 h-20 left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full bg-purple-100 border-2 border-purple-500 shadow-md flex items-center justify-center transition-all duration-300 ${agentState.active ? 'scale-110 bg-purple-200' : ''}`}
                  >
                    <div className="text-center">
                      <div className="text-xs font-semibold">Agent</div>
                      {agentState.active && (
                        <div className="animate-pulse text-xs text-purple-600">Active</div>
                      )}
                    </div>
                  </div>

                  {/* Ingredients visualization */}
                  {agentState.ingredientsOnTable.map((ingredient, index) => {
                    const angle = ((index + 0.5) / 2) * Math.PI;
                    const radius = 50;
                    const xPos = Math.sin(angle) * radius + 124;
                    const yPos = 124 + (index === 0 ? -20 : 20);

                    return (
                      <div
                        key={`ingredient-${ingredient}`}
                        className="absolute w-10 h-10 -mt-5 -ml-5 rounded-full flex items-center justify-center bg-white shadow-md border border-gray-300 animate-bounce-slow"
                        style={{
                          left: `${xPos}px`,
                          top: `${yPos}px`,
                          animationDelay: `${index * 0.2}s`,
                        }}
                      >
                        <div className="flex items-center justify-center">
                          {getIngredientIcon(ingredient)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="flex justify-center">
                <button
                  onClick={serveRandomIngredients}
                  disabled={agentState.active || agentState.ingredientsOnTable.length > 0}
                  className={`px-5 py-2 rounded-lg font-medium flex items-center transition-all duration-300
                    ${agentState.active || agentState.ingredientsOnTable.length > 0
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-purple-500 hover:bg-purple-600 text-white"
                    }`}
                >
                  <Sparkles className="w-4 h-4 mr-1" />
                  Serve Ingredients
                </button>
              </div>
            </div>

            {/* Controls */}
            <div className="grid grid-cols-1 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
                <div className="flex items-center mb-4">
                  <Activity className="w-5 h-5 text-orange-500 mr-2" />
                  <h2 className="text-xl font-semibold text-gray-800">
                    Controls
                  </h2>
                </div>

                <div className="space-y-5">
                  <div>
                    <div className="flex justify-between mb-1">
                      <label className="text-sm font-medium text-gray-700">
                        Smoking Duration (seconds)
                      </label>
                      <span className="text-orange-600 font-medium">
                        {simulationConfig.smokingDuration}s
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={simulationConfig.smokingDuration}
                      onChange={(e) =>
                        setSimulationConfig({
                          ...simulationConfig,
                          smokingDuration: parseInt(e.target.value)
                        })
                      }
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <label className="text-sm font-medium text-gray-700">
                        Agent Delay (seconds)
                      </label>
                      <span className="text-purple-600 font-medium">
                        {simulationConfig.agentDelay}s
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={simulationConfig.agentDelay}
                      onChange={(e) =>
                        setSimulationConfig({
                          ...simulationConfig,
                          agentDelay: parseInt(e.target.value)
                        })
                      }
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">
                      Auto-Run Simulation
                    </label>
                    <div className="relative inline-block w-12 mr-2 align-middle select-none">
                      <input
                        type="checkbox"
                        checked={simulationConfig.autoRun}
                        onChange={() =>
                          setSimulationConfig({
                            ...simulationConfig,
                            autoRun: !simulationConfig.autoRun
                          })
                        }
                        id="toggle"
                        className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer"
                      />
                      <label
                        htmlFor="toggle"
                        className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${
                          simulationConfig.autoRun ? "bg-purple-500" : "bg-gray-300"
                        }`}
                      ></label>
                    </div>
                  </div>
                </div>

                <div className="flex justify-center mt-6">
                  <button
                    onClick={resetSimulation}
                    className="px-5 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-medium flex items-center transition-all duration-300"
                  >
                    <RefreshCw className="w-4 h-4 mr-1" />
                    Reset
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right column - log and stats */}
          <div className="w-1/3 space-y-6">
            {/* Statistics */}
            <div className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
              <div className="flex items-center mb-4">
                <Activity className="w-5 h-5 text-orange-500 mr-2" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Statistics
                </h2>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="bg-orange-50 p-3 rounded-lg text-center transform transition-all duration-300 hover:scale-105">
                  <p className="text-sm font-medium text-orange-800 mb-1">
                    Cigarettes Smoked
                  </p>
                  <p className="text-xl font-bold text-orange-600">
                    {stats.totalCigarettesSmoked}
                  </p>
                </div>

                <div className="bg-purple-50 p-3 rounded-lg text-center transform transition-all duration-300 hover:scale-105">
                  <p className="text-sm font-medium text-purple-800 mb-1">
                    Agent Servings
                  </p>
                  <p className="text-xl font-bold text-purple-600">
                    {stats.agentServings}
                  </p>
                </div>

                <div className="bg-blue-50 p-3 rounded-lg text-center transform transition-all duration-300 hover:scale-105">
                  <p className="text-sm font-medium text-blue-800 mb-1">
                    Efficiency
                  </p>
                  <p className="text-xl font-bold text-blue-600">
                    {stats.agentServings ? Math.round((stats.totalCigarettesSmoked / stats.agentServings) * 100) + "%" : "0%"}
                  </p>
                </div>
              </div>
              
              <div className="mt-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-2">Individual Smoker Stats</h3>
                <div className="space-y-2">
                  {smokers.map(smoker => (
                    <div key={`stat-${smoker.id}`} className="flex justify-between text-sm">
                      <div className="font-medium flex items-center">
                        {smoker.name}
                        <div className="ml-1 p-0.5 bg-white rounded-full">
                          {getIngredientIcon(smoker.ingredient)}
                        </div>
                      </div>
                      <div>
                        <span className="text-orange-600 font-medium">{smoker.cigarettesSmoked}</span> cigarettes
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Activity Log */}
            <div className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl flex flex-col">
              <div className="flex items-center mb-4">
                <Activity className="w-5 h-5 text-orange-500 mr-2" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Activity Log
                </h2>
              </div>

              <div
                ref={logContainerRef}
                className="flex-grow overflow-y-auto pr-2 border border-gray-200 rounded-lg p-2 bg-gray-50"
                style={{ maxHeight: "350px" }}
              >
                {activityLog.length === 0 ? (
                  <div className="text-center p-4 text-gray-500 italic">
                    No activity yet. Start the simulation to see log entries.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {activityLog.map((entry) => (
                      <div
                        key={entry.id}
                        className={`border-l-4 pl-2 py-1 text-sm rounded bg-white shadow-sm 
                        ${getLogEntryColor(entry.type)} animate-fadeIn`}
                      >
                        <div className="flex items-start">
                          <div className="mr-2 mt-1">
                            {getLogEntryIcon(entry.type)}
                          </div>
                          <div className="flex-grow">
                            <div className="text-xs text-gray-500">
                              {entry.time}
                            </div>
                            <div className="font-medium">{entry.message}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-4 pt-3 border-t border-gray-200">
                <div className="flex flex-wrap gap-2">
                  <div className="flex items-center text-xs text-gray-600">
                    <div className="w-3 h-3 bg-purple-500 rounded-full mr-1"></div>
                    <span>Agent</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-600">
                    <div className="w-3 h-3 bg-orange-500 rounded-full mr-1"></div>
                    <span>Smoking</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-600">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                    <span>Finished</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-600">
                    <div className="w-3 h-3 bg-amber-500 rounded-full mr-1"></div>
                    <span>Warning</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-gray-500 text-sm">
          <p>
            The Cigarette Smokers problem is a classic concurrent programming synchronization problem.
          </p>
          <p className="mt-2">
            Each smoker has one ingredient and needs two other ingredients to make and smoke a cigarette.
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default CigaretteSmokers;

            
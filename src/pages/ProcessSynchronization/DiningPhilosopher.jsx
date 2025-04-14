import React, { useState, useRef, useEffect } from "react";
import {
  RefreshCw,
  Activity,
  Utensils,
  AlertCircle,
  Clock,
  ArrowRightCircle,
  User,
} from "lucide-react";

const DiningPhilosophers = () => {
  const [philosophers, setPhilosophers] = useState([
    {
      id: 1,
      name: "Socrates",
      state: "thinking",
      leftFork: false,
      rightFork: false,
      eatingTime: 0,
      thinkingTime: 0,
    },
    {
      id: 2,
      name: "Plato",
      state: "thinking",
      leftFork: false,
      rightFork: false,
      eatingTime: 0,
      thinkingTime: 0,
    },
    {
      id: 3,
      name: "Aristotle",
      state: "thinking",
      leftFork: false,
      rightFork: false,
      eatingTime: 0,
      thinkingTime: 0,
    },
    {
      id: 4,
      name: "Kant",
      state: "thinking",
      leftFork: false,
      rightFork: false,
      eatingTime: 0,
      thinkingTime: 0,
    },
    {
      id: 5,
      name: "Nietzsche",
      state: "thinking",
      leftFork: false,
      rightFork: false,
      eatingTime: 0,
      thinkingTime: 0,
    },
  ]);

  const [forks, setForks] = useState([
    { id: 1, inUse: false, heldBy: null },
    { id: 2, inUse: false, heldBy: null },
    { id: 3, inUse: false, heldBy: null },
    { id: 4, inUse: false, heldBy: null },
    { id: 5, inUse: false, heldBy: null },
  ]);

  const [activityLog, setActivityLog] = useState([]);
  const [stats, setStats] = useState({
    mealsEaten: 0,
    forksPickedUp: 0,
    forksPutDown: 0,
    deadlockEvents: 0,
  });

  const [numPhilosophers, setNumPhilosophers] = useState(5);
  const [eatingDuration, setEatingDuration] = useState(5);

  const logContainerRef = useRef(null);
  const eatingTimers = useRef({});

  useEffect(() => {
    if (logContainerRef.current) {
      logContainerRef.current.scrollTop = logContainerRef.current.scrollHeight;
    }
  }, [activityLog]);

  useEffect(() => {
    const allHoldingSingleFork = philosophers.every(
      (p) => (p.leftFork && !p.rightFork) || (!p.leftFork && p.rightFork)
    );

    if (allHoldingSingleFork && philosophers.length > 1) {
      setStats((s) => ({ ...s, deadlockEvents: s.deadlockEvents + 1 }));
      addLogEntry(
        "DEADLOCK DETECTED: All philosophers are holding one fork and waiting for another!",
        "warning"
      );
    }
  }, [philosophers]);

  useEffect(() => {
    if (numPhilosophers !== philosophers.length) {
      Object.values(eatingTimers.current).forEach((timer) =>
        clearTimeout(timer)
      );
      eatingTimers.current = {};

      const philosopherNames = [
        "Socrates",
        "Plato",
        "Aristotle",
        "Kant",
        "Nietzsche",
        "Descartes",
        "Hume",
        "Locke",
        "Spinoza",
        "Hegel",
      ];

      const newPhilosophers = [];
      const newForks = [];

      for (let i = 1; i <= numPhilosophers; i++) {
        newPhilosophers.push({
          id: i,
          name: philosopherNames[i - 1],
          state: "thinking",
          leftFork: false,
          rightFork: false,
          eatingTime: 0,
          thinkingTime: 0,
        });

        newForks.push({
          id: i,
          inUse: false,
          heldBy: null,
        });
      }

      setPhilosophers(newPhilosophers);
      setForks(newForks);

      setStats({
        mealsEaten: 0,
        forksPickedUp: 0,
        forksPutDown: 0,
        deadlockEvents: 0,
      });

      setActivityLog([
        {
          id: Date.now(),
          time: formatTime(),
          message: `Simulation reset with ${numPhilosophers} philosophers`,
          type: "info",
        },
      ]);
    }
  }, [numPhilosophers]);

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

  const getLeftForkIndex = (philosopherId) =>
    (philosopherId - 1) % numPhilosophers;

  const getRightForkIndex = (philosopherId) =>
    (getLeftForkIndex(philosopherId) + numPhilosophers - 1) % numPhilosophers;

  const pickUpLeftFork = (philosopherId) => {
    const philosopher = philosophers.find((p) => p.id === philosopherId);
    const forkIndex = getLeftForkIndex(philosopherId);

    const fork = forks[forkIndex];

    if (philosopher.leftFork) {
      addLogEntry(`${philosopher.name} already has their left fork`, "warning");
      return;
    }

    if (fork.inUse) {
      addLogEntry(
        `${philosopher.name} tried to take fork ${fork.id} but it's already in use by Philosopher ${fork.heldBy}`,
        "warning"
      );
      return;
    }
    const updatedForks = [...forks];
    updatedForks[forkIndex] = { ...fork, inUse: true, heldBy: philosopherId };

    setForks(updatedForks);

    const updatedPhilosophers = philosophers.map((p) =>
      p.id === philosopherId ? { ...p, leftFork: true } : p
    );
    setPhilosophers(updatedPhilosophers);

    setStats((s) => ({ ...s, forksPickedUp: s.forksPickedUp + 1 }));

    addLogEntry(
      `${philosopher.name} picked up left fork (Fork ${fork.id})`,
      "pickup"
    );

    const updatedPhilosopher = { ...philosopher, leftFork: true };

    if (updatedPhilosopher.leftFork && updatedPhilosopher.rightFork) {
      startEating(philosopherId);
    }
  };

  const pickUpRightFork = (philosopherId) => {
    const philosopher = philosophers.find((p) => p.id === philosopherId);
    const forkIndex = getRightForkIndex(philosopherId);

    const fork = forks[forkIndex];

    if (philosopher.rightFork) {
      addLogEntry(
        `${philosopher.name} already has their right fork`,
        "warning"
      );
      return;
    }

    if (fork.inUse) {
      addLogEntry(
        `${philosopher.name} tried to take fork ${fork.id} but it's already in use by Philosopher ${fork.heldBy}`,
        "warning"
      );
      return;
    }

    const updatedForks = [...forks];

    updatedForks[forkIndex] = { ...fork, inUse: true, heldBy: philosopherId };
    setForks(updatedForks);

    const updatedPhilosophers = philosophers.map((p) =>
      p.id === philosopherId ? { ...p, rightFork: true } : p
    );
    setPhilosophers(updatedPhilosophers);

    setStats((s) => ({ ...s, forksPickedUp: s.forksPickedUp + 1 }));
    addLogEntry(
      `${philosopher.name} picked up right fork (Fork ${fork.id})`,
      "pickup"
    );

    const updatedPhilosopher = { ...philosopher, rightFork: true };

    if (updatedPhilosopher.leftFork && updatedPhilosopher.rightFork) {
      startEating(philosopherId);
    }
  };

  const finishEating = (philosopherId) => {
    const leftForkIndex = getLeftForkIndex(philosopherId);
    const rightForkIndex = getRightForkIndex(philosopherId);

    setForks((prevForks) =>
      prevForks.map((fork, index) => {
        if (
          (index === leftForkIndex || index === rightForkIndex) &&
          fork.heldBy === philosopherId
        ) {
          return {
            ...fork,
            inUse: false,
            heldBy: null,
          };
        }
        return fork;
      })
    );

    setPhilosophers((prevPhilosophers) =>
      prevPhilosophers.map((p) =>
        p.id === philosopherId
          ? {
              ...p,
              state: "thinking",
              leftFork: false,
              rightFork: false,
            }
          : p
      )
    );

    addLogEntry(`Philosopher ${philosopherId} finished eating`, "done");

    setStats((prev) => ({
      ...prev,
      mealsEaten: prev.mealsEaten + 1,
      forksPutDown: prev.forksPutDown + 2,
    }));
  };
  const startEating = (philosopherId) => {
    const philosopher = philosophers.find((p) => p.id === philosopherId);
    if (!philosopher) return;
    const leftForkIndex = getLeftForkIndex(philosopherId);
    const rightForkIndex = getRightForkIndex(philosopherId);

    const hasLeftFork = forks[leftForkIndex].heldBy === philosopherId;
    const hasRightFork = forks[rightForkIndex].heldBy === philosopherId;

    if (!hasLeftFork || !hasRightFork) {
      return;
    }

    if (eatingTimers.current[philosopherId]) {
      clearTimeout(eatingTimers.current[philosopherId]);
    }

    const updatedPhilosophers = philosophers.map((p) =>
      p.id === philosopherId ? { ...p, state: "eating" } : p
    );
    setPhilosophers(updatedPhilosophers);

    addLogEntry(`${philosopher.name} started eating with both forks`, "eating");

    eatingTimers.current[philosopherId] = setTimeout(() => {
      finishEating(philosopherId);
    }, eatingDuration * 1000);
  };

  const resetSimulation = () => {
    Object.keys(eatingTimers.current).forEach((key) => {
      clearTimeout(eatingTimers.current[key]);
    });
    eatingTimers.current = {};

    const resetPhilosophers = philosophers.map((p) => ({
      ...p,
      state: "thinking",
      leftFork: false,
      rightFork: false,
      eatingTime: 0,
      thinkingTime: 0,
    }));
    setPhilosophers(resetPhilosophers);

    const resetForks = forks.map((f) => ({
      ...f,
      inUse: false,
      heldBy: null,
    }));
    setForks(resetForks);

    setStats({
      mealsEaten: 0,
      forksPickedUp: 0,
      forksPutDown: 0,
      deadlockEvents: 0,
    });

    setActivityLog([
      {
        id: Date.now(),
        time: formatTime(),
        message: "Simulation reset",
        type: "info",
      },
    ]);
  };

  useEffect(() => {
    return () => {
      Object.keys(eatingTimers.current).forEach((key) => {
        clearTimeout(eatingTimers.current[key]);
      });
      eatingTimers.current = {};
    };
  }, []);

  useEffect(() => {
    const eatingPhilosophers = philosophers.filter((p) => p.state === "eating");

    if (eatingPhilosophers.length > 0) {
      eatingPhilosophers.forEach((p) => {
        if (eatingTimers.current[p.id]) {
          clearTimeout(eatingTimers.current[p.id]);

          eatingTimers.current[p.id] = setTimeout(() => {
            finishEating(p.id);
          }, eatingDuration * 1000);
        }
      });

      addLogEntry(
        `Adjusted eating duration for ${eatingPhilosophers.length} eating philosopher(s)`,
        "info"
      );
    }
  }, [eatingDuration]);

  useEffect(() => {
    philosophers.forEach((philosopher) => {
      if (
        philosopher.leftFork &&
        philosopher.rightFork &&
        philosopher.state !== "eating" &&
        !eatingTimers.current[philosopher.id]
      ) {
        startEating(philosopher.id);
      }
    });
  }, [philosophers]);

  const getPhilosopherStateColor = (state) => {
    switch (state) {
      case "eating":
        return "bg-green-100 border-green-500 text-green-800";
      case "hungry":
        return "bg-yellow-100 border-yellow-500 text-yellow-800";
      case "thinking":
      default:
        return "bg-blue-100 border-blue-500 text-blue-800";
    }
  };

  const getLogEntryColor = (type) => {
    switch (type) {
      case "pickup":
        return "text-blue-600 border-l-blue-500";
      case "putdown":
        return "text-purple-600 border-l-purple-500";
      case "eating":
        return "text-green-600 border-l-green-500";
      case "thinking":
        return "text-blue-600 border-l-blue-500";
      case "warning":
        return "text-amber-600 border-l-amber-500";
      case "info":
      default:
        return "text-gray-600 border-l-gray-400";
    }
  };

  const getLogEntryIcon = (type) => {
    switch (type) {
      case "pickup":
        return (
          <ArrowRightCircle className="w-4 h-4 text-blue-500 flex-shrink-0" />
        );
      case "putdown":
        return (
          <ArrowRightCircle className="w-4 h-4 text-purple-500 flex-shrink-0" />
        );
      case "eating":
        return <Utensils className="w-4 h-4 text-green-500 flex-shrink-0" />;
      case "thinking":
        return <User className="w-4 h-4 text-blue-500 flex-shrink-0" />;
      case "warning":
        return <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />;
      case "info":
      default:
        return <Clock className="w-4 h-4 text-gray-500 flex-shrink-0" />;
    }
  };

  return (
    <div className="min-h-screen  font-sans w-full bg-gray-50">
      <div className="w-full mx-auto p-6">
        <div className="text-center mb-2">
          <h1 className="text-3xl md:text-4xl font-bold mb-2 text-blue-700">
            Dining Philosophers Simulation
          </h1>
          <p className="text-gray-600">
            Control when philosophers pick up left or right forks. Both forks
            are needed to eat!
          </p>
        </div>
        <div className="flex flex-row gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl w-[33%]">
            <h3 className="text-lg font-semibold text-blue-700 mb-3">
              Philosophers
            </h3>
            <div className="space-y-4 w-full">
              {philosophers.map((philosopher) => (
                <div
                  key={philosopher.id}
                  className={`border-2 rounded-lg p-3 ${getPhilosopherStateColor(
                    philosopher.state
                  )}`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-medium">
                      {philosopher.name} ({philosopher.id})
                    </div>
                    <div className="text-sm capitalize font-semibold">
                      {philosopher.state}
                    </div>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-sm">
                      Left Fork: {philosopher.leftFork ? "✅" : "❌"} &nbsp;
                      Right Fork: {philosopher.rightFork ? "✅" : "❌"}
                    </div>
                    <div className="text-sm">
                      Meals: {philosopher.eatingTime}
                    </div>
                  </div>

                  <div className="flex justify-between mt-2 space-x-2">
                    <button
                      onClick={() => pickUpLeftFork(philosopher.id)}
                      disabled={
                        philosopher.leftFork || philosopher.state === "eating"
                      }
                      className={`flex-1 px-2 py-1 text-sm font-medium rounded
                                    ${
                                      philosopher.leftFork ||
                                      philosopher.state === "eating"
                                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                        : "bg-blue-500 hover:bg-blue-600 text-white"
                                    }`}
                    >
                      Left Fork
                    </button>

                    <button
                      onClick={() => pickUpRightFork(philosopher.id)}
                      disabled={
                        philosopher.rightFork || philosopher.state === "eating"
                      }
                      className={`flex-1 px-2 py-1 text-sm font-medium rounded
                                    ${
                                      philosopher.rightFork ||
                                      philosopher.state === "eating"
                                        ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                        : "bg-blue-500 hover:bg-blue-600 text-white"
                                    }`}
                    >
                      Right Fork
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="w-[50%] space-y-6">
            <div className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <Utensils className="w-5 h-5 text-blue-500 mr-2" />
                  <h2 className="text-xl font-semibold text-gray-800">
                    Table Visualization
                  </h2>
                </div>
              </div>

              <div className="relative mb-6">
                <div className="w-64 h-64 bg-amber-200 rounded-full mx-auto relative border-4 border-amber-300">
                  {philosophers.map((philosopher, index) => {
                    const angle = (index / numPhilosophers) * 2 * Math.PI;
                    const radius = 100;
                    const xPos = Math.sin(angle) * radius + 124;
                    const yPos = -Math.cos(angle) * radius + 124;

                    return (
                      <div
                        key={philosopher.id}
                        className={`absolute w-16 h-16 -mt-8 -ml-8 rounded-full flex items-center justify-center shadow-md border-2
                        ${getPhilosopherStateColor(philosopher.state)}`}
                        style={{
                          left: `${xPos}px`,
                          top: `${yPos}px`,
                          transition: "all 0.3s ease-in-out",
                        }}
                      >
                        <div className="text-center">
                          <div className="text-xs font-semibold">
                            {philosopher.name}
                          </div>
                          <div className="text-xs capitalize">
                            {philosopher.state}
                          </div>
                        </div>
                      </div>
                    );
                  })}

                  {forks.map((fork, index) => {
                    const angle =
                      ((index + 0.5) / numPhilosophers) * 2 * Math.PI;
                    const radius = 70; 
                    const xPos = Math.sin(angle) * radius + 124;
                    const yPos = -Math.cos(angle) * radius + 124;

                    return (
                      <div
                        key={`fork-${fork.id}`}
                        className={`absolute w-6 h-6 -mt-3 -ml-3 rounded-full flex items-center justify-center
                        ${
                          fork.inUse ? "bg-gray-400" : "bg-yellow-400"
                        } shadow-sm`}
                        style={{
                          left: `${xPos}px`,
                          top: `${yPos}px`,
                          transition: "all 0.3s ease-in-out",
                        }}
                      >
                        <div className="text-xs font-bold text-white">
                          {fork.id}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl md:col-span-2 ">
                <div className="flex items-center mb-4">
                  <Activity className="w-5 h-5 text-blue-500 mr-2" />
                  <h2 className="text-xl font-semibold text-gray-800">
                    Controls
                  </h2>
                </div>

                <div className="space-y-5">
                  <div>
                    <div className="flex justify-between mb-1">
                      <label className="text-sm font-medium text-gray-700">
                        Number of Philosophers
                      </label>
                      <span className="text-blue-600 font-medium">
                        {numPhilosophers}
                      </span>
                    </div>
                    <input
                      type="range"
                      min="2"
                      max="10"
                      value={numPhilosophers}
                      onChange={(e) =>
                        setNumPhilosophers(parseInt(e.target.value))
                      }
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <label className="text-sm font-medium text-gray-700">
                        Eating Duration (seconds)
                      </label>
                      <span className="text-blue-600 font-medium">
                        {eatingDuration}s
                      </span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={eatingDuration}
                      onChange={(e) =>
                        setEatingDuration(parseInt(e.target.value))
                      }
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
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

              <div className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl md:col-span-2 ">
                <div className="flex items-center mb-4">
                  <Activity className="w-5 h-5 text-blue-500 mr-2" />
                  <h2 className="text-xl font-semibold text-gray-800">
                    Statistics
                  </h2>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-green-50 p-3 rounded-lg text-center transform transition-all duration-300 hover:scale-105">
                    <p className="text-sm font-medium text-green-800 mb-1">
                      Meals Eaten
                    </p>
                    <p className="text-xl font-bold text-green-600">
                      {stats.mealsEaten}
                    </p>
                  </div>

                  <div className="bg-blue-50 p-3 rounded-lg text-center transform transition-all duration-300 hover:scale-105">
                    <p className="text-sm font-medium text-blue-800 mb-1">
                      Forks Picked Up
                    </p>
                    <p className="text-xl font-bold text-blue-600">
                      {stats.forksPickedUp}
                    </p>
                  </div>

                  <div className="bg-purple-50 p-3 rounded-lg text-center transform transition-all duration-300 hover:scale-105">
                    <p className="text-sm font-medium text-purple-800 mb-1">
                      Forks Put Down
                    </p>
                    <p className="text-xl font-bold text-purple-600">
                      {stats.forksPutDown}
                    </p>
                  </div>

                  <div className="bg-red-50 p-3 rounded-lg text-center transform transition-all duration-300 hover:scale-105">
                    <p className="text-sm font-medium text-red-800 mb-1">
                      Deadlocks
                    </p>
                    <p className="text-xl font-bold text-red-600">
                      {stats.deadlockEvents}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="w-[33%]">
            <div className="bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl h-full flex flex-col">
              <div className="flex items-center mb-4">
                <Activity className="w-5 h-5 text-blue-500 mr-2" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Activity Log
                </h2>
              </div>

              <div
                ref={logContainerRef}
                className="flex-grow overflow-y-auto pr-2 border border-gray-200 rounded-lg p-2 bg-gray-50"
                style={{ maxHeight: "600px" }}
              >
                {activityLog.length === 0 ? (
                  <div className="text-center p-4 text-gray-500 italic">
                    No activity yet. Use the philosopher controls to see log
                    entries.
                  </div>
                ) : (
                  <div className="space-y-2">
                    {activityLog.map((entry) => (
                      <div
                        key={entry.id}
                        className={`border-l-4 pl-2 py-1 text-sm rounded bg-white shadow-sm 
                                  ${getLogEntryColor(
                                    entry.type
                                  )} animate-fadeIn`}
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
                    <div className="w-3 h-3 bg-blue-500 rounded-full mr-1"></div>
                    <span>Pick Up Fork</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-600">
                    <div className="w-3 h-3 bg-purple-500 rounded-full mr-1"></div>
                    <span>Put Down Forks</span>
                  </div>
                  <div className="flex items-center text-xs text-gray-600">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-1"></div>
                    <span>Eating</span>
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
            The Dining Philosophers problem is a classic synchronization problem
            in computer science.
          </p>
          <p className="mt-2">
            Each philosopher must acquire two forks to eat, illustrating
            resource allocation and deadlock scenarios.
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

export default DiningPhilosophers;


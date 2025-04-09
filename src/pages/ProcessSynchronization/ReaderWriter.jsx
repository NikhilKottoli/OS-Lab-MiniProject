import { useState, useEffect } from "react";
import { Activity, BookOpen, Edit, Clock } from "lucide-react";

export default function ReaderWriterSimulation() {
  const [readers, setReaders] = useState(0);
  const [waitingReaders, setWaitingReaders] = useState(0);
  const [writers, setWriters] = useState(0);
  const [waitingWriters, setWaitingWriters] = useState(0);
  const [resource, setResource] = useState("Shared Resource Content");
  const [log, setLog] = useState([]);
  const [speed, setSpeed] = useState(1000);
  const [isRunning, setIsRunning] = useState(false);
  const [mode, setMode] = useState("fair");
  const [readerAction, setReaderAction] = useState(false);
  const [writerAction, setWriterAction] = useState(false);
  const [readerId, setReaderId] = useState(1);
  const [writerId, setWriterId] = useState(1);
  const [activeReaders, setActiveReaders] = useState([]);
  const [activeWriters, setActiveWriters] = useState([]);
  const [waitingReadersList, setWaitingReadersList] = useState([]);
  const [waitingWritersList, setWaitingWritersList] = useState([]);

  const addLog = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    setLog((prev) => [`${timestamp}: ${message}`, ...prev.slice(0, 19)]);
  };

  const animateAction = (type) => {
    if (type === "reader") {
      setReaderAction(true);
      setTimeout(() => setReaderAction(false), 300);
    } else {
      setWriterAction(true);
      setTimeout(() => setWriterAction(false), 300);
    }
  };

  const addReader = () => {
    const newReaderId = readerId;
    setReaderId((prev) => prev + 1);

    if (writers > 0 || (waitingWriters > 0 && mode !== "reader-priority")) {
      setWaitingReaders((prev) => prev + 1);
      setWaitingReadersList((prev) => [...prev, newReaderId]);
      addLog(
        `Reader #${newReaderId} waiting - resource occupied by writer or writer waiting`
      );
    } else {
      setReaders((prev) => prev + 1);
      setActiveReaders((prev) => [...prev, newReaderId]);
      addLog(`Reader #${newReaderId} accessing resource`);
    }
    animateAction("reader");
  };

  const addWriter = () => {
    const newWriterId = writerId;
    setWriterId((prev) => prev + 1);

    if (
      readers > 0 ||
      writers > 0 ||
      (waitingReaders > 0 && mode === "reader-priority")
    ) {
      setWaitingWriters((prev) => prev + 1);
      setWaitingWritersList((prev) => [...prev, newWriterId]);
      addLog(
        `Writer #${newWriterId} waiting - resource occupied or readers waiting`
      );
    } else {
      setWriters((prev) => prev + 1);
      setActiveWriters((prev) => [...prev, newWriterId]);
      addLog(`Writer #${newWriterId} accessing resource`);
      setTimeout(() => {
        setResource(
          `Modified by Writer #${newWriterId} at ${new Date().toLocaleTimeString()}`
        );
      }, speed / 2);
    }
    animateAction("writer");
  };

  const removeReader = () => {
    if (readers > 0) {
      const readerToRemove = activeReaders[0];
      setReaders((prev) => prev - 1);
      setActiveReaders((prev) => prev.slice(1));
      addLog(`Reader #${readerToRemove} finished`);
    }
  };

  const removeWriter = () => {
    if (writers > 0) {
      const writerToRemove = activeWriters[0];
      setWriters((prev) => prev - 1);
      setActiveWriters((prev) => prev.slice(1));
      addLog(`Writer #${writerToRemove} finished`);
    }
  };

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      if (
        writers === 0 &&
        waitingReaders > 0 &&
        (mode !== "writer-priority" || waitingWriters === 0)
      ) {
        const readerToActivate = waitingReadersList[0];
        setWaitingReaders((prev) => prev - 1);
        setWaitingReadersList((prev) => prev.slice(1));
        setReaders((prev) => prev + 1);
        setActiveReaders((prev) => [...prev, readerToActivate]);
        addLog(`Waiting Reader #${readerToActivate} now accessing resource`);
        animateAction("reader");
      }

      if (
        readers === 0 &&
        writers === 0 &&
        waitingWriters > 0 &&
        (mode !== "reader-priority" || waitingReaders === 0)
      ) {
        const writerToActivate = waitingWritersList[0];
        setWaitingWriters((prev) => prev - 1);
        setWaitingWritersList((prev) => prev.slice(1));
        setWriters((prev) => prev + 1);
        setActiveWriters((prev) => [...prev, writerToActivate]);
        addLog(`Waiting Writer #${writerToActivate} now accessing resource`);
        setTimeout(() => {
          setResource(
            `Modified by Writer #${writerToActivate} at ${new Date().toLocaleTimeString()}`
          );
        }, speed / 2);
        animateAction("writer");
      }

      if (Math.random() < 0.1 && readers > 0) {
        removeReader();
      }

      if (Math.random() < 0.15 && writers > 0) {
        removeWriter();
      }
    }, speed);

    return () => clearInterval(interval);
  }, [
    isRunning,
    mode,
    speed,
    readers,
    writers,
    waitingReaders,
    waitingWriters,
    waitingReadersList,
    waitingWritersList,
    activeReaders,
    activeWriters,
  ]);

  return (
    <div className="flex flex-row min-h-screen">
      <div className="flex flex-col mt-6 mb-6 ml-6 p-6 w-[70%] mx-auto bg-gray-50 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-10 text-center bg-gradient-to-r from-blue-600 to-purple-600 text-transparent bg-clip-text">
          Reader-Writer Problem Simulation
        </h1>

        <div className="flex flex-wrap mb-6 gap-4 justify-center">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className={`px-5 py-2 rounded-lg font-medium transition-all duration-300 shadow-md ${
              isRunning
                ? "bg-red-500 hover:bg-red-600 text-white ring-red-300"
                : "bg-green-500 hover:bg-green-600 text-white ring-green-300"
            } hover:shadow-lg focus:ring-4`}
          >
            {isRunning ? "Pause" : "Start"} Simulation
          </button>

          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-300 shadow-sm bg-white focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition-all duration-300"
          >
            <option value="fair">Fair (FIFO)</option>
            <option value="reader-priority">Reader Priority</option>
            <option value="writer-priority">Writer Priority</option>
          </select>

          <div className="flex items-center bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200">
            <label className="mr-3 font-medium text-gray-700">Speed:</label>
            <input
              type="range"
              min="200"
              max="3000"
              value={speed}
              onChange={(e) => setSpeed(parseInt(e.target.value))}
              className="w-32 accent-blue-500"
            />
            <span className="ml-2 text-sm text-gray-500">{speed}ms</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="flex flex-col p-5 bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-xl font-semibold mb-4 flex items-center text-blue-600">
              <BookOpen className="mr-2" size={22} /> Readers
            </h2>

            {/* Fixed height container for tokens to prevent layout shift */}
            <div className="min-h-32 mb-4">
              <div className="flex flex-wrap gap-2 mb-2">
                {activeReaders.map((id) => (
                  <div
                    key={`reader-${id}`}
                    className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full border border-blue-200 shadow-sm animate-pulse flex items-center"
                  >
                    <div className="w-2 h-2 bg-blue-400 rounded-full mr-1"></div>{" "}
                    R#{id}
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {waitingReadersList.map((id) => (
                  <div
                    key={`waiting-reader-${id}`}
                    className="px-3 py-1 bg-amber-50 text-amber-700 text-sm rounded-full border border-amber-200 shadow-sm flex items-center"
                  >
                    <Clock size={12} className="mr-1" /> R#{id}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex space-x-4">
                <button
                  onClick={addReader}
                  className={`px-4 py-2 bg-blue-500 text-white rounded-lg shadow transition-all duration-300 hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 ${
                    readerAction ? "opacity-80" : ""
                  }`}
                  disabled={!isRunning}
                  style={{
                    transform: readerAction ? "scale(0.98)" : "scale(1)",
                  }}
                >
                  Add Reader
                </button>
                <button
                  onClick={removeReader}
                  className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg transition-all duration-300 hover:bg-blue-200 focus:ring-2 focus:ring-blue-300 disabled:opacity-50"
                  disabled={readers === 0 || !isRunning}
                >
                  Remove Reader
                </button>
              </div>

              <div className="flex items-center space-x-6 ml-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-600">
                    {readers}
                  </div>
                  <div className="text-xs text-gray-500 font-medium uppercase">
                    Active
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-500">
                    {waitingReaders}
                  </div>
                  <div className="text-xs text-gray-500 font-medium uppercase">
                    Waiting
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col p-5 bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-xl font-semibold mb-4 flex items-center text-purple-600">
              <Edit className="mr-2" size={22} /> Writers
            </h2>

            {/* Fixed height container for tokens to prevent layout shift */}
            <div className="min-h-32 mb-4">
              <div className="flex flex-wrap gap-2 mb-2">
                {activeWriters.map((id) => (
                  <div
                    key={`writer-${id}`}
                    className="px-3 py-1 bg-purple-100 text-purple-800 text-sm rounded-full border border-purple-200 shadow-sm animate-pulse flex items-center"
                  >
                    <div className="w-2 h-2 bg-purple-400 rounded-full mr-1"></div>{" "}
                    W#{id}
                  </div>
                ))}
              </div>
              <div className="flex flex-wrap gap-2">
                {waitingWritersList.map((id) => (
                  <div
                    key={`waiting-writer-${id}`}
                    className="px-3 py-1 bg-amber-50 text-amber-700 text-sm rounded-full border border-amber-200 shadow-sm flex items-center"
                  >
                    <Clock size={12} className="mr-1" /> W#{id}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="flex space-x-4">
                <button
                  onClick={addWriter}
                  className={`px-4 py-2 bg-purple-500 text-white rounded-lg shadow transition-all duration-300 hover:bg-purple-600 focus:ring-2 focus:ring-purple-300 ${
                    writerAction ? "opacity-80" : ""
                  }`}
                  disabled={!isRunning}
                  style={{
                    transform: writerAction ? "scale(0.98)" : "scale(1)",
                  }}
                >
                  Add Writer
                </button>
                <button
                  onClick={removeWriter}
                  className="px-4 py-2 bg-purple-100 text-purple-800 rounded-lg transition-all duration-300 hover:bg-purple-200 focus:ring-2 focus:ring-purple-300 disabled:opacity-50"
                  disabled={writers === 0 || !isRunning}
                >
                  Remove Writer
                </button>
              </div>

              <div className="flex items-center space-x-6 ml-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-purple-600">
                    {writers}
                  </div>
                  <div className="text-xs text-gray-500 font-medium uppercase">
                    Active
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-amber-500">
                    {waitingWriters}
                  </div>
                  <div className="text-xs text-gray-500 font-medium uppercase">
                    Waiting
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
          <div className="p-5 bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-xl font-semibold mb-3 text-gray-800 flex items-center">
              <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded mr-2"></div>
              Shared Resource
            </h2>
            <div
              className={`p-5 rounded-lg transition-all duration-500 min-h-32 ${
                writers > 0
                  ? "border-2 border-purple-300 bg-purple-50 shadow-md"
                  : readers > 0
                  ? "border-2 border-blue-300 bg-blue-50 shadow-md"
                  : "border border-gray-200 bg-gray-50"
              }`}
            >
              <p
                className={`font-mono text-gray-700 ${
                  writers > 0 ? "animate-pulse" : ""
                }`}
              >
                {resource}
              </p>
              <div className="mt-3 text-sm flex items-center">
                {writers > 0 && (
                  <span className="text-purple-600 flex items-center px-3 py-1 bg-purple-100 rounded-full shadow-sm">
                    <Edit className="mr-1" size={14} /> Being modified by writer
                  </span>
                )}
                {readers > 0 && writers === 0 && (
                  <span className="text-blue-600 flex items-center px-3 py-1 bg-blue-100 rounded-full shadow-sm">
                    <BookOpen className="mr-1" size={14} /> Being read by{" "}
                    {readers} reader{readers !== 1 ? "s" : ""}
                  </span>
                )}
                {readers === 0 && writers === 0 && (
                  <span className="text-gray-500 flex items-center px-3 py-1 bg-gray-100 rounded-full shadow-sm">
                    <Clock className="mr-1" size={14} /> Resource idle
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="p-5 bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
            <h2 className="text-xl font-semibold mb-3 text-gray-800 flex items-center">
              <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded mr-2"></div>
              <Activity className="mr-2" size={20} /> Activity Log
            </h2>
            <div className="h-78 overflow-y-auto pr-2 rounded-lg bg-gray-50 p-3 border border-gray-200">
              {log.length === 0 && (
                <div className="flex items-center justify-center h-full text-gray-400">
                  No activity yet. Start the simulation and add readers or
                  writers.
                </div>
              )}
              {log.map((entry, index) => {
                const isReader = entry.includes("Reader");
                const isWriter = entry.includes("Writer");
                const isWaiting = entry.includes("waiting");
                const isFinished = entry.includes("finished");

                return (
                  <div
                    key={index}
                    className={`py-2 px-3 rounded mb-1 ${
                      index === 0 ? "animate-fadeIn" : ""
                    } ${
                      isReader && !isWaiting && !isFinished
                        ? "bg-blue-50 border-l-4 border-blue-400"
                        : isWriter && !isWaiting && !isFinished
                        ? "bg-purple-50 border-l-4 border-purple-400"
                        : isWaiting
                        ? "bg-amber-50 border-l-4 border-amber-400"
                        : isFinished
                        ? "bg-gray-50 border-l-4 border-gray-400"
                        : ""
                    }`}
                  >
                    <span className="text-gray-700 font-medium">
                      {entry.split(": ")[0]}:
                    </span>{" "}
                    <span
                      className={
                        isReader && !isWaiting && !isFinished
                          ? "text-blue-700"
                          : isWriter && !isWaiting && !isFinished
                          ? "text-purple-700"
                          : isWaiting
                          ? "text-amber-700"
                          : isFinished
                          ? "text-gray-600"
                          : ""
                      }
                    >
                      {entry.split(": ")[1]}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <style jsx>{`
          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateY(-5px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .animate-fadeIn {
            animation: fadeIn 0.5s ease-out;
          }
        `}</style>
      </div>
      <div className="w-[25%] m-6 p-5 bg-white rounded-xl shadow-md border border-gray-100 hover:shadow-lg transition-shadow duration-300">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 flex items-center">
          <div className="w-1 h-6 bg-gradient-to-b from-blue-500 to-purple-500 rounded mr-2"></div>
          Mode Explanation
        </h2>
        <div className="grid grid-rows-1 md:grid-rows-3 gap-4">
          <div className="p-4 border border-gray-200 rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 mr-2">
                1
              </div>
              <p className="font-bold text-gray-800">Fair (FIFO)</p>
            </div>
            <p className="text-gray-600">
              First come, first served. Processes get access in the order they
              arrive, maintaining a fair balance.
            </p>
          </div>
          <div className="p-4 border border-blue-200 rounded-lg bg-blue-50 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mr-2">
                <BookOpen size={16} />
              </div>
              <p className="font-bold text-blue-800">Reader Priority</p>
            </div>
            <p className="text-blue-700">
              Readers are given priority over writers. Multiple readers can
              access simultaneously. Writers may starve if readers keep coming.
            </p>
          </div>
          <div className="p-4 border border-purple-200 rounded-lg bg-purple-50 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-center mb-2">
              <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-600 mr-2">
                <Edit size={16} />
              </div>
              <p className="font-bold text-purple-800">Writer Priority</p>
            </div>
            <p className="text-purple-700">
              Writers are given priority over readers. Ensures data consistency
              but readers may starve if writers keep coming.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { Send, CheckCircle, AlertCircle, ArrowRight } from "lucide-react";

// A custom hook for animation timing
function useDelayedState(initialValue, delay) {
  const [value, setValue] = useState(initialValue);
  const [targetValue, setTargetValue] = useState(initialValue);

  useEffect(() => {
    const timer = setTimeout(() => {
      setValue(targetValue);
    }, delay);

    return () => clearTimeout(timer);
  }, [targetValue, delay]);

  return [value, targetValue, setTargetValue];
}

export default function IPCVisualization() {
  const [userInput, setUserInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [processStatus, setProcessStatus] = useState("idle");

  // Animation states
  const [message, messageTarget, setMessageTarget] = useDelayedState(null, 500);
  const [processAData, processADataTarget, setProcessADataTarget] =
    useDelayedState(null, 700);
  const [processBData, processBDataTarget, setProcessBDataTarget] =
    useDelayedState(null, 900);
  const [processCData, processCDataTarget, setProcessCDataTarget] =
    useDelayedState(null, 1100);
  const [result, resultTarget, setResultTarget] = useDelayedState(null, 1300);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userInput.trim() || isProcessing) return;

    // Reset states
    setProcessStatus("processing");
    setIsProcessing(true);
    setMessageTarget(userInput);
    setProcessADataTarget(null);
    setProcessBDataTarget(null);
    setProcessCDataTarget(null);
    setResultTarget(null);

    // Simulate Process A (capitalize)
    setTimeout(() => {
      setProcessADataTarget(userInput.toUpperCase());

      // Simulate Process B (reverse)
      setTimeout(() => {
        setProcessBDataTarget(
          userInput.toUpperCase().split("").reverse().join("")
        );

        // Simulate Process C (add timestamp)
        setTimeout(() => {
          const timestamp = new Date().toLocaleTimeString();
          setProcessCDataTarget(
            `${userInput
              .toUpperCase()
              .split("")
              .reverse()
              .join("")} [${timestamp}]`
          );

          // Final result
          setTimeout(() => {
            setResultTarget(
              `${userInput
                .toUpperCase()
                .split("")
                .reverse()
                .join("")} [${timestamp}]`
            );
            setProcessStatus("complete");
            setIsProcessing(false);
          }, 1000);
        }, 1000);
      }, 1000);
    }, 1000);
  };

  return (
    <div className="flex flex-col items-center w-full max-w-4xl mx-auto p-6 bg-slate-50 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6 text-slate-800">
        Interprocess Communication Visualization
      </h1>

      {/* User Input */}
      <form onSubmit={handleSubmit} className="w-full mb-8">
        <div className="flex gap-2">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Enter a message to send between processes..."
            className="flex-1 p-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isProcessing}
          />
          <button
            type="submit"
            disabled={isProcessing || !userInput.trim()}
            className={`flex items-center gap-2 px-4 py-2 rounded-md ${
              isProcessing || !userInput.trim()
                ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            <Send size={18} /> Send
          </button>
        </div>
      </form>

      {/* Status Indicator */}
      <div className="w-full mb-6 flex items-center justify-center">
        {processStatus === "idle" && (
          <div className="text-slate-500 flex items-center gap-2">
            <span className="inline-block w-3 h-3 bg-slate-300 rounded-full"></span>
            Waiting for input
          </div>
        )}
        {processStatus === "processing" && (
          <div className="text-amber-600 flex items-center gap-2">
            <span className="inline-block w-3 h-3 bg-amber-500 rounded-full animate-pulse"></span>
            Processing message
          </div>
        )}
        {processStatus === "complete" && (
          <div className="text-green-600 flex items-center gap-2">
            <CheckCircle size={18} />
            Processing complete
          </div>
        )}
        {processStatus === "error" && (
          <div className="text-red-600 flex items-center gap-2">
            <AlertCircle size={18} />
            Error processing message
          </div>
        )}
      </div>

      {/* Process Visualization */}
      <div className="w-full mb-8 overflow-hidden">
        <div className="flex flex-col gap-8">
          {/* Message Queue */}
          <div className="flex items-center gap-4">
            <div className="w-32 text-right font-bold text-slate-700">
              Message Queue
            </div>
            <div
              className={`flex-1 p-4 rounded-lg border-2 border-blue-200 bg-blue-50 min-h-16 transition-all duration-300 ${
                message ? "border-blue-500" : ""
              }`}
            >
              {message && (
                <div className="flex items-center gap-2">
                  <div className="px-3 py-2 bg-blue-100 rounded-md border border-blue-300 animate-pulse">
                    {message}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Process A */}
          <div className="flex items-center gap-4">
            <div className="w-32 text-right font-bold text-slate-700">
              Process A<br />
              <span className="text-xs font-normal text-slate-500">
                (Capitalize)
              </span>
            </div>
            <div
              className={`relative flex-1 p-4 rounded-lg border-2 border-purple-200 bg-purple-50 min-h-16 transition-all duration-300 ${
                processAData ? "border-purple-500" : ""
              }`}
            >
              {message && !processAData && (
                <ArrowRight className="absolute -left-6 top-1/2 -translate-y-1/2 text-slate-400 animate-bounce" />
              )}
              {processAData && (
                <div className="flex items-center gap-2">
                  <div className="px-3 py-2 bg-purple-100 rounded-md border border-purple-300">
                    {processAData}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Process B */}
          <div className="flex items-center gap-4">
            <div className="w-32 text-right font-bold text-slate-700">
              Process B<br />
              <span className="text-xs font-normal text-slate-500">
                (Reverse)
              </span>
            </div>
            <div
              className={`relative flex-1 p-4 rounded-lg border-2 border-green-200 bg-green-50 min-h-16 transition-all duration-300 ${
                processBData ? "border-green-500" : ""
              }`}
            >
              {processAData && !processBData && (
                <ArrowRight className="absolute -left-6 top-1/2 -translate-y-1/2 text-slate-400 animate-bounce" />
              )}
              {processBData && (
                <div className="flex items-center gap-2">
                  <div className="px-3 py-2 bg-green-100 rounded-md border border-green-300">
                    {processBData}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Process C */}
          <div className="flex items-center gap-4">
            <div className="w-32 text-right font-bold text-slate-700">
              Process C<br />
              <span className="text-xs font-normal text-slate-500">
                (Add Timestamp)
              </span>
            </div>
            <div
              className={`relative flex-1 p-4 rounded-lg border-2 border-amber-200 bg-amber-50 min-h-16 transition-all duration-300 ${
                processCData ? "border-amber-500" : ""
              }`}
            >
              {processBData && !processCData && (
                <ArrowRight className="absolute -left-6 top-1/2 -translate-y-1/2 text-slate-400 animate-bounce" />
              )}
              {processCData && (
                <div className="flex items-center gap-2">
                  <div className="px-3 py-2 bg-amber-100 rounded-md border border-amber-300">
                    {processCData}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Result */}
          <div className="flex items-center gap-4">
            <div className="w-32 text-right font-bold text-slate-700">
              Result Output
            </div>
            <div
              className={`relative flex-1 p-4 rounded-lg border-2 border-red-200 bg-red-50 min-h-16 transition-all duration-300 ${
                result ? "border-red-500" : ""
              }`}
            >
              {processCData && !result && (
                <ArrowRight className="absolute -left-6 top-1/2 -translate-y-1/2 text-slate-400 animate-bounce" />
              )}
              {result && (
                <div className="px-3 py-2 bg-red-100 rounded-md border border-red-300">
                  {result}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="w-full p-4 bg-white rounded-md border border-slate-200">
        <h3 className="font-bold text-slate-700 mb-2">How it works:</h3>
        <ol className="list-decimal ml-5 text-sm text-slate-600 space-y-1">
          <li>Enter a message and click Send to initiate the process</li>
          <li>The message passes through a queue before being processed</li>
          <li>Process A capitalizes the entire message</li>
          <li>Process B reverses the capitalized message</li>
          <li>Process C adds a timestamp to the reversed message</li>
          <li>The final result is displayed in the output box</li>
        </ol>
      </div>
    </div>
  );
}

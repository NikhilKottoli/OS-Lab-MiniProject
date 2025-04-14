import React, { useState, useEffect } from 'react';
import { Power, Cpu, HardDrive, Check, X, MonitorCheck, Loader2, RefreshCw, Play, RotateCcw, Pause } from 'lucide-react';

const BootStage = ({ icon: Icon, title, description, isActive, isCompleted, children }) => {
  return (
    <div className={`
      relative p-6 rounded-lg border-2 transition-all duration-300
      ${isActive ? 'border-blue-500 bg-blue-50' : 'border-gray-200 bg-white'}
      ${isCompleted ? 'border-green-500 bg-green-50' : ''}
    `}>
      <div className="flex items-center gap-4 mb-3">
        <div className={`
          p-2 rounded-full
          ${isActive ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-600'}
          ${isCompleted ? 'bg-green-500 text-white' : ''}
        `}>
          <Icon size={24} />
        </div>
        <div>
          <h3 className="text-lg font-semibold">{title}</h3>
          <p className="text-sm text-gray-600">{description}</p>
        </div>
        {isCompleted && <Check className="ml-auto text-green-500" size={24} />}
        {isActive && <Loader2 className="ml-auto animate-spin text-blue-500" size={24} />}
      </div>
      {children && (
        <div className="ml-12 mt-4 space-y-2 text-sm">
          {children}
        </div>
      )}
    </div>
  );
};

const CheckItem = ({ text, isChecked }) => (
  <div className="flex items-center gap-2">
    {isChecked ? (
      <Check size={16} className="text-green-500" />
    ) : (
      <X size={16} className="text-red-500" />
    )}
    <span className={isChecked ? 'text-green-700' : 'text-red-700'}>{text}</span>
  </div>
);

const ControlButton = ({ icon: Icon, onClick, label, disabled, variant = 'primary' }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`
      flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all
      ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-90'}
      ${variant === 'primary' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}
    `}
  >
    <Icon size={18} />
    {label}
  </button>
);

export default function App() {
  const [currentStage, setCurrentStage] = useState(-1);
  const [checks, setChecks] = useState({
    cpu: false,
    memory: false,
    storage: false,
    display: false,
    bootDevice: false
  });
  const [isAutoPlaying, setIsAutoPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [speed, setSpeed] = useState(2000); // milliseconds between stages
  const [progress, setProgress] = useState({
    loadingBootSector: false,
    verifyingFiles: false,
    osFound: false,
    kernel: false,
    drivers: false,
    services: false,
    ui: false
  });

  useEffect(() => {
    let timeouts = [];
    
    if (isAutoPlaying && !isPaused) {
      const runNextStage = (stage) => {
        if (stage <= 3) {
          runStage(stage);
          timeouts.push(setTimeout(() => runNextStage(stage + 1), speed));
        } else {
          setIsAutoPlaying(false);
        }
      };
      
      timeouts.push(setTimeout(() => runNextStage(0), 100));
    }
    
    return () => {
      timeouts.forEach(clearTimeout);
    };
  }, [isAutoPlaying, isPaused, speed]);

  const resetSimulation = () => {
    setCurrentStage(-1);
    setChecks({
      cpu: false,
      memory: false,
      storage: false,
      display: false,
      bootDevice: false
    });
    setProgress({
      loadingBootSector: false,
      verifyingFiles: false,
      osFound: false,
      kernel: false,
      drivers: false,
      services: false,
      ui: false
    });
    setIsAutoPlaying(false);
    setIsPaused(false);
  };

  const runStage = (stageIndex) => {
    setCurrentStage(stageIndex);
    
    if (stageIndex === 0) {
      setTimeout(() => setChecks(prev => ({ ...prev, cpu: true })), speed * 0.25);
      setTimeout(() => setChecks(prev => ({ ...prev, memory: true })), speed * 0.5);
      setTimeout(() => setChecks(prev => ({ ...prev, storage: true })), speed * 0.75);
      setTimeout(() => setChecks(prev => ({ ...prev, display: true })), speed * 0.9);
    } 
    else if (stageIndex === 1) {
      setTimeout(() => setChecks(prev => ({ ...prev, bootDevice: true })), speed * 0.5);
    }
    else if (stageIndex === 2) {
      setTimeout(() => setProgress(prev => ({ ...prev, loadingBootSector: true })), speed * 0.3);
      setTimeout(() => setProgress(prev => ({ ...prev, verifyingFiles: true })), speed * 0.6);
      setTimeout(() => setProgress(prev => ({ ...prev, osFound: true })), speed * 0.9);
    }
    else if (stageIndex === 3) {
      setTimeout(() => setProgress(prev => ({ ...prev, kernel: true })), speed * 0.2);
      setTimeout(() => setProgress(prev => ({ ...prev, drivers: true })), speed * 0.4);
      setTimeout(() => setProgress(prev => ({ ...prev, services: true })), speed * 0.6);
      setTimeout(() => setProgress(prev => ({ ...prev, ui: true })), speed * 0.8);
    }
  };

  const startAutoPlay = () => {
    resetSimulation();
    setIsAutoPlaying(true);
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const handleManualAdvance = () => {
    if (currentStage < 3) {
      runStage(currentStage + 1);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-3xl font-bold text-center mb-4">Computer Boot Process</h1>
          
          <div className="flex gap-4 mb-4">
            {!isAutoPlaying ? (
              <ControlButton
                icon={Play}
                onClick={startAutoPlay}
                label="Auto Play"
                disabled={false}
                variant="primary"
              />
            ) : (
              <ControlButton
                icon={isPaused ? Play : Pause}
                onClick={togglePause}
                label={isPaused ? "Resume" : "Pause"}
                disabled={false}
                variant="primary"
              />
            )}
            <ControlButton
              icon={RefreshCw}
              onClick={handleManualAdvance}
              label="Next Stage"
              disabled={isAutoPlaying || currentStage >= 3}
              variant="secondary"
            />
            <ControlButton
              icon={RotateCcw}
              onClick={resetSimulation}
              label="Reset"
              disabled={currentStage === -1}
              variant="secondary"
            />
          </div>

          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600">Simulation Speed:</label>
            <select
              value={speed}
              onChange={(e) => setSpeed(Number(e.target.value))}
              className="px-2 py-1 rounded border"
              disabled={isAutoPlaying && !isPaused}
            >
              <option value={1000}>Fast (1s)</option>
              <option value={2000}>Normal (2s)</option>
              <option value={3000}>Slow (3s)</option>
            </select>
          </div>
        </div>
        
        <BootStage
          icon={Power}
          title="Power-On Self Test (POST)"
          description="Initial hardware check and system initialization"
          isActive={currentStage === 0}
          isCompleted={currentStage > 0}
        >
          <CheckItem text="CPU verification" isChecked={checks.cpu} />
          <CheckItem text="Memory test" isChecked={checks.memory} />
          <CheckItem text="Storage devices detection" isChecked={checks.storage} />
          <CheckItem text="Display adapter check" isChecked={checks.display} />
        </BootStage>

        <BootStage
          icon={Cpu}
          title="BIOS/UEFI Initialization"
          description="Basic Input/Output System setup and configuration"
          isActive={currentStage === 1}
          isCompleted={currentStage > 1}
        >
          <CheckItem text="Boot device detection" isChecked={checks.bootDevice} />
          <div className="bg-gray-800 text-green-400 p-3 rounded font-mono text-xs mt-2">
            Initializing BIOS settings...
            {checks.bootDevice && <div>Boot sequence configured.</div>}
          </div>
        </BootStage>

        <BootStage
          icon={HardDrive}
          title="Boot Loader"
          description="Loading operating system into memory"
          isActive={currentStage === 2}
          isCompleted={currentStage > 2}
        >
          {currentStage >= 2 && (
            <div className="bg-black text-green-400 p-3 rounded font-mono text-xs">
              {progress.loadingBootSector && <div>Loading boot sector...</div>}
              {progress.verifyingFiles && <div>Verifying system files...</div>}
              {progress.osFound && <div>Operating system found.</div>}
            </div>
          )}
        </BootStage>

        <BootStage
          icon={MonitorCheck}
          title="Operating System Initialization"
          description="Starting system services and user interface"
          isActive={currentStage === 3}
          isCompleted={currentStage > 3}
        >
          {currentStage >= 3 && (
            <div className="space-y-1">
              <div className={`text-gray-600 ${progress.kernel ? 'font-medium' : ''}`}>
                {progress.kernel && '✓ '} Loading system kernel
              </div>
              <div className={`text-gray-600 ${progress.drivers ? 'font-medium' : ''}`}>
                {progress.drivers && '✓ '} Initializing device drivers
              </div>
              <div className={`text-gray-600 ${progress.services ? 'font-medium' : ''}`}>
                {progress.services && '✓ '} Starting system services
              </div>
              <div className={`text-gray-600 ${progress.ui ? 'font-medium' : ''}`}>
                {progress.ui && '✓ '} Loading user interface
              </div>
              {progress.ui && (
                <div className="mt-4 p-3 bg-green-100 rounded-lg text-green-800 font-medium">
                  System boot complete! ✓
                </div>
              )}
            </div>
          )}
        </BootStage>
      </div>
    </div>
  );
}
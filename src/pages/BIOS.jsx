import React, { useState } from 'react';

export default function FirmwareExplainer() {
  const [activeTab, setActiveTab] = useState('overview');
  const [bootStage, setBootStage] = useState(0);
  const [showComparison, setShowComparison] = useState(false);
  const [bootProcess, setBootProcess] = useState('bios');

  // Animate boot sequence
  const handleStartBootAnimation = (type) => {
    setBootProcess(type);
    setBootStage(1);
    const interval = setInterval(() => {
      setBootStage(prevStage => {
        if (prevStage >= 7) {
          clearInterval(interval);
          return 7;
        }
        return prevStage + 1;
      });
    }, 1200);
  };

  const resetAnimation = () => {
    setBootStage(0);
  };

  // Tab content components
  const Overview = () => (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold mb-4">What is Firmware?</h2>
      <p className="text-lg">
        Firmware is a type of software that provides low-level control for a device's specific hardware. 
        It sits between the hardware components of your computer and the operating system, serving as a crucial 
        bridge that initializes and tests hardware components before your operating system loads.
      </p>
      
      <div className="bg-blue-50 p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-3">Key Firmware Types</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded shadow hover:shadow-lg transition-shadow">
            <h4 className="font-bold text-blue-800">BIOS</h4>
            <p>Basic Input/Output System - the traditional firmware used since the 1980s.</p>
          </div>
          <div className="bg-white p-4 rounded shadow hover:shadow-lg transition-shadow">
            <h4 className="font-bold text-blue-800">UEFI</h4>
            <p>Unified Extensible Firmware Interface - the modern replacement for BIOS.</p>
          </div>
          <div className="bg-white p-4 rounded shadow hover:shadow-lg transition-shadow">
            <h4 className="font-bold text-blue-800">Other Firmware</h4>
            <p>Including device-specific firmware like for GPUs, SSDs, and peripherals.</p>
          </div>
        </div>
      </div>
      
      <div className="mt-4">
        <h3 className="text-xl font-bold mb-3">Firmware's Role</h3>
        <div className="relative h-64 bg-gray-100 rounded-lg overflow-hidden border border-gray-300">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-full max-w-lg">
              <div className="relative h-20">
                {/* OS Layer */}
                <div className="absolute inset-x-0 top-0 h-8 bg-green-400 rounded-t-lg flex items-center justify-center text-white font-bold">
                  Operating System
                </div>
                
                {/* Firmware Layer */}
                <div className="absolute inset-x-0 top-8 h-8 bg-blue-500 flex items-center justify-center text-white font-bold">
                  Firmware (BIOS/UEFI)
                </div>
                
                {/* Hardware Layer */}
                <div className="absolute inset-x-0 top-16 h-8 bg-gray-700 rounded-b-lg flex items-center justify-center text-white font-bold">
                  Hardware
                </div>
              </div>
              
              <div className="mt-8 text-center">
                <p className="text-gray-700">
                  Firmware acts as the essential interface between your computer's hardware and operating system, 
                  initializing components and providing basic control instructions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
  const BiosSection = () => (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold mb-4">BIOS: Basic Input/Output System</h2>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/2">
          <p className="mb-4">
            BIOS (Basic Input/Output System) is the traditional firmware interface that's been used in PCs since the 1980s. 
            It's responsible for initializing and testing hardware components during the POST (Power-On Self Test) process 
            before handing control to the operating system.
          </p>
          
          <h3 className="text-xl font-bold mb-2">Key Characteristics of BIOS:</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>16-bit code running in real mode</li>
            <li>Limited to 1MB addressable space</li>
            <li>Can only boot from drives with MBR (Master Boot Record) partitioning</li>
            <li>Typically stored on a small EEPROM or flash memory chip on the motherboard</li>
            <li>Text-based interface with keyboard-only navigation</li>
            <li>Limited boot options and hardware support</li>
          </ul>
        </div>
        
        <div className="md:w-1/2 bg-gray-100 p-4 rounded-lg">
          <h3 className="text-lg font-bold mb-2 text-center">Traditional BIOS Interface</h3>
          <div className="bg-black text-white font-mono p-4 rounded border-2 border-blue-300 h-64 overflow-hidden">
            <div className="text-blue-300 text-center text-lg mb-2">Phoenix BIOS Setup Utility</div>
            <div className="text-gray-400 border-b border-gray-600 mb-2"></div>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>▶ System Information</div>
              <div>Advanced Settings</div>
              <div>Boot Options</div>
              <div>Security Settings</div>
              <div>Power Management</div>
              <div>Exit</div>
            </div>
            <div className="text-gray-400 border-b border-gray-600 my-2"></div>
            <div className="text-xs text-gray-400 mt-4">
              ↑↓: Select Item   Enter: Select   +/-: Change Values   F10: Save and Exit   ESC: Exit
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">BIOS Boot Process</h3>
        <button 
          onClick={() => handleStartBootAnimation('bios')}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mb-4 mr-2"
        >
          Animate BIOS Boot
        </button>
        <button 
          onClick={resetAnimation}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded mb-4"
        >
          Reset Animation
        </button>
        
        <div className="bg-gray-100 p-4 rounded-lg">
          <div className="relative h-16 bg-gray-200 rounded overflow-hidden">
            <div className="absolute h-full bg-blue-500 transition-all duration-1000" style={{ width: `${(bootProcess === 'bios' ? bootStage : 0) * 14.28}%` }}></div>
            <div className="absolute inset-0 flex items-center justify-between px-6">
              <span>Power On</span>
              <span>Operating System</span>
            </div>
          </div>
          
          <div className="mt-4 text-center font-mono">
            {bootProcess === 'bios' && bootStage >= 1 && (
              <div className={`${bootStage === 1 ? 'text-blue-600 font-bold' : 'text-gray-500'}`}>
                1. Power-On Self Test (POST)
              </div>
            )}
            {bootProcess === 'bios' && bootStage >= 2 && (
              <div className={`${bootStage === 2 ? 'text-blue-600 font-bold' : 'text-gray-500'}`}>
                2. Initialize key hardware (RAM, keyboard, basic devices)
              </div>
            )}
            {bootProcess === 'bios' && bootStage >= 3 && (
              <div className={`${bootStage === 3 ? 'text-blue-600 font-bold' : 'text-gray-500'}`}>
                3. Display system information
              </div>
            )}
            {bootProcess === 'bios' && bootStage >= 4 && (
              <div className={`${bootStage === 4 ? 'text-blue-600 font-bold' : 'text-gray-500'}`}>
                4. Check boot sequence configuration
              </div>
            )}
            {bootProcess === 'bios' && bootStage >= 5 && (
              <div className={`${bootStage === 5 ? 'text-blue-600 font-bold' : 'text-gray-500'}`}>
                5. Find bootable device with Master Boot Record (MBR)
              </div>
            )}
            {bootProcess === 'bios' && bootStage >= 6 && (
              <div className={`${bootStage === 6 ? 'text-blue-600 font-bold' : 'text-gray-500'}`}>
                6. Load & execute MBR bootloader
              </div>
            )}
            {bootProcess === 'bios' && bootStage >= 7 && (
              <div className={`${bootStage === 7 ? 'text-blue-600 font-bold' : 'text-gray-500'}`}>
                7. Bootloader loads Operating System
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
  
  const UefiSection = () => (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold mb-4">UEFI: Unified Extensible Firmware Interface</h2>
      
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/2">
          <p className="mb-4">
            UEFI (Unified Extensible Firmware Interface) is the modern replacement for BIOS, designed to address 
            its limitations. It offers more sophisticated features, better security, and support for newer hardware 
            technologies.
          </p>
          
          <h3 className="text-xl font-bold mb-2">Key Advantages of UEFI:</h3>
          <ul className="list-disc pl-6 space-y-2">
            <li>64-bit code from the start, with more addressable memory</li>
            <li>Support for drives larger than 2TB with GPT partitioning</li>
            <li>Graphical user interface with mouse support</li>
            <li>Faster boot times through parallel device initialization</li>
            <li>Secure Boot capability to prevent unauthorized boot code</li>
            <li>Network capabilities for remote troubleshooting</li>
            <li>Modular design for better extensibility</li>
          </ul>
        </div>
        
        <div className="md:w-1/2 bg-gray-100 p-4 rounded-lg">
          <h3 className="text-lg font-bold mb-2 text-center">Modern UEFI Interface</h3>
          <div className="bg-gradient-to-b from-blue-900 to-blue-700 text-white p-4 rounded border-2 border-blue-300 h-64 overflow-hidden">
            <div className="flex justify-between items-center mb-4">
              <div className="text-lg font-semibold">UEFI Firmware Settings</div>
              <div className="text-sm">v3.2</div>
            </div>
            <div className="flex h-48">
              <div className="w-1/3 border-r border-blue-500 pr-2">
                <div className="bg-blue-600 p-1 rounded mb-1">System Overview</div>
                <div className="p-1">Advanced Settings</div>
                <div className="p-1">Boot Options</div>
                <div className="p-1">Security</div>
                <div className="p-1">Server Management</div>
                <div className="p-1">Save & Exit</div>
              </div>
              <div className="w-2/3 pl-2">
                <div className="text-sm mb-2">System Information</div>
                <div className="grid grid-cols-2 gap-1 text-xs">
                  <div className="text-gray-300">Processor:</div>
                  <div>Intel Core i7-10700K</div>
                  <div className="text-gray-300">Memory:</div>
                  <div>32GB DDR4</div>
                  <div className="text-gray-300">UEFI Version:</div>
                  <div>3.2.1</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-8">
        <h3 className="text-xl font-bold mb-4">UEFI Boot Process</h3>
        <button 
          onClick={() => handleStartBootAnimation('uefi')}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mb-4 mr-2"
        >
          Animate UEFI Boot
        </button>
        <button 
          onClick={resetAnimation}
          className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded mb-4"
        >
          Reset Animation
        </button>
        
        <div className="bg-gray-100 p-4 rounded-lg">
          <div className="relative h-16 bg-gray-200 rounded overflow-hidden">
            <div className="absolute h-full bg-blue-500 transition-all duration-1000" style={{ width: `${(bootProcess === 'uefi' ? bootStage : 0) * 14.28}%` }}></div>
            <div className="absolute inset-0 flex items-center justify-between px-6">
              <span>Power On</span>
              <span>Operating System</span>
            </div>
          </div>
          
          <div className="mt-4 text-center font-mono">
            {bootProcess === 'uefi' && bootStage >= 1 && (
              <div className={`${bootStage === 1 ? 'text-blue-600 font-bold' : 'text-gray-500'}`}>
                1. Power-On and Security checks
              </div>
            )}
            {bootProcess === 'uefi' && bootStage >= 2 && (
              <div className={`${bootStage === 2 ? 'text-blue-600 font-bold' : 'text-gray-500'}`}>
                2. Initialize key hardware (parallel initialization)
              </div>
            )}
            {bootProcess === 'uefi' && bootStage >= 3 && (
              <div className={`${bootStage === 3 ? 'text-blue-600 font-bold' : 'text-gray-500'}`}>
                3. Load UEFI drivers and services
              </div>
            )}
            {bootProcess === 'uefi' && bootStage >= 4 && (
              <div className={`${bootStage === 4 ? 'text-blue-600 font-bold' : 'text-gray-500'}`}>
                4. Perform Secure Boot validation
              </div>
            )}
            {bootProcess === 'uefi' && bootStage >= 5 && (
              <div className={`${bootStage === 5 ? 'text-blue-600 font-bold' : 'text-gray-500'}`}>
                5. Find EFI System Partition (ESP) with boot manager
              </div>
            )}
            {bootProcess === 'uefi' && bootStage >= 6 && (
              <div className={`${bootStage === 6 ? 'text-blue-600 font-bold' : 'text-gray-500'}`}>
                6. Load UEFI application (bootloader)
              </div>
            )}
            {bootProcess === 'uefi' && bootStage >= 7 && (
              <div className={`${bootStage === 7 ? 'text-blue-600 font-bold' : 'text-gray-500'}`}>
                7. Bootloader loads Operating System
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
  
  const ComparisonSection = () => (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold mb-4">BIOS vs UEFI: Head-to-Head Comparison</h2>
      
      <button 
        onClick={() => setShowComparison(!showComparison)}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mb-4"
      >
        {showComparison ? "Hide Visual Comparison" : "Show Visual Comparison"}
      </button>
      
      {showComparison && (
        <div className="bg-gray-100 p-6 rounded-lg shadow-md mb-6 transition-all">
          <h3 className="text-lg font-bold mb-4 text-center">Boot Process Comparison</h3>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="bg-blue-100 p-4 rounded-lg h-full">
                <h4 className="font-bold text-center mb-2 text-blue-800">BIOS</h4>
                <div className="space-y-4">
                  <div className="bg-white p-2 rounded border border-blue-300 text-center">
                    Power On
                  </div>
                  <div className="flex justify-center">
                    <div className="w-0 h-8 border border-blue-500 border-dashed"></div>
                  </div>
                  <div className="bg-white p-2 rounded border border-blue-300 text-center">
                    POST (Power-On Self Test)
                  </div>
                  <div className="flex justify-center">
                    <div className="w-0 h-8 border border-blue-500 border-dashed"></div>
                  </div>
                  <div className="bg-white p-2 rounded border border-blue-300 text-center">
                    Find MBR Boot Device
                  </div>
                  <div className="flex justify-center">
                    <div className="w-0 h-8 border border-blue-500 border-dashed"></div>
                  </div>
                  <div className="bg-white p-2 rounded border border-blue-300 text-center">
                    Load Bootloader from MBR
                  </div>
                  <div className="flex justify-center">
                    <div className="w-0 h-8 border border-blue-500 border-dashed"></div>
                  </div>
                  <div className="bg-white p-2 rounded border border-blue-300 text-center">
                    Boot Operating System
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex-1">
              <div className="bg-green-100 p-4 rounded-lg h-full">
                <h4 className="font-bold text-center mb-2 text-green-800">UEFI</h4>
                <div className="space-y-4">
                  <div className="bg-white p-2 rounded border border-green-300 text-center">
                    Power On
                  </div>
                  <div className="flex justify-center">
                    <div className="w-0 h-8 border border-green-500 border-dashed"></div>
                  </div>
                  <div className="bg-white p-2 rounded border border-green-300 text-center">
                    Initialize Hardware in Parallel
                  </div>
                  <div className="flex justify-center">
                    <div className="w-0 h-8 border border-green-500 border-dashed"></div>
                  </div>
                  <div className="bg-white p-2 rounded border border-green-300 text-center">
                    Security Validation (Secure Boot)
                  </div>
                  <div className="flex justify-center">
                    <div className="w-0 h-8 border border-green-500 border-dashed"></div>
                  </div>
                  <div className="bg-white p-2 rounded border border-green-300 text-center">
                    Load Boot Manager from ESP
                  </div>
                  <div className="flex justify-center">
                    <div className="w-0 h-8 border border-green-500 border-dashed"></div>
                  </div>
                  <div className="bg-white p-2 rounded border border-green-300 text-center">
                    Boot Operating System
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-300 shadow-sm rounded-lg">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-4 text-left border-b">Feature</th>
              <th className="p-4 text-left border-b">BIOS</th>
              <th className="p-4 text-left border-b">UEFI</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="p-4 border-b font-medium">Architecture</td>
              <td className="p-4 border-b">16-bit</td>
              <td className="p-4 border-b">32-bit or 64-bit</td>
            </tr>
            <tr className="bg-gray-50">
              <td className="p-4 border-b font-medium">Storage Size Limits</td>
              <td className="p-4 border-b">Limited to 2TB drives (MBR)</td>
              <td className="p-4 border-b">Up to 9.4 ZB with GPT</td>
            </tr>
            <tr>
              <td className="p-4 border-b font-medium">Boot Time</td>
              <td className="p-4 border-b">Slower (sequential initialization)</td>
              <td className="p-4 border-b">Faster (parallel initialization)</td>
            </tr>
            <tr className="bg-gray-50">
              <td className="p-4 border-b font-medium">User Interface</td>
              <td className="p-4 border-b">Text-based, keyboard only</td>
              <td className="p-4 border-b">Graphical, mouse support</td>
            </tr>
            <tr>
              <td className="p-4 border-b font-medium">Security Features</td>
              <td className="p-4 border-b">Limited, vulnerable to bootkits</td>
              <td className="p-4 border-b">Secure Boot, cryptographic validation</td>
            </tr>
            <tr className="bg-gray-50">
              <td className="p-4 border-b font-medium">Network Support</td>
              <td className="p-4 border-b">None</td>
              <td className="p-4 border-b">Built-in networking stack</td>
            </tr>
            <tr>
              <td className="p-4 border-b font-medium">Driver Support</td>
              <td className="p-4 border-b">Limited, OS drivers needed early</td>
              <td className="p-4 border-b">Rich driver environment</td>
            </tr>
            <tr className="bg-gray-50">
              <td className="p-4 border-b font-medium">Partitioning Scheme</td>
              <td className="p-4 border-b">MBR (Master Boot Record)</td>
              <td className="p-4 border-b">GPT (GUID Partition Table)</td>
            </tr>
            <tr>
              <td className="p-4 border-b font-medium">Modularity</td>
              <td className="p-4 border-b">Monolithic</td>
              <td className="p-4 border-b">Modular, extensible</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
  
  const OtherFirmwareSection = () => (
    <div className="space-y-6 animate-fade-in">
      <h2 className="text-2xl font-bold mb-4">Other Types of Firmware</h2>
      
      <p className="text-lg">
        Beyond BIOS and UEFI, there are many other types of firmware that control various components and devices 
        in a computer system. Each plays a critical role in managing hardware functionality.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
          <h3 className="text-xl font-bold mb-3 text-purple-700">Device-Specific Firmware</h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <div className="bg-purple-100 p-2 rounded-full mr-3">
                <div className="w-6 h-6 flex items-center justify-center">💽</div>
              </div>
              <div>
                <span className="font-bold">SSD/HDD Firmware:</span> Controls storage device operations, including wear leveling in SSDs.
              </div>
            </li>
            <li className="flex items-start">
              <div className="bg-purple-100 p-2 rounded-full mr-3">
                <div className="w-6 h-6 flex items-center justify-center">🖥️</div>
              </div>
              <div>
                <span className="font-bold">GPU Firmware:</span> Controls graphics processing units and handles display initialization before drivers load.
              </div>
            </li>
            <li className="flex items-start">
              <div className="bg-purple-100 p-2 rounded-full mr-3">
                <div className="w-6 h-6 flex items-center justify-center">🔊</div>
              </div>
              <div>
                <span className="font-bold">Audio Firmware:</span> Controls sound card functionality and audio processing features.
              </div>
            </li>
            <li className="flex items-start">
              <div className="bg-purple-100 p-2 rounded-full mr-3">
                <div className="w-6 h-6 flex items-center justify-center">🖨️</div>
              </div>
              <div>
                <span className="font-bold">Peripheral Firmware:</span> Controls printers, scanners, and other external devices.
              </div>
            </li>
          </ul>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow hover:shadow-md transition-shadow">
          <h3 className="text-xl font-bold mb-3 text-teal-700">Embedded Systems Firmware</h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <div className="bg-teal-100 p-2 rounded-full mr-3">
                <div className="w-6 h-6 flex items-center justify-center">📱</div>
              </div>
              <div>
                <span className="font-bold">Router Firmware:</span> Controls networking equipment functions, including OpenWrt and DD-WRT.
              </div>
            </li>
            <li className="flex items-start">
              <div className="bg-teal-100 p-2 rounded-full mr-3">
                <div className="w-6 h-6 flex items-center justify-center">🔌</div>
              </div>
              <div>
                <span className="font-bold">Embedded Controllers:</span> Manage power, battery, keyboard, and thermal functions in laptops.
              </div>
            </li>
            <li className="flex items-start">
              <div className="bg-teal-100 p-2 rounded-full mr-3">
                <div className="w-6 h-6 flex items-center justify-center">🔋</div>
              </div>
              <div>
                <span className="font-bold">BMC (Baseboard Management Controller):</span> Remote server management independent of main CPU.
              </div>
            </li>
            <li className="flex items-start">
              <div className="bg-teal-100 p-2 rounded-full mr-3">
                <div className="w-6 h-6 flex items-center justify-center">📟</div>
              </div>
              <div>
                <span className="font-bold">IoT Device Firmware:</span> Controls smart home devices, wearables, and other IoT products.
              </div>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="bg-gray-50 p-6 rounded-lg shadow mt-6">
        <h3 className="text-xl font-bold mb-4">Firmware Update Importance</h3>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-2/3">
            <p className="mb-4">
              Keeping firmware updated is crucial for system stability, security, and performance. 
              Modern firmware updates often address security vulnerabilities, improve compatibility 
              with new hardware, and enhance features.
            </p>
            <h4 className="font-bold mb-2">Benefits of Firmware Updates:</h4>
            <ul className="list-disc pl-6 space-y-1">
              <li>Security vulnerability patching</li>
              <li>Improved hardware compatibility</li>
              <li>Bug fixes and stability improvements</li>
              <li>Performance optimizations</li>
              <li>New feature additions</li>
            </ul>
          </div>
          <div className="md:w-1/3">
            <img src="/images/firmware-update.png" alt="Firmware Update" className="rounded-lg shadow-md" />
            <p className="text-center text-sm text-gray-500 mt-2">Firmware Update Process</p>
          </div>
        </div>
      </div>
    </div>
  );
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Understanding Firmware</h1>
      
      <div className="flex space-x-4 mb-6">
        <button 
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded ${activeTab === 'overview' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Overview
        </button>
        <button 
          onClick={() => setActiveTab('bios')}
          className={`px-4 py-2 rounded ${activeTab === 'bios' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          BIOS
        </button>
        <button 
          onClick={() => setActiveTab('uefi')}
          className={`px-4 py-2 rounded ${activeTab === 'uefi' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          UEFI
        </button>
        <button 
          onClick={() => setActiveTab('comparison')}
          className={`px-4 py-2 rounded ${activeTab === 'comparison' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Comparison
        </button>
        <button 
          onClick={() => setActiveTab('other')}
          className={`px-4 py-2 rounded ${activeTab === 'other' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
        >
          Other Firmware
        </button>
      </div>
      
      {activeTab === 'overview' && <Overview />}
      {activeTab === 'bios' && <BiosSection />}
      {activeTab === 'uefi' && <UefiSection />}
      {activeTab === 'comparison' && <ComparisonSection />}
      {activeTab === 'other' && <OtherFirmwareSection />}
    </div>
  );
}
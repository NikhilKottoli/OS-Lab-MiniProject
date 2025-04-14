import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import "./index.css";
import About from "./pages/About";
import MemoryAllocationHomepage from "./pages/contigeousmemoryallocation/home";
import FirstFitDynamic from "./pages/contigeousmemoryallocation/first"; // Import the simulation component
import PageReplacementModule from "./pages/pagereplacement/pagereplacement";
import PageReplacementTheory from "./pages/pagereplacement/pagereplacementtheory";
import MVT from "./pages/Memory_Management/Mvt";
import MFT from "./pages/Memory_Management/Mft";
import MemoryAllocationHome from "./pages/Memory_Management/MemoryHome";
import DeadlockAvoidanceSimulator from "./pages/DEADLOCK/Avoidance";
import DeadlockDetectionSimulator from "./pages/DEADLOCK/Detection";
import DeadlockHomepage from "./pages/DEADLOCK/deadlockhome";
import ProcessSystemCalls from "./pages/ProcessSysCalls";
import SystemCallsReference from "./pages/SysCallsGuide";
import Navbar from "./pages/components/Navbar";
import FileOrganizationHome from "./pages/FileOrganization/pages/Home";
import FileOrganizationTechniques from "./pages/FileOrganization/pages/Techniques";
import DiskMain from "./pages/Disk";
import FileAllocation from "./pages/FileAllocation/FileAllocation";
import FileAllocationInfo from "./pages/FileAllocation/FileAllocationInfo";
import ProcessSyncProblems from "./pages/ProcessSynchronization/ProcessSyncProblems";
import CacheCoherencySimulator from "./pages/CacheCoherency/cache";
import CacheHomePage from "./pages/CacheCoherency/cacheHome";
import IPCVisualization from "./pages/InterProcessCom/MessagePass";
import SharedMemoryVisualization from "./pages/InterProcessCom/SharedMemory";
import IPCHomePage from "./pages/InterProcessCom/IPCHome";
import FileSysCall from "./pages/FileSysCall";
import MemoryManagementVisualizer from "./pages/MemManage";
import MemoryManagementUnit from "./pages/FileAllocation/MemoryManagementUnit";
import MMUInfoPage from "./pages/FileAllocation/MemoryManagementInfo";


const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/mvt" element={<MVT />} />
        <Route path="/mft" element={<MFT />} />
        <Route path="/memoryhome" element={<MemoryAllocationHome />} />
        <Route path="/" element={<About />} />
        <Route path="/memory_allocation_home" element={<MemoryAllocationHomepage />} />
        <Route path="/memory-allocation/buddy-fit" element={<FirstFitDynamic initialStrategy="buddyfit" />} />
        <Route path="/memory-allocation/first-fit" element={<FirstFitDynamic initialStrategy="first" />} />
        <Route path="/memory-allocation/best-fit" element={<FirstFitDynamic initialStrategy="best" />} />
        <Route path="/memory-allocation/worst-fit" element={<FirstFitDynamic initialStrategy="worst" />} />
        <Route path="/memory-allocation/next-fit" element={<FirstFitDynamic initialStrategy="next" />} />
        <Route path="/memory-allocation/quick-fit" element={<FirstFitDynamic initialStrategy="quick" />} />
        <Route path="/page" element={<PageReplacementModule />} />
        <Route path="/theory" element={<PageReplacementTheory />} />
        <Route path="/page-replacement/simulation" element={<PageReplacementModule />} />
        <Route path="/avoidance" element={<DeadlockAvoidanceSimulator />} />
        <Route path="/detection" element={<DeadlockDetectionSimulator />} />
        <Route path="/deadlockhome" element={<DeadlockHomepage />} />
        <Route path="/process" element={<ProcessSystemCalls />} />
        <Route path="/syscalls" element={<SystemCallsReference />} />
        <Route path="/fileorganization" element={<FileOrganizationHome />} />
        <Route path="/techniques" element={<FileOrganizationTechniques />} />
        <Route path="/disk" element={<DiskMain/>} />
        <Route path="/fileallocation" element={<FileAllocation/>}/>
        <Route path="/fileallocationinfo" element={<FileAllocationInfo/>}/>
        <Route path="/processsync" element={<ProcessSyncProblems />} />
        <Route path="/cache" element={<CacheCoherencySimulator />} />
        <Route path="/cachehome" element={<CacheHomePage />} />
        <Route path="/IPC" element={<IPCVisualization />} />
        <Route path="/SM" element={<SharedMemoryVisualization />} />
        <Route path="/IPCHome" element={<IPCHomePage />} />
        <Route path="/filesyscall" element={<FileSysCall />} />
        <Route path="/memmanage" element={<MemoryManagementVisualizer />} />
        <Route path="/mmu" element={<MemoryManagementUnit />} />
        <Route path="/mmuinfo" element={<MMUInfoPage />} />
      </Routes>
    </Router>
  );
};

export default App;

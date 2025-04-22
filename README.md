# Operating Systems Lab Mini Project

An interactive educational web application for visualizing and simulating Operating System concepts. This project provides visual demonstrations of various OS algorithms and concepts to facilitate learning.

## 🚀 Features

This application includes visualizations and simulations for:

### Memory Management

- Contiguous Memory Allocation (First Fit, Best Fit, Worst Fit, Next Fit, Quick Fit, Buddy Fit)
- Memory Partitioning (MVT, MFT)
- Page Replacement Algorithms
- Memory Management Unit (MMU)

### Process Management

- Process System Calls
- Process Synchronization Problems
  - Producer-Consumer
  - Reader-Writer
  - Dining Philosophers
  - Cigarette Smokers
- CPU Scheduling
  - Completely Fair Scheduler (CFS)
  - Nice Value Priority Scheduling

### Deadlocks

- Deadlock Avoidance
- Deadlock Detection
- Deadlock Prevention

### File Systems

- File Organization Techniques
  - Sequential, Indexed, Hierarchical
  - B-Tree, Hashed, Clustered
- File Allocation Methods
- File System Calls

### Storage

- Disk Scheduling Algorithms

### Inter-Process Communication

- Message Passing
- Shared Memory

### Hardware

- BIOS
- Cache Coherency

## 🛠️ Technologies Used

- **Frontend Framework**: React
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router
- **State Management**: Redux Toolkit
- **UI Components**: Shadcn/UI
- **Animation**: Framer Motion
- **Charts**: Chart.js

## 🏁 Getting Started

### Prerequisites

- Node.js (v14.x or higher)
- npm or yarn

### Installation

1. Clone the repository:

   ```bash
   git clone [your-repository-url]
   cd OS-Lab-MiniProject
   ```

2. Install dependencies:

   ```bash
   npm install
   # or
   yarn
   ```

3. Start the development server:

   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## 🏗️ Project Structure

```
src/
├── pages/               # Page components
│   ├── contigeousmemoryallocation/  # Memory allocation simulations
│   ├── pagereplacement/            # Page replacement algorithms
│   ├── Memory_Management/          # Memory management concepts
│   ├── DEADLOCK/                  # Deadlock handling simulations
│   ├── ProcessSynchronization/    # Process synchronization problems
│   ├── FileOrganization/          # File organization techniques
│   ├── FileAllocation/            # File allocation methods
│   ├── InterProcessCom/           # Inter-process communication
│   ├── CacheCoherency/            # Cache coherency simulations
│   └── components/                # Reusable components
├── App.jsx              # Main application component with routing
└── main.jsx             # Entry point
```

## 📚 Learning Resources

This application serves as a visual aid for understanding essential OS concepts typically covered in undergraduate Operating Systems courses, including:

- Memory management and allocation strategies
- Process management and scheduling
- File systems and storage
- Inter-process communication
- Concurrency and synchronization
- Deadlock handling

## 🧪 Building and Deployment

To build for production:

```bash
npm run build
# or
yarn build
```

The build artifacts will be stored in the `dist/` directory.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

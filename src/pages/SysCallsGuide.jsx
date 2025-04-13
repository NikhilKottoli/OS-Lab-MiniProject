export default function SysCallsGuide() {
    return (
        <div className="flex flex-col items-center bg-gray-100 min-h-screen p-6">
            <h1 className="text-4xl font-bold mb-4">System Calls Reference</h1>
            <p className="text-lg mb-6 text-gray-700">Explore the essential system calls used in operating systems.</p>

            <div className="w-full max-w-4xl space-y-6">
                {/* Process System Calls */}
                <div className="bg-white shadow-md rounded-lg p-4">
                    <h2 className="text-2xl font-semibold mb-2 text-center">Process System Calls</h2>
                    <ul className="list-disc list-inside text-gray-700 mb-4">
                        <li><strong>fork()</strong> - Creates a new child process identical to the parent.</li>
                        <li><strong>exec()</strong> - Replaces the current process image with a new program.</li>
                        <li><strong>wait()</strong> - Causes a parent process to wait for a child process to finish execution.</li>
                        <li><strong>exit()</strong> - Terminates the calling process.</li>
                        <li><strong>getpid()</strong> - Retrieves the process ID of the calling process.</li>
                        <li><strong>getppid()</strong> - Retrieves the parent process ID.</li>
                        <li><strong>nice()</strong> - Adjusts the priority of a process.</li>
                    </ul>
                    <div className="text-center">
                        <a href="/process" className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Visualize</a>
                    </div>
                </div>

                {/* File System Calls */}
                <div className="bg-white shadow-md rounded-lg p-4">
                    <h2 className="text-2xl font-semibold mb-2 text-center">File System Calls</h2>
                    <ul className="list-disc list-inside text-gray-700 mb-4">
                        <li><strong>open()</strong> - Opens a file and returns a file descriptor.</li>
                        <li><strong>read()</strong> - Reads data from a file into a buffer.</li>
                        <li><strong>write()</strong> - Writes data to a file.</li>
                        <li><strong>close()</strong> - Closes an open file descriptor.</li>
                        <li><strong>lseek()</strong> - Repositions the file offset of an open file.</li>
                        <li><strong>unlink()</strong> - Deletes a file.</li>
                        <li><strong>stat()</strong> - Retrieves metadata about a file.</li>
                        <li><strong>mkdir()</strong> - Creates a new directory.</li>
                        <li><strong>rmdir()</strong> - Removes a directory.</li>
                    </ul>
                    <div className="text-center">
                        <a href="/filesyscall" className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Visualize</a>
                    </div>
                </div>

                {/* Memory Management System Calls */}
                <div className="bg-white shadow-md rounded-lg p-4">
                    <h2 className="text-2xl font-semibold mb-2 text-center">Memory Management System Calls</h2>
                    <ul className="list-disc list-inside text-gray-700 mb-4">
                        <li><strong>brk()</strong> - Adjusts the data segment size of a process.</li>
                        <li><strong>mmap()</strong> - Maps files or devices into memory.</li>
                        <li><strong>munmap()</strong> - Unmaps a region of memory.</li>
                        <li><strong>shmget()</strong> - Allocates a shared memory segment.</li>
                        <li><strong>shmat()</strong> - Attaches a shared memory segment.</li>
                        <li><strong>shmdt()</strong> - Detaches a shared memory segment.</li>
                        <li><strong>shmctl()</strong> - Controls shared memory operations.</li>
                    </ul>
                    <div className="text-center">
                        <a href="/memmanage" className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Visualize</a>
                    </div>
                </div>

                {/* Interprocess Communication (IPC) System Calls */}
                <div className="bg-white shadow-md rounded-lg p-4">
                    <h2 className="text-2xl font-semibold mb-2 text-center">Interprocess Communication (IPC) System Calls</h2>
                    <ul className="list-disc list-inside text-gray-700 mb-4">
                        <li><strong>pipe()</strong> - Creates an interprocess communication channel.</li>
                        <li><strong>msgget()</strong> - Creates a message queue.</li>
                        <li><strong>msgsnd()</strong> - Sends a message to a message queue.</li>
                        <li><strong>msgrcv()</strong> - Receives a message from a message queue.</li>
                        <li><strong>semget()</strong> - Creates a semaphore.</li>
                        <li><strong>semop()</strong> - Performs operations on a semaphore.</li>
                        <li><strong>semctl()</strong> - Controls semaphore operations.</li>
                    </ul>
                    <div className="text-center">
                        <a href="#" className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Visualize</a>
                    </div>
                </div>

                {/* Network System Calls */}
                <div className="bg-white shadow-md rounded-lg p-4">
                    <h2 className="text-2xl font-semibold mb-2 text-center">Network System Calls</h2>
                    <ul className="list-disc list-inside text-gray-700 mb-4">
                        <li><strong>socket()</strong> - Creates a socket.</li>
                        <li><strong>bind()</strong> - Binds an address to a socket.</li>
                        <li><strong>listen()</strong> - Listens for incoming connections.</li>
                        <li><strong>accept()</strong> - Accepts an incoming connection.</li>
                        <li><strong>connect()</strong> - Establishes a connection to a remote host.</li>
                        <li><strong>send()</strong> - Sends data through a socket.</li>
                        <li><strong>recv()</strong> - Receives data from a socket.</li>
                        <li><strong>close()</strong> - Closes a socket.</li>
                    </ul>
                    <div className="text-center">
                        <a href="#" className="inline-block px-6 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Visualize</a>
                    </div>
                </div>
            </div>
        </div>
    );
}

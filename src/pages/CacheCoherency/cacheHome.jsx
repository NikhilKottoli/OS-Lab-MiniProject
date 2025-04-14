import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function CacheHomePage() {
    const [activeTab, setActiveTab] = useState('overview');
    const navigate = useNavigate();

    const goToSimulator = () => {
        navigate('/cache');
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
            <header className="bg-blue-600 text-white shadow-md">
                <div className="container mx-auto p-4 flex justify-center items-center">
                    <h1 className="text-2xl font-bold">OS Cache Coherency Simulator</h1>
                </div>
            </header>


            <main className="container mx-auto p-6">
                <section className="mb-12 text-center">
                    <h2 className="text-4xl font-bold text-gray-800 mb-4">Understanding Cache Coherency</h2>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Explore how modern multiprocessor systems maintain data consistency across multiple cache memories.
                    </p>
                </section>

                <div className="flex flex-col md:flex-row gap-8 mb-12">
                    <div className="flex-1">
                        <div className="bg-white rounded-lg shadow-lg p-6 h-full">
                            <div className="flex border-b mb-4">
                                <button
                                    className={`px-4 py-2 ${activeTab === 'overview' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
                                    onClick={() => setActiveTab('overview')}
                                >
                                    Overview
                                </button>
                                <button
                                    className={`px-4 py-2 ${activeTab === 'protocols' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
                                    onClick={() => setActiveTab('protocols')}
                                >
                                    Protocols
                                </button>
                                <button
                                    className={`px-4 py-2 ${activeTab === 'challenges' ? 'border-b-2 border-blue-500 text-blue-600' : 'text-gray-500'}`}
                                    onClick={() => setActiveTab('challenges')}
                                >
                                    Challenges
                                </button>
                            </div>

                            {activeTab === 'overview' && (
                                <div>
                                    <h3 className="text-xl font-semibold mb-3">What is Cache Coherency?</h3>
                                    <p className="mb-4">
                                        Cache coherency is a crucial aspect of multiprocessor systems that ensures all CPUs have a consistent view of memory.
                                        When multiple processors have their own local caches, the same memory location might be cached in different places.
                                    </p>
                                    <p className="mb-4">
                                        The <strong>cache coherency problem</strong> occurs when one processor modifies a memory location, potentially making
                                        copies of that data in other processors' caches outdated or "stale".
                                    </p>
                                    <p>
                                        A cache coherence protocol is the solution that maintains consistency between all the caches in a system, ensuring that
                                        changes to the shared memory are properly propagated to all processors.
                                    </p>
                                </div>
                            )}

                            {activeTab === 'protocols' && (
                                <div>
                                    <h3 className="text-xl font-semibold mb-3">Common Coherency Protocols</h3>

                                    <div className="mb-4">
                                        <h4 className="font-medium text-lg">MSI Protocol</h4>
                                        <p>Uses three states to track cache line status:</p>
                                        <ul className="list-disc ml-6 mt-2">
                                            <li><strong>Modified (M):</strong> Cache line has been modified and is inconsistent with main memory</li>
                                            <li><strong>Shared (S):</strong> Cache line is unmodified and shared by multiple processors</li>
                                            <li><strong>Invalid (I):</strong> Cache line does not contain valid data</li>
                                        </ul>
                                    </div>

                                    <div className="mb-4">
                                        <h4 className="font-medium text-lg">MESI Protocol</h4>
                                        <p>Adds an Exclusive state to the MSI protocol:</p>
                                        <ul className="list-disc ml-6 mt-2">
                                            <li><strong>Modified (M):</strong> Same as MSI</li>
                                            <li><strong>Exclusive (E):</strong> Cache line is unmodified and present only in this cache</li>
                                            <li><strong>Shared (S):</strong> Same as MSI</li>
                                            <li><strong>Invalid (I):</strong> Same as MSI</li>
                                        </ul>
                                    </div>

                                    <div>
                                        <h4 className="font-medium text-lg">MOESI Protocol</h4>
                                        <p>Adds an Owned state to further optimize the protocol</p>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'challenges' && (
                                <div>
                                    <h3 className="text-xl font-semibold mb-3">Challenges in Cache Coherency</h3>

                                    <div className="mb-4">
                                        <h4 className="font-medium text-lg">Performance Overhead</h4>
                                        <p>
                                            Maintaining coherence requires communication between caches, which can introduce latency.
                                            As systems scale to more processors, this overhead increases.
                                        </p>
                                    </div>

                                    <div className="mb-4">
                                        <h4 className="font-medium text-lg">Scalability</h4>
                                        <p>
                                            Traditional snooping-based protocols don't scale well to many-core systems.
                                            Directory-based protocols help address this but introduce their own complexities.
                                        </p>
                                    </div>

                                    <div>
                                        <h4 className="font-medium text-lg">False Sharing</h4>
                                        <p>
                                            When two processors modify different variables that happen to be on the same cache line,
                                            they can cause the cache line to ping-pong between them, severely degrading performance.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <section className="mb-12">
                    <h3 className="text-2xl font-bold text-center mb-6">Why Cache Coherency Matters</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                </svg>
                            </div>
                            <h4 className="text-xl font-semibold mb-2">Performance</h4>
                            <p className="text-gray-600">
                                Efficient cache coherence is critical for achieving high performance in multicore systems.
                                Without it, systems would need to constantly access slower main memory.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                                </svg>
                            </div>
                            <h4 className="text-xl font-semibold mb-2">Correctness</h4>
                            <p className="text-gray-600">
                                Programs expect memory operations to behave consistently. Cache coherence ensures
                                that all processors see a consistent view of memory at all times.
                            </p>
                        </div>

                        <div className="bg-white p-6 rounded-lg shadow-md flex flex-col items-center text-center">
                            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
                                </svg>
                            </div>
                            <h4 className="text-xl font-semibold mb-2">Scalability</h4>
                            <p className="text-gray-600">
                                Modern systems with many cores need sophisticated coherence solutions to scale efficiently,
                                making this an active area of computer architecture research.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="bg-gray-100 p-6 rounded-lg shadow-sm">
                    <div className="flex flex-col md:flex-row items-center">
                        <div className="md:w-2/3 mb-4 md:mb-0 md:mr-6">
                            <h3 className="text-2xl font-bold mb-2">Ready to experiment?</h3>
                            <p className="text-gray-700">
                                Launch our interactive simulator to see cache coherency in action. The simulator demonstrates the MSI protocol
                                with multiple processors, letting you perform read and write operations and observe how the system maintains coherence.
                            </p>
                        </div>
                        <div className="md:w-1/3 flex justify-center">
                            <button
                                onClick={goToSimulator}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors flex items-center"
                            >
                                Try the Simulator
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
import Navbar from '../components/Navbar';

export default function Verify() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-950">
      <Navbar />
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-xl w-full bg-gray-900 border border-gray-800 rounded-2xl p-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-4">Verify Credential</h1>
          <p className="text-gray-400 mb-8">Enter the Token ID or Wallet Address to verify.</p>
          
          <div className="flex space-x-4">
            <input 
              type="text" 
              placeholder="Enter Token ID..."
              className="flex-1 bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 transition-colors"
            />
            <button className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-6 py-3 rounded-xl transition-colors">
              Verify
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}

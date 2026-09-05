import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { Search } from 'lucide-react';

export default function Verify() {
  const [searchInput, setSearchInput] = useState('');
  const navigate = useNavigate();

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchInput.trim()) {
      navigate(`/verify/${searchInput.trim()}`);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-950">
      <Navbar />
      <main className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-xl w-full bg-gray-900 border border-gray-800 rounded-3xl p-10 text-center shadow-2xl">
          <div className="bg-indigo-500/10 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-indigo-500/20">
            <Search className="h-8 w-8 text-indigo-400" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-3">Verify Credential</h1>
          <p className="text-gray-400 mb-8">Enter the Token ID to check the on-chain validity and IPFS metadata of a credential.</p>
          
          <form onSubmit={handleVerify} className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <input 
              type="text" 
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Token ID (e.g., 0)"
              className="flex-1 bg-gray-950 border border-gray-700 rounded-xl px-5 py-4 text-white placeholder-gray-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono text-lg"
            />
            <button 
              type="submit"
              disabled={!searchInput.trim()}
              className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white font-semibold px-8 py-4 rounded-xl transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)]"
            >
              Verify
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

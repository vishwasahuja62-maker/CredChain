import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Search } from 'lucide-react';
import Navbar from '../components/Navbar';
import GhostFibers from '../components/GhostFibers';

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
    <div className="flex flex-col min-h-screen bg-black text-slate-50 relative overflow-hidden font-sans selection:bg-fuchsia-500/30">
      
      {/* Interactive Ghost Fibers Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <GhostFibers 
          lineColor="#a855f7" 
          glowColor="#4f46e5"
          speed={0.15} 
          scale={1.5} 
          vignette={0.9}
        />
      </div>

      <Navbar />

      <main className="flex-grow flex items-center justify-center p-4 relative z-10 pt-32 pb-20">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-xl w-full relative group"
        >
          {/* Card Outer Glow */}
          <div className="absolute -inset-1 bg-gradient-to-r from-fuchsia-600/30 to-indigo-600/30 rounded-[2.5rem] blur-xl group-hover:blur-2xl transition-all duration-500 opacity-70"></div>
          
          <div className="relative bg-[#0A0A0C]/80 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-10 text-center shadow-2xl overflow-hidden">
            
            {/* Top glass reflection */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
            
            <motion.div 
              whileHover={{ rotate: 90, scale: 1.1 }}
              transition={{ duration: 0.4 }}
              className="bg-[#111115] w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-white/10 shadow-inner relative"
            >
              <div className="absolute inset-0 bg-fuchsia-500/20 blur-md rounded-3xl"></div>
              <Search className="h-10 w-10 text-fuchsia-400 relative z-10" />
            </motion.div>

            <h1 className="text-4xl font-black text-white mb-4 tracking-tight">
              Trustless Verification
            </h1>
            <p className="text-slate-400 mb-10 text-lg">
              Enter a Token ID to instantly verify the cryptographic signature and IPFS metadata of any credential.
            </p>
            
            <form onSubmit={handleVerify} className="flex flex-col space-y-4">
              <div className="relative">
                <input 
                  type="text" 
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Enter Token ID (e.g. 0)"
                  className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-5 text-white placeholder-slate-600 focus:outline-none focus:border-fuchsia-500/50 focus:bg-[#111115] focus:ring-1 focus:ring-fuchsia-500/50 transition-all font-mono text-xl shadow-inner text-center"
                />
              </div>
              
              <motion.button 
                type="submit"
                disabled={!searchInput.trim()}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500 disabled:opacity-50 disabled:grayscale text-white font-bold px-8 py-5 rounded-2xl transition-all shadow-[0_0_30px_rgba(168,85,247,0.4)] text-lg border border-white/10 uppercase tracking-widest flex items-center justify-center gap-3"
              >
                Verify Credential
                <Search className="h-5 w-5" />
              </motion.button>
            </form>
          </div>
        </motion.div>
      </main>
    </div>
  );
}

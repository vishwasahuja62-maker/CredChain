import { Link } from 'react-router-dom';
import { useWeb3 } from '../Web3Context';
import { ShieldCheck, LogOut, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Navbar() {
  const { account, isIssuer, connectWallet, disconnectWallet, error } = useWeb3();

  return (
    <nav className="fixed top-6 left-0 z-50 w-full px-4 sm:px-6 lg:px-8 pointer-events-none">
      <div className="max-w-7xl mx-auto">
        <div className="relative bg-[#0A0A0C]/80 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-4 shadow-2xl pointer-events-auto">
          {/* Background Effects Layer (needs overflow-hidden so the glow doesn't bleed) */}
          <div className="absolute inset-0 overflow-hidden rounded-[2rem] pointer-events-none">
            {/* Top shimmer line */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-fuchsia-500/40 to-transparent" />
            {/* Inner nav glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[80px] bg-fuchsia-500/8 blur-[50px] rounded-b-full" />
          </div>
          
          <div className="relative z-10 flex justify-between items-center h-12 px-2">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-3 group">
              <motion.div 
                whileHover={{ rotate: 180, scale: 1.1 }}
                transition={{ duration: 0.4 }}
                className="relative bg-[#111115] p-2.5 rounded-2xl border border-white/5 shadow-inner"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-fuchsia-500/20 to-indigo-500/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <ShieldCheck className="h-5 w-5 text-fuchsia-400 relative z-10" />
              </motion.div>
              <span className="font-black text-xl tracking-tight bg-gradient-to-r from-white via-fuchsia-200 to-indigo-300 bg-clip-text text-transparent">
                CredChain
              </span>
            </Link>
            
            {/* Nav Links */}
            <div className="flex items-center space-x-8">
              <Link to="/verify" className="relative text-sm font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-widest group">
                Verify
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-fuchsia-500 to-indigo-500 group-hover:w-full transition-all duration-300 rounded-full" />
              </Link>
              
              {account && isIssuer && (
                <Link to="/dashboard" className="relative text-sm font-bold text-slate-400 hover:text-white transition-colors uppercase tracking-widest group">
                  Dashboard
                  <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-gradient-to-r from-fuchsia-500 to-indigo-500 group-hover:w-full transition-all duration-300 rounded-full" />
                </Link>
              )}

              <div className="relative flex flex-col items-end">
                {!account ? (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={connectWallet}
                    className="relative bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500 text-white text-sm font-bold px-6 py-3 rounded-xl shadow-[0_0_20px_rgba(168,85,247,0.35)] transition-all flex items-center gap-2 border border-white/10"
                  >
                    <Wallet className="h-4 w-4" />
                    Connect Wallet
                  </motion.button>
                ) : (
                  <div className="flex items-center space-x-3 bg-white/5 border border-white/10 rounded-xl p-1.5 pl-4 shadow-inner">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_6px_rgba(52,211,153,0.8)] animate-pulse" />
                      <span className="text-xs text-slate-300 font-mono font-bold">
                        {account.slice(0, 6)}...{account.slice(-4)}
                      </span>
                    </div>
                    <button
                      onClick={disconnectWallet}
                      className="p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-400 hover:text-red-300 transition-colors border border-red-500/20"
                      title="Disconnect"
                    >
                      <LogOut className="h-4 w-4" />
                    </button>
                  </div>
                )}
                
                {/* Error tooltip */}
                {error && (
                  <motion.div 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="absolute top-[120%] right-0 bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold px-3 py-2 rounded-lg shadow-xl backdrop-blur-xl whitespace-nowrap"
                  >
                    {error}
                  </motion.div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

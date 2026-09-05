import { Link } from 'react-router-dom';
import { useWeb3 } from '../Web3Context';
import { ShieldCheck, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Navbar() {
  const { account, isIssuer, connectWallet, disconnectWallet } = useWeb3();

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-xl bg-gray-950/70 border-b border-gray-800/50 supports-[backdrop-filter]:bg-gray-950/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <Link to="/" className="flex items-center space-x-3 group">
            <motion.div 
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.4 }}
              className="bg-indigo-500/20 p-2 rounded-xl text-indigo-400 border border-indigo-500/30"
            >
              <ShieldCheck className="h-6 w-6" />
            </motion.div>
            <span className="font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-gray-50 to-gray-400">
              CredChain
            </span>
          </Link>
          
          <div className="flex items-center space-x-6">
            <Link to="/verify" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
              Verify
            </Link>
            
            {account && isIssuer && (
              <Link to="/dashboard" className="text-sm font-medium text-gray-300 hover:text-white transition-colors">
                Dashboard
              </Link>
            )}

            {!account ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={connectWallet}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium px-5 py-2.5 rounded-lg shadow-[0_0_15px_rgba(79,70,229,0.3)] transition-all"
              >
                Connect Wallet
              </motion.button>
            ) : (
              <div className="flex items-center space-x-3 bg-gray-900/50 border border-gray-800 rounded-lg p-1.5 pl-3">
                <span className="text-xs text-gray-400 font-mono">
                  {account.slice(0, 6)}...{account.slice(-4)}
                </span>
                <button
                  onClick={disconnectWallet}
                  className="p-1.5 hover:bg-gray-800 rounded-md text-gray-400 hover:text-white transition-colors"
                  title="Disconnect"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

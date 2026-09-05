import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Shield, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 inset-x-0 h-screen bg-gradient-to-b from-indigo-900/20 to-gray-950 pointer-events-none -z-10" />
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[50%] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none -z-10" />

      <Navbar />

      <main className="flex-grow flex items-center justify-center pt-10 pb-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center space-x-2 bg-gray-900/80 border border-gray-800 rounded-full px-4 py-1.5 mb-8"
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            <span className="text-xs font-medium text-gray-300 uppercase tracking-wider">
              HackBlox 2026 Web3 Track
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight"
          >
            Verify academic credentials <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
              instantly on-chain.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-4 text-xl text-gray-400 max-w-2xl mx-auto mb-10"
          >
            Trustless credentials powered by soulbound NFTs and IPFS. Eliminating certificate fraud while reducing manual verification delays for employers and institutions.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6"
          >
            <Link to="/verify" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto bg-white text-gray-950 font-semibold px-8 py-4 rounded-xl hover:bg-gray-100 transition-colors flex items-center justify-center space-x-2 group">
                <span>Verify Credential</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </Link>
            <a href="#how-it-works" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto bg-gray-900 border border-gray-800 text-gray-300 font-medium px-8 py-4 rounded-xl hover:bg-gray-800 transition-colors">
                Learn How It Works
              </button>
            </a>
          </motion.div>

          {/* Features Grid */}
          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-32 grid md:grid-cols-3 gap-8 text-left"
            id="how-it-works"
          >
            <FeatureCard 
              icon={<Shield className="w-6 h-6 text-indigo-400" />}
              title="Soulbound NFT"
              description="Credentials are minted as non-transferable ERC-721 tokens securely bound to the recipient's wallet."
            />
            <FeatureCard 
              icon={<CheckCircle2 className="w-6 h-6 text-emerald-400" />}
              title="Cryptographic Trust"
              description="Only whitelisted institutions can issue credentials. Mathematical proof replaces manual phone calls."
            />
            <FeatureCard 
              icon={<Zap className="w-6 h-6 text-amber-400" />}
              title="Instant Verification"
              description="Employers can instantly scan a QR code to verify the blockchain record and IPFS metadata."
            />
          </motion.div>
        </div>
      </main>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-gray-900/50 backdrop-blur-sm border border-gray-800 rounded-2xl p-8 hover:bg-gray-900/80 transition-colors group">
      <div className="bg-gray-950 border border-gray-800 w-12 h-12 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-lg font-semibold text-white mb-3">{title}</h3>
      <p className="text-gray-400 leading-relaxed text-sm">{description}</p>
    </div>
  )
}

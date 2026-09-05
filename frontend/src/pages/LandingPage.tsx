import { motion } from 'framer-motion';
import { ArrowRight, ShieldCheck, Database, Lock, Search, FileWarning, CheckCircle2, QrCode } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { PixelRain } from '../components/PixelRain';

const BackgroundElements = () => (
  <>
    <PixelRain count={300} color="#a855f7" speed={1.5} />
    
    {/* Ambient Drifting Glows */}
    <motion.div 
      animate={{ 
        x: [0, 50, -50, 0], 
        y: [0, -50, 50, 0],
        scale: [1, 1.1, 0.9, 1] 
      }}
      transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      className="fixed top-[-20%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-fuchsia-900/10 blur-[150px] mix-blend-screen pointer-events-none -z-10" 
    />
    <motion.div 
      animate={{ 
        x: [0, -60, 60, 0], 
        y: [0, 60, -60, 0],
        scale: [1, 0.9, 1.1, 1] 
      }}
      transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      className="fixed top-[20%] right-[-20%] w-[70vw] h-[70vw] rounded-full bg-purple-900/10 blur-[150px] mix-blend-screen pointer-events-none -z-10" 
    />

    {/* Subtle Grid Pattern */}
    <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_100%_100%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none -z-10" />
    
    {/* Premium Film Noise Grain */}
    <div className="fixed inset-0 opacity-[0.03] mix-blend-screen pointer-events-none -z-10" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")` }} />
  </>
);

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen bg-black text-slate-50 relative overflow-hidden font-sans selection:bg-fuchsia-500/30">
      
      <BackgroundElements />

      <Navbar />

      <main className="flex-grow flex flex-col items-center pt-20 pb-32 px-4 sm:px-6 lg:px-8 relative z-10 w-full">
        
        {/* 1. Hero Section - UPGRADED AESTHETICS */}
        <section className="max-w-6xl mx-auto text-center w-full mb-32 relative mt-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-8 backdrop-blur-xl"
          >
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-300">
              Live on Sepolia Testnet
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-6xl md:text-8xl font-black tracking-tight text-white mb-6 leading-[1.05]"
          >
            Unforgeable <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400">
              Credentials.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="mt-6 text-xl text-slate-400 max-w-2xl mx-auto mb-12 font-medium leading-relaxed"
          >
            Transform academic degrees into soulbound Ethereum NFTs. Verify candidates instantly, cryptographically, and trustlessly.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-5"
          >
            <Link to="/verify" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto bg-white text-black font-black px-10 py-4 rounded-2xl transition-all flex items-center justify-center space-x-2 text-lg shadow-[0_0_30px_rgba(255,255,255,0.15)] hover:shadow-[0_0_50px_rgba(255,255,255,0.3)] hover:scale-105 group relative overflow-hidden border border-white/50">
                <Search className="w-5 h-5 text-indigo-600 group-hover:scale-110 transition-transform" />
                <span className="relative z-10">Verify a Credential</span>
              </button>
            </Link>
            <Link to="/dashboard" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto bg-[#111115]/80 backdrop-blur-xl border border-white/10 hover:bg-white/5 text-slate-200 font-bold px-10 py-4 rounded-2xl transition-all flex items-center justify-center space-x-2 text-lg shadow-xl hover:border-white/20">
                <ShieldCheck className="w-5 h-5 text-slate-400" />
                <span>Issuer Dashboard</span>
              </button>
            </Link>
          </motion.div>

          {/* Hero Premium Visual Element */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="mt-20 w-full max-w-4xl mx-auto relative group perspective-1000"
          >
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[100%] bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-indigo-500/20 transition-all duration-1000" />
            <div className="absolute top-[20%] right-[10%] w-[100px] h-[100px] bg-purple-500/20 blur-[60px] rounded-full pointer-events-none" />
            
            <div className="relative bg-[#0A0A0C]/60 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-3 shadow-2xl transform hover:-translate-y-2 transition-transform duration-700">
               <div className="bg-[#111115] rounded-[2rem] border border-white/5 p-6 md:p-10 flex flex-col md:flex-row items-center gap-8 shadow-inner">
                  
                  <div className="w-24 h-24 md:w-32 md:h-32 bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-3xl flex items-center justify-center flex-shrink-0 shadow-[0_0_30px_rgba(99,102,241,0.15)] relative overflow-hidden">
                     <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-transparent opacity-50" />
                     <ShieldCheck className="w-12 h-12 md:w-16 md:h-16 text-indigo-400 relative z-10 drop-shadow-lg" />
                  </div>
                  
                  <div className="flex-1 text-center md:text-left w-full">
                     <div className="flex flex-col md:flex-row items-center gap-3 mb-2 justify-center md:justify-start">
                        <span className="text-2xl md:text-3xl font-black text-white tracking-tight">Master of Science</span>
                        <div className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.1)]">
                           <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                        </div>
                     </div>
                     <p className="text-slate-400 font-medium text-base md:text-lg">Stanford University &bull; Issued 2026</p>
                     
                     <div className="mt-6 flex flex-wrap justify-center md:justify-start gap-4">
                        <div className="bg-white/5 rounded-xl px-4 py-3 border border-white/5 shadow-inner flex-1 min-w-[140px]">
                           <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1.5 flex items-center justify-center md:justify-start gap-1.5"><Database className="w-3 h-3"/> Network</div>
                           <div className="text-sm text-slate-300 font-mono font-bold">Ethereum Sepolia</div>
                        </div>
                        <div className="bg-white/5 rounded-xl px-4 py-3 border border-white/5 shadow-inner flex-1 min-w-[140px]">
                           <div className="text-[10px] text-slate-500 uppercase font-bold tracking-widest mb-1.5 flex items-center justify-center md:justify-start gap-1.5"><QrCode className="w-3 h-3"/> Token Standard</div>
                           <div className="text-sm text-slate-300 font-mono font-bold">Soulbound ERC-721</div>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
          </motion.div>
        </section>

        {/* 2. ULTIMATE BENTO GRID */}
        <section className="w-full max-w-7xl mx-auto">
          
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6 auto-rows-[minmax(300px,auto)]">
            
            {/* Card 1: The Problem (Red) - 2 cols wide */}
            <motion.div
              whileHover={{ scale: 0.99 }}
              className="col-span-1 md:col-span-2 relative overflow-hidden bg-[#0A0A0C] border border-white/10 rounded-[2rem] p-8 flex flex-col group shadow-2xl"
            >
              <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-red-600/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-red-600/20 transition-all duration-700" />
              <div className="relative z-10 flex-1 flex flex-col justify-between">
                <div className="bg-red-500/10 w-12 h-12 rounded-xl flex items-center justify-center border border-red-500/20 mb-6 shadow-inner">
                  <FileWarning className="w-6 h-6 text-red-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">The Verification Crisis</h3>
                  <p className="text-slate-400 leading-relaxed font-medium max-w-md">
                    Background checks take weeks. PDFs are photoshopped. Universities burn massive resources manually verifying alumni for employers.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Card 2: The Solution (Emerald) - 2 cols wide */}
            <motion.div
              whileHover={{ scale: 0.99 }}
              className="col-span-1 md:col-span-2 relative overflow-hidden bg-[#0A0A0C] border border-white/10 rounded-[2rem] p-8 flex flex-col group shadow-2xl"
            >
              <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-emerald-600/10 blur-[80px] rounded-full pointer-events-none group-hover:bg-emerald-600/20 transition-all duration-700" />
              <div className="relative z-10 flex-1 flex flex-col justify-between">
                <div className="bg-emerald-500/10 w-12 h-12 rounded-xl flex items-center justify-center border border-emerald-500/20 mb-6 shadow-inner">
                  <CheckCircle2 className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">The Web3 Standard</h3>
                  <p className="text-slate-400 leading-relaxed font-medium max-w-md">
                    A decentralized protocol where whitelisted institutions mint verifiable, non-transferable records. Employers verify authenticity in 45 milliseconds.
                  </p>
                </div>
              </div>
            </motion.div>

            {/* Card 3: Soulbound ERC-721 (Orange/Copper) - 2 cols wide, tall */}
            <motion.div
              whileHover={{ scale: 0.99 }}
              className="col-span-1 md:col-span-2 lg:col-span-2 lg:row-span-2 relative overflow-hidden bg-[#0A0A0C] border border-white/10 rounded-[2rem] p-8 flex flex-col group shadow-2xl min-h-[400px]"
            >
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] bg-orange-600/15 blur-[100px] rounded-full pointer-events-none group-hover:bg-orange-600/25 transition-all duration-700" />
              
              {/* Premium Floating UI */}
              <div className="relative z-10 flex-1 flex items-center justify-center w-full py-10">
                <div className="bg-[#111115]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex items-center gap-4 shadow-2xl w-full max-w-[300px] transform group-hover:-translate-y-2 transition-transform duration-500">
                  <div className="bg-orange-500/20 p-3 rounded-xl border border-orange-500/20 shadow-inner">
                    <ShieldCheck className="w-6 h-6 text-orange-400" />
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-bold text-white">Identity Bound</div>
                    <div className="text-xs text-slate-500 font-medium">Non-transferable</div>
                  </div>
                  <div className="px-2 py-1 bg-orange-500/10 text-orange-400 text-[10px] uppercase font-bold tracking-widest rounded border border-orange-500/20">
                    Secured
                  </div>
                </div>
              </div>

              <div className="relative z-10 mt-auto">
                <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Soulbound ERC-721</h3>
                <p className="text-slate-400 leading-relaxed font-medium">
                  Credentials are minted as non-transferable NFTs natively bound to the recipient's wallet. They cannot be sold, traded, or stolen.
                </p>
              </div>
            </motion.div>

            {/* Card 4: IPFS Storage (Blue/Indigo) - 2 cols wide */}
            <motion.div
              whileHover={{ scale: 0.99 }}
              className="col-span-1 md:col-span-2 lg:col-span-2 relative overflow-hidden bg-[#0A0A0C] border border-white/10 rounded-[2rem] p-8 flex flex-col group shadow-2xl min-h-[300px]"
            >
              <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-blue-600/15 blur-[80px] rounded-full pointer-events-none group-hover:bg-blue-600/25 transition-all duration-700" />
              
              {/* Premium Floating UI */}
              <div className="relative z-10 flex-1 flex flex-col items-center justify-center gap-3 w-full py-6">
                <div className="bg-[#111115]/80 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3 w-full max-w-[280px] flex items-center justify-between shadow-2xl transform group-hover:translate-x-2 transition-transform duration-500">
                  <span className="text-xs font-bold text-slate-400">Storage</span>
                  <div className="flex items-center gap-1 bg-blue-500/10 px-2 py-1 rounded text-blue-400 text-xs font-bold border border-blue-500/20 shadow-inner">
                    <Database className="w-3 h-3" /> IPFS Pinata
                  </div>
                </div>
                <div className="bg-[#111115]/80 backdrop-blur-xl border border-white/10 rounded-xl px-4 py-3 w-full max-w-[240px] flex items-center justify-between shadow-2xl relative left-6 transform group-hover:-translate-x-2 transition-transform duration-500">
                  <span className="text-xs font-bold text-slate-400">CID Hash</span>
                  <span className="text-xs font-mono text-slate-300">QmXy...9AbC</span>
                </div>
              </div>

              <div className="relative z-10 mt-auto">
                <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Permanent IPFS Storage</h3>
                <p className="text-slate-400 leading-relaxed font-medium">
                  Metadata is securely pinned to IPFS, ensuring decentralized permanence without bloating the Ethereum chain.
                </p>
              </div>
            </motion.div>

            {/* Card 5: Revocation (Purple/Pink) - 2 cols wide */}
            <motion.div
              whileHover={{ scale: 0.99 }}
              className="col-span-1 md:col-span-2 lg:col-span-2 relative overflow-hidden bg-[#0A0A0C] border border-white/10 rounded-[2rem] p-8 flex flex-col group shadow-2xl min-h-[300px]"
            >
              <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-fuchsia-600/15 blur-[80px] rounded-full pointer-events-none group-hover:bg-fuchsia-600/25 transition-all duration-700" />
              
              {/* Premium Floating UI */}
              <div className="relative z-10 flex-1 flex items-center justify-center w-full py-6">
                <div className="bg-[#111115]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-5 flex flex-col gap-4 shadow-2xl w-full max-w-[260px] transform group-hover:scale-105 transition-transform duration-500">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-400">Contract Status</span>
                    <span className="flex h-2.5 w-2.5 relative">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                    </span>
                  </div>
                  <div className="h-px bg-white/10 w-full"></div>
                  <div className="flex items-center justify-between gap-4">
                     <span className="text-sm font-bold text-white">Revoke Access</span>
                     <div className="bg-red-500/10 px-2 py-1 rounded text-red-400 text-[10px] uppercase font-bold tracking-widest border border-red-500/20 shadow-inner">Executed</div>
                  </div>
                </div>
              </div>

              <div className="relative z-10 mt-auto">
                <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">Cryptographic Revocation</h3>
                <p className="text-slate-400 leading-relaxed font-medium">
                  Issuers retain the right to permanently revoke credentials on-chain, instantly flagging the status across all verification portals.
                </p>
              </div>
            </motion.div>

          </div>
        </section>

        {/* 3. Bottom CTA Section - UPGRADED AESTHETICS */}
        <section className="w-full max-w-5xl mx-auto text-center px-4 mt-32 mb-10">
           <div className="bg-[#0A0A0C] border border-white/10 rounded-[3rem] p-16 md:p-24 relative overflow-hidden shadow-2xl group">
              
              {/* Massive inner glows */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[120%] bg-indigo-600/10 blur-[100px] rounded-full pointer-events-none group-hover:bg-indigo-600/20 transition-all duration-1000" />
              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60%] h-[50%] bg-purple-600/15 blur-[80px] rounded-t-full pointer-events-none" />
              
              <div className="relative z-10 flex flex-col items-center">
                <div className="bg-[#111115]/80 backdrop-blur-xl border border-white/10 p-5 rounded-3xl mb-8 shadow-2xl transform group-hover:-translate-y-2 transition-transform duration-500">
                  <div className="bg-indigo-500/20 p-3 rounded-2xl border border-indigo-500/20 shadow-inner">
                    <Lock className="w-8 h-8 text-indigo-400" />
                  </div>
                </div>
                
                <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">Ready to Secure Your Institution?</h2>
                <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto font-medium leading-relaxed">
                  Join the network of universities building the future of unforgeable academic credentials on Ethereum. No setup fees, instant verification.
                </p>
                
                <Link to="/dashboard">
                  <button className="bg-white text-black font-black px-12 py-5 rounded-2xl transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:shadow-[0_0_60px_rgba(255,255,255,0.4)] hover:scale-105 text-lg flex items-center gap-3 border border-white/50">
                    Deploy Smart Contract <ArrowRight className="w-5 h-5 text-indigo-600" />
                  </button>
                </Link>
              </div>
           </div>
        </section>

      </main>

      {/* Premium Floating Footer */}
      <footer className="relative z-10 w-full mt-auto pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="relative overflow-hidden bg-[#0A0A0C]/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 md:p-10 shadow-2xl">
            {/* Inner footer glow */}
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[80%] h-[100px] bg-indigo-500/10 blur-[60px] rounded-t-full pointer-events-none" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="flex items-center space-x-4">
                <div className="bg-[#111115] p-3 rounded-2xl border border-white/5 shadow-inner">
                  <ShieldCheck className="h-6 w-6 text-indigo-400" />
                </div>
                <div>
                  <div className="font-black text-white text-xl tracking-tight">CredChain</div>
                  <div className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Trustless Protocol</div>
                </div>
              </div>
              
              <div className="flex flex-wrap justify-center items-center gap-6 md:gap-10 text-xs font-bold text-slate-400 uppercase tracking-widest">
                <a href="https://sepolia.etherscan.io/address/0x9961d602bc6FE437F8dff53f928c044b56569935" target="_blank" rel="noreferrer" className="hover:text-white transition-colors flex items-center gap-2">
                  <Database className="w-3.5 h-3.5" /> Etherscan
                </a>
                <a href="https://github.com/vishwasahuja62-maker/CredChain" target="_blank" rel="noreferrer" className="hover:text-white transition-colors flex items-center gap-2">
                  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                  GitHub
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

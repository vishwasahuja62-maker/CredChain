import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Shield, Zap, Upload, Search, QrCode } from 'lucide-react';
import { Link } from 'react-router-dom';
import Navbar from '../components/Navbar';

const steps = [
  {
    number: "01",
    title: "Institution Connects",
    description: "An authorized institution connects their whitelisted wallet. Only permissioned addresses can issue credentials — enforced by smart contract.",
    icon: <Shield className="w-5 h-5" />
  },
  {
    number: "02",
    title: "Credential Created",
    description: "The issuer fills in credential details: recipient wallet, program, institution, and date. Metadata is packaged into a structured JSON schema.",
    icon: <Upload className="w-5 h-5" />
  },
  {
    number: "03",
    title: "Pinned to IPFS",
    description: "Metadata is pinned to IPFS via Pinata. Only non-sensitive institutional data is stored — no national IDs or personal documents.",
    icon: <Zap className="w-5 h-5" />
  },
  {
    number: "04",
    title: "Minted On-Chain",
    description: "A soulbound ERC-721 token is minted to the recipient's wallet with the IPFS URI. The token cannot be transferred — ever.",
    icon: <CheckCircle2 className="w-5 h-5" />
  },
  {
    number: "05",
    title: "QR Code Generated",
    description: "The recipient receives a QR code linking directly to the on-chain verification page. Shareable anywhere — LinkedIn, email, a resume.",
    icon: <QrCode className="w-5 h-5" />
  },
  {
    number: "06",
    title: "Anyone Can Verify",
    description: "An employer scans the QR code. CredChain queries the blockchain and IPFS simultaneously — returning a definitive verified or revoked status.",
    icon: <Search className="w-5 h-5" />
  }
];

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen relative overflow-hidden">
      {/* Background Gradients */}
      <div className="absolute top-0 inset-x-0 h-screen bg-gradient-to-b from-indigo-900/20 to-gray-950 pointer-events-none -z-10" />
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[50%] rounded-full bg-blue-600/10 blur-[120px] pointer-events-none -z-10" />

      <Navbar />

      {/* Hero */}
      <main className="flex-grow">
        <section className="flex items-center justify-center pt-16 pb-28 px-4 sm:px-6 lg:px-8">
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
                Live on Sepolia Testnet · HackBlox 2026
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl md:text-7xl font-extrabold tracking-tight text-white mb-6 leading-tight"
            >
              Verify academic credentials{' '}
              <br className="hidden md:block" />
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
              Trustless credentials powered by soulbound NFTs and IPFS. Eliminating certificate fraud while removing manual verification delays for employers and institutions.
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
                  See How It Works
                </button>
              </a>
            </motion.div>

            {/* Trust Pillars */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-16 flex flex-wrap justify-center gap-4"
            >
              {["On-Chain Verified", "Non-Transferable", "IPFS Metadata", "Instant Revocation"].map((tag) => (
                <span key={tag} className="flex items-center space-x-1.5 text-sm text-gray-500 bg-gray-900/50 border border-gray-800 rounded-full px-4 py-1.5">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                  <span>{tag}</span>
                </span>
              ))}
            </motion.div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 border-t border-gray-800/50 bg-gray-950/50">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <p className="text-indigo-400 text-sm font-semibold uppercase tracking-widest mb-3">The Protocol</p>
              <h2 className="text-3xl md:text-5xl font-bold text-white">How CredChain Works</h2>
              <p className="text-gray-400 mt-4 max-w-xl mx-auto">
                A complete trust pipeline from institutional issuance to employer verification — all verifiable on-chain.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {steps.map((step, i) => (
                <motion.div
                  key={step.number}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="bg-gray-900/50 border border-gray-800 rounded-2xl p-7 hover:border-gray-700 transition-colors group"
                >
                  <div className="flex items-center space-x-3 mb-5">
                    <span className="text-4xl font-black text-gray-800 group-hover:text-gray-700 transition-colors">{step.number}</span>
                    <div className="bg-indigo-500/10 border border-indigo-500/20 p-2 rounded-lg text-indigo-400">
                      {step.icon}
                    </div>
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{step.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Trust Model CTA */}
        <section className="py-24 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-gray-900 to-gray-900/50 border border-gray-800 rounded-3xl p-10 md:p-16 text-center relative overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-indigo-500 to-transparent" />
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                Blockchain solves the trust problem.
              </h2>
              <p className="text-gray-400 max-w-xl mx-auto mb-8">
                Unlike a PDF or email certificate, a CredChain credential is cryptographically unforgeable, permanently traceable, and instantly verifiable by anyone on Earth.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/verify">
                  <button className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)]">
                    Try Verification
                  </button>
                </Link>
                <a href="https://sepolia.etherscan.io/address/0x9961d602bc6FE437F8dff53f928c044b56569935" target="_blank" rel="noreferrer">
                  <button className="border border-gray-700 hover:border-gray-600 text-gray-300 hover:text-white font-medium px-8 py-3.5 rounded-xl transition-colors flex items-center space-x-2">
                    <span>View Contract</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-800/50 py-10 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-3">
            <Shield className="h-5 w-5 text-indigo-400" />
            <span className="font-semibold text-white">CredChain</span>
            <span className="text-gray-600 text-sm">— Trustless credentials. Instant verification.</span>
          </div>
          <div className="flex items-center gap-6 text-sm text-gray-500">
            <a href="https://sepolia.etherscan.io/address/0x9961d602bc6FE437F8dff53f928c044b56569935" target="_blank" rel="noreferrer" className="hover:text-gray-300 transition-colors">Contract</a>
            <a href="https://github.com/vishwasahuja62-maker/CredChain" target="_blank" rel="noreferrer" className="hover:text-gray-300 transition-colors">GitHub</a>
            <span>HackBlox 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

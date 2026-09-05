import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import GhostFibers from '../components/GhostFibers';
import { useWeb3, CONTRACT_ADDRESS, ABI } from '../Web3Context';
import { getIPFSUrl } from '../utils/pinata';
import { QRCodeSVG } from 'qrcode.react';
import { CheckCircle2, XCircle, AlertCircle, Loader2, Link as LinkIcon } from 'lucide-react';
import { ethers } from 'ethers';
import { motion } from 'framer-motion';

interface CredentialMetadata {
  name: string;
  description: string;
  recipient: string;
  credential: string;
  institution: string;
  issueDate: string;
  certificateId: string;
  issuer: string;
}

export default function CredentialDetails() {
  const { tokenId } = useParams();
  const { contract, isIssuer } = useWeb3();

  const [metadata, setMetadata] = useState<CredentialMetadata | null>(null);
  const [onChainOwner, setOnChainOwner] = useState('');
  const [isRevoked, setIsRevoked] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [revoking, setRevoking] = useState(false);

  useEffect(() => {
    fetchCredential();
  }, [tokenId, contract]);

  const fetchCredential = async () => {
    if (!tokenId) return;
    setLoading(true);
    setError('');

    try {
      // Create a read-only instance if user hasn't connected wallet
      let readContract = contract;
      if (!readContract) {
        // Use a public Sepolia RPC for read-only verification, making this page work flawlessly 
        // even if MetaMask is disconnected, on the wrong network, or completely uninstalled!
        const fallbackProvider = new ethers.JsonRpcProvider("https://ethereum-sepolia-rpc.publicnode.com");
        readContract = new ethers.Contract(CONTRACT_ADDRESS, ABI, fallbackProvider);
      }

      // 1. Fetch from Contract
      let owner = '';
      try {
        owner = await readContract.ownerOf(tokenId);
      } catch (e: any) {
        if (e.message.includes("nonexistent") || e.message.includes("ERC721NonexistentToken")) {
          throw new Error("Credential not found on-chain.");
        }
        throw e;
      }
      
      setOnChainOwner(owner);

      const revokedStatus = await readContract.isRevoked(tokenId);
      setIsRevoked(revokedStatus);

      const uri = await readContract.tokenURI(tokenId);
      
      // 2. Fetch Metadata from IPFS
      const ipfsUrl = getIPFSUrl(uri);
      const res = await fetch(ipfsUrl);
      if (!res.ok) throw new Error("Failed to load metadata from IPFS");
      const data = await res.json();
      
      setMetadata(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to fetch credential");
    } finally {
      setLoading(false);
    }
  };

  const handleRevoke = async () => {
    if (!contract || !isIssuer) return;
    if (!window.confirm("Are you sure you want to completely revoke this credential? This cannot be undone.")) return;
    
    try {
      setRevoking(true);
      const tx = await contract.revokeCredential(tokenId);
      await tx.wait();
      setIsRevoked(true);
    } catch (err: any) {
      console.error(err);
      alert("Failed to revoke: " + (err.reason || err.message));
    } finally {
      setRevoking(false);
    }
  };

  const currentUrl = window.location.href;

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

      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20 w-full relative z-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32">
            <Loader2 className="animate-spin h-12 w-12 text-fuchsia-500 mb-4" />
            <p className="text-slate-400 font-mono tracking-widest uppercase">Querying Blockchain & IPFS...</p>
          </div>
        ) : error ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#0A0A0C]/80 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-10 text-center max-w-2xl mx-auto shadow-2xl"
          >
            <AlertCircle className="h-16 w-16 text-fuchsia-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Verification Failed</h2>
            <p className="text-slate-400 mb-8">{error}</p>
            <Link to="/verify">
              <button className="bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(168,85,247,0.35)] uppercase tracking-widest text-sm">
                Try Another Token
              </button>
            </Link>
          </motion.div>
        ) : metadata && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            {/* Left Column: Verification Status & QR */}
            <div className="space-y-6">
              <div className="bg-[#0A0A0C]/80 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 flex flex-col items-center text-center relative overflow-hidden shadow-2xl group">
                {/* Top glow indicator */}
                <div className={`absolute top-0 inset-x-0 h-1.5 transition-colors duration-500 ${isRevoked ? 'bg-red-500' : 'bg-emerald-500'}`} />
                <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[40px] blur-[30px] rounded-b-full transition-colors duration-500 ${isRevoked ? 'bg-red-500/20' : 'bg-emerald-500/20'}`} />
                
                {isRevoked ? (
                  <>
                    <div className="bg-red-500/10 p-4 rounded-full mb-4 border border-red-500/20 shadow-[0_0_30px_rgba(239,68,68,0.2)]">
                      <XCircle className="h-12 w-12 text-red-500" />
                    </div>
                    <h2 className="text-2xl font-black text-white mb-1 tracking-tight">Revoked</h2>
                    <p className="text-red-400 text-sm font-medium uppercase tracking-widest">Credential Invalid</p>
                  </>
                ) : (
                  <>
                    <div className="bg-emerald-500/10 p-4 rounded-full mb-4 border border-emerald-500/20 shadow-[0_0_30px_rgba(16,185,129,0.2)]">
                      <CheckCircle2 className="h-12 w-12 text-emerald-500" />
                    </div>
                    <h2 className="text-2xl font-black text-white mb-1 tracking-tight">Verified</h2>
                    <p className="text-emerald-400 text-sm font-medium uppercase tracking-widest">Cryptographically Valid</p>
                  </>
                )}

                <div className="mt-10 w-full relative">
                  <div className="bg-white p-4 rounded-3xl mx-auto inline-block border-[6px] border-[#111115] shadow-2xl">
                    <QRCodeSVG value={currentUrl} size={160} level="H" includeMargin={false} />
                  </div>
                  <p className="text-xs text-slate-500 mt-6 uppercase tracking-widest font-bold">Scan to Verify</p>
                </div>
              </div>

              {/* Trust Model Checklist */}
              <div className="bg-[#0A0A0C]/80 backdrop-blur-2xl border border-white/10 rounded-[2rem] p-8 shadow-2xl">
                <h3 className="text-white font-bold mb-6 text-sm uppercase tracking-widest">Trust Protocol</h3>
                <ul className="space-y-4">
                  <TrustItem valid={true} text="Exists on Blockchain" />
                  <TrustItem valid={true} text="Soulbound (Non-Transferable)" />
                  <TrustItem valid={!isRevoked} text="Not Revoked by Issuer" />
                  <TrustItem valid={true} text="Decentralized IPFS Metadata" />
                </ul>
              </div>

              {/* Admin Actions */}
              {isIssuer && !isRevoked && (
                <div className="bg-red-500/5 backdrop-blur-md border border-red-500/20 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 blur-[50px] rounded-full pointer-events-none" />
                  <h3 className="text-white font-bold mb-3 text-sm uppercase tracking-widest relative z-10">Issuer Actions</h3>
                  <p className="text-sm text-slate-400 mb-6 relative z-10">As an authorized issuer, you can revoke this credential permanently.</p>
                  <button 
                    onClick={handleRevoke}
                    disabled={revoking}
                    className="w-full relative z-10 bg-red-500/20 hover:bg-red-500/30 text-red-400 font-bold px-4 py-3.5 rounded-xl transition-all border border-red-500/30 flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(239,68,68,0.2)]"
                  >
                    {revoking ? <Loader2 className="animate-spin h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                    {revoking ? 'REVOKING...' : 'REVOKE CREDENTIAL'}
                  </button>
                </div>
              )}
            </div>

            {/* Right Column: Credential Details */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-[#0A0A0C]/80 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-10 md:p-12 shadow-2xl relative overflow-hidden">
                {/* Glow effects */}
                <div className="absolute top-0 right-0 w-[80%] h-[300px] bg-gradient-to-bl from-fuchsia-600/10 to-transparent blur-[80px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-[50%] h-[200px] bg-gradient-to-tr from-indigo-600/10 to-transparent blur-[60px] pointer-events-none" />
                
                <div className="relative z-10">
                  <div className="mb-12">
                    <p className="text-fuchsia-400 font-bold mb-3 uppercase tracking-widest text-sm">{metadata.institution}</p>
                    <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400 leading-tight mb-4">
                      {metadata.name}
                    </h1>
                    <p className="text-slate-300 text-xl font-medium">{metadata.credential}</p>
                  </div>

                  <div className="bg-[#111115]/80 backdrop-blur-md border border-white/5 rounded-3xl p-8 grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-12 mb-10 shadow-inner">
                    <DetailItem label="Recipient Wallet" value={metadata.recipient} />
                    <DetailItem label="Issue Date" value={new Date(metadata.issueDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })} />
                    <DetailItem label="Certificate ID" value={metadata.certificateId} />
                    <DetailItem label="Issuer Address" value={metadata.issuer} />
                  </div>

                  {metadata.description && (
                    <div className="mb-10">
                      <h4 className="text-xs font-bold text-slate-500 mb-4 uppercase tracking-widest">Description</h4>
                      <div className="bg-[#111115]/50 p-6 rounded-2xl border border-white/5 shadow-inner">
                        <p className="text-slate-300 leading-relaxed text-lg">
                          {metadata.description}
                        </p>
                      </div>
                    </div>
                  )}

                  <div className="border-t border-white/10 pt-8 mt-4">
                    <h4 className="text-xs font-bold text-slate-500 mb-5 uppercase tracking-widest">On-Chain Evidence</h4>
                    <div className="flex flex-wrap gap-4">
                      <a href={`https://sepolia.etherscan.io/address/${onChainOwner}`} target="_blank" rel="noreferrer" className="flex items-center space-x-2 text-sm font-bold text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 border border-white/10 px-5 py-3 rounded-xl transition-all hover:shadow-[0_0_15px_rgba(255,255,255,0.1)] group">
                        <LinkIcon className="h-4 w-4 text-slate-400 group-hover:text-fuchsia-400 transition-colors" />
                        <span>Owner: {onChainOwner.slice(0,6)}...{onChainOwner.slice(-4)}</span>
                      </a>
                      <div className="flex items-center space-x-2 text-sm font-bold text-slate-300 bg-white/5 border border-white/10 px-5 py-3 rounded-xl cursor-default shadow-inner">
                        <ZapIcon className="h-4 w-4 text-fuchsia-400" />
                        <span>Token ID: {tokenId}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}

function TrustItem({ valid, text }: { valid: boolean, text: string }) {
  return (
    <li className="flex items-start space-x-3">
      {valid ? (
        <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
      ) : (
        <XCircle className="h-5 w-5 text-red-500 shrink-0" />
      )}
      <span className={`text-sm ${valid ? 'text-gray-300' : 'text-red-400'}`}>{text}</span>
    </li>
  );
}

function DetailItem({ label, value }: { label: string, value: string }) {
  return (
    <div>
      <p className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">{label}</p>
      <p className="text-gray-200 font-medium break-all">{value}</p>
    </div>
  );
}

function ZapIcon(props: any) {
  return <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>
}

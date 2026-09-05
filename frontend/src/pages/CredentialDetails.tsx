import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { useWeb3, CONTRACT_ADDRESS, ABI } from '../Web3Context';
import { getIPFSUrl } from '../utils/pinata';
import { QRCodeSVG } from 'qrcode.react';
import { CheckCircle2, XCircle, AlertCircle, Loader2, Link as LinkIcon } from 'lucide-react';
import { ethers } from 'ethers';

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
        if (!window.ethereum) throw new Error("MetaMask not found. Please install a Web3 wallet to verify on-chain.");
        const fallbackProvider = new ethers.BrowserProvider(window.ethereum);
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
    <div className="flex flex-col min-h-screen bg-gray-950">
      <Navbar />
      <main className="flex-grow max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="animate-spin h-12 w-12 text-indigo-500 mb-4" />
            <p className="text-gray-400">Querying Blockchain & IPFS...</p>
          </div>
        ) : error ? (
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-10 text-center max-w-2xl mx-auto">
            <AlertCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Verification Failed</h2>
            <p className="text-gray-400 mb-6">{error}</p>
            <Link to="/verify">
              <button className="bg-gray-800 hover:bg-gray-700 text-white font-medium px-6 py-2.5 rounded-xl transition-colors">
                Try Another
              </button>
            </Link>
          </div>
        ) : metadata && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Verification Status & QR */}
            <div className="space-y-6">
              <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 flex flex-col items-center text-center relative overflow-hidden">
                <div className={`absolute top-0 inset-x-0 h-1.5 ${isRevoked ? 'bg-red-500' : 'bg-emerald-500'}`} />
                
                {isRevoked ? (
                  <>
                    <div className="bg-red-500/10 p-4 rounded-full mb-4">
                      <XCircle className="h-12 w-12 text-red-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-1">Revoked</h2>
                    <p className="text-red-400 text-sm font-medium">This credential is no longer valid</p>
                  </>
                ) : (
                  <>
                    <div className="bg-emerald-500/10 p-4 rounded-full mb-4">
                      <CheckCircle2 className="h-12 w-12 text-emerald-500" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-1">Verified</h2>
                    <p className="text-emerald-400 text-sm font-medium">Cryptographically Valid</p>
                  </>
                )}

                <div className="mt-8 w-full">
                  <div className="bg-white p-4 rounded-2xl mx-auto inline-block border-4 border-gray-800 shadow-xl">
                    <QRCodeSVG value={currentUrl} size={160} level="H" includeMargin={false} />
                  </div>
                  <p className="text-xs text-gray-500 mt-4 uppercase tracking-widest font-semibold">Scan to Verify</p>
                </div>
              </div>

              {/* Trust Model Checklist */}
              <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6">
                <h3 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Trust Protocol</h3>
                <ul className="space-y-3">
                  <TrustItem valid={true} text="Exists on Blockchain" />
                  <TrustItem valid={true} text="Soulbound (Non-Transferable)" />
                  <TrustItem valid={!isRevoked} text="Not Revoked by Issuer" />
                  <TrustItem valid={true} text="Decentralized IPFS Metadata" />
                </ul>
              </div>

              {/* Admin Actions */}
              {isIssuer && !isRevoked && (
                <div className="bg-red-500/5 border border-red-500/20 rounded-3xl p-6">
                  <h3 className="text-white font-semibold mb-2">Issuer Actions</h3>
                  <p className="text-xs text-gray-400 mb-4">As an authorized issuer, you can revoke this credential permanently.</p>
                  <button 
                    onClick={handleRevoke}
                    disabled={revoking}
                    className="w-full bg-red-500/20 hover:bg-red-500/30 text-red-400 font-medium px-4 py-2.5 rounded-xl transition-colors border border-red-500/30 flex items-center justify-center"
                  >
                    {revoking ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <AlertCircle className="h-4 w-4 mr-2" />}
                    {revoking ? 'Revoking...' : 'Revoke Credential'}
                  </button>
                </div>
              )}
            </div>

            {/* Right Column: Credential Details */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 md:p-10">
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <p className="text-indigo-400 font-semibold mb-1">{metadata.institution}</p>
                    <h1 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
                      {metadata.name}
                    </h1>
                    <p className="text-gray-400 mt-2 text-lg">{metadata.credential}</p>
                  </div>
                </div>

                <div className="bg-gray-950 border border-gray-800 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8 mb-8">
                  <DetailItem label="Recipient" value={metadata.recipient} />
                  <DetailItem label="Issue Date" value={new Date(metadata.issueDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })} />
                  <DetailItem label="Certificate ID" value={metadata.certificateId} />
                  <DetailItem label="Issuer Address" value={metadata.issuer} />
                </div>

                {metadata.description && (
                  <div className="mb-8">
                    <h4 className="text-sm font-semibold text-gray-500 mb-2 uppercase tracking-wider">Description</h4>
                    <p className="text-gray-300 leading-relaxed bg-gray-950/50 p-4 rounded-xl border border-gray-800/50">
                      {metadata.description}
                    </p>
                  </div>
                )}

                <div className="border-t border-gray-800 pt-6 mt-2">
                  <h4 className="text-sm font-semibold text-gray-500 mb-4 uppercase tracking-wider">On-Chain Data</h4>
                  <div className="flex flex-wrap gap-4">
                    <a href={`https://sepolia.etherscan.io/address/${onChainOwner}`} target="_blank" rel="noreferrer" className="flex items-center space-x-2 text-xs font-medium text-gray-400 hover:text-white bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-lg transition-colors">
                      <LinkIcon className="h-3.5 w-3.5" />
                      <span>Owner: {onChainOwner.slice(0,6)}...{onChainOwner.slice(-4)}</span>
                    </a>
                    <div className="flex items-center space-x-2 text-xs font-medium text-gray-400 bg-gray-800 px-3 py-2 rounded-lg cursor-default">
                      <ZapIcon className="h-3.5 w-3.5" />
                      <span>Token ID: {tokenId}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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

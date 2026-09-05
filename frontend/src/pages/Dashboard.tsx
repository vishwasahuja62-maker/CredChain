import { useState } from 'react';
import Navbar from '../components/Navbar';
import { useWeb3 } from '../Web3Context';
import { uploadJSONToIPFS } from '../utils/pinata';
import { Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const { isIssuer, account, contract } = useWeb3();

  const [formData, setFormData] = useState({
    recipient: '',
    name: '',
    course: '',
    institution: '',
    description: '',
  });

  const [status, setStatus] = useState<'idle' | 'uploading' | 'minting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');
  const [txHash, setTxHash] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleIssue = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contract) {
      setErrorMessage("Contract not initialized");
      return;
    }

    setStatus('uploading');
    setErrorMessage('');
    
    try {
      // 1. Prepare Metadata
      const issueDate = new Date().toISOString();
      const certificateId = `CRED-${Date.now().toString(16).toUpperCase()}`;

      const metadata = {
        name: formData.name,
        description: formData.description,
        recipient: formData.recipient,
        credential: formData.course,
        institution: formData.institution,
        issueDate: issueDate,
        certificateId: certificateId,
        issuer: account,
        version: "1.0"
      };

      // 2. Upload to IPFS
      const ipfsURI = await uploadJSONToIPFS(metadata);
      
      // 3. Mint Credential
      setStatus('minting');
      const tx = await contract.issueCredential(formData.recipient, ipfsURI);
      
      const receipt = await tx.wait();
      setTxHash(receipt.hash || tx.hash);
      setStatus('success');

    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setErrorMessage(err.reason || err.message || "An unknown error occurred");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-950">
      <Navbar />
      <main className="flex-grow max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {!account ? (
           <div className="text-center bg-gray-900 border border-gray-800 rounded-2xl p-12">
            <h2 className="text-2xl font-bold text-white mb-4">Connect Wallet</h2>
            <p className="text-gray-400">Please connect your wallet to access the dashboard.</p>
           </div>
        ) : !isIssuer ? (
          <div className="text-center bg-gray-900 border border-gray-800 rounded-2xl p-12">
            <AlertTriangle className="h-12 w-12 text-amber-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-4">Unauthorized Access</h2>
            <p className="text-gray-400">
              Your wallet <span className="font-mono text-gray-300">{account}</span> is not an authorized issuer.
            </p>
          </div>
        ) : (
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Issuer Dashboard</h1>
            <p className="text-gray-400 mb-8">Mint verifiable, soulbound credentials to students or employees.</p>
            
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 md:p-8">
              {status === 'success' ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-12"
                >
                  <CheckCircle className="h-16 w-16 text-emerald-500 mx-auto mb-6" />
                  <h2 className="text-2xl font-bold text-white mb-2">Credential Issued Successfully!</h2>
                  <p className="text-gray-400 mb-6">The soulbound token has been minted and bound to the recipient's wallet.</p>
                  <div className="bg-gray-950 border border-gray-800 rounded-xl p-4 inline-block mb-8">
                    <p className="text-sm text-gray-500 mb-1">Transaction Hash</p>
                    <a href={`https://sepolia.etherscan.io/tx/${txHash}`} target="_blank" rel="noreferrer" className="text-indigo-400 font-mono hover:underline">
                      {txHash}
                    </a>
                  </div>
                  <div>
                    <button 
                      onClick={() => {
                        setStatus('idle');
                        setFormData({ recipient: '', name: '', course: '', institution: '', description: '' });
                      }}
                      className="bg-gray-800 hover:bg-gray-700 text-white font-medium px-6 py-3 rounded-xl transition-colors"
                    >
                      Issue Another Credential
                    </button>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleIssue} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-1 md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">Recipient Wallet Address</label>
                      <input 
                        type="text" 
                        name="recipient"
                        required
                        value={formData.recipient}
                        onChange={handleInputChange}
                        placeholder="0x..."
                        className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-mono"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Credential Name</label>
                      <input 
                        type="text" 
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        placeholder="e.g. Master of Science"
                        className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Course / Program</label>
                      <input 
                        type="text" 
                        name="course"
                        required
                        value={formData.course}
                        onChange={handleInputChange}
                        placeholder="e.g. Computer Science"
                        className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                      />
                    </div>

                    <div className="col-span-1 md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">Institution</label>
                      <input 
                        type="text" 
                        name="institution"
                        required
                        value={formData.institution}
                        onChange={handleInputChange}
                        placeholder="e.g. Stanford University"
                        className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                      />
                    </div>

                    <div className="col-span-1 md:col-span-2">
                      <label className="block text-sm font-medium text-gray-300 mb-2">Description (Optional)</label>
                      <textarea 
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Additional details about the credential..."
                        rows={3}
                        className="w-full bg-gray-950 border border-gray-800 rounded-xl px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all resize-none"
                      />
                    </div>
                  </div>

                  {status === 'error' && (
                    <div className="bg-red-500/10 border border-red-500/50 rounded-xl p-4 text-red-400 text-sm">
                      {errorMessage}
                    </div>
                  )}

                  <div className="pt-4 flex justify-end">
                    <button 
                      type="submit" 
                      disabled={status === 'uploading' || status === 'minting'}
                      className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold px-8 py-3.5 rounded-xl transition-all shadow-[0_0_20px_rgba(79,70,229,0.2)] flex items-center"
                    >
                      {status === 'uploading' && <><Loader2 className="animate-spin mr-2 h-5 w-5" /> Uploading to IPFS...</>}
                      {status === 'minting' && <><Loader2 className="animate-spin mr-2 h-5 w-5" /> Minting on-chain...</>}
                      {status === 'idle' || status === 'error' ? 'Issue Credential' : ''}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

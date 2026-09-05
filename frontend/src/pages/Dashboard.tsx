import { useState } from 'react';
import Navbar from '../components/Navbar';
import { useWeb3 } from '../Web3Context';
import { uploadJSONToIPFS } from '../utils/pinata';
import { Loader2, CheckCircle, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import AeroShards from '../components/AeroShards';

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
    <div className="flex flex-col min-h-screen bg-[#0D0A14] text-slate-50 relative overflow-hidden font-sans selection:bg-fuchsia-500/30">
      
      {/* AeroShards WebGPU Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <AeroShards
          backgroundColor="#0D0A14"
          shardColor="#896ABD"
          accentColor="#A855F7"
          placement="full"
          flow="stream"
          material="pearl"
          detail="balanced"
          effect="none"
          scale={1}
          spread={1.2}
          depth={1}
          speed={0.8}
          spin={1}
          interaction="repel"
          density={1.2}
          shardSize={1.0}
          stretch={1}
          turbulence={1}
          glow={1.2}
          bloom={0.5}
          grain={0.03}
          chromaticAberration={0.005}
          interactionRadius={1.5}
          interactionStrength={0.5}
          rippleIntensity={1}
          holdToGather={true}
        />
      </div>

      <Navbar />
      
      <main className="flex-grow max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-40 pb-20 w-full relative z-10">
        {!account ? (
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="text-center relative group"
           >
             <div className="absolute -inset-1 bg-gradient-to-r from-indigo-600/20 to-fuchsia-600/20 rounded-[2.5rem] blur-xl opacity-70"></div>
             <div className="relative bg-[#0A0A0C]/80 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-16 shadow-2xl overflow-hidden">
               <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
               <div className="bg-[#111115] w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-white/10 shadow-inner relative">
                 <div className="absolute inset-0 bg-indigo-500/20 blur-md rounded-3xl"></div>
                 <AlertTriangle className="h-10 w-10 text-indigo-400 relative z-10" />
               </div>
               <h2 className="text-3xl font-black text-white mb-4 tracking-tight">Wallet Disconnected</h2>
               <p className="text-slate-400 text-lg">Please connect your Web3 wallet using the button in the top right to access the issuer dashboard.</p>
             </div>
           </motion.div>
        ) : !isIssuer ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center relative group"
          >
            <div className="absolute -inset-1 bg-gradient-to-r from-red-600/20 to-orange-600/20 rounded-[2.5rem] blur-xl opacity-70"></div>
            <div className="relative bg-[#0A0A0C]/80 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-16 shadow-2xl overflow-hidden">
              <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
              <div className="bg-[#111115] w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-white/10 shadow-inner relative">
                <div className="absolute inset-0 bg-red-500/20 blur-md rounded-3xl"></div>
                <AlertTriangle className="h-10 w-10 text-red-400 relative z-10" />
              </div>
              <h2 className="text-3xl font-black text-white mb-4 tracking-tight">Unauthorized Access</h2>
              <p className="text-slate-400 text-lg">
                Your wallet <span className="font-mono text-slate-300 bg-white/5 px-2 py-1 rounded-md">{account}</span> is not an authorized issuer on this network.
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="mb-10 text-center">
              <h1 className="text-4xl font-black text-white mb-4 tracking-tight">Issuer Dashboard</h1>
              <p className="text-slate-400 text-lg">Mint verifiable, soulbound credentials to students or employees directly onto the blockchain.</p>
            </div>
            
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-fuchsia-600/20 to-indigo-600/20 rounded-[2.5rem] blur-xl opacity-50 group-hover:opacity-70 transition-opacity duration-500"></div>
              <div className="relative bg-[#0A0A0C]/80 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 md:p-12 shadow-2xl overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                
                {status === 'success' ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <div className="bg-[#111115] w-24 h-24 rounded-3xl flex items-center justify-center mx-auto mb-8 border border-white/10 shadow-inner relative">
                      <div className="absolute inset-0 bg-emerald-500/20 blur-md rounded-3xl"></div>
                      <CheckCircle className="h-12 w-12 text-emerald-400 relative z-10" />
                    </div>
                    <h2 className="text-3xl font-black text-white mb-4 tracking-tight">Credential Minted!</h2>
                    <p className="text-slate-400 mb-8 text-lg">The soulbound token has been successfully issued to the recipient's wallet.</p>
                    <div className="bg-black/50 border border-white/5 rounded-2xl p-6 inline-block mb-10 shadow-inner w-full max-w-md">
                      <p className="text-sm font-bold text-slate-500 mb-2 uppercase tracking-widest">Transaction Hash</p>
                      <a href={`https://sepolia.etherscan.io/tx/${txHash}`} target="_blank" rel="noreferrer" className="text-fuchsia-400 font-mono hover:text-fuchsia-300 transition-colors break-all">
                        {txHash}
                      </a>
                    </div>
                    <div>
                      <button 
                        onClick={() => {
                          setStatus('idle');
                          setFormData({ recipient: '', name: '', course: '', institution: '', description: '' });
                        }}
                        className="bg-white/5 hover:bg-white/10 text-white font-bold px-8 py-4 rounded-xl transition-all border border-white/10 shadow-inner"
                      >
                        Issue Another Credential
                      </button>
                    </div>
                  </motion.div>
                ) : (
                  <form onSubmit={handleIssue} className="space-y-8">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="col-span-1 md:col-span-2">
                        <label className="block text-sm font-bold text-slate-400 mb-3 uppercase tracking-widest">Recipient Wallet Address</label>
                        <input 
                          type="text" 
                          name="recipient"
                          required
                          value={formData.recipient}
                          onChange={handleInputChange}
                          placeholder="0x..."
                          className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:bg-[#111115] focus:ring-1 focus:ring-indigo-500/50 transition-all font-mono shadow-inner text-lg"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-bold text-slate-400 mb-3 uppercase tracking-widest">Credential Name</label>
                        <input 
                          type="text" 
                          name="name"
                          required
                          value={formData.name}
                          onChange={handleInputChange}
                          placeholder="e.g. Master of Science"
                          className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:bg-[#111115] focus:ring-1 focus:ring-indigo-500/50 transition-all shadow-inner text-lg"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-slate-400 mb-3 uppercase tracking-widest">Course / Program</label>
                        <input 
                          type="text" 
                          name="course"
                          required
                          value={formData.course}
                          onChange={handleInputChange}
                          placeholder="e.g. Computer Science"
                          className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:bg-[#111115] focus:ring-1 focus:ring-indigo-500/50 transition-all shadow-inner text-lg"
                        />
                      </div>

                      <div className="col-span-1 md:col-span-2">
                        <label className="block text-sm font-bold text-slate-400 mb-3 uppercase tracking-widest">Institution</label>
                        <input 
                          type="text" 
                          name="institution"
                          required
                          value={formData.institution}
                          onChange={handleInputChange}
                          placeholder="e.g. Stanford University"
                          className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:bg-[#111115] focus:ring-1 focus:ring-indigo-500/50 transition-all shadow-inner text-lg"
                        />
                      </div>

                      <div className="col-span-1 md:col-span-2">
                        <label className="block text-sm font-bold text-slate-400 mb-3 uppercase tracking-widest">Description (Optional)</label>
                        <textarea 
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          placeholder="Additional details about the credential..."
                          rows={3}
                          className="w-full bg-black/50 border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-slate-600 focus:outline-none focus:border-indigo-500/50 focus:bg-[#111115] focus:ring-1 focus:ring-indigo-500/50 transition-all resize-none shadow-inner text-lg"
                        />
                      </div>
                    </div>

                    {status === 'error' && (
                      <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-5 text-red-400 text-sm shadow-inner flex items-center gap-3">
                        <AlertTriangle className="h-5 w-5" />
                        {errorMessage}
                      </div>
                    )}

                    <div className="pt-6">
                      <button 
                        type="submit" 
                        disabled={status === 'uploading' || status === 'minting'}
                        className="w-full bg-gradient-to-r from-fuchsia-600 to-indigo-600 hover:from-fuchsia-500 hover:to-indigo-500 disabled:opacity-50 disabled:grayscale text-white font-bold px-8 py-5 rounded-2xl transition-all shadow-[0_0_30px_rgba(79,70,229,0.4)] flex items-center justify-center border border-white/10 text-lg uppercase tracking-widest"
                      >
                        {status === 'uploading' && <><Loader2 className="animate-spin mr-3 h-6 w-6" /> Uploading to IPFS...</>}
                        {status === 'minting' && <><Loader2 className="animate-spin mr-3 h-6 w-6" /> Minting on-chain...</>}
                        {status === 'idle' || status === 'error' ? 'Mint Soulbound Credential' : ''}
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}

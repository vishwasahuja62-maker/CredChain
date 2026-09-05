import { useParams } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function CredentialDetails() {
  const { tokenId } = useParams();

  return (
    <div className="flex flex-col min-h-screen bg-gray-950">
      <Navbar />
      <main className="flex-grow max-w-4xl mx-auto px-4 py-12 w-full text-center">
        <h1 className="text-3xl font-bold text-white mb-4">Credential #{tokenId}</h1>
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8 mt-8">
          <p className="text-gray-400">Loading on-chain data for Token ID: {tokenId}...</p>
        </div>
      </main>
    </div>
  );
}

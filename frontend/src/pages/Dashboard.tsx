import Navbar from '../components/Navbar';
import { useWeb3 } from '../Web3Context';

export default function Dashboard() {
  const { isIssuer, account } = useWeb3();

  return (
    <div className="flex flex-col min-h-screen bg-gray-950">
      <Navbar />
      <main className="flex-grow max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        {!isIssuer ? (
          <div className="text-center bg-gray-900 border border-gray-800 rounded-2xl p-12">
            <h2 className="text-2xl font-bold text-white mb-4">Unauthorized Access</h2>
            <p className="text-gray-400">
              Your connected wallet ({account}) is not authorized to issue credentials.
            </p>
          </div>
        ) : (
          <div>
            <h1 className="text-3xl font-bold text-white mb-8">Issuer Dashboard</h1>
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-8">
              <h2 className="text-xl font-semibold text-white mb-6">Issue New Credential</h2>
              <p className="text-gray-400">Minting form will be implemented here.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

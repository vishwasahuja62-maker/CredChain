import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Verify from './pages/Verify';
import CredentialDetails from './pages/CredentialDetails';

function App() {
  return (
    <div className="min-h-screen bg-gray-950 text-gray-50 flex flex-col font-sans">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/verify" element={<Verify />} />
        <Route path="/verify/:tokenId" element={<CredentialDetails />} />
      </Routes>
    </div>
  );
}

export default App;

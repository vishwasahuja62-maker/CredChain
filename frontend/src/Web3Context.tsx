import React, { createContext, useContext, useState, useEffect } from 'react';
import { ethers } from 'ethers';

// Sepolia Testnet Deployment
export const CONTRACT_ADDRESS = "0x9961d602bc6FE437F8dff53f928c044b56569935";

// ABI snippet for necessary functions
export const ABI = [
  "function issueCredential(address to, string memory uri) external returns (uint256)",
  "function revokeCredential(uint256 tokenId) external",
  "function isRevoked(uint256 tokenId) external view returns (bool)",
  "function tokenURI(uint256 tokenId) public view returns (string)",
  "function ownerOf(uint256 tokenId) public view returns (address)",
  "function hasRole(bytes32 role, address account) public view returns (bool)",
  "function ISSUER_ROLE() public view returns (bytes32)"
];

interface Web3ContextType {
  provider: ethers.BrowserProvider | null;
  signer: ethers.JsonRpcSigner | null;
  contract: ethers.Contract | null;
  account: string;
  isIssuer: boolean;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
  error: string;
}

const Web3Context = createContext<Web3ContextType>({
  provider: null,
  signer: null,
  contract: null,
  account: '',
  isIssuer: false,
  connectWallet: async () => {},
  disconnectWallet: () => {},
  error: ''
});

export const useWeb3 = () => useContext(Web3Context);

export const Web3Provider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null);
  const [signer, setSigner] = useState<ethers.JsonRpcSigner | null>(null);
  const [contract, setContract] = useState<ethers.Contract | null>(null);
  const [account, setAccount] = useState<string>('');
  const [isIssuer, setIsIssuer] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const checkIssuerStatus = async (userAccount: string, contractInstance: ethers.Contract) => {
    try {
      const issuerRole = await contractInstance.ISSUER_ROLE();
      const status = await contractInstance.hasRole(issuerRole, userAccount);
      setIsIssuer(status);
    } catch (err) {
      console.error("Error checking issuer status:", err);
      setIsIssuer(false);
    }
  };

  const connectWallet = async () => {
    if (window.ethereum == null) {
      setError("MetaMask not installed; using read-only defaults");
      return;
    }

    try {
      setError('');
      const browserProvider = new ethers.BrowserProvider(window.ethereum);
      setProvider(browserProvider);

      const accounts = await browserProvider.send("eth_requestAccounts", []);
      if (accounts.length > 0) {
        setAccount(accounts[0]);
        const jsonRpcSigner = await browserProvider.getSigner();
        setSigner(jsonRpcSigner);
        
        const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, ABI, jsonRpcSigner);
        setContract(contractInstance);
        await checkIssuerStatus(accounts[0], contractInstance);
      }
    } catch (err: any) {
      setError(err.message || "Failed to connect wallet");
    }
  };

  const disconnectWallet = () => {
    setAccount('');
    setSigner(null);
    setContract(null);
    setIsIssuer(false);
  };

  // Handle account changes
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        if (accounts.length > 0) {
          connectWallet(); // Re-initialize with new account
        } else {
          disconnectWallet();
        }
      });
    }
  }, []);

  return (
    <Web3Context.Provider value={{ provider, signer, contract, account, isIssuer, connectWallet, disconnectWallet, error }}>
      {children}
    </Web3Context.Provider>
  );
};

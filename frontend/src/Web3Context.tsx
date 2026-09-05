import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { ethers } from 'ethers';

// Sepolia Testnet Deployment
export const CONTRACT_ADDRESS = "0x9961d602bc6FE437F8dff53f928c044b56569935";
const SEPOLIA_CHAIN_ID = "0xaa36a7"; // 11155111

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
  const isConnecting = useRef(false); // Prevent concurrent MetaMask requests

  const checkIssuerStatus = async (userAccount: string, contractInstance: ethers.Contract) => {
    try {
      // Always checksum the address before passing to hasRole
      const checksummed = ethers.getAddress(userAccount);
      const issuerRole = await contractInstance.ISSUER_ROLE();
      const status = await contractInstance.hasRole(issuerRole, checksummed);
      console.log(`[CredChain] hasRole(ISSUER_ROLE, ${checksummed}) =`, status);
      setIsIssuer(status);
    } catch (err) {
      console.error("Error checking issuer status:", err);
      setIsIssuer(false);
    }
  };

  const connectWallet = useCallback(async () => {
    // Guard: if a MetaMask request is already in-flight, do nothing
    if (isConnecting.current) return;

    if (window.ethereum == null) {
      setError("MetaMask not installed; using read-only defaults");
      return;
    }

    isConnecting.current = true;
    try {
      setError('');
      // Use 'any' to tell ethers v6 to gracefully handle underlying chain changes
      let browserProvider = new ethers.BrowserProvider(window.ethereum, "any");
      
      // Ensure we are on Sepolia — prompt to switch if not
      const network = await browserProvider.getNetwork();
      if (network.chainId !== BigInt(11155111)) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: SEPOLIA_CHAIN_ID }],
          });
          // CRITICAL: Re-instantiate provider after network switch so it clears stale Mainnet state!
          browserProvider = new ethers.BrowserProvider(window.ethereum, "any");
        } catch (switchErr: any) {
          // This error code indicates that the chain has not been added to MetaMask.
          if (switchErr.code === 4902) {
            try {
              await window.ethereum.request({
                method: 'wallet_addEthereumChain',
                params: [
                  {
                    chainId: SEPOLIA_CHAIN_ID,
                    chainName: 'Sepolia test network',
                    nativeCurrency: { name: 'Sepolia Ether', symbol: 'SEP', decimals: 18 },
                    rpcUrls: ['https://rpc.sepolia.org'],
                    blockExplorerUrls: ['https://sepolia.etherscan.io'],
                  },
                ],
              });
              // Re-instantiate after adding and switching
              browserProvider = new ethers.BrowserProvider(window.ethereum, "any");
            } catch (addError) {
              setError("Failed to add the Sepolia network. Please add it manually in MetaMask.");
              setProvider(null);
              return;
            }
          } else if (switchErr.code === -32002) {
            setError("MetaMask is waiting! Please open the extension to approve the network switch.");
            setProvider(null);
            return;
          } else {
            setError("Please switch MetaMask to the Sepolia network and try again.");
            setProvider(null);
            return;
          }
        }
      }

      setProvider(browserProvider);

      // Try to get already connected accounts first silently
      let accounts: string[] = [];
      try {
        accounts = await browserProvider.send("eth_accounts", []);
        
        // If no accounts are returned, it means the user hasn't connected this site yet, so prompt them
        if (!accounts || accounts.length === 0) {
          accounts = await browserProvider.send("eth_requestAccounts", []);
        }
      } catch (reqErr: any) {

        // 4001 = user rejected, -32002 = already pending (MetaMask already open)
        if (reqErr.code === 4001) {
          setProvider(null);
          return;
        }
        if (reqErr.code === -32002) {
          setError("MetaMask is waiting! Please open the MetaMask browser extension to approve.");
          setProvider(null);
          return;
        }
        throw reqErr;
      }

      if (accounts && accounts.length > 0) {
        const checksummedAccount = ethers.getAddress(accounts[0]);
        setAccount(checksummedAccount);

        const jsonRpcSigner = await browserProvider.getSigner();
        setSigner(jsonRpcSigner);

        const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, ABI, jsonRpcSigner);
        setContract(contractInstance);

        await checkIssuerStatus(checksummedAccount, contractInstance);
      }
    } catch (err: any) {
      setError(err.message || "Failed to connect wallet");
      setProvider(null);
    } finally {
      // Always release the lock so the button works on the next click
      isConnecting.current = false;
    }
  }, []);

  const disconnectWallet = async () => {
    // Revoke site permissions so MetaMask prompts fresh on next connect
    try {
      if (window.ethereum) {
        await window.ethereum.request({
          method: 'wallet_revokePermissions',
          params: [{ eth_accounts: {} }],
        });
      }
    } catch (_) {
      // wallet_revokePermissions may not be supported on older MetaMask — that's fine
    }
    setAccount('');
    setSigner(null);
    setContract(null);
    setIsIssuer(false);
    setProvider(null);
    setError('');
  };


  // Handle account or chain changes from MetaMask
  useEffect(() => {
    if (!window.ethereum) return;

    // Eagerly try to connect on mount if the user already gave permissions previously
    const tryEagerConnect = async () => {
      try {
        const browserProvider = new ethers.BrowserProvider(window.ethereum, "any");
        const accounts = await browserProvider.send("eth_accounts", []);
        if (accounts && accounts.length > 0) {
          connectWallet();
        }
      } catch (e) {
        console.log("Eager connect failed silently", e);
      }
    };
    tryEagerConnect();

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length > 0) {
        connectWallet();
      } else {
        disconnectWallet();
      }
    };

    const handleChainChanged = () => {
      // Re-initialize everything when the network changes
      connectWallet();
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum.removeListener('chainChanged', handleChainChanged);
    };
  }, [connectWallet]);

  return (
    <Web3Context.Provider value={{ provider, signer, contract, account, isIssuer, connectWallet, disconnectWallet, error }}>
      {children}
    </Web3Context.Provider>
  );
};


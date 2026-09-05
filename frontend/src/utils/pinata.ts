export const uploadJSONToIPFS = async (JSONBody: any): Promise<string> => {
  const url = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;
  const pinataJWT = import.meta.env.VITE_PINATA_JWT;
  
  if (!pinataJWT) {
    console.warn("Pinata JWT not found in environment. Please set VITE_PINATA_JWT.");
    throw new Error("Pinata JWT not found in environment");
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${pinataJWT}`
      },
      body: JSON.stringify(JSONBody)
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return `ipfs://${data.IpfsHash}`;
  } catch (error) {
    console.error("IPFS Upload Error: ", error);
    throw new Error("Failed to upload metadata to IPFS");
  }
};

// Helper function to get IPFS HTTP URL
export const getIPFSUrl = (ipfsURI: string): string => {
  if (!ipfsURI) return '';
  if (ipfsURI.startsWith('ipfs://')) {
    return ipfsURI.replace('ipfs://', 'https://gateway.pinata.cloud/ipfs/');
  }
  return ipfsURI;
};

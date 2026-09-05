# CredChain

"Trustless credentials. Instant verification."

CredChain is a decentralized credential verification platform designed to solve the real-world problem of fake academic and professional certificates. 

By leveraging the Ethereum blockchain (Sepolia Testnet) and IPFS, CredChain allows authorized institutions to issue non-transferable (soulbound) NFT credentials. Employers and third-party verifiers can instantly cryptographically verify these credentials without relying on manual phone calls or centralized databases.

## Problem
Fake academic and professional certificates are difficult to detect, and legitimate credentials often require manual, slow verification by contacting the issuing institution. This creates friction and a lack of trust in digital certificates.

## Solution
CredChain provides a trustless verification pipeline:
1. Only **authorized institutions** can issue credentials.
2. Credentials are **soulbound** (non-transferable), meaning they permanently belong to the recipient's wallet.
3. Metadata is securely pinned on **IPFS**, guaranteeing decentralized permanence.
4. Credentials can be **instantly verified** via QR code or direct lookup on the blockchain.
5. Issuers retain the ability to **revoke** credentials cryptographically if issued by mistake or if the credential becomes invalid.

## Features
- **Soulbound Tokens (SBT):** ERC-721 based tokens that block all transfer methods.
- **Issuer Authorization:** Cryptographic role-based access control (RBAC). Only whitelisted addresses can mint.
- **Decentralized Metadata:** Credentials packaged and stored on IPFS via Pinata.
- **Instant Verification Portal:** Fetch on-chain status and IPFS payload instantly.
- **QR Code Sharing:** Mobile-first verification experience.
- **Revocation Engine:** Institutional ability to permanently mark a credential as invalid while preserving historical audit trails.

## Architecture

### Smart Contract (`CredChain.sol`)
- Built with **Solidity v0.8.24** and **OpenZeppelin**.
- Overrides `_update` to enforce non-transferability (Soulbound mechanics).
- Uses `AccessControl` for managing `ISSUER_ROLE`.
- Implements a decentralized mapping for revocation status (`isRevoked`).

### Frontend
- **React + Vite + TypeScript**.
- Styled with **Tailwind CSS v4** and **Framer Motion** for a premium SaaS feel.
- Integrates **Ethers.js v6** for direct Web3 JSON-RPC calls.

## Tech Stack
- **Smart Contracts:** Solidity, Hardhat, Chai (Testing)
- **Frontend:** React, TypeScript, Vite, Tailwind CSS, Framer Motion, Lucide React
- **Blockchain:** Sepolia Testnet
- **Storage:** IPFS (via Pinata API)
- **Web3 Interface:** Ethers.js v6, MetaMask Injected Provider

## Getting Started

### Prerequisites
- Node.js (v18+)
- MetaMask extension installed
- Pinata account for IPFS JWT

### Environment Variables
Copy the example files and populate them with your credentials.

**Blockchain (.env):**
```bash
cd blockchain
cp .env.example .env
# Add SEPOLIA_RPC_URL and PRIVATE_KEY
```

**Frontend (.env):**
```bash
cd frontend
cp .env.example .env
# Add VITE_PINATA_JWT
```

### Local Development

#### 1. Compile and Test Smart Contracts
```bash
cd blockchain
npm install
npx hardhat test
```

#### 2. Run the Frontend
```bash
cd frontend
npm install
npm run dev
```

## Security Considerations
- **Non-Transferability:** The `_update` hook enforces that `from` must be the zero address, making standard `transferFrom` and `safeTransferFrom` impossible.
- **Access Control:** Unauthorized users cannot mint or revoke credentials.
- **Revocation:** A revoked credential is not burned; its state is flagged to preserve historical context for auditors.
- **Metadata Privacy:** Only non-sensitive institutional credential metadata (Course, Institution, Date) is stored on IPFS. Sensitive personal identity data is intentionally excluded.

## Future Improvements
- Implement a hierarchical issuer structure (Departments under a University Admin).
- Integrate ENS for human-readable wallet addresses.
- Add advanced issuer analytics for credential usage.
- Multi-signature requirement for institutional revocation.

## License
MIT License

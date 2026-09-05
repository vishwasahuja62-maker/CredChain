# CredChain

> "Trustless credentials. Instant verification."

CredChain is a decentralized credential verification platform that solves the real-world problem of fake academic and professional certificates. Built for HackBlox 2026 Web3 Track.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)
[![Solidity](https://img.shields.io/badge/Solidity-0.8.24-blue)](blockchain/contracts/CredChain.sol)
[![Network](https://img.shields.io/badge/Network-Sepolia-purple)](https://sepolia.etherscan.io/address/0x9961d602bc6FE437F8dff53f928c044b56569935)

## 🔗 Deployed Contract

| Network | Address | Explorer |
|---------|---------|---------|
| Sepolia Testnet | `0x9961d602bc6FE437F8dff53f928c044b56569935` | [View on Etherscan](https://sepolia.etherscan.io/address/0x9961d602bc6FE437F8dff53f928c044b56569935) |

## Problem

Fake academic and professional certificates are difficult to detect. Legitimate credentials often require manual verification by contacting the issuing institution — a slow, error-prone, and costly process. There is no trustless way for an employer to verify a certificate today.

## Solution

CredChain provides a trustless verification pipeline:

1. **Authorized institutions** issue credentials via a permissioned smart contract
2. Credentials are **soulbound (non-transferable)** — permanently bound to the recipient's wallet
3. Metadata is pinned to **IPFS** for decentralized, permanent storage
4. Anyone can **instantly verify** a credential via QR code or direct lookup — no intermediary required
5. Issuers can **revoke** credentials cryptographically while preserving the audit trail

## Features

| Feature | Description |
|---------|-------------|
| 🔒 Soulbound NFTs | ERC-721 tokens that block all transfer methods permanently |
| 🏛️ Issuer Authorization | Role-based access control — only whitelisted wallets can mint |
| 📦 IPFS Metadata | Credential data stored on IPFS via Pinata — not on-chain |
| ✅ Public Verification | Instant on-chain + IPFS verification by anyone |
| 📱 QR Code Sharing | Mobile-first verification experience with auto-generated QR codes |
| ❌ Revocation | Permanent on-chain revocation with preserved audit trail |

## Architecture

```
ISSUER (Authorized Wallet)
│
├── Connect MetaMask
├── Fill credential form
├── Upload JSON metadata → IPFS (Pinata)
│                            ↓
│                      ipfs://Qm...URI
│
└── Call issueCredential(recipient, uri) → CredChain.sol (Sepolia)
                                                │
                                    Mint ERC-721 Soulbound Token
                                    Store IPFS URI on-chain
                                    Emit CredentialIssued event

VERIFIER (Anyone)
│
├── Enter Token ID or scan QR code
│
├── Read ownerOf(tokenId)      → Confirm credential exists
├── Read isRevoked(tokenId)    → Check revocation status
└── Read tokenURI(tokenId)     → Fetch IPFS URI
           │
           └── Fetch JSON from IPFS → Display full credential metadata
```

### What's stored on-chain
- Token ID (auto-incremented)
- Recipient wallet address (owner)
- IPFS URI pointing to metadata
- Revocation status (boolean)
- Issuer role assignments

### What's stored on IPFS
```json
{
  "name": "Master of Science",
  "description": "...",
  "recipient": "0x...",
  "credential": "Computer Science",
  "institution": "Stanford University",
  "issueDate": "2026-09-05T...",
  "certificateId": "CRED-...",
  "issuer": "0x...",
  "version": "1.0"
}
```

*Only non-sensitive institutional data is stored. No national IDs or personal documents on-chain.*

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Smart Contract | Solidity 0.8.24, OpenZeppelin |
| Development | Hardhat, Chai |
| Blockchain | Ethereum Sepolia Testnet |
| Frontend | React, TypeScript, Vite |
| Styling | Tailwind CSS v4, Framer Motion |
| Web3 Interface | Ethers.js v6, MetaMask |
| Storage | IPFS via Pinata API |

## Getting Started

### Prerequisites
- Node.js v18+
- MetaMask browser extension
- Pinata account (free tier works)
- Alchemy or Infura account for RPC

### 1. Clone the Repository
```bash
git clone https://github.com/vishwasahuja62-maker/CredChain.git
cd CredChain
```

### 2. Smart Contract Setup
```bash
cd blockchain
npm install
cp .env.example .env
# Fill in SEPOLIA_RPC_URL and PRIVATE_KEY
```

### 3. Run Tests
```bash
npx hardhat test
```

### 4. Frontend Setup
```bash
cd ../frontend
npm install
cp .env.example .env
# Fill in VITE_PINATA_JWT
npm run dev
```

## Environment Variables

**`blockchain/.env`**
```env
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR-KEY
PRIVATE_KEY=your-deployer-private-key
ETHERSCAN_API_KEY=your-etherscan-api-key
```

**`frontend/.env`**
```env
VITE_PINATA_JWT=your-pinata-jwt-token
```

## Deployment

```bash
cd blockchain

# Deploy to Sepolia
npx hardhat run scripts/deploy.js --network sepolia

# Authorize an issuer (replace address)
npx hardhat run scripts/addIssuer.js --network sepolia

# Verify on Etherscan
npx hardhat verify --network sepolia <CONTRACT_ADDRESS>
```

## Testing

```bash
cd blockchain
npx hardhat test
```

Test coverage includes:
- ✅ Admin role is set correctly on deployment
- ✅ Only admin can add/remove issuers
- ✅ Only authorized issuers can mint credentials
- ✅ Soulbound: `transferFrom` is permanently blocked
- ✅ Revocation marks credential as invalid
- ✅ Double-revocation is prevented
- ✅ Non-existent token revocation is rejected
- ✅ Events are emitted correctly

## Smart Contract

**Contract:** [`CredChain.sol`](blockchain/contracts/CredChain.sol)

**Key design decisions:**

- **Soulbound via `_update` hook**: We override OpenZeppelin's internal `_update` hook rather than `transferFrom` directly. This blocks all transfer paths including `safeTransferFrom`, `transferFrom`, and approval-based transfers — there is no transfer bypass.
- **AccessControl over Ownable**: `AccessControl` allows future multi-role hierarchies (e.g., Department roles under a University Admin).
- **Revoke ≠ Burn**: Revoked credentials remain on-chain for historical auditing. The `isRevoked` flag is the canonical validity indicator.
- **No sensitive data on-chain**: Only IPFS URIs are stored in the contract. Metadata lives on IPFS.

## Security Considerations

| Concern | Mitigation |
|---------|-----------|
| Unauthorized minting | `ISSUER_ROLE` enforced via OpenZeppelin AccessControl |
| Transfer bypass | `_update` hook blocks all ERC-721 transfer paths |
| Zero-address recipient | Handled by OpenZeppelin's `_safeMint` |
| Double revocation | Explicit `AlreadyRevoked` custom error |
| Admin key compromise | Future improvement: multi-sig admin |
| IPFS availability | Pinata pinning ensures persistence; future improvement: redundant gateways |

**This contract has not been formally audited. Do not use in production without a professional security review.**

## Project Structure

```
CredChain/
├── blockchain/
│   ├── contracts/
│   │   └── CredChain.sol        # Core soulbound credential contract
│   ├── scripts/
│   │   ├── deploy.js            # Deployment script
│   │   └── addIssuer.js         # Issuer authorization script
│   ├── test/
│   │   └── CredChain.js         # Hardhat test suite (9 tests)
│   ├── hardhat.config.js
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   └── Navbar.tsx       # Global navigation with wallet connection
│   │   ├── pages/
│   │   │   ├── LandingPage.tsx  # Hero, features, CTA
│   │   │   ├── Dashboard.tsx    # Issuer dashboard + minting form
│   │   │   ├── Verify.tsx       # Credential lookup entry point
│   │   │   └── CredentialDetails.tsx # Full verification + QR + revoke
│   │   ├── utils/
│   │   │   └── pinata.ts        # IPFS upload utilities
│   │   └── Web3Context.tsx      # Ethers.js wallet + contract context
│   ├── .env.example
│   └── vite.config.ts
├── README.md
├── LICENSE
└── .gitignore
```

## Known Limitations

- No formal security audit
- Single admin key (no multi-sig)
- IPFS metadata can theoretically be unpinned (use redundant gateways in production)
- No batch minting for large institutions
- Frontend contract address is hardcoded (would use env var in production)

## Future Improvements

- Issuer hierarchy (Departments under University Admin)
- Multi-signature revocation requirement
- ENS integration for human-readable issuer names
- Batch credential issuance
- Credential timeline / history view
- Issuer analytics dashboard
- Mobile-native QR scanner app
- Production IPFS redundancy (Filecoin backup)

## License

[MIT](LICENSE) © 2026 CredChain

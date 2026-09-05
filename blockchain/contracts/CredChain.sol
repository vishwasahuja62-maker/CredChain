// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

contract CredChain is ERC721, ERC721URIStorage, AccessControl {
    bytes32 public constant ISSUER_ROLE = keccak256("ISSUER_ROLE");
    uint256 private _nextTokenId;

    mapping(uint256 => bool) private _revoked;

    event CredentialIssued(uint256 indexed tokenId, address indexed recipient, string uri);
    event CredentialRevoked(uint256 indexed tokenId);
    event IssuerAdded(address indexed issuer);
    event IssuerRemoved(address indexed issuer);

    error NotAuthorized();
    error NonTransferable();
    error AlreadyRevoked();

    constructor() ERC721("CredChain", "CRED") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    function addIssuer(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(ISSUER_ROLE, account);
        emit IssuerAdded(account);
    }

    function removeIssuer(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        revokeRole(ISSUER_ROLE, account);
        emit IssuerRemoved(account);
    }

    function issueCredential(address to, string memory uri) external onlyRole(ISSUER_ROLE) returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        emit CredentialIssued(tokenId, to, uri);
        return tokenId;
    }

    function revokeCredential(uint256 tokenId) external onlyRole(ISSUER_ROLE) {
        // This reverts if the token doesn't exist
        address owner = ownerOf(tokenId);
        
        if (_revoked[tokenId]) revert AlreadyRevoked();
        
        _revoked[tokenId] = true;
        emit CredentialRevoked(tokenId);
    }

    function isRevoked(uint256 tokenId) external view returns (bool) {
        // Let's just check if it's revoked. If it doesn't exist, it will just return false, which is fine, 
        // but frontend should check ownership as well.
        return _revoked[tokenId];
    }

    // --- Overrides ---

    function _update(address to, uint256 tokenId, address auth) internal virtual override returns (address) {
        address from = _ownerOf(tokenId);
        
        // Block transfers: from must be zero address (minting)
        if (from != address(0)) {
            revert NonTransferable();
        }

        return super._update(to, tokenId, auth);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}

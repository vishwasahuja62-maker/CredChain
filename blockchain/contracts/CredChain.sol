// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";

/// @title CredChain - Soulbound Credential Verification
/// @author CredChain (HackBlox 2026)
/// @notice This contract issues non-transferable (soulbound) ERC-721 credentials.
///         Only authorized issuers can mint credentials. Credentials can be revoked.
///         All credential metadata is stored on IPFS, with only the URI stored on-chain.
/// @dev Extends ERC721URIStorage for metadata URI support and OpenZeppelin AccessControl
///      for role-based issuer management. Transfer is blocked by overriding `_update`.
contract CredChain is ERC721, ERC721URIStorage, AccessControl {

    /// @notice Role identifier for authorized credential issuers.
    bytes32 public constant ISSUER_ROLE = keccak256("ISSUER_ROLE");

    /// @dev Internal counter for minting sequential token IDs.
    uint256 private _nextTokenId;

    /// @dev Stores the revocation status of each credential by token ID.
    mapping(uint256 => bool) private _revoked;

    // ─── Events ──────────────────────────────────────────────────────────────

    /// @notice Emitted when a new credential is issued.
    event CredentialIssued(uint256 indexed tokenId, address indexed recipient, string uri);

    /// @notice Emitted when a credential is revoked.
    event CredentialRevoked(uint256 indexed tokenId);

    /// @notice Emitted when an issuer is authorized.
    event IssuerAdded(address indexed issuer);

    /// @notice Emitted when an issuer is deauthorized.
    event IssuerRemoved(address indexed issuer);

    // ─── Custom Errors ────────────────────────────────────────────────────────

    /// @notice Thrown when an unauthorized account attempts a restricted operation.
    error NotAuthorized();

    /// @notice Thrown when a transfer is attempted on a soulbound token.
    error NonTransferable();

    /// @notice Thrown when attempting to revoke an already-revoked credential.
    error AlreadyRevoked();

    // ─── Constructor ──────────────────────────────────────────────────────────

    /// @notice Deploys the CredChain contract, granting the deployer DEFAULT_ADMIN_ROLE.
    constructor() ERC721("CredChain", "CRED") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    // ─── Issuer Management ────────────────────────────────────────────────────

    /// @notice Authorizes a new issuer address to mint credentials.
    /// @dev Only callable by the contract admin (DEFAULT_ADMIN_ROLE).
    /// @param account The wallet address to grant ISSUER_ROLE to.
    function addIssuer(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        grantRole(ISSUER_ROLE, account);
        emit IssuerAdded(account);
    }

    /// @notice Removes issuer authorization from an address.
    /// @dev Only callable by the contract admin.
    /// @param account The wallet address to revoke ISSUER_ROLE from.
    function removeIssuer(address account) external onlyRole(DEFAULT_ADMIN_ROLE) {
        revokeRole(ISSUER_ROLE, account);
        emit IssuerRemoved(account);
    }

    // ─── Credential Issuance ──────────────────────────────────────────────────

    /// @notice Mints a new soulbound credential to the specified recipient.
    /// @dev Only authorized issuers can call this. The URI should point to an IPFS metadata file.
    /// @param to The recipient wallet address.
    /// @param uri The IPFS URI of the credential metadata (e.g., ipfs://QmXxx...).
    /// @return tokenId The ID of the newly minted credential token.
    function issueCredential(address to, string memory uri) external onlyRole(ISSUER_ROLE) returns (uint256) {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        emit CredentialIssued(tokenId, to, uri);
        return tokenId;
    }

    // ─── Revocation ───────────────────────────────────────────────────────────

    /// @notice Revokes an existing credential.
    /// @dev The token is NOT burned; revocation is a status flag to preserve the audit trail.
    ///      Only authorized issuers can revoke. Cannot revoke a credential that is already revoked.
    /// @param tokenId The token ID to revoke.
    function revokeCredential(uint256 tokenId) external onlyRole(ISSUER_ROLE) {
        // ownerOf reverts with ERC721NonexistentToken if token doesn't exist
        ownerOf(tokenId);

        if (_revoked[tokenId]) revert AlreadyRevoked();

        _revoked[tokenId] = true;
        emit CredentialRevoked(tokenId);
    }

    /// @notice Returns whether a credential has been revoked.
    /// @param tokenId The token ID to check.
    /// @return True if the credential has been revoked, false otherwise.
    function isRevoked(uint256 tokenId) external view returns (bool) {
        return _revoked[tokenId];
    }

    // ─── Soulbound Override ───────────────────────────────────────────────────

    /// @notice Enforces soulbound (non-transferable) behavior.
    /// @dev Overrides OpenZeppelin's internal _update hook. Reverts any transfer
    ///      where `from` is not the zero address (i.e., any transfer that is not a mint).
    function _update(address to, uint256 tokenId, address auth) internal virtual override returns (address) {
        address from = _ownerOf(tokenId);

        // Allow minting (from == address(0)), block all transfers
        if (from != address(0)) {
            revert NonTransferable();
        }

        return super._update(to, tokenId, auth);
    }

    // ─── Required Overrides ───────────────────────────────────────────────────

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

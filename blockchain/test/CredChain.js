const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("CredChain", function () {
  async function deployCredChainFixture() {
    const [owner, issuer, addr1, addr2] = await ethers.getSigners();

    const CredChain = await ethers.getContractFactory("CredChain");
    const credChain = await CredChain.deploy();

    return { credChain, owner, issuer, addr1, addr2 };
  }

  describe("Deployment", function () {
    it("Should set the right admin", async function () {
      const { credChain, owner } = await deployCredChainFixture();
      const DEFAULT_ADMIN_ROLE = await credChain.DEFAULT_ADMIN_ROLE();
      expect(await credChain.hasRole(DEFAULT_ADMIN_ROLE, owner.address)).to.be.true;
    });
  });

  describe("Issuer Management", function () {
    it("Should allow admin to add an issuer", async function () {
      const { credChain, owner, issuer } = await deployCredChainFixture();
      const ISSUER_ROLE = await credChain.ISSUER_ROLE();

      await expect(credChain.addIssuer(issuer.address))
        .to.emit(credChain, "IssuerAdded")
        .withArgs(issuer.address);

      expect(await credChain.hasRole(ISSUER_ROLE, issuer.address)).to.be.true;
    });

    it("Should not allow non-admin to add an issuer", async function () {
      const { credChain, addr1, addr2 } = await deployCredChainFixture();
      await expect(credChain.connect(addr1).addIssuer(addr2.address))
        .to.be.revertedWithCustomError(credChain, "AccessControlUnauthorizedAccount");
    });
  });

  describe("Minting and Soulbound Behavior", function () {
    it("Should allow issuer to mint a credential", async function () {
      const { credChain, owner, issuer, addr1 } = await deployCredChainFixture();
      await credChain.addIssuer(issuer.address);

      const uri = "ipfs://QmTest";
      await expect(credChain.connect(issuer).issueCredential(addr1.address, uri))
        .to.emit(credChain, "CredentialIssued")
        .withArgs(0, addr1.address, uri);

      expect(await credChain.ownerOf(0)).to.equal(addr1.address);
      expect(await credChain.tokenURI(0)).to.equal(uri);
    });

    it("Should not allow non-issuer to mint", async function () {
      const { credChain, addr1, addr2 } = await deployCredChainFixture();
      const uri = "ipfs://QmTest";
      
      await expect(credChain.connect(addr1).issueCredential(addr2.address, uri))
        .to.be.revertedWithCustomError(credChain, "AccessControlUnauthorizedAccount");
    });

    it("Should revert on transfer (Soulbound)", async function () {
      const { credChain, issuer, addr1, addr2 } = await deployCredChainFixture();
      await credChain.addIssuer(issuer.address);
      await credChain.connect(issuer).issueCredential(addr1.address, "ipfs://test");

      await expect(
        credChain.connect(addr1).transferFrom(addr1.address, addr2.address, 0)
      ).to.be.revertedWithCustomError(credChain, "NonTransferable");
    });
  });

  describe("Revocation", function () {
    it("Should allow issuer to revoke a credential", async function () {
      const { credChain, issuer, addr1 } = await deployCredChainFixture();
      await credChain.addIssuer(issuer.address);
      await credChain.connect(issuer).issueCredential(addr1.address, "ipfs://test");

      await expect(credChain.connect(issuer).revokeCredential(0))
        .to.emit(credChain, "CredentialRevoked")
        .withArgs(0);

      expect(await credChain.isRevoked(0)).to.be.true;
    });

    it("Should not allow revocation of non-existent token", async function () {
      const { credChain, issuer } = await deployCredChainFixture();
      await credChain.addIssuer(issuer.address);

      await expect(credChain.connect(issuer).revokeCredential(99))
        .to.be.revertedWithCustomError(credChain, "ERC721NonexistentToken");
    });

    it("Should not allow double revocation", async function () {
      const { credChain, issuer, addr1 } = await deployCredChainFixture();
      await credChain.addIssuer(issuer.address);
      await credChain.connect(issuer).issueCredential(addr1.address, "ipfs://test");

      await credChain.connect(issuer).revokeCredential(0);

      await expect(credChain.connect(issuer).revokeCredential(0))
        .to.be.revertedWithCustomError(credChain, "AlreadyRevoked");
    });
  });
});

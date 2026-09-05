const { ethers } = require("hardhat");

const CONTRACT_ADDRESS = "0x9961d602bc6FE437F8dff53f928c044b56569935";
const ISSUER_ADDRESS   = "0xD6Fc330A4ef559dB720047346a44700FD346ACce";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("🔑  Deployer:", deployer.address);

  const contract = await ethers.getContractAt("CredChain", CONTRACT_ADDRESS);

  // Verify the deployer holds DEFAULT_ADMIN_ROLE before proceeding
  const adminRole = await contract.DEFAULT_ADMIN_ROLE();
  const isAdmin = await contract.hasRole(adminRole, deployer.address);
  if (!isAdmin) {
    console.error("❌  Deployer does NOT hold DEFAULT_ADMIN_ROLE — cannot grant ISSUER_ROLE.");
    process.exit(1);
  }
  console.log("✅  Deployer has DEFAULT_ADMIN_ROLE");

  // Check if already an issuer
  const issuerRole = await contract.ISSUER_ROLE();
  const alreadyIssuer = await contract.hasRole(issuerRole, ISSUER_ADDRESS);
  if (alreadyIssuer) {
    console.log(`ℹ️   ${ISSUER_ADDRESS} already holds ISSUER_ROLE — nothing to do.`);
    return;
  }

  console.log(`⏳  Calling addIssuer(${ISSUER_ADDRESS}) ...`);
  const tx = await contract.addIssuer(ISSUER_ADDRESS);
  console.log("   tx hash:", tx.hash);
  const receipt = await tx.wait();
  console.log("✅  Confirmed in block", receipt.blockNumber);
  console.log(`🎉  ${ISSUER_ADDRESS} is now an authorized ISSUER on CredChain!`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});


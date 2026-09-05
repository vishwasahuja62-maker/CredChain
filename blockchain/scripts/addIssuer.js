const hre = require("hardhat");
require("dotenv").config();

async function main() {
  const CONTRACT_ADDRESS = "0x9961d602bc6FE437F8dff53f928c044b56569935";

  const CredChain = await hre.ethers.getContractFactory("CredChain");
  const credChain = CredChain.attach(CONTRACT_ADDRESS);

  const [deployer] = await hre.ethers.getSigners();
  console.log("Admin wallet:", deployer.address);

  // Self-authorize the deployer as an issuer for testing
  const tx = await credChain.addIssuer(deployer.address);
  await tx.wait();
  console.log("Issuer authorized:", deployer.address);
  console.log("Tx:", tx.hash);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

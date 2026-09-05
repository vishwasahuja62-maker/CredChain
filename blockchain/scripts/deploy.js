const hre = require("hardhat");

async function main() {
  const CredChain = await hre.ethers.getContractFactory("CredChain");
  const credChain = await CredChain.deploy();

  await credChain.waitForDeployment();

  const address = await credChain.getAddress();
  console.log(`CredChain deployed to: ${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.

const hre = require("hardhat");

async function main() {
  const LibraryContract = await hre.ethers.getContractFactory("LibraryContract");

  // Deploy the contract
  const library = await LibraryContract.deploy();

  // Wait for the contract to be deployed
  await library.deployed();

  console.log(`LibraryContract deployed to ${library.address}`);
}

// Catch any errors during deployment
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

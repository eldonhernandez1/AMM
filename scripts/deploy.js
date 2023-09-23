// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const Token = await hre.ethers.getContractFactory('Token')

  // Deploy Token 1 
  let kal = await Token.deploy('Kalina Token', 'KAL', '1000000') // 1 million tokens
  await kal.deployed()
  console.log(`Kalina Token deployed to: ${kal.address}\n`)

  // Deploy Token 2 
  let dapp = await Token.deploy('Dapp University', 'DAPP', '1000000') // 1 million tokens
  await dapp.deployed()
  console.log(`Dapp University Token deployed to: ${dapp.address}\n`)

  // Deploy AMM
  const AMM = await hre.ethers.getContractFactory('AMM')
  const amm = await AMM.deploy(kal.address, dapp.address)
  console.log(`AMM deployed to: ${amm.address}\n`)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

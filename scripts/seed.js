const hre = require("hardhat");
const { ethers } = hre;

const config = require('../src/config.json')
const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether')
}

const ether = tokens
const shares = ether

async function main() {
    // Fetch accounts
    console.log(`Fetching accounts & network \n`)
    const accounts = await ethers.getSigners()
    const deployer = accounts[0]
	  const investor1 = accounts[1]
    const investor2 = accounts[2]
    const investor3 = accounts[3]
    const investor4 = accounts[4]

    // Deploy contracts or use existing ones
    const Token = await ethers.getContractFactory('Token'); // Replace 'Token' with your contract name
    const dappAddress = config[31337].dapp.address;
    const dapp = await ethers.getContractAt('Token', dappAddress);
    
    const kalAddress = config[31337].kal.address;
    const kal = await ethers.getContractAt('Token', kalAddress);
    

    // Now you can interact with 'dapp' and 'kal' contracts
    console.log(`Dapp Token fetched ${dapp.address}\n`)
    console.log(`Kalina Token fetched ${kal.address}\n`)

    ////////////////////////////////////
    // Distribute Tokens to Investors //
    ////////////////////////////////////

    let transaction

    // Send Kalina tokens to investor 1
    transaction = await kal.connect(deployer).transfer(investor1.address, tokens(10))
    await transaction.wait()
    
    // Send Dapp tokens to investor 2
    transaction = await dapp.connect(deployer).transfer(investor2.address, tokens(10))
    await transaction.wait()
    
    // Send Kalina tokens to investor 3
    transaction = await kal.connect(deployer).transfer(investor3.address, tokens(10))
    await transaction.wait()
    
    // Send Dapp tokens to investor 4
    transaction = await dapp.connect(deployer).transfer(investor4.address, tokens(10))
    await transaction.wait()
    
    ///////////////////
    // Add liquidity //
    ///////////////////

    let amount = tokens(100)
    console.log(`Fetching AMM... \n`)

    // Fetch AMM
    const amm = await ethers.getContractAt('AMM', config[31337].amm.address)
    console.log(`AMM fetched: ${amm.address}\n`)

    transaction = await dapp.connect(deployer).approve(amm.address, amount)
    await transaction.wait()

    transaction = await kal.connect(deployer).approve(amm.address, amount)
    await transaction.wait()

    // Deployer adds liquidity
    transaction = await amm.connect(deployer).addLiquidity(amount, amount)
    await transaction.wait()
    console.log(`Adding liquidity... \n`)

    ///////////////////////////////////////
    // Investor 1 Swaps: Kalina --> Dapp //
    ///////////////////////////////////////

    console.log(`Investor 1 Swaps... \n`)

    // Investor approves all tokens
    transaction = await kal.connect(investor1).approve(amm.address, tokens(10))
    await transaction.wait()

    // Investor swaps 1 token
    transaction = await amm.connect(investor1).swapToken1(tokens(1));
    await transaction.wait()

    ///////////////////////////////////////
    // Investor 2 Swaps: Dapp --> Kalina //
    ///////////////////////////////////////

    console.log(`Investor 2 Swaps... \n`)
    // Investor approves all tokens
    transaction = await dapp.connect(investor2).approve(amm.address, tokens(10))
    await transaction.wait()

    // Investor swaps 1 token
    transaction = await amm.connect(investor2).swapToken2(tokens(1));
    await transaction.wait()


    ///////////////////////////////////////
    // Investor 3 Swaps: Kalina --> Dapp //
    ///////////////////////////////////////

    console.log(`Investor 3 Swaps... \n`)

    // Investor approves all tokens
    transaction = await kal.connect(investor3).approve(amm.address, tokens(10))
    await transaction.wait()

    // Investor swaps all 10 tokens
    transaction = await amm.connect(investor3).swapToken1(amm.address, tokens(10));
    await transaction.wait()

    ///////////////////////////////////////
    // Investor 3 Swaps: Dapp --> Kalina //
    ///////////////////////////////////////

    console.log(`Investor 4 Swaps... \n`)

    // Investor approves all tokens
    transaction = await dapp.connect(investor4).approve(amm.address, tokens(10))
    await transaction.wait()

    // Investor swaps 5 tokens
    transaction = await amm.connect(investor4).swapToken2(amm.address, tokens(5));
    await transaction.wait()

    console.log(`Finished. \n`)
 }

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

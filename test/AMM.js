const { expect } = require('chai');
const { ethers } = require('hardhat');

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

const ether = tokens

describe('AMM', () => {
  let accounts, 
      deployer,
      liquidityProvider,
      liquidityProvider2

  let token1, 
      token2, 
      token3, 
      amm

  beforeEach(async () => {
    // Setup Accounts
    accounts = await ethers.getSigners()
    deployer = accounts[0]
    liquidityProvider = accounts[1]
    liquidityProvider2 = accounts[2]

    // Deploy Token
    const Token = await ethers.getContractFactory('Token')
    token1 = await Token.deploy('Kalina', 'KAL', '1000000') // 1 Million Tokens
    token2 = await Token.deploy('USD Token', 'USD', '1000000') // 1 Million Tokens
    token3 = await Token.deploy('Dapp University', 'DAPP', '1000000') // 1 Million Tokens

    // Send tokens to liquidity provider
    let transaction = await token1.connect(deployer).transfer(liquidityProvider.address, tokens(100000))
    await transaction.wait()

    transaction = await token2.connect(deployer).transfer(liquidityProvider.address, tokens(100000))
    await transaction.wait()

    transaction = await token3.connect(deployer).transfer(liquidityProvider.address, tokens(100000))
    await transaction.wait()

    // Deploy AMM
    const AMM = await ethers.getContractFactory('AMM')
    amm = await AMM.deploy(token1.address, token2.address, token3.address)

  })

  describe('Deployment', () => {
    // const name = 'Kalina'
    // const symbol = 'KAL'
    // const decimals = '18'
    // const totalSupply = tokens('1000000')

    it('has an address', async () => {
        expect(amm.address).to.not.equal(0x0)
    })

    it('tracks Token1 address', async () => {
        expect(await amm.Token1()).to.equal(token1.address)
    })
        
    it('tracks Token2 address', async () => {
        expect(await amm.Token2()).to.equal(token2.address)
    })        
        
    it('tracks Token3 address', async () => {
        expect(await amm.Token3()).to.equal(token3.address)
    })        
 })
    describe('Swapping tokens', () => {
        let amount, transaction, result

    it('facilitates swaps', async () => {
        // Deployer approved 100k tokens

        // Deployer adds liquidity
        transaction = await amm.connect(deployer).addLiquidity(amount, amount, amount)
        await transaction.wait()

        // Check AMM Receives tokens
        expect(await token1.balanceOf(amm.address)).to.equal(amount)
        expect(await token2.balanceOf(amm.address)).to.equal(amount)
        expect(await token3.balanceOf(amm.address)).to.equal(amount)

        expect(await amm.token1Balance()).to.equal(amount)
        expect(await amm.token2Balance()).to.equal(amount)
        expect(await amm.token3Balance()).to.equal(amount)

        // Check deployer has 100 shares
        expect(await amm.shares(deployer.address)).to.equal(tokens(100)) // Use token helpers to calculate shares

        // Check pool has 100 total shares
        expect(await amm.totalShares()).to.equal(tokens(100))


        ////////////////////////////
        // LP adds more liquidity //
        ////////////////////////////

        // LP approves 50k tokens
        amount = tokens(50000)
        transaction = await token1.connect(liquidityProvider).approve(amm.address, amount)

        transaction = await token2.connect(liquidityProvider).approve(amm.address, amount)

        transaction = await token3.connect(liquidityProvider).approve(amm.address, amount)

        // Calculate token2 deposit amount
        let token2Deposit = await amm.calculateToken2Deposit(amount)

        // Calculate token3 deposit amount
        let token3Deposit = await amm.calculateToken3Deposit(amount)

        // LP adds liquidity
        transaction = await amm.connect(liquidityProvider).addLiquidity(amount, token2Deposit, token3Deposit)
        await transaction.wait()

        // LP should have 50 shares
        expect(await amm.shares(liquidityProvider.address).to.equal)(tokens(50))

        // Deployer should still have 100 shares
        expect(await amm.shares(deployer.address)).to.equal(tokens(100))

        // Pool should have 150 shares
        expect(await amm.totalShares()).to.equal(tokens(150))

    })
       
    })
})

const { expect } = require('chai');
const { ethers } = require('hardhat');

const tokens = (n) => {
  return ethers.utils.parseUnits(n.toString(), 'ether')
}

const ether = tokens

describe('AMM', () => {
  let accounts, 
      deployer,
      liquidityProvider

  let token1, 
      token2, 
      amm

  beforeEach(async () => {
    // Setup Accounts
    accounts = await ethers.getSigners()
    deployer = accounts[0]
    liquidityProvider = accounts[1]

    // Deploy Token
    const Token = await ethers.getContractFactory('Token')
    token1 = await Token.deploy('Kalina', 'KAL', '1000000') // 1 Million Tokens
    token2 = await Token.deploy('USD Token', 'USD', '1000000') // 1 Million Tokens

    // Send tokens to liquidity provider
    let transaction = await token1.connect(deployer).transfer(liquidityProvider.address, tokens(100000))
    await transaction.wait()

    transaction = await token2.connect(deployer).transfer(liquidityProvider.address, tokens(100000))
    await transaction.wait()

    // Deploy AMM
    const AMM = await ethers.getContractFactory('AMM')
    amm = await AMM.deploy(token1.address, token2.address)

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
 })
    describe('Swapping tokens', () => {
        let amount, transaction, result

    it('facilitates swaps', async () => {
        // Deployer approved 100k tokens
        amount = tokens(100000)
        transaction = await token1.connect(deployer).approve(amm.address, amount)

        amount = tokens(100000)
        transaction = await token2.connect(deployer).approve(amm.address, amount)

        // Deployer adds liquidity
        transaction = await amm.connect(deployer).addLiquidity(amount, amount)
        await transaction.wait()

        // Check AMM Receives tokens
        expect(await token1.balanceOf(amm.address)).to.equal(amount)
        expect(await token2.balanceOf(amm.address)).to.equal(amount)
    })
       
    })
})

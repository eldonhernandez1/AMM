import { useEffect, useState } from 'react'
import { Container, Row } from 'react-bootstrap'
import { ethers } from 'ethers'

// Components
import Navigation from './Navigation';
import Loading from './Loading';
import Card from './Card';

// Hero image
import Hero from '../images/kalina_AMM_hero.jpg'

// ABIs: Import your contract ABIs here
// import TOKEN_ABI from '../abis/Token.json'

// Config: Import your network config here
// import config from '../config.json';

function App() {
  const [account, setAccount] = useState(null)
  const [balance, setBalance] = useState(0)

  const [isLoading, setIsLoading] = useState(true)

  const loadBlockchainData = async () => {
    // Initiate provider
    const provider = new ethers.providers.Web3Provider(window.ethereum)

    // Fetch accounts
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    const account = ethers.utils.getAddress(accounts[0])
    setAccount(account)

    // Fetch account balance
    let balance = await provider.getBalance(account)
    balance = ethers.utils.formatUnits(balance, 18)
    setBalance(balance)

    setIsLoading(false)
  }

  useEffect(() => {
    if (isLoading) {
      loadBlockchainData()
    }
  }, [isLoading]);

  return(
    <Container>
      <Navigation account={account} />
      <Row>
        <img src={Hero} style={{ borderRadius: '15px' }} alt="KalinaSwap Hero"/>
      </Row>
      <h1 className='my-4 p-4 text-center text-warning'>Easily swap tokens</h1>
      <Card />
      {isLoading ? (
        <Loading />
        
      ) : (
        <>
          <p className='text-center text-white my-4'><strong>Your ETH Balance:</strong> {balance} ETH</p>
          <p className='text-center text-white my-4'>Edit App.js to add your code here.</p>
        </>
      )}
      
    </Container>
  )
}

export default App;

import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { Container, Row } from 'react-bootstrap'
import { ethers } from 'ethers'

// Components
import Navigation from './Navigation';
import Loading from './Loading';
import Card from './Card';

import { loadProvider, loadNetwork, loadAccount } from '../store/interactions';

// Hero image
import Hero from '../images/kalina_AMM_hero.jpg'

// ABIs: Import your contract ABIs here
// import TOKEN_ABI from '../abis/Token.json'

// Config: Import your network config here
// import config from '../config.json';

function App() {
  const dispatch = useDispatch()

  const loadBlockchainData = async () => {
    // Initiate provider
    const provider = await loadProvider(dispatch)

    const chainID = await loadNetwork(provider, dispatch)

    // Fetch accounts
    await loadAccount(dispatch)
  }

  useEffect(() => {
    loadBlockchainData()

    }
  , []);

  return(
    <Container>
      <Navigation account={'0x0...'} />
      <Row>
        <img src={Hero} style={{ borderRadius: '10px' }} alt="KalinaSwap Hero"/>
      </Row>
      <h1 className='my-4 p-4 text-center text-warning'>Easily swap tokens.</h1>
      <h2 className='my-2 text-center text-warning'>Knowing your tokens are safe and secure.</h2>
      <Card />
                <>
                <p className='text-center text-white my-4'><strong>Your ETH Balance:</strong> 0 ETH</p>
                <p className='text-center text-white my-4'>Edit App.js to add your code here.</p>
              </>
      
    </Container>
  )
}

export default App;

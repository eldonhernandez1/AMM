import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux';
import { Container, Row } from 'react-bootstrap'
import { ethers } from 'ethers'

// Components
import Navigation from './Navigation';
import Loading from './Loading';
import Card from './Card';

import {
  loadProvider,
  loadNetwork,
  loadAccount,
  loadTokens,
  loadAMM
} from '../store/interactions';

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

    // Fetch current network's chainID (e.g. Hardhat: 31337, kovan: 42)
    const chainID = await loadNetwork(provider, dispatch)

    // Reload page when network changes
    window.ethereum.on('chainChanged', () => {
      window.location.reload()
    })

    // Fetch account current account from metamask when changed
    window.ethereum.on('accountsChanged', async () => {
      await loadAccount(dispatch)
    })

    // Initiate load contracts
    await loadTokens(provider, chainID, dispatch)
    await loadAMM(provider, chainID, dispatch)
  }

  useEffect(() => {
    loadBlockchainData()

  }
    , []);

  return (
    <Container>
      <Navigation />
      <Row>
        <img src={Hero} style={{ borderRadius: '10px' }} alt="KalinaSwap Hero" />
      </Row>
      <h1 className='my-2 p-4 text-center text-warning'>Easily swap tokens...</h1>
      <h2 className='my-1 text-center text-warning'>...knowing your tokens are safe and secure.</h2>
      <Card />
      <>
        <p className='text-center text-white my-4'><strong>Your ETH Balance:</strong> 0 ETH</p>
        <p className='text-center text-white my-4'>Edit App.js to add your code here.</p>
      </>
      <Loading />
    </Container>
  )
}

export default App;

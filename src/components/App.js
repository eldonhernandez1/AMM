import { useEffect, useCallback } from 'react'
import { useDispatch } from 'react-redux';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Container, Row } from 'react-bootstrap'
// import { ethers } from 'ethers'

// Components
import Navigation from './Navigation';
import Tabs from './Tabs';
import Deposit from './Deposit';
import Swap from './Swap';
import Withdraw from './Withdraw';
import Charts from './Charts';
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

  const loadBlockchainData = useCallback(async () => {
    // Initiate provider
    const provider = await loadProvider(dispatch);

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
    
  },[dispatch]);

  useEffect(() => {
    loadBlockchainData();
  }, [loadBlockchainData]);
  

  return (
    <Container>
      
        <Navigation />
      

     
      <Row>
        <img src={Hero} style={{ borderRadius: '10px' }} alt="KalinaSwap Hero" />
      </Row>
      <h1 className='my-2 p-4 text-center text-warning'>Easily swap tokens...</h1>
      <h2 className='my-1 text-center text-warning'>...knowing your tokens are safe and secure.</h2>
      
       <HashRouter>
          <Tabs />
          <Routes>
          <Route exact path="/" element={<Swap />} />
            <Route path="/deposit" element={<Deposit />} />
            <Route exact path="/withdraw" element={<Withdraw />} />
            <Route path="/charts" element={<Charts />} />
          </Routes>
      </HashRouter>
     
     <Card />
      
    </Container>
  )
}

export default App;

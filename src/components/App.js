import { useEffect, useCallback } from 'react'
import { useDispatch } from 'react-redux';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap'
// import { ethers } from 'ethers'

// Components
import Navigation from './Navigation';
import Tabs from './Tabs';
import Deposit from './Deposit';
import Swap from './Swap';
import Withdraw from './Withdraw';
import Charts from './Charts';
import Card from './Card';
import HeroCard from './HeroCard';

import {
  loadProvider,
  loadNetwork,
  loadAccount,
  loadTokens,
  loadAMM
} from '../store/interactions';

// ABIs: Import your contract ABIs here
// import TOKEN_ABI from '../abis/Token.json'

// Config: Import your network config here
// import config from '../config.json';

function App() {
  const dispatch = useDispatch()

  const loadBlockchainData = useCallback(async () => {
    // Initiate provider
    const provider = await loadProvider(dispatch);

    // Fetch current network's chainId (e.g. Hardhat: 31337, kovan: 42)
    const chainId = await loadNetwork(provider, dispatch)

    // Reload page when network changes
    window.ethereum.on('chainChanged', () => {
      window.location.reload()
    })

    // Fetch account current account from metamask when changed
    window.ethereum.on('accountsChanged', async () => {
      await loadAccount(dispatch)
    })

    // Initiate load contracts
    await loadTokens(provider, chainId, dispatch)
    await loadAMM(provider, chainId, dispatch)
    
  },[dispatch]);

  useEffect(() => {
    loadBlockchainData();
  }, [loadBlockchainData]);
  

  return (
    <Container>
      
        <Navigation />
      

      <HeroCard />     
      
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

import { useEffect, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Container } from 'react-bootstrap';
import { Routes, Route, Outlet } from 'react-router-dom';

// Components
import Tabs from './Tabs';
import Swap from './Swap';
import Deposit from './Deposit';
import Withdraw from './Withdraw';
import Charts from './Charts';

import {
    loadProvider,
    loadNetwork,
    loadAccount,
    loadTokens,
    loadAMM
} from '../store/interactions';

import ConnectBtn from './ConnectBtn';

export function SecondPage() {
    const dispatch = useDispatch();

    const loadBlockchainData = useCallback(async () => {
        // Initiate provider
        const provider = await loadProvider(dispatch);

        // Fetch the current network's chainId (e.g. Hardhat: 31337, kovan: 42)
        const chainId = await loadNetwork(provider, dispatch);

        // Reload the page when the network changes
        window.ethereum.on('chainChanged', () => {
            window.location.reload();
        });

        // Fetch the current account from MetaMask when it changes
        window.ethereum.on('accountsChanged', async () => {
            await loadAccount(dispatch);
        });

        // Initiate loading contracts
        await loadTokens(provider, chainId, dispatch);
        await loadAMM(provider, chainId, dispatch);
    }, [dispatch]);

    useEffect(() => {
        loadBlockchainData();
    }, [loadBlockchainData]);

    return (
        <Container>
            <Tabs />
                {/* <hr /> */}
            
                <Routes>
                    <Route exact path="/second-page/" element={<Swap />} />
                    <Route path="/second-page/deposit" element={<Deposit />} />
                    <Route path="/second-page/withdraw" element={<Withdraw />} />
                    <Route path="/second-page/charts" element={<Charts />} />
                </Routes>
            <Outlet />

            <ConnectBtn />
        </Container>
    );
}

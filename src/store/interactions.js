import { ethers } from 'ethers'

import {
    setProvider,
    setNetwork,
    setAccount
} from '../store/reducers/provider';

import {
    setContracts,
    setSymbols,
    balancesLoaded
} from '../store/reducers/tokens';
import {
    setContract,
    sharesLoaded
} from '../store/reducers/amm';

import TOKEN_ABI from "../abis/Token.json";
import AMM_ABI from "../abis/AMM.json";
import config from "../config.json"

export const loadProvider = (dispatch) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    dispatch(setProvider(provider))

    return provider
}

export const loadNetwork = async (provider, dispatch) => {
    const { chainID } = await provider.getNetwork()
    dispatch(setNetwork(chainID))

    return chainID
}

export const loadAccount = async (dispatch) => {
    // Fetch accounts
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    const account = ethers.utils.getAddress(accounts[0])
    dispatch(setAccount(account))

    return account
}
//////////////////////
/// LOAD CONTRACTS ///
//////////////////////

export const loadTokens = async (provider, chainID, dispatch) => {
    const kal = new ethers.Contract(config[chainID].kal.address, TOKEN_ABI, provider)
    const dapp = new ethers.Contract(config[chainID].dapp.address, TOKEN_ABI, provider)

    dispatch(setContracts([kal, dapp]))
    dispatch(setSymbols([await kal.symbol(), await dapp.symbol()]))
}
export const loadAMM = async (provider, chainID, dispatch) => {
    const amm = new ethers.Contract(config[chainID].amm.address, AMM_ABI, provider)

    dispatch(setContract(amm))
    return amm
}

//////////////////////////////
/// LOAD BALANCES & SHARES ///
//////////////////////////////

export const loadBalances = async (tokens, account, dispatch, amm) => {
    const balance1 = await tokens[0].balanceOf(account)
    const balance2 = await tokens[1].balanceOf(account)

    dispatch(balancesLoaded([
        ethers.utils.formatUnits(balance1.toString(), 'ether'),
        ethers.utils.formatUnits(balance2.toString(), 'ether')
    ]))
    const shares = await amm.shares(account)
    dispatch(sharesLoaded(ethers.utils.formatUnits(shares.toString(), 'ether')))

}

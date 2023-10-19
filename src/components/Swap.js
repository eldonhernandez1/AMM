import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Button from 'react-bootstrap/Button';
import Row from 'react-bootstrap/Row';
import Spinner from 'react-bootstrap/Spinner';
import { ethers } from 'ethers';

import Alert from './Alert';

import {
  swap,
  loadBalances
} from '../store/interactions';

const Swap = () => {
  const [inputToken, setInputToken] = useState(null);
  const [outputToken, setOutputToken] = useState(null);
  const [inputAmount, setInputAmount] = useState(0);
  const [outputAmount, setOutputAmount] = useState(0);

  const [price, setPrice] = useState(0);

  const [showAlert, setShowAlert] = useState(false);

  const provider = useSelector(state => state.provider.connection);
  const account = useSelector(state => state.provider.account);

  const tokens = useSelector(state => state.tokens.contracts);
  const symbols = useSelector(state => state.tokens.symbols);
  const balances = useSelector(state => state.tokens.balances);

  const amm = useSelector(state => state.amm.contract);
  const isSwapping = useSelector(state => state.amm.swapping.isSwapping);
  const isSuccess = useSelector(state => state.amm.swapping.isSuccess);
  const transactionHash = useSelector(state => state.amm.swapping.transactionHash);

  const dispatch = useDispatch();

  const inputHandler = (e) => {
    if (!inputToken || !outputToken) {
      window.alert('Please select a token');
      return;
    }

    if (inputToken === 'KAL' && amm.calculateToken1Swap) {
      const _token1Amount = ethers.utils.parseUnits(e.target.value, 'ether');
      amm.calculateToken1Swap(_token1Amount)
        .then(result => {
          const _token2Amount = ethers.utils.formatUnits(result.toString(), 'ether');
          setOutputAmount(_token2Amount.toString());
        })
        .catch(error => {
          console.error('Error calculating token 1 swap:', error);
        });
    } else if (inputToken === 'DAPP' && amm.calculateToken2Swap) {
      const _token2Amount = ethers.utils.parseUnits(e.target.value, 'ether');
      amm.calculateToken2Swap(_token2Amount)
        .then(result => {
          const _token1Amount = ethers.utils.formatUnits(result.toString(), 'ether');
          setOutputAmount(_token1Amount.toString());
        })
        .catch(error => {
          console.error('Error calculating token 2 swap:', error);
        });
    }
  };

  const getPrice = async () => {
    if (inputToken === outputToken) {
      setPrice(0);
      return;
    }

    try {
      let token1Balance, token2Balance;

      if (inputToken === 'KAL') {
        [token1Balance, token2Balance] = await Promise.all([
          amm.token1Balance(),
          amm.token2Balance(),
        ]);
      } else {
        [token2Balance, token1Balance] = await Promise.all([
          amm.token2Balance(),
          amm.token1Balance(),
        ]);
      }

      setPrice(token2Balance / token1Balance);
    } catch (error) {
      console.error('Error fetching price:', error);
    }
  };

  const swapHandler = async (e) => {
    e.preventDefault();

    setShowAlert(false);

    if (inputToken === outputToken) {
      window.alert('Invalid Token Pair');
      return;
    }

    const _inputAmount = ethers.utils.parseUnits(inputAmount, 'ether');

    try {
      // Swap token depending upon which one we're doing...
      if (inputToken === "KAL") {
        await swap(provider, amm, tokens[0], inputToken, _inputAmount, dispatch);
      } else {
        await swap(provider, amm, tokens[1], inputToken, _inputAmount, dispatch);
      }

      await loadBalances(amm, tokens, account, dispatch);
      await getPrice();

      setShowAlert(true);
    } catch (error) {
      console.error('Error during swap or loading balances:', error);
    }
  };

  useEffect(() => {
    if (inputToken && outputToken && amm) {
      fetchPrice();
    }
  }, [inputToken, outputToken, amm]);

  return (
    <div>
      {/* Your component JSX remains the same */}
    </div>
  );
};

export default Swap;

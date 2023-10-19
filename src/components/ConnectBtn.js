import { useSelector, useDispatch } from 'react-redux';
import Navbar from 'react-bootstrap/Navbar';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Blockies from 'react-blockies';

import { loadAccount, loadBalances } from '../store/interactions';
import config from '../config.json';
// import amm from '../store/reducers/amm';

const ConnectBtn = () => {
  const chainId = useSelector(state => state.provider.chainId)
  const account = useSelector(state => state.provider.account)
  const tokens = useSelector(state => state.tokens.contracts)
  const amm = useSelector(state => state.amm.contract)

  const dispatch = useDispatch()

  const connectHandler = async () => {
    const account = await loadAccount(dispatch)
    await loadBalances(amm, tokens, account, dispatch)
  }

  const networkHandler = async (e) => {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId: e.target.value}],
    })
    console.log(chainId)
  }
  return (
    // Navigation Bar
    <Navbar expand='lg' style={{ maxWidth: '300px', margin: '0 auto' }}>
      
      <Navbar.Toggle aria-controls='nav' />
      <Navbar.Collapse id='nav' className="justify-content-end">
        <div className='d-flex justify-content-end'>
          <Form.Select
            aria-label="Network Selector"
            value={config[chainId] ? `0x${chainId.toString(16)}` : `0`}
            onChange={networkHandler}
            style={{ maxWidth: '200px', marginRight: '20px' }}
           >
            <option value="0" disabled>Select Network</option> 
            <option value="0x7A69">Localhost</option> 
            <option value="0xaa36a7">Sepolia</option> 
          </Form.Select>
          {account ? (
          <Navbar.Text className='d-flex align-items-center text-white'>
            {account.slice(0, 5) + '...' + account.slice(38, 42)}
            <Blockies
              seed={account}
              size={10}
              scale={3}
              color="#2187D0"
              bgColor="#F1F2F9"
              spotColor="#767F92"
              className="identicon mx-2"
            />
          </Navbar.Text>
        ) : (
          <Button className='mx-3' onClick={connectHandler}>Connect</Button>
        )}
        </div>
      
        
      </Navbar.Collapse>
    </Navbar>
  );
}

export default ConnectBtn;

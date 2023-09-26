import Navbar from 'react-bootstrap/Navbar';
import logo from '../logo.png';

// Function to shorten account
const shortenAccount = (account, chars = 3) => {
  if (account) {
    return `${account.substring(0, chars)}...${account.substring(42 - chars)}`;
  }
  // Return a default value if account is not defined
  return "Account Not Available";
};

const Navigation = ({ account }) => {
  return (
    // Navigation Bar
    <Navbar className='my-3'>
      <img
        alt="logo"
        src={logo}
        width="40"
        height="40"
        className="d-inline-block align-top mx-3"
      />
      <Navbar.Brand href="#" className='text-white'>KalinaSwap</Navbar.Brand>
      <Navbar.Collapse className="justify-content-end">
        <Navbar.Text className='text-white'>
        {shortenAccount(account)}
        </Navbar.Text>
      </Navbar.Collapse>
    </Navbar>
  );
}

export default Navigation;

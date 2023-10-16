import Nav from 'react-bootstrap/Nav';
import { LinkContainer } from 'react-router-bootstrap';
const Tabs = () => {
    
    return (
        <Nav className="text-white justify-content-center my-4" variant='pills' defaultActiveKey="/">
            <LinkContainer to="/">
                <Nav.Link className='text-white'>Swap</Nav.Link>
            </LinkContainer>

            <LinkContainer to="/deposit">
                <Nav.Link className="text-white">Deposit</Nav.Link>
            </LinkContainer>

            <LinkContainer to="/withdraw">
                <Nav.Link className="text-white">Withdraw</Nav.Link>
            </LinkContainer>

            <LinkContainer to="/charts">
                <Nav.Link className="text-white">Charts</Nav.Link>
            </LinkContainer>
        </Nav>
    );
}


export default Tabs;

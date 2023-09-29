import { Row, Col } from 'react-bootstrap';
import { Card as BootstrapCard } from 'react-bootstrap';

// Import your images
import SwapImage from '../images/Swap-01.jpg';
import WalletImage from '../images/Wallet-01.jpg';
import CommunityImage from '../images/Community-03.jpg';

function BasicExample() {
  return (
    <Row>
      <Col>
        <BootstrapCard style={{ width: '18rem' }} className='mx-auto my-4'>
          <BootstrapCard.Img variant="top" src={SwapImage} />
          <BootstrapCard.Body>
            <BootstrapCard.Title>Simple token swapping</BootstrapCard.Title>
            <BootstrapCard.Text>
            With just a few easy steps, your token swap is moments away from completion.
            </BootstrapCard.Text>
          </BootstrapCard.Body>
        </BootstrapCard>
      </Col>
      <Col>
        <BootstrapCard style={{ width: '18rem' }} className='mx-auto my-4'>
          <BootstrapCard.Img variant="top" src={CommunityImage} />
          <BootstrapCard.Body>
            <BootstrapCard.Title>Join the Community</BootstrapCard.Title>
            <BootstrapCard.Text>
            Be a part of the vibrant community that drives success by shaping the future.
            </BootstrapCard.Text>
          </BootstrapCard.Body>
        </BootstrapCard>
      </Col>
      <Col>
        <BootstrapCard style={{ width: '18rem' }} className='mx-auto my-4'>
          <BootstrapCard.Img variant="top" src={WalletImage} />
          <BootstrapCard.Body>
            <BootstrapCard.Title>Swap thousands of tokens</BootstrapCard.Title>
            <BootstrapCard.Text>
              With the constant expansion of the Crypto ecosystem. You can swap your favorite tokens for new ones.
            </BootstrapCard.Text>
          </BootstrapCard.Body>
        </BootstrapCard>
      </Col>
    </Row>
  );
}

export default BasicExample;

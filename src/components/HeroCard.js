import { Container, Row, Col } from 'react-bootstrap';
import ThemeProvider from 'react-bootstrap/ThemeProvider'

// Hero image
import HeroSwap from '../images/kalina_AMM_hero-swap.jpg'

function BasicExample() {
  return (
  <ThemeProvider
  breakpoints={['xxxl', 'xxl', 'xl', 'lg', 'md', 'sm', 'xs', 'xxs']}
  minBreakpoint="xxs">  
    <Container>
        <Row>

            <Col className='pt-4 sm'>
                <h1 className='pt-4 dosis-font' style={{ fontSize: '100px',  color: '#ffffff', lineHeight: '110px', fontWeight:'bold' }}>Easily Swap Tokens</h1>
                <h2 className='pt-4 onest-font' style={{ fontSize: '55px',  color: '#ffffff', lineHeight: '60px' }}>Safely exchange tokens on the most user-friendly DApp.</h2>
            </Col>

            <Col className='sm'>
              <Row>
                <img src={HeroSwap} style={{ borderRadius: '50px' }} alt="KalinaSwap" className='m-4' />
              </Row>
            </Col>
        </Row>
    </Container>
  </ThemeProvider>
  );
}

export default BasicExample;

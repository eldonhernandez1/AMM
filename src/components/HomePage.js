import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import ThemeProvider from 'react-bootstrap/ThemeProvider';
import Button from 'react-bootstrap/Button';
import { Link } from 'react-router-dom';

// Hero image
import HeroSwap from '../images/kalina_AMM_hero-swap.jpg';

// Cards below the hero image
import Card from './Card';

function HomePage() {
  return (
    <ThemeProvider breakpoints={['xxxl', 'xxl', 'xl', 'lg', 'md', 'sm', 'xs', 'xxs']} minBreakpoint="xxs">
      <Container>
        <Row>
          <Col className='pt-4'sm={{ order: 1 }}>
            <h1 className='pt-4 dosis-font' style={{ fontSize: '4.5rem', color: '#ffffff', lineHeight: '1.2', fontWeight: 'bold' }}>Easily Swap Tokens</h1>
            <h2 className='pt-4 onest-font' style={{ fontSize: '2.5rem', color: '#ffffff', lineHeight: '1.3' }}>Safely exchange tokens on the most user-friendly DApp.</h2>
        <Link to="/swap">
          <Button variant="info" className='p-4 my-5' style={{fontSize: '2rem'}}>Start swapping</Button>
        </Link>
          </Col>
          <Col className='sm' sm={{ order: 2 }}>
            <Row>
              <img src={HeroSwap} style={{ borderRadius: '50px' }} alt="KalinaSwap" className='m-4' />
            </Row>
          </Col>
        </Row>
        <Card />
      </Container>
    </ThemeProvider>
  );
}

export default HomePage;

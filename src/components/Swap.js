import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import Card from "react-bootstrap/Card";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Dropdown from "react-bootstrap/Dropdown";
import DropdownButton from "react-bootstrap/DropdownButton";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import { FormControl } from "react-bootstrap";
import DropdownItem from "react-bootstrap/esm/DropdownItem";

const Swap = () => {
    const [inputToken, setInputToken] = useState(null)
    const [outputToken, setOutputToken] = useState(null)
    const [price, setPrice] = useState(0)
    const account = useSelector(state => state.provider.account)
    const tokens = useSelector(state => state.tokens.contracts)
    const amm = useSelector(state => state.amm.contract)
    
    const getPrice = async () => {
        if (inputToken === outputToken) {
            setPrice(0)
            return
        }
        if (inputToken === 'KAL') {
            setPrice(await amm.token1Balance() / await amm.token2Balance())
        } else {
            setPrice(await amm.token2Balance() / await amm.token1Balance())
        }
        
    }

    useEffect(() => {
        if(inputToken && outputToken) {
            getPrice()
        }
    }, [inputToken, outputToken]);

    return (
        <div className="text-white">
            <Card style={{ maxWidth: '450px' }} className="mx-auto px-4 text-black">
                {account ? (
                    <Form style={{ maxWidth: '450px', margin: '50px auto' }}>
                        <Row className="my-3">
                            <div className="d-flex justify-content-between">
                                <Form.Label style={{ fontWeight: 'bold' }}>
                                    Input:
                                </Form.Label>
                                <Form.Text muted>
                                    Balance:
                                </Form.Text>
                            </div>
                            <InputGroup>
                                <FormControl
                                 type="number"
                                 placeholder="0.0"
                                 min="0.0"
                                 step="any"
                                 disabled={false}
                                />
                               <DropdownButton
                                variant="outline-secondary"
                                title={inputToken ? inputToken : "Select Token"}
                            >
                                <Dropdown.Item onClick={(e) => setInputToken(e.target.innerHTML)}>KAL</Dropdown.Item>
                                <Dropdown.Item onClick={(e) => setInputToken(e.target.innerHTML)}>DAPP</Dropdown.Item>
                            </DropdownButton>
                         </InputGroup>
                        </Row>
                        <Row className="my-4">
                            <div className="d-flex justify-content-between">
                                <Form.Label style={{ fontWeight: 'bold' }}>
                                    Output:
                                </Form.Label>
                                <Form.Text muted>
                                    Balance:
                                </Form.Text>
                            </div>
                            <InputGroup>
                                <FormControl
                                 type="number"
                                 placeholder="0.0"
                                 step="any"
                                 disabled
                                />
                               <DropdownButton
                                variant="outline-secondary"
                                title={outputToken ? outputToken : "Select Token"}
                            >
                                <Dropdown.Item onClick={(e) => setOutputToken(e.target.innerHTML)}>KAL</Dropdown.Item>
                                <Dropdown.Item onClick={(e) => setOutputToken(e.target.innerHTML)}>DAPP</Dropdown.Item>
                            </DropdownButton>
                         </InputGroup>
                        </Row>
                        <Row className="my-3">
                            <Button type="submit">Swap</Button>
                            <Form.Text muted>
                                Exchange Rate: {price}
                            </Form.Text>
                        </Row>
                    </Form>
                ) : (
                    <p
                        className="d-flex justify-content-center align-items-center"
                        style={{ height: '300px', fontSize: '20px' }}
                    >Connect your wallet before swapping tokens.</p>
                )}
            </Card>
        </div>
    );
}

export default Swap;

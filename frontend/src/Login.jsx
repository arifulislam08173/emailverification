import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert, Modal } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import Signup from './Signup';
import { URL } from './config';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [errMsg, setErrMsg] = useState('');
    const [showSignupModal, setShowSignupModal] = useState(false);

    const loginHandleBtn = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${URL}/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });

            if (response.ok) {
                const data = await response.json();
                console.log('User successfully logged in:', data.message);
            } else {
                const error = await response.json();
                setErrMsg(error.error);
                console.log('User not valid:', error);
            }
        } catch (error) {
            console.error('Error during login:', error);
            setErrMsg('Failed to connect to server');
        }
    };

    return (
        <>
            <Container className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
                <Row>
                    <Col md={12}>
                        <h2 className="text-center mb-4">Log in</h2>
                        <Form onSubmit={loginHandleBtn}>
                            <Form.Group controlId="formEmail" className="mb-3">
                                <Form.Control type="email" placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} />
                            </Form.Group>
                            <Form.Group controlId="formPassword" className="mb-3">
                                <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                            </Form.Group>
                            {errMsg && <Alert variant="danger">{errMsg}</Alert>}
                            <Button variant="primary" type="submit" className="w-100 mb-2">Enter</Button>
                            <hr />
                            <Button variant="secondary" type="button" className="w-100" onClick={() => setShowSignupModal(true)}>Create Account</Button>
                        </Form>
                    </Col>
                </Row>
            </Container>
            <Modal show={showSignupModal} onHide={() => setShowSignupModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Sign up</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Signup onClose={() => setShowSignupModal(false)} />
                </Modal.Body>
            </Modal>
        </>
    );
};

export default Login;

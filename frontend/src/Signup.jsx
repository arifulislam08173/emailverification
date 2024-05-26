import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import { URL } from './config';

const Signup = ({ onClose }) => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        mobile: '',
        password: '',
        city: '',
        dob: '',
        gender: ''
    });

    const [otp, setOtp] = useState('');
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [userEmail, setUserEmail] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${URL}/signup`, formData);
            console.log('OTP sent:', response.data);
            setIsOtpSent(true);
            setErrorMessage('');
            setUserEmail(formData.email);
        } catch (error) {
            console.error('Error sending OTP:', error);
            if (error.response && error.response.data) {
                setErrorMessage(error.response.data.message);
            }
        }
    };

    const verifyOtp = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${URL}/verify-otp`, { ...formData, otp });
            console.log('OTP verified and user created:', response.data);
            setIsOtpSent(false);
            onClose();
        } catch (error) {
            console.error('Error verifying OTP:', error);
            if (error.response && error.response.data) {
                setErrorMessage(error.response.data.message);
            }
        }
    };

    return (
        <>
            {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
            {!isOtpSent ? (
                <Form onSubmit={handleSignup}>
                    <Form.Group controlId="formFirstName" className="mb-3">
                        <Form.Control type="text" placeholder="First Name" name="firstName" value={formData.firstName} onChange={handleInputChange} />
                    </Form.Group>
                    <Form.Group controlId="formLastName" className="mb-3">
                        <Form.Control type="text" placeholder="Last Name" name="lastName" value={formData.lastName} onChange={handleInputChange} />
                    </Form.Group>
                    <Form.Group controlId="formEmail" className="mb-3">
                        <Form.Control type="email" placeholder="Email" name="email" value={formData.email} onChange={handleInputChange} />
                    </Form.Group>
                    <Form.Group controlId="formMobile" className="mb-3">
                        <Form.Control type="tel" placeholder="Mobile No" name="mobile" value={formData.mobile} onChange={handleInputChange} />
                    </Form.Group>
                    <Form.Group controlId="formPassword" className="mb-3">
                        <Form.Control type="password" placeholder="Password" name="password" value={formData.password} onChange={handleInputChange} />
                    </Form.Group>
                    <Form.Group controlId="formCity" className="mb-3">
                        <Form.Control as="select" name="city" value={formData.city} onChange={handleInputChange}>
                            <option value="">Select your City</option>
                            <option value="Dhaka">Dhaka</option>
                            <option value="Chattogram">Chattogram</option>
                            <option value="Barishal">Barishal</option>
                            <option value="Sylhet">Sylhet</option>
                            <option value="Rajshahi">Rajshahi</option>
                            <option value="Khulna">Khulna</option>
                            <option value="Rangpur">Rangpur</option>
                            <option value="Maymensingh">Maymensingh</option>
                        </Form.Control>
                    </Form.Group>
                    <Form.Group controlId="formDob" className="mb-3">
                        <Form.Label>Date of Birth</Form.Label>
                        <Form.Control type="date" name="dob" value={formData.dob} onChange={handleInputChange} />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Gender</Form.Label>
                        <div>
                            <Form.Check inline type="radio" label="Male" name="gender" value="male" checked={formData.gender === 'male'} onChange={handleInputChange} />
                            <Form.Check inline type="radio" label="Female" name="gender" value="female" checked={formData.gender === 'female'} onChange={handleInputChange} />
                        </div>
                    </Form.Group>
                    <Button variant="primary" type="submit" className="w-100">Sign Up</Button>
                </Form>
            ) : (
                <Form onSubmit={verifyOtp}>
                    <Alert variant="info">OTP sent to {userEmail}</Alert>
                    <Form.Group controlId="formOtp" className="mb-3">
                        <Form.Control type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
                    </Form.Group>
                    <Button variant="primary" type="submit" className="w-100">Verify OTP</Button>
                </Form>
            )}
        </>
    );
};

export default Signup;

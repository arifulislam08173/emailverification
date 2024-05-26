const User = require('../Model/user');
const nodemailer = require('nodemailer');
const otps = {};


const checkEmailAndSendOTP = async (req, res) => {
    const { email, firstName } = req.body;

    try {
        const user = await User.findOne({ where: { email } });

        if (user) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        const otp = Math.floor(1000 + Math.random() * 9000);
        otps[email] = otp;

        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL,
                pass: process.env.PASSWORD
            }
        });

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: "Email Verification Code",
            html: `<h2>Hello, ${firstName}</h2><p>Your OTP Code: ${otp}</p>`
        };

        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.error("Error sending email:", error);
                res.status(500).json({ error: 'Failed to send email' });
            } else {
                console.log("Email sent:", info.response);
                res.status(200).json({ message: 'OTP sent successfully' });
            }
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

const verifyOTPAndCreateUser = async (req, res) => {
    const { email, otp, password, firstName, lastName, mobile, city, dob, gender } = req.body;

    if (otps[email] && otps[email] === parseInt(otp)) {
        try {
            const newUser = await User.create({
                FirstName: firstName,
                LastName: lastName,
                email,
                mobile,
                password,
                city,
                dob,
                gender,
                status: 'verified',
            });

            delete otps[email];
            res.status(201).json(newUser);
        } catch (error) {
            console.error("Error creating user:", error);
            res.status(500).json({ error: 'Failed to create user' });
        }
    } else {
        res.status(400).json({ message: 'Invalid OTP' });
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ where: { email } });

        if (!user) {
            console.log('User not found with email:', email);
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        console.log('User found:', user);

        if (user.password !== password) {
            console.log('Invalid password for user:', email);
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        res.status(200).json({ message: 'Login successful' });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = { checkEmailAndSendOTP, verifyOTPAndCreateUser, login };
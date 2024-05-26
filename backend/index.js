const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { checkEmailAndSendOTP, verifyOTPAndCreateUser, login } = require('./Controller/usercontroller');
require('dotenv').config();

const app = express();

app.use(cors({
  origin: 'http://localhost:3001'
}));
app.use(bodyParser.json());

app.post('/signup', checkEmailAndSendOTP);
app.post('/verify-otp', verifyOTPAndCreateUser);

app.post('/login', login);

app.listen(4213, () => {
  console.log("Server is running on port 4213");
});

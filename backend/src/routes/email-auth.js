// Example in-memory store
import bcrypt from 'bcrypt'
import { Router } from 'express';
import { sendgridApiKey } from '../env.js';
import sgMail from '@sendgrid/mail';
import { createUser } from '../database/account.js';
import 'dotenv/config.js' 
sgMail.setApiKey(sendgridApiKey);

const router = Router();
export default router

const saltRounds = 10;



let otpStore = {};

router.post('/request-otp', async (req, res) => {
    const { email } = req.body;
    if (!email) {
        return res.status(400).json({error: "Email is required"});
    }
    // Generate a 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = Date.now() + 300000; // 5 minutes from now

    // Store OTP and expiry
    otpStore[email] = { otp, expiry };

    // Send OTP via email
    const msg = {
        to: email,
        from: 'Gophermatch@gmail.com', 
        subject: 'Your OTP for account verification',
        text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
    };

    try {
        await sgMail.send(msg);
        res.status(200).json({message: "OTP sent"});
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Failed to send OTP"});
    }
});

router.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;
    const storedOtp = otpStore[email];

    if (!storedOtp || storedOtp.otp !== otp || storedOtp.expiry < Date.now()) {
        return res.status(400).json({error: "Invalid or expired OTP"});
    }

    // Assuming createUser is a function that creates the user in your database
    try {
        const hashpass = await bcrypt.hash(req.body.password, saltRounds)
        const user = await createUser(email, hashpass); // Ensure password hashing happens inside createUser
        delete otpStore[email]; // Clean up OTP
        res.status(201).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({error: "Account creation failed"});
    }
});


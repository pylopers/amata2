import validator from "validator";
import bcrypt from "bcrypt"
import jwt from 'jsonwebtoken'
import userModel from "../models/userModel.js";
import passport from "../middleware/passport.js";
import { OAuth2Client } from "google-auth-library";
import crypto from 'crypto';
import sendMail from '../utils/sendMail.js';

const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);

const createToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET)
}

// Route for user login
const loginUser = async (req, res) => {
    try {

        const { email, password } = req.body;

        const user = await userModel.findOne({ email });

        if (!user) {
            return res.json({ success: false, message: "User doesn't exists" })
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (isMatch) {

            const token = createToken(user._id)
            res.json({ success: true, token })

        }
        else {
            res.json({ success: false, message: 'Invalid credentials' })
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}


const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await userModel.findOne({ email });
    if (!user)
      return res.status(404).json({ success: false, message: 'User not found' });

    const otp = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    user.otp = { code: otp, expiresAt };
    await user.save();

    await sendMail(email, 'Your OTP Code', `Your OTP is ${otp}. It will expire in 10 minutes.`);

    res.json({ success: true, message: 'OTP sent to your email' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Failed to send OTP' });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const user = await userModel.findOne({ email });
    if (
      !user ||
      !user.otp ||
      user.otp.code !== otp ||
      user.otp.expiresAt < new Date()
    ) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
    }

    res.json({ success: true, message: 'OTP verified' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'OTP verification failed' });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    const user = await userModel.findOne({ email });
    if (!user)
      return res.status(404).json({ success: false, message: 'User not found' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    user.password = hashedPassword;
    user.otp = undefined;
    await user.save();

    res.json({ success: true, message: 'Password reset successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Password reset failed' });
  }
};


const registerUser = async (req, res) => {
  try {
    const { name, email, phone, dob, password } = req.body;

    // check existing email or phone
    if (await userModel.findOne({ email }))
      return res.json({ success: false, message: "Email already in use" });
    if (await userModel.findOne({ phone }))
      return res.json({ success: false, message: "Phone already in use" });

    // validate email, phone, dob, password
    if (!validator.isEmail(email))
      return res.json({ success: false, message: "Invalid email" });
    if (!validator.isMobilePhone(phone, "any"))
      return res.json({ success: false, message: "Invalid phone number" });
    if (!dob || isNaN(new Date(dob).getTime()))
      return res.json({ success: false, message: "Invalid date of birth" });
    if (password.length < 8)
      return res.json({ success: false, message: "Password too short" });

    // hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // save user
    const newUser = new userModel({
      name, email, phone, dob, password: hashedPassword
    });
    const user = await newUser.save();

    // create token
    const token = createToken(user._id);
    res.json({ success: true, token });

  } catch (error) {
    console.error(error);
    res.json({ success: false, message: error.message });
  }
};


// Add a new saved address
const saveAddress = async (req, res) => {
    try {
        const { address } = req.body;
        const user = await userModel.findById(req.body.userId);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        user.savedAddresses.push(address);
        await user.save();

        res.json({ success: true, message: "Address saved successfully", savedAddresses: user.savedAddresses });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};

// Get saved addresses
const getSavedAddresses = async (req, res) => {
    try {
        const user = await userModel.findById(req.body.userId);
        if (!user) return res.status(404).json({ success: false, message: "User not found" });

        res.json({ success: true, savedAddresses: user.savedAddresses });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
};


// Route for admin login
const adminLogin = async (req, res) => {
    try {
        
        const {email,password} = req.body

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email+password,process.env.JWT_SECRET);
            res.json({success:true,token})
        } else {
            res.json({success:false,message:"Invalid credentials"})
        }

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message })
    }
}

// in controllers/userController.js
const googleFrontEndLogin = async (req, res) => {
  try {
    console.log("googleFrontEndLogin body:", req.body);
    const { credential } = req.body;

    if (!credential) {
      return res
        .status(400)
        .json({ success: false, message: "No credential provided" });
    }

    // Verify the Google ID token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const email = payload.email;
    const name = payload.name;
    const googleId = payload.sub;

    // Find existing user
    let existingUser = await userModel.findOne({ email });

    // If user doesn't exist, create a new one
    if (!existingUser) {
      existingUser = await userModel.create({
        name,
        email,
        authProvider: "google",
        googleId,
        // phone, dob, password are optional for google users per your schema
      });
    }

    // Issue your own JWT
    const token = createToken(existingUser._id);
    res.json({ success: true, token });
  } catch (err) {
    console.error("googleFrontEndLogin error:", err);
    res
      .status(400)
      .json({ success: false, message: "Invalid Google credential" });
  }
};

export { loginUser, registerUser, adminLogin, saveAddress, getSavedAddresses,googleFrontEndLogin , resetPassword, sendOtp, verifyOtp }
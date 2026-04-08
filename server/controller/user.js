import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import User from '../model/user.js'
import { configDotenv } from 'dotenv';
import ExternalConnection from '../model/connection.js';

configDotenv()

const JWT_SECRET = process.env.JWT_SECRET || 'portal6756';
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);


export const signupUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(404).json({ error: 'User details Name ,Email, Password required' });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });
    await newUser.save();
    res.status(201).json({ message: 'User registered successfully', userId: newUser._id });
  } catch (error) {
    console.error('Error while creating user:', error.message);
    res.status(500).json({ error: 'Failed to register user' });
  }
};


export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true in production
      sameSite: "lax",
    })
    res.status(200).json({
      message: 'Login successful',
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (error) {
    console.error('Error while logging in user:', error.message);
    res.status(500).json({ error: 'Failed to login user' });
  }
};


// ------------------- GOOGLE SIGNIN -------------------
export const googleSignIn = async (req, res) => {
  try {
    const { tokenId } = req.body; // frontend sends Google ID token

    // 1️⃣ Verify token with Google
    const ticket = await client.verifyIdToken({
      idToken: tokenId,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name, sub: googleId } = payload;

    let user = await User.findOne({ email });

    if (!user) {
      user = new User({
        name,
        email,
        password: googleId,
        role: 'user',
      });
      await user.save();
    }

    const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '1h' });
    res.cookie("token", token, {
      httpOnly: true,
      secure: false, // true in production
      sameSite: "lax",
    })
    res.status(200).json({
      message: 'Google sign-in successful',
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error('Google Sign-In error:', error.message);
    res.status(500).json({ error: 'Failed to sign in with Google' });
  }
};


export const getUserData=async(req,res)=>{
   try {
    const user = await User.findById(req.user.userId).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });
    const connections=await ExternalConnection.findOne({
      userId:user.id
    }).select('freshdesk')
    res.json({ user , connections });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
}
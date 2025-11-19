import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import middleware from '../middleware/middleware.js';

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const user = await User.findOne({ email });

    if (user) {
      return res.status(401).json({ success: false, message: "user already exists" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashPassword
    })

    await newUser.save();

    return res.status(200).json({ success: true, message: "Account Created!" });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Error in creating account" });
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ success: false, message: "user not exists" });
    }

    const checkPassword = await bcrypt.compare(password, user.password);

    if (!checkPassword) {
      return res.status(401).json({ success: false, message: "Wrong Credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "5h" });

    return res.status(200).json({ success: true, message: "Logged in Successfully!", token, user: { name: user.name } });

  } catch (error) {
    return res.status(500).json({ success: false, message: "Error in login server" });
  }
})

router.get('/verify', middleware, async (req, res) => {
  res.status(200).json({ success: true, user: req.user })
})

export default router;
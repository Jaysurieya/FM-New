const User = require('../models/mongooseSchema');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;
    // Check if user already exists
    const existingUser = await User.findOne({email});
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create new user
    const newUser = new User({
      email,
      password: hashedPassword,
      rememberMe,
    });

    await newUser.save();

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: 'JWT secret not configured' });
    }
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({ message: 'User created successfully', token });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};  

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 2. Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ message: 'JWT secret not configured' });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({ message: 'Login successful', token });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
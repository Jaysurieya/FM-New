const User = require('../models/mongooseSchema');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const admin = require("../config/firebaseAdmin");

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


exports.googleLogin = async (req, res) => {
  try {
    const { token } = req.body;

    // 0️⃣ Validate input
    if (!token) {
      return res.status(400).json({
        success: false,
        message: "Firebase token missing",
      });
    }

    // 1️⃣ Verify Firebase ID token (trust check)
    const decoded = await admin.auth().verifyIdToken(token);

    const firebaseUid = decoded.uid;
    const email = decoded.email;

    if (!firebaseUid || !email) {
      return res.status(400).json({
        success: false,
        message: "Invalid Firebase token data",
      });
    }

    // 2️⃣ Check if user already exists using firebaseUid
    let user = await User.findOne({ firebaseUid });
    let isNewUser = false;

    // 3️⃣ If user not found by UID, check by email (edge case)
    if (!user) {
      const emailUser = await User.findOne({ email });

      if (emailUser) {
        // Link existing email user with Google
        emailUser.firebaseUid = firebaseUid;
        emailUser.provider = "google";
        emailUser.lastLogin = new Date();
        user = await emailUser.save();
      } else {
        // 4️⃣ First-time Google user → create user
        user = await User.create({
          email,
          firebaseUid,
          provider: "google",
          lastLogin: new Date(),
          createdAt: new Date(),
        });
        isNewUser = true;
      }
    } else {
      // Existing Google user
      user.lastLogin = new Date();
      await user.save();
    }

    // 5️⃣ Ensure JWT secret exists
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({
        success: false,
        message: "JWT secret not configured",
      });
    }

    // 6️⃣ Generate JWT (app session token)
    const jwtToken = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    // 7️⃣ Send structured response
    return res.status(200).json({
      success: true,
      isNewUser,
      token: jwtToken,
      userId: user._id,
    });

  } catch (error) {
    console.error("Google login error:", error);

    return res.status(401).json({
      success: false,
      message: "Invalid or expired Firebase token",
    });
  }
};

exports.emailAuth = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password required",
      });
    }

    let user = await User.findOne({ email });
    let isNewUser = false;

    // 🔹 CASE 1: User does NOT exist → SIGN UP
    if (!user) {
      const hashedPassword = await bcrypt.hash(password, 12);

      user = await User.create({
        email,
        password: hashedPassword,
        provider: "local",
        createdAt: new Date(),
      });

      isNewUser = true;
    }
    // 🔹 CASE 2: User exists → LOGIN
    else {
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Invalid credentials",
        });
      }
    }

    // 🔐 Create JWT
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      success: true,
      isNewUser,
      token,
    });

  } catch (error) {
    console.error("Email auth error:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

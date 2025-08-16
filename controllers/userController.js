
const User = require('../models/User');
const Registration = require('../models/Registration');


// Middleware for token authentication
exports.authMiddleware = (req, res, next) => {
  const header = req.headers.authorization;
  if (!header) return res.status(401).json({ error: 'No token provided' });

  const token = header.split(' ')[1];
  try {
    const data = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    req.user = data;
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Get profile
exports.getProfile = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json(user);
};

// Get wallet
exports.getWallet = async (req, res) => {
  const user = await User.findById(req.user.id);
  res.json(user.wallet);
};

// Get all users
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Create new user
exports.createUser = async (req, res) => {
  try {
    const user = new User(req.body);
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Register new user
exports.registerUser = async (req, res) => {
  try {
    const { name, phoneNumber, address, email, gender, dob, altMobile } = req.body;

    // Check if phoneNumber or email already exists
    const existingPhone = await Registration.findOne({ phoneNumber });
    if (existingPhone) {
      return res.status(400).json({ error: 'Phone number already registered' });
    }
    const existingEmail = await Registration.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const registration = new Registration({
      name,
      phoneNumber
    });

    await registration.save();
    res.status(201).json({ message: 'Registration successful', data: registration });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};



// const User = require('../models/User');
// const jwt = require('jsonwebtoken');

// // Middleware for token authentication
// exports.authMiddleware = (req, res, next) => {
//   const header = req.headers.authorization;
//   if (!header) return res.status(401).json({ error: 'No token provided' });

//   const token = header.split(' ')[1];
//   try {
//     const data = jwt.verify(token, process.env.JWT_SECRET || 'secret');
//     req.user = data;
//     next();
//   } catch (err) {
//     res.status(401).json({ error: 'Invalid token' });
//   }
// };

// // Get profile
// exports.getProfile = async (req, res) => {
//   const user = await User.findById(req.user.id);
//   res.json(user);
// };

// // Get wallet
// exports.getWallet = async (req, res) => {
//   const user = await User.findById(req.user.id);
//   res.json(user.wallet);
// };

// // Get all users
// exports.getUsers = async (req, res) => {
//   try {
//     const users = await User.find();
//     res.json(users);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// };

// // Create new user
// exports.createUser = async (req, res) => {
//   try {
//     const user = new User(req.body);
//     await user.save();
//     res.status(201).json(user);
//   } catch (err) {
//     res.status(400).json({ error: err.message });
//   }
// };

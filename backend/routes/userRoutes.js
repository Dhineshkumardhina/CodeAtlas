const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const requireDatabase = require('../middleware/requireDatabase');

// Register routes
router.post('/register', requireDatabase, registerUser);
router.post('/login', requireDatabase, loginUser);
router.get('/me', requireDatabase, protect, getMe);

module.exports = router;

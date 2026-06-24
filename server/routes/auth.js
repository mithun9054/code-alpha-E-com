const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/verifyToken');
const requireAdmin = require('../middleware/requireAdmin');

const { registerUser, loginUser, getMe } = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', verifyToken, getMe);

// Placeholder for /api/auth/admin endpoints (if needed later)
router.post('/admin', verifyToken, requireAdmin, (req, res) => {
  return res.status(501).json({ success: false, message: 'Not implemented: auth admin endpoint', data: null });
});

module.exports = router;


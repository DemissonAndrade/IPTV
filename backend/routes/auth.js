const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');
const { validate, schemas } = require('../middleware/validation');

// @route   POST /api/auth/register
// @desc    Registrar novo usuário
// @access  Public
router.post('/register', validate(schemas.userRegister), authController.register);

// @route   POST /api/auth/login
// @desc    Login de usuário
// @access  Public
router.post('/login', validate(schemas.userLogin), authController.login);

// @route   GET /api/auth/verify
// @desc    Verificar token JWT
// @access  Private
router.get('/verify', authenticateToken, authController.verifyToken);

// @route   POST /api/auth/logout
// @desc    Logout de usuário
// @access  Private
router.post('/logout', authenticateToken, authController.logout);

module.exports = router;


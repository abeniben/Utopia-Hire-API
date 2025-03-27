const express = require('express');
const { register, login } = require('../controllers/authController');
const router = express.Router();
const { authLimiter } = require('../middleware/rateLimiter');
const {validateUserRegistration, handleValidationErrors} = require('../utils/validators')

router.post('/register',  authLimiter , validateUserRegistration, handleValidationErrors, register);
router.post('/login', authLimiter, login);


module.exports = router;

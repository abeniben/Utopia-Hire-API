const express = require('express');
const router = express.Router();
const {getProfile, updateProfile, updatePassword, deleteProfile} = require('../controllers/employerController');
const {logout} = require('../controllers/authController')
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const { validateEmployerProfile, validatePasswordUpdate ,handleValidationErrors } = require("../utils/validators");

// Protected routes - Employer profile
router.get('/profile', auth, authorize(['employer']), getProfile);
router.put('/profile', auth, authorize(['employer']), validateEmployerProfile , handleValidationErrors, updateProfile);
router.put('/update-password', auth, authorize(['employer']), validatePasswordUpdate, handleValidationErrors, updatePassword);
router.post("/logout", auth, authorize(["employer"]), logout)
router.delete('/profile', auth, authorize(['employer']), deleteProfile);



module.exports = router;
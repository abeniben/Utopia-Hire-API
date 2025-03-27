const express = require("express")
const auth = require("../middleware/auth")
const authorize = require("../middleware/authorize")
const router = express.Router()
const {getProfile, updateProfile, updatePassword, deleteProfile} = require("../controllers/jobSeekerController")
const {logout} = require('../controllers/authController')
const { validateJobSeekerProfile, validatePasswordUpdate ,handleValidationErrors } = require("../utils/validators");

//Protected - Job Seeker profile
router.get('/profile', auth, authorize(['jobseeker']), getProfile);
router.put('/profile', auth, authorize(['jobseeker']), validateJobSeekerProfile , handleValidationErrors, updateProfile);
router.put('/update-password', auth, authorize(['jobseeker']), validatePasswordUpdate, handleValidationErrors, updatePassword);
router.post("/logout", auth, authorize(["jobseeker"]), logout);
router.delete('/profile', auth, authorize(['jobseeker']), deleteProfile);




module.exports = router;



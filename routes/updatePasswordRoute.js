const express = require("express")
const auth = require("../middleware/auth")
const router = express.Router()
const {updatePassword} = require('../controllers/updatePasswordController');


// router.put('/update-password', auth, updatePassword);
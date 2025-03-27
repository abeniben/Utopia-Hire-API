const express = require('express');
const { createApplication, getMyApplications, getApplicationById,
        updateApplication, deleteApplication, getJobApplications, updateApplicationStatus
      } = require('../controllers/applicationController');
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize');
const upload = require('../config/multerConfig');
const { validateJobApplication, validateJobApplicationUpdate, handleValidationErrors } = require("../utils/validators");
const router = express.Router();


// Job Seeker Routes

router.get('/my-applications', auth, authorize(['jobseeker']), getMyApplications);
router.get('/:id', auth, authorize(['jobseeker']), getApplicationById);
router.put('/:id', auth, authorize(['jobseeker']), upload.single('resume'), validateJobApplicationUpdate,handleValidationErrors, updateApplication);
router.delete('/:id', auth, authorize(['jobseeker']), deleteApplication);

// Employer Routes
router.put('/:id/status', auth, authorize(['employer']), updateApplicationStatus);

module.exports = router;
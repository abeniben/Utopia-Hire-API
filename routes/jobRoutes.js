const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const authorize = require('../middleware/authorize')
const upload = require('../config/multerConfig');
const { createJob, getJobs, getJobById, updateJob, deleteJob, getMyJobs, 
        createApplication, getJobApplications } = require('../controllers/jobController');
const {jobPostLimiter} = require('../middleware/rateLimiter');
const {validateJob, validateJobUpdate, validateJobApplication ,handleValidationErrors} = require('../utils/validators')


router.get('/employer/myjobs', auth, authorize(['employer']), getMyJobs) 
router.post('/', auth, authorize(['employer']), validateJob , handleValidationErrors , jobPostLimiter, createJob);
router.post('/apply', auth, authorize(['jobseeker']), upload.single('resume'), validateJobApplication , handleValidationErrors, createApplication);        
router.get('/', auth, getJobs); //Public
router.get('/:id',auth,getJobById); //Public
router.put('/:id', auth, authorize(['employer']), validateJobUpdate, handleValidationErrors, jobPostLimiter, updateJob);      
router.delete('/:id',auth, authorize(['employer']), deleteJob);    
router.get('/:id/applications', auth, authorize(['employer']), getJobApplications);

module.exports = router;
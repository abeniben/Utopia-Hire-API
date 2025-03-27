const express = require('express');
const router = express.Router();
const {searchJobs} = require('../controllers/searchController');
const { searchLimiter } = require('../middleware/rateLimiter');


//Search jobs
router.get('/jobs', searchLimiter , searchJobs);

module.exports = router;
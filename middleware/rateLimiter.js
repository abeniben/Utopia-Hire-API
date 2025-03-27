const rateLimit = require("express-rate-limit");                    //Tested - works well

// Rate limiter for authentication endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: "Too many login attempts, please try again after 15 minutes",
});

// Rate limiter for job posting endpoints
const jobPostLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 requests per windowMs
  message: "Too many job postings, please try again after 1 hour",
});

// Rate limiter for search endpoints
const searchLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 100, // Limit each IP to 100 requests per windowMs
  message: "Too many search requests, please try again after 1 hour",
});

module.exports = { authLimiter, jobPostLimiter, searchLimiter };


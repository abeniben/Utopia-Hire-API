const { body, validationResult } = require("express-validator");

// For job creation
const validateJob = [                           //-> works well
  body("title")
    .notEmpty().withMessage("Title is required")
    .isLength({min:3}).withMessage('Job title must be at leaast 3 characters long'),
  body("description")
    .notEmpty().withMessage("Description is required")
    .isLength({ min: 20 }).withMessage("Description must be at least 20 characters long"),
  body("location")
    .notEmpty().withMessage("Location is required")
    .isLength({min:10}).withMessage('Location must be at leaast 10 characters long'),
  body("salary")
    .isNumeric()
    .withMessage("Salary must be a number"),
];

// Validation For job update
const validateJobUpdate = [                           //-> works well
  body("title")
    .optional()
    .notEmpty().withMessage("Title is required")
    .isLength({min:3}).withMessage('Job title must be at leaast 3 characters long'),
  body("description")
    .optional()
    .notEmpty().withMessage("Description is required")
    .isLength({ min: 20 }).withMessage("Description must be at least 20 characters long"),
  body("location")
    .optional()
    .notEmpty().withMessage("Location is required")
    .isLength({min:10}).withMessage('Location must be at leaast 10 characters long'),
  body("salary")
    .optional()
    .isNumeric()
    .withMessage("Salary must be a number"),
];

// For user registration                          ->  works well
const validateUserRegistration = [
  body("email").isEmail().withMessage("Invalid email"),
  body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters long"),
  body("name")
    .notEmpty().withMessage("Name is required")
    .isLength({min:5}).withMessage('Name must be at leaast 5 characters long'),
  body("role")
    .notEmpty()
    .withMessage("Role is required")
    .custom((value) => {
        const validRoles = ["jobseeker", "employer"];
        if (!validRoles.includes(value.toLowerCase())) {
          throw new Error("Role must be either 'job seeker' or 'employer'");
        }
        return true;
    }),
];


// For job application                      -> works well
const validateJobApplication = [                         
    body("jobId").notEmpty().withMessage("Job ID is required"),
    body('resume')
    .custom((value, { req }) => {
      const file = req.file;

      if (!file) {
        throw new Error("Resume file is required.");
      }

      if (file) {
        const isPdf = file.mimetype === 'application/pdf';
        if (!isPdf) {
          throw new Error("Applications are accepted in pdf format only.");
        }
      }
      return true;
    })
];

const validateJobApplicationUpdate = [    //-> works well
    body('resume')
      .custom((value, { req }) => {
        const file = req.file;
        console.log('Uploaded file:', file);

        if (file) {
          const isPdf = file.mimetype === 'application/pdf';
          if (!isPdf) {
            console.log('Invalid file type:', file.mimetype);
            throw new Error("Applications are accepted in pdf format only.");
          }
        }
        return true;
      })

]
  
  // For employer profile update
const validateEmployerProfile = [                   //-> works well
    body("companyName")
        .optional()
        .notEmpty().withMessage("Company name is required")
        .isLength({min:5}).withMessage('Company name must be at leaast 5 characters long'),
    body("email")
        .optional().isEmail().withMessage("Invalid email"),
];

//For jobseeker profile 
const validateJobSeekerProfile = [                   //-> works well
  body("name")
      .optional()
      .notEmpty().withMessage("Name is required")
      .isLength({min:5}).withMessage('Name must be at least 5 characters long'),
  body("email")
      .optional().isEmail().withMessage("Invalid email"),
];


//Generic password update validator

const validatePasswordUpdate = [                   //-> works well
  body("newPassword").isLength({ min: 8 }).withMessage("Password must be at least 8 characters long")
];
  
  // Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    console.log('Validation errors:', errors.array());
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map(error => error.msg);
      return res.status(400).json({ errors: errorMessages });
    }
    next();
  };
  
module.exports = {
    validateJob,
    validateJobUpdate,
    validateUserRegistration,
    validateJobApplication,
    validateJobApplicationUpdate,
    validateEmployerProfile,
    validateJobSeekerProfile,
    validatePasswordUpdate,
    handleValidationErrors,
};


const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { where } = require('sequelize');
const JobSeeker = require('../models/jobSeekerModel');
const Employer = require('../models/employerModel')

// Register a new job seeker                -> Works well
exports.register = async(req, res) => {
  try {
      const {name, email, password, role} = req.body;

      const hashedPass = await bcrypt.hash(password, 10);

      if(role === 'employer'){
          const employer = await Employer.create({companyName:name, email, password:hashedPass})
          res.status(201).json(employer)
      } else if(role === 'jobseeker'){
          const jobseeker = await JobSeeker.create({name,email, password:hashedPass})
          res.status(201).json(jobseeker);
      } else{
          res.status(400).json({error: 'Invalid role'});
      }
  } catch(error){ 
      res.status(500).json({ error: error.message });
  }

};

// Login job seeker                         -> works well
exports.login = async(req, res) =>{
  try{
      const {email, password, role} =  req.body;

      console.log('Login Request:', { email, role });

      let user;

      if(role === 'employer'){
          user = await Employer.findOne({ where : { email } });
      } else if(role === 'jobseeker'){
          user = await JobSeeker.findOne({ where : { email } });
      } else {
          return res.status(400).json({error:"Invalid role!"})
      }

      if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      console.log('Stored Hashed Password:', user.password);
      console.log('Password Valid:', isPasswordValid); 

      if(!isPasswordValid){
          return res.status(401).json({error:"Invalid Credentials"})
      }

      const token =jwt.sign({id:user.id, role}, process.env.JWT_SECRET, {expiresIn:'24h'})
      
      res.header('Authorization', `Bearer ${token}`);


      res.json({token})


  } catch(error){
      console.error('Login Error:', error); 
      res.status(500).json({ error: error.message });
  }
} 


//Logout
exports.logout = async (req, res) => {
    try {
      res.status(200).json({ message: "Logged out successfully." });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

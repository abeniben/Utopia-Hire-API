const { Op, Sequelize } = require("sequelize");
const Job = require('../models/jobModel');
const Application = require('../models/applicationModel');
const JobSeeker = require('../models/jobSeekerModel');
const Employer = require("../models/employerModel");
const { sendApplicationConfirmation } = require('../services/emailService');


exports.createJob = async(req, res) => {            //-> works well
    try{
        const newJob = req.body
        const employerId = req.user.id

        const job = await Job.create({...newJob,  EmployerId:employerId});

        res.status(201).json({job});

    } catch(error){
        res.status(500).json({error: error.message})
    }
}


exports.getJobs = async(req, res) => {          //-> works well
    try {
        const { page = 1, limit = 10, location, minSalary, maxSalary, title } = req.query;
    
        
        const filter = {};

        if (location) filter.location = location;
        if (minSalary) filter.salary = { [Op.gte]: parseFloat(minSalary) };
        if (maxSalary) {
          filter.salary = filter.salary || {};
          filter.salary[Op.lte] = parseFloat(maxSalary);
        }
        
        if (title && typeof title === "string" && title.trim() !== "") {
            filter.title = { [Op.like]: `%${title}%` };
          }
    
        const offset = (page - 1) * limit;
    
        // Fetch jobs with filtering and pagination
        const jobs = await Job.findAndCountAll({
          where: filter,
          limit: parseInt(limit),
          offset: offset,
          include: [{ model: Employer , attributes: ["id", "companyName", "email"]}],
        });
    

        const totalPages = Math.ceil(jobs.count / limit);
    
        res.status(200).json({
          totalJobs: jobs.count,
          totalPages,
          currentPage: parseInt(page),
          jobs: jobs.rows,
        });

      } catch (error) {
        console.error("Get All Jobs Error:", error);
        res.status(500).json({ error: error.message });
      }
};




exports.getMyJobs = async (req, res) =>{         //-> works well

    try{
        
        const employerId = req.user.id;
        
        if (!employerId) {
            return res.status(400).json({ error: "Employer ID is missing or invalid." });
        }
        console.log("Employer ID:", employerId);
        
        const jobs = await Job.findAll({ where: { EmployerId: employerId} });

        if(jobs.length === 0){
           return res.status(404).json({error: "No Jobs found!"});
        }
        res.status(200).json(jobs);

    } catch(error){
        console.error("Error in getMyJobs:", error);
        res.status(500).json({error:error.message})
    }
}



exports.getJobById = async(req, res) => {       //-> works well
    try{
        const jobId = req.params.id;
        const employerId = req.user.id;
        console.log("EmployerId: ", employerId)
        const job = await Job.findOne({
            where:{id:jobId, EmployerId:employerId}, 
        })

        if(!job)  return res.status(404).json({error: "Job not found or Unauthorized!"})
        
        res.status(200).json(job)
    } catch(error){
        res.status(500).json({ error: error.message })
    }
}


exports.updateJob = async (req, res) =>{            //-> works well
   try{
        const jobId = req.params.id             //Get the job id
        const employerId =  req.user.id         // Get employers by id
        const updates = req.body                //Get the job updates

        const job = await Job.findOne({
            where:{id: jobId, EmployerId:employerId},
        })   //Get the job to be updated from the database

        if (!job) return res.status(404).json({ error: 'Job not found or Unauthorized!' });

        await job.update(updates)               //Update the existing job with the new data

        res.json(job)
   } catch(error){
        res.status(500).json({ error: error.message })
    }

}


exports.deleteJob = async (req, res) =>{        //-> works well
    try{
        const jobId = req.params.id;
        const employerId = req.user.id;
        const job = await Job.findOne({
            where:{id:jobId, EmployerId:employerId},
        })
        
        if(!job)  return res.status(404).json({error: "Job not found or Unauthorized!"})
        await job.destroy()
        res.status(204).send()
        
    } catch(error){
        res.status(500).json({ error: error.message })
    }
}

exports.createApplication = async(req, res) =>{     //-> Works well
  try {
    const jobSeekerId = req.user.id;
    const jobId = req.body.jobId;
    const resumeUrl = req.file.path;   //Cloudinary URL

    // Get job details for the email
    const job = await Job.findByPk(jobId);
    if (!job) {
      return res.status(404).json({ error: "Job not found" });
    }

    // Get job seeker details
    const jobSeeker = await JobSeeker.findByPk(jobSeekerId, {
      attributes: { exclude: ['password'] }
    });

    const application = await Application.create({ 
      JobId: jobId,       
      JobSeekerId: jobSeekerId,
      resume: resumeUrl,
    });

    // Send confirmation email
    await sendApplicationConfirmation(
      jobSeeker.email,
      jobSeeker.name,
      job.title
    );
    
    res.status(201).json(application);

  } catch(error){
    console.error('Create Application Error:', error);
    res.status(500).json({ error: error.message });
  }
}

exports.getJobApplications = async(req, res) =>{            //-> works well
    try {
      const jobId = req.params.id
      const employerId = req.user.id
      const { page = 1, limit = 10, status } = req.query;
  
      // Debugging logs
        console.log("Job ID:", jobId);
        console.log("Employer ID:", employerId);

      const job = await Job.findOne(
        {where: {id:jobId, EmployerId:employerId}}
      )
      
  
      if (!job) {
        return res.status(404).json({ error: 'Job not found or unauthorized' });
      }
      
      const filter = {JobId: jobId};
      if(status) filter.status = status;

      const offset = (page - 1) * limit;

      const applications = await Application.findAndCountAll({
        where:filter,
        limit: parseInt(limit),
        offset:offset,
        include:[{model:JobSeeker,  attributes: ["id", "name", "email"]}]   //Select fields not to expose sensitive data
      })
  
      const totalPages = Math.ceil(applications.count / limit);

      res.status(200).json({
        totalApplications:applications.count,
        totalPages,
        currentPage:parseInt(page),
        applications:applications.rows,
      });
    } catch(error){
      console.error('Get Job Applications Error:', error);
      res.status(500).json({ error: "Something went wrong. Please try again."});
    }
  }

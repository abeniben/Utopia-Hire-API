const Application = require('../models/applicationModel');
const Job = require('../models/jobModel')
const JobSeeker = require('../models/jobSeekerModel');
const { sendApplicationStatusEmail } = require('../services/emailService');


exports.getMyApplications = async(req, res)=>{      //-> works well

    try{
        const jobSeekerId = req.user.id;
        const applications = await Application.findAll({where: { JobSeekerId: jobSeekerId}});
        res.status(200).json(applications);

    } catch (error) {
        res.status(500).json({ error: error.message });
      }
};


exports.getApplicationById = async(req, res) =>{      //-> works well
  try{
      const applicationId = req.params.id
      const jobSeekerId = req.user.id
      const application = await Application.findOne({
        where:{id:applicationId, JobSeekerId: jobSeekerId},
        include: [{model: JobSeeker}]
      });

      if(!application) {
          return res.status(404).json({error: "Application not found!"})
      }
      res.status(200).json(application)

  } catch (error) {
      res.status(500).json({ error: error.message });
  }
};





exports.updateApplication = async (req, res) => {     //-> works well
  try {
    const applicationId = req.params.id;
    const jobSeekerId = req.user.id; // Get job seeker ID from the token

    const application = await Application.findOne({
      where: { id: applicationId, JobSeekerId: jobSeekerId },
    });

    if (!application) {
      return res.status(404).json({ error: 'Application not found or unauthorized' });
    }

    // Get the new resume file path from Multer
    const newResumePath = req.file.path;

    await application.update({ resume: newResumePath });

    res.json(application);
  } catch (error) {
    console.error('Update Application Error:', error); 
    res.status(500).json({ error: error.message });
  }
};



exports.deleteApplication = async(req, res) =>{       //-> works well
  try {
    const applicationId = req.params.id;
    const jobSeekerId = req.user.id;

    const application = await Application.findOne({
      where:{id: applicationId, JobSeekerId: jobSeekerId}
  })

    if(!application) {
      return res.status(404).json({error: "Application not found!"})
    }

    await application.destroy();
    res.status(204).send();

  } catch(error){
    res.status(500).json({ error: error.message });
  }
}



exports.updateApplicationStatus = async(req, res) =>{       //-> works well
  try {
    const applicationId = req.params.id;
    const {status} = req.body;
    const employerId = req.user.id;

    if (!status) {  
      return res.status(400).json({ error: "Status is required." });
    }

    const allowedStatuses = ["pending", "accepted", "rejected"];
    if (!allowedStatuses.includes(status.toLowerCase())) {
      return res.status(400).json({ error: "Invalid status value. Status can only be of value 'accepted', 'rejected' or 'pending' " });
    }

    const application = await Application.findOne({
      where: { id: applicationId},
      include: [{ model: Job,
                  where: { EmployerId: employerId },
                  attributes:['id','title']
                 },
                 {
                  model: JobSeeker, 
                  attributes: ['id', 'name', 'email']
                 }
               ],
    });
    
    if (!application) {
      return res.status(404).json({ error: 'Application not found or unauthorized' });
    }
    
    await application.update({ status });

     // Send email notification to the job seeker
     await sendApplicationStatusEmail(application.JobSeeker.email, application.JobSeeker.name ,application.Job.title, status);

    res.status(200).json({message: "Application status updated successfully", 
                          application: {
                              id: application.id,
                              status: application.status,
                              jobTitle: application.Job.title,
                              jobSeekerName: application.JobSeeker.name
                           }
    });

  } catch(error){
    console.error("Update Application Status Error:", error);
    res.status(500).json({ error: "Something went wrong. Please try again." });
  }
}
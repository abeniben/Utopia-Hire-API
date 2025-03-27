const bcrypt = require('bcrypt')
const JobSeeker = require('../models/jobSeekerModel')
const Application = require('../models/applicationModel')


exports.getProfile = async(req, res) =>{                    //-> Works well
    try{
        const jobSeekerId = req.user.id;


        const jobSeeker = await JobSeeker.findByPk( jobSeekerId, {
            attributes: { exclude: ["password"]},
        });

        if(!jobSeeker){
            return res.status(404).json({error:"Job Seeker not found."})
        }

        res.status(200).json(jobSeeker);

    } catch(error){
         res.status(500).json({error: "Something went wrong."})
    }

}





exports.updateProfile = async (req, res) => {           //-> works well
    try {
      const jobSeekerId = req.user.id;
      console.log("Job seekers is:", req.user);

      const jobSeeker = await JobSeeker.findByPk(jobSeekerId);
  
      if (!jobSeeker) {
        return res.status(404).json({ error: "JobSeeker not found." });
      }
  
      // Allowed fields to update (prevent sensitive fields from being updated)
      const allowedFields = ["name", "email"]; // Use the correct field name
      const updatedData = Object.keys(req.body)
        .filter((key) => allowedFields.includes(key))
        .reduce((obj, key) => {
          obj[key] = req.body[key];
          return obj;
        }, {});
  
      // Ensure there's something to update
      if (Object.keys(updatedData).length === 0) {
        return res.status(400).json({ error: "No valid fields to update." });
      }
  
      await jobSeeker.update(updatedData, { validate: true });
  
      res.status(200).json({ message: "Profile updated successfully.", jobSeeker });
    } catch (error) {
      console.error("Update Profile Error:", error);
  
      // Handle validation errors
      if (error.name === "SequelizeValidationError") {
        return res.status(400).json({ error: error.errors.map((e) => e.message) });
      }
  
      res.status(500).json({ error: error.message }); 
    }
};




exports.deleteProfile = async(req, res) =>{           // -> works well
    try{
        const jobSeekerId = req.user.id;
        const jobSeeker = await JobSeeker.findByPk(jobSeekerId);

        if (!jobSeeker) {
            return res.status(404).json({ error: "Job Seeker not found." });
        }

        // Delete related applications first
        await Application.destroy({ where: { JobSeekerId: jobSeekerId } });

        await jobSeeker.destroy();
        res.status(204).send();

    } catch(error) {
        return res.status(500).json({error: error.message})
    }
}




exports.updatePassword = async (req, res) => {          //-> works well
    try {
      const jobSeekerId = req.user.id;          
      const { oldPassword, newPassword } = req.body;
  

      const jobSeeker = await JobSeeker.findByPk(jobSeekerId); 
      if (!jobSeeker) {
        return res.status(404).json({ error: "JobSeeker not found." });
      }
  
      
      const isMatch = await bcrypt.compare(oldPassword, jobSeeker.password);

      if (!isMatch) {
        return res.status(400).json({ error: "Old password is incorrect." });
      }
  
      // Hash new password 
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
  
      //  Update password
      await jobSeeker.update({ password: hashedPassword });
  
      // Invalidate old tokens (Optional - Implement token revocation)
      // Example: store a "tokenVersion" in the database and increment it
      //await user.update({ tokenVersion: user.tokenVersion + 1 });
  
      res.status(200).json({ message: "Password updated successfully." });
    } catch (error) {
      console.error("Password Update Error:", error);
      res.status(500).json({ error: error.message });
    }
};

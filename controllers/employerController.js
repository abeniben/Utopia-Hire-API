const bcrypt = require("bcrypt");
const Employer = require("../models/employerModel");


exports.getProfile = async(req, res) =>{                // -> works well

    try{
        const employerId = req.user.id;


        const employer = await Employer.findByPk( employerId, {
            attributes: { exclude: ["password"]},
        });

        if(!employer){
            return res.status(404).json({error:"Employer not found."})
        }

        res.status(200).json(employer);

    } catch(error){
         res.status(500).json({error: "Something went wrong."})
    }
}


exports.updateProfile = async (req, res) => {           //-> works well
    try {
      const employerId = req.user.id;
  
      const employer = await Employer.findByPk(employerId);
  
      if (!employer) {
        return res.status(404).json({ error: "Employer not found." });
      }
  
      // Allowed fields to update (prevent sensitive fields from being updated)
      const allowedFields = ["companyName", "email"]; // Use the correct field name
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
  
      await employer.update(updatedData, { validate: true });
  
      res.status(200).json({ message: "Profile updated successfully.", employer });
    } catch (error) {
      console.error("Update Profile Error:", error);
  
      // Handle validation errors
      if (error.name === "SequelizeValidationError") {
        return res.status(400).json({ error: error.errors.map((e) => e.message) });
      }
  
      res.status(500).json({ error: error.message }); 
    }
};




exports.deleteProfile = async(req, res) =>{                       // -> works well
    try{
        const employerId = req.user.id;
        const employer = await Employer.findByPk(employerId);

        if (!employer) {
            return res.status(404).json({ error: "Employer not found." });
        }

        await employer.destroy();
        res.status(204).send();

    } catch(error) {
        return res.status(500).json({error: error.message})
    }
}




exports.updatePassword = async (req, res) => {                  //-> works well
    try {
      const employerId = req.user.id;          
      const { oldPassword, newPassword } = req.body;
  

      const employer = await Employer.findByPk(employerId); 
      if (!employer) {
        return res.status(404).json({ error: "Employer not found." });
      }
  
      
      const isMatch = await bcrypt.compare(oldPassword, employer.password);
      if (!isMatch) {
        return res.status(400).json({ error: "Old password is incorrect." });
      }
  
      // Hash new password 
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
  
      // 4️⃣ Update password
      await employer.update({ password: hashedPassword });
  
      // 5️⃣ Invalidate old tokens (Optional - Implement token revocation)
      // Example: store a "tokenVersion" in the database and increment it
      //await user.update({ tokenVersion: user.tokenVersion + 1 });
  
      res.status(200).json({ message: "Password updated successfully." });
    } catch (error) {
      console.error("Password Update Error:", error);
      res.status(500).json({ error: error.message });
    }
};
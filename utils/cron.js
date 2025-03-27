const cron = require("node-cron");
const { sendDailyDigestEmail } = require("../services/emailService");
const Employer = require("../models/employerModel");
const Job = require('../models/jobModel');
const Application = require('../models/applicationModel');

console.log("Cron job file loaded!");


cron.schedule("09 02 * * *", async () => {          //To be tested
  console.log("Cron job executed at:", new Date());
  // Run at 9:00 AM every day
  try {
    const employers = await Employer.findAll();

    for (const employer of employers) {
      const jobs = await Job.findAll({ where: { EmployerId: employer.id } });

      for (const job of jobs) {
        const applications = await Application.findAll({
          where: { JobId: job.id, status: "pending" },
        });

        if (applications.length > 0) {
          console.log(`Sending email to ${employer.email} for ${job.title}`);
          await sendDailyDigestEmail(employer.email, job.title, applications.length);
        }
      }
    }
  } catch (error) {
    console.error("Error sending daily digest emails:", error);
  }
});
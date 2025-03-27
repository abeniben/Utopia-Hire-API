const sendEmail = require("../config/resend");










// TEMPLATE FUNCTIONS


const applicationSubmittedTemplate = (name, jobTitle, companyName = "Utopia Hire") => {
  return {
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Application Submitted: ${jobTitle}</title>
        <style>
          body { font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; padding-bottom: 20px; border-bottom: 1px solid #eee; margin-bottom: 30px; }
          .logo { max-width: 150px; }
          .status-box { background-color: #3498db; color: white; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0; }
          .job-title { font-size: 20px; font-weight: bold; margin-bottom: 10px; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #777; text-align: center; }
        </style>
      </head>
      <body>
        <div class="header">
          <img src="https://res.cloudinary.com/dzbepyf6i/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1743005029/Hire_Utopia_2_ekqwdu.png" alt="${companyName} Logo" class="logo">
        </div>
        
        <h2>Hi ${name},</h2>
        
        <p>Thank you for applying for:</p>
        
        <div class="job-title">${jobTitle}</div>
        
        <div class="status-box">
          <h3>Your application has been received and is under review.</h3>
        </div>
        
        <p>Our team will carefully review your qualifications and get back to you soon. Typically, you can expect to hear back within 5-7 business days.</p>
        
        <p>You can check the status of your application at any time through your dashboard.</p>
        
        <div class="footer">
          <p>${companyName} Team</p>
          <p>© ${new Date().getFullYear()} ${companyName}. All rights reserved.</p>
        </div>
      </body>
      </html>
    `,
    text: `
      Hi ${name},

      Thank you for applying for:
      ${jobTitle}

      Your application has been received and is under review.

      Our team will carefully review your qualifications and get back to you soon. Typically, you can expect to hear back within 5-7 business days.

      You can check the status of your application at any time through your dashboard.

      Best regards,
      ${companyName} Team
      © ${new Date().getFullYear()} ${companyName}
    `
  };
};

const applicationStatusTemplate = (name, jobTitle, status, companyName = "Utopia Hire") => {
  const statusConfig = {
    pending: {
      color: "#3498db",
      message: "is currently under review",
      additionalText: "We're carefully reviewing your application and will update you soon."
    },
    accepted: {
      color: "#2ecc71",
      message: "has been accepted for an interview!",
      additionalText: "Our team will contact you shortly to schedule an interview. Please keep an eye on your inbox."
    },
    rejected: {
      color: "#e74c3c",
      message: "unfortunately wasn't successful this time",
      additionalText: "We appreciate the time and effort you put into your application. While we were impressed with your qualifications, we've decided to move forward with other candidates. We encourage you to apply for future positions that match your skills."
    }
  };

  const config = statusConfig[status.toLowerCase()] || statusConfig.pending;

  return {
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Application Update: ${jobTitle}</title>
        <style>
          body { font-family: 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; padding-bottom: 20px; border-bottom: 1px solid #eee; margin-bottom: 30px; }
          .logo { max-width: 150px; }
          .status-box { background-color: ${config.color}; color: white; padding: 15px; border-radius: 5px; text-align: center; margin: 20px 0; }
          .job-title { font-size: 20px; font-weight: bold; margin-bottom: 10px; }
          .footer { margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #777; text-align: center; }
          .button { display: inline-block; padding: 10px 20px; background-color: ${config.color}; color: white; text-decoration: none; border-radius: 5px; margin: 15px 0; }
        </style>
      </head>
      <body>
        <div class="header">
          <img src="https://res.cloudinary.com/dzbepyf6i/image/upload/w_1000,c_fill,ar_1:1,g_auto,r_max,bo_5px_solid_red,b_rgb:262c35/v1743005029/Hire_Utopia_2_ekqwdu.png" alt="${companyName} Logo" class="logo">
        </div>
        
        <h2>Hi ${name},</h2>
        
        <p>We're writing to update you about your application for:</p>
        
        <div class="job-title">${jobTitle}</div>
        
        <div class="status-box">
          <h3>Your application ${config.message}</h3>
        </div>
        
        <p>${config.additionalText}</p>
        
        <p>
          View your dashboard for more info.
        </p>
        
        <div class="footer">
          <p>${companyName} Team</p>
          <p>© ${new Date().getFullYear()} ${companyName}. All rights reserved.</p>
        </div>
      </body>
      </html>
    `,
    text: `
      Hi ${name},

      We're writing to update you about your application for:
      ${jobTitle}

      Your application ${config.message}

      ${config.additionalText}

      View your dashboard for more info.

      Best regards,
      ${companyName} Team
      © ${new Date().getFullYear()} ${companyName}
    `
  };
};


// EMAIL SENDING FUNCTIONS

//Email for application confirmation   -> works well
const sendApplicationConfirmation = async (jobSeekerEmail, jobSeekerName, jobTitle) => {
  const subject = `Application Submitted: ${jobTitle}`;
  const templates = applicationSubmittedTemplate(jobSeekerName, jobTitle);
  
  console.log(`Sending application confirmation to ${jobSeekerEmail}`);
  await sendEmail(jobSeekerEmail, subject, templates.text, templates.html);
  console.log("Application confirmation sent successfully!");
};



//Email for application status update
  const sendApplicationStatusEmail = async (jobSeekerEmail, jobSeekerName,jobTitle, status) => {
  const subject = `Application Update: ${jobTitle}`;
  const templates = applicationStatusTemplate(jobSeekerName, jobTitle, status);
  
  console.log(`Sending status update (${status}) to ${jobSeekerEmail}`);
  await sendEmail(jobSeekerEmail, subject, templates.text, templates.html);
  console.log("Status update email sent successfully!");
  
};



//Digest Email for job applications
const sendDailyDigestEmail = async (employerEmail, jobTitle, applicationCount) => {
  const subject = `Daily Digest: New Applications for ${jobTitle}`;
  const text = `You have ${applicationCount} new applications for the job "${jobTitle}".`;
  const html = `<p>You have ${applicationCount} new applications for the job "${jobTitle}". 
                   Check them out in your dashboard
                </p>`;

  await sendEmail(employerEmail, subject, text, html);
};

module.exports = {
  sendApplicationConfirmation,
  sendApplicationStatusEmail,
  sendDailyDigestEmail,
};
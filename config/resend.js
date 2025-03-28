require('dotenv').config();
const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (to, subject, text, html) => {
  try {
    await resend.emails.send({
      from: "Utopia Hire <onresend@resend.dev>", // Replace with your domain
      to,   //Test email
      subject,
      text,
      html,
    });

  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
};

module.exports = {sendEmail, resend};
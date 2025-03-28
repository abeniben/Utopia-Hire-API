require('dotenv').config();

console.log("RESEND_API_KEY:", process.env.RESEND_API_KEY);  // Debug log
const { Resend } = require("resend");

const apiKey = process.env.RESEND_API_KEY;
if (!apiKey) {
  throw new Error("Abeni You have Missing RESEND_API_KEY environment variable.");
}
const resend = new Resend(apiKey);

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
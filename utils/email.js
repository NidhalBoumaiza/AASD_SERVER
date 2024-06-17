const nodemailer = require("nodemailer");

const sendEmail = async (options) => {
  // 1) Create a transporter :
  var transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
  // 2) Define the email options :
  const mailOptions = {
    from: "AASD <AASD@gmail.com>",
    to: options.email,
    subject: options.subject,
    text: options.message,
    attachments: options.attachments,
  };
  try {
    await transport.sendMail(mailOptions);
  } catch (error) {
    console.log("Error sending email:", error);
  }
};

module.exports = sendEmail;

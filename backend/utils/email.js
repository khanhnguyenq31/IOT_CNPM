const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD
  }
});

const sendEmail = async (options) => {
  const mailOptions = {
    from: process.env.EMAIL,
    to: options.to,
    subject: options.subject,
    text: options.text
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
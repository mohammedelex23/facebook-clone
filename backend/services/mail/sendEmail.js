const nodemailer = require("nodemailer");

module.exports = function sendEmail(email, userId, name, cb) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "mi1145578@gmail.com",
      pass: process.env.MAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: "Facebook-clone <noreply@facebook-clone.com>",
    to: email,
    subject: "Account Verification",
    html: `<html>
        <p>Hello ${name},</p>
        <p>Welcome to Facebook! Before you can begin using your account, you need to activate it using the below link:</p>
        <a style="color:blue;font-size:18px;font-weight:bold" href="http://localhost:3000/verify?id=${userId}">Verify account</a>
        </html>`,
  };
  transporter.sendMail(mailOptions, cb);
};

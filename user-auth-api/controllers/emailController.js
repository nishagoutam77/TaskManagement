const nodemailer = require('nodemailer');
//const Email = require('../models/emailModel');
const User = require('../models/userModel');
const { sendEmailNodemailer, sendEmailSendGrid } = require('../utils/email');

exports.sendWelcomeEmail = async (req, res) => {
    const { email, name } = req.body;
    
    const emailOptions = {
        to: email,
        subject: 'Welcome to Our Service!',
        text: `Hi ${name}, Welcome to our platform!`,
        html: `<h1>Hi ${name},</h1><p>Welcome to our platform!</p>`
    };

    try {
        await sendEmailNodemailer(emailOptions);
        
        res.status(200).json({ message: 'Welcome email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error.message);
        res.status(500).json({ message: 'Error sending email', error: error.message });
    }
};

// Send Password Recovery Email
// exports.sendPasswordRecoveryEmail = async (req, res) => {
//     const { email, resetToken } = req.body;
    
//     const emailOptions = {
//         to: email,
//         subject: 'Password Recovery',
//         text: `You requested a password reset. Click the link to reset your password: ${resetToken}`,
//         html: `<p>You requested a password reset. Click the link to reset your password: <a href="${resetToken}">Reset Password</a></p>`
//     };

//     try {
//         await sendEmailNodemailer(emailOptions); // Use Nodemailer
//         // await sendEmailSendGrid(emailOptions); // Use SendGrid
//         res.status(200).json({ message: 'Password recovery email sent successfully' });
//     } catch (error) {
//         console.error('Error sending email:', error.message);
//         res.status(500).json({ message: 'Error sending email', error: error.message });
//     }
// };

exports.sendPasswordRecoveryEmail = async (req, res) => {
    const { email } = req.body;

    try {
        // Find the user in the database by email
        const user = await User.findOne({ email });
        console.log(user);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // No token needed, just send a password reset link
        const resetLink = `http://your-frontend.com/reset-password?email=${user.email}`;
        await sendEmailNodemailer({
            to: user.email,
            subject: 'Password Recovery',
            html: `<p>Click <a href="${resetLink}">here</a> to reset your password.</p>`
        });

        res.status(200).json({ message: 'Password recovery email sent' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
};

// Send Newsletter Email
exports.sendNewsletter = async (req, res) => {
    const { email, subject, content } = req.body;
    
    const emailOptions = {
        to: email,
        subject: subject,
        text: content,
        html: `<p>${content}</p>`
    };

    try {
        await sendEmailNodemailer(emailOptions); // Use Nodemailer
        // await sendEmailSendGrid(emailOptions); // Use SendGrid
        res.status(200).json({ message: 'Newsletter sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error.message);
        res.status(500).json({ message: 'Error sending newsletter', error: error.message });
    }
};




// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// // Send Welcome Email
// exports.sendWelcomeEmail = async (req, res) => {
//   const { email } = req.body;
//   const user = await Email.findOne({ email });

//   if (!user) {
//     return res.status(404).json({ message: 'User not found' });
//   }

//   const mailOptions = {
//     from: process.env.EMAIL_USER,
//     to: email,
//     subject: 'Welcome to Our Service',
//     text: `Hello ${user.name}, Welcome to our service!`,
//   };
// console.log(mailOptions);

//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       return res.status(500).json({ message: 'Error sending email' });
//     }
//     res.status(200).json({ message: 'Welcome email sent', info });
//   });
// };

// // Send Password Recovery Email
// exports.sendPasswordRecoveryEmail = async (req, res) => {
//   const { email } = req.body;
//   const user = await Email.findOne({ email });

//   if (!user) {
//     return res.status(404).json({ message: 'User not found' });
//   }

//   const mailOptions = {
//     from: process.env.EMAIL_USER,
//     to: email,
//     subject: 'Password Recovery',
//     text: `Hello ${user.name}, click here to reset your password.`,
//   };

//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       return res.status(500).json({ message: 'Error sending email' });
//     }
//     res.status(200).json({ message: 'Password recovery email sent', info });
//   });
// };

// // Send Newsletter
// exports.sendNewsletter = async (req, res) => {
//   const { subject, content } = req.body;

//   const users = await Email.find({});
//   const emails = users.map((user) => user.email);

//   const mailOptions = {
//     from: process.env.EMAIL_USER,
//     to: emails,
//     subject: subject,
//     text: content,
//   };

//   transporter.sendMail(mailOptions, (error, info) => {
//     if (error) {
//       return res.status(500).json({ message: 'Error sending newsletter' });
//     }
//     res.status(200).json({ message: 'Newsletter sent', info });
//   });
// };

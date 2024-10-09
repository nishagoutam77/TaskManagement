// utils/sendEmail.js
const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');
require('dotenv').config();

// Using Nodemailer
const sendEmailNodemailer = async (options) => {
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        }
    });

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: options.to,
        subject: options.subject,
        text: options.text,
        html: options.html
    };

    await transporter.sendMail(mailOptions);
};

// Using SendGrid
const sendEmailSendGrid = async (options) => {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const msg = {
        to: options.to,
        from: process.env.EMAIL_USER,
        subject: options.subject,
        text: options.text,
        html: options.html
    };

    await sgMail.send(msg);
};

module.exports = {
    sendEmailNodemailer,
    sendEmailSendGrid
};

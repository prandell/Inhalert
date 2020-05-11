const nodemailer = require('nodemailer');
const crypt = require('../config/crypt');

const password = crypt.encrypt(process.env.GMAIL_PASSWORD);
const sender = process.env.GMAIL_ADDRESS;

//This was just for testing the functionalitiy. Emails are sent automatically now in bin/loop.js

const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: sender,
        pass: crypt.decrypt(password),
    },
});

function nodeMailerSend(to, subject, message) {
    const mailOptions = {
        from: sender,
        to,
        subject,
        html: message,
    };
    transport.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error)
        } else {
            console.log(info)
        }
    });
};

function sendEmail(req, res) {
    let mailOptions = {
        from: sender,
        to: req.user.email,
        subject: "Air Quality Report",
        html: "Inhalert",
    };
    transport.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error)
            req.flash('error_msg', 'Email failed to send');
            res.redirect('/dashboard');
        } else {
            req.flash(
                'success_msg',
                'Email sent'
            );
            res.redirect('/dashboard');
        }
    });
}


module.exports.sendEmail = sendEmail;
module.exports.nodeMailerSend = nodeMailerSend;

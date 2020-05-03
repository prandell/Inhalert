const nodemailer = require('nodemailer');
const crypt = require('../config/crypt');
const mongoose = require('mongoose');

const password = crypt.encrypt(process.env.GMAIL_PASSWORD);
const sender = process.env.GMAIL_ADDRESS;

//Bring in models
const SiteSub = mongoose.model('SiteSub');

const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: sender,
        pass: crypt.decrypt(password),
    },
});

//Send with options
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

//Stock sender function to test functionality
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
            console.log(req.user)
            req.flash(
                'success_msg',
                'Email sent'
            );
            res.redirect('/dashboard');
        }
    });
}


//Separated function just mails out to all subbed users in bulk
async function sendSubMail(siteId, status, siteName) {
    const subs = await SiteSub.find({siteId: siteId}).exec()
    let emails = []
    for (let s in subs) {
        emails.push(subs[s].email)
    }
    nodeMailerSend(emails,
        "Air Quality " + status + " at " + siteName,
        "This message was sent to you by Inhalert. We will notify you when the status changes")
}


module.exports.sendEmail = sendEmail;
module.exports.nodeMailerSend = nodeMailerSend;
module.exports.sendSubMail = sendSubMail;

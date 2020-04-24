const nodemailer = require('nodemailer');
const crypt = require('../config/crypt');

const password = crypt.encrypt(process.env.GMAIL_PASSWORD);
const sender = process.env.GMAIL_ADDRESS;

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
            error.msg
            return error
        } else {

        }
    });
};

function sendEmail(req, res) {
    let mailOptions = {
        from: sender,
        to: req.user.email,
        subject: "Air Quality Report",
        html: "aosdhaosihdoaijsdfsofjhdsf",
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






    // if (nodeMailerSend(req.user.email, "Notification", "message")) {
    //     let errors = [{msg: 'Message sending failed'}];
    //     res.render('dashboard', {
    //         errors: errors
    //     });
    // } else {
    //     req.flash(
    //         'success_msg',
    //         'Email sent'
    //     );
    //     res.redirect('/');
    // }
}


module.exports.sendEmail = sendEmail;

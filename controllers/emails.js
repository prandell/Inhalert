const nodemailer = require('nodemailer');
const crypt = require('../config/crypt');
const mongoose = require('mongoose');
const request = require("request");
const pug = require('pug');
const axios = require('axios');


const password = crypt.encrypt(process.env.GMAIL_PASSWORD);
const sender = process.env.GMAIL_ADDRESS;

//Bring in models
const SiteSub = mongoose.model('SiteSub');

const statusNums = {"Good":1, "Moderate":2, "Poor": 3, "Very poor":4, "Hazardous":5}

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

async function getScientificSummary(siteId) {
    var options = {
        method: "GET",
        url:
            "https://gateway.api.epa.vic.gov.au/environmentMonitoring/v1/sites/" + siteId + "/parameters",
        headers: {
            "X-API-Key": process.env.EPA_API_KEY,
        },
    };
    let url = "https://gateway.api.epa.vic.gov.au/environmentMonitoring/v1/sites/" + siteId + "/parameters"
    let response = await axios.get(url,{headers: {
            "X-API-Key": process.env.EPA_API_KEY,
        }})
    return response.data

}

function formatter(summary) {
    // Compile the source code
    const compiledFunction = pug.compileFile('./views/email.pug');
    var html = compiledFunction({
        summary: summary
    })
    return html
}


//Separated function just mails out to all subbed users in bulk
async function sendSubMail(siteId, status, siteName) {
    var statusNum = statusNums[status]

    //Status has returned to Good
    if (statusNum == 1) {
        var subs = await SiteSub.find({siteId: siteId}).exec()
    } else {
        var subs = await SiteSub.find({siteId: siteId, status: { $lte: statusNum}}).exec()
    }

    if (!subs[0]) {
        console.log("No alerts to be sent!")
        return
    }
    let emails = []
    for (let s of subs) {
        await emails.push(s.email)
    }
    var summary = await getScientificSummary(siteId)
    nodeMailerSend(emails,
        "Air Quality " + status + " at " + siteName,
        formatter(summary))
    console.log("sent emails")
}


module.exports.sendEmail = sendEmail;
module.exports.nodeMailerSend = nodeMailerSend;
module.exports.sendSubMail = sendSubMail;

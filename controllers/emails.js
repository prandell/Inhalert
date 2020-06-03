const nodemailer = require('nodemailer');
const crypt = require('../config/crypt');
const mongoose = require('mongoose');
const request = require("request");
const pug = require('pug');
const axios = require('axios');

//Encrypted email account info
const password = crypt.encrypt(process.env.GMAIL_PASSWORD);
const sender = process.env.GMAIL_ADDRESS;

//Bring in models
const SiteSub = mongoose.model('SiteSub');

//Status categories and their numeric values
const statusNums = require('../models/statusNums').nameKeys

/**
 * SMTP Transport used for sending emails
 */
const transport = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: sender,
        pass: crypt.decrypt(password),
    },
});

/**
 * Private function for sending emails
 * Args:
 *  to: Recipient email address
 *  subject: Subject of email
 *  message: Html body of email
 * Returns:
 *  Nothing. Sends mail out and logs result.
 */
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

/**
 * Stock email function for testing the functionality.
 * Args:
 *  req: Http request object containing user email
 *  res: Http response object
 * Returns:
 *  Redirect to dashboard with relevant message.
 */
function sendEmail(req, res) {
    let mailOptions = {
        from: sender,
        to: req.user.email,
        subject: "Inhalert",
        html: "This is a sample message",
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

/**
 * Retrieves scientific Site information from EPA
 * Args:
 *  siteId: The Id of the site
 * Returns:
 *  The summary as a JSON object
 */
async function getScientificSummary(siteId) {
    let url = "https://gateway.api.epa.vic.gov.au/environmentMonitoring/v1/sites/" + siteId + "/parameters"
    let response = await axios.get(url,{headers: {
            "X-API-Key": process.env.EPA_API_KEY,
        }})
    return response.data

}

/**
 * Embeds a summary into a pug template, and returns the converted html
 * Args:
 *  summary: A site summary object
 * Returns:
 *  Pug compiled to html
 */
function formatter(summary) {
    // Compile the source code
    const compiledFunction = pug.compileFile('./views/email.pug');
    var html = compiledFunction({
        summary: summary
    })
    return html
}


/**
 * Sends out mail to subscribers of the supplied site
 * Args:
 *  siteId: The id of the site
 *  status: The status of the site
 *  siteName: The name of the site
 * Returns:
 *  Nothing. Sends subscriber email out and logs the result
 */
async function sendSubMail(siteId, status, siteName) {
    //Converts the status to a number corresponding to severity
    var statusNum = statusNums[status]

    //Status has returned to Good
    if (statusNum == 1) {
        var subs = await SiteSub.find({siteId: siteId}).exec()
    } else {
        // Only notify users who have subscribed to this severity
        var subs = await SiteSub.find({siteId: siteId, status: { $lte: statusNum}}).exec()
    }

    //Log that no emails were sent
    if (!subs[0]) {
        console.log("No alerts to be sent!")
        return
    }

    //Add all user emails to a list, to send out in bulk.
    let emails = []
    for (let s of subs) {
        await emails.push(s.email)
    }

    //Create the message body, and send the formatted result
    var summary = await getScientificSummary(siteId)
    nodeMailerSend(emails,
        "Air Quality " + status + " at " + siteName,
        formatter(summary))
    console.log("sent emails")
}


module.exports.sendEmail = sendEmail;
module.exports.nodeMailerSend = nodeMailerSend;
module.exports.sendSubMail = sendSubMail;

const mongoose = require('mongoose');
const request = require("request");
// Bring in User Model
const Site = mongoose.model('Site');
const SiteSub = mongoose.model('SiteSub')

const emailController = require('../controllers/email-controller')

//Fetches Site records from EPA API
function fetchUpdate() {
    let data_type = "air";
    let options = {
        method: "GET",
        url:
            "https://gateway.api.epa.vic.gov.au/environmentMonitoring/v1/sites?environmentalSegment=" +
            data_type +
            "\n",
        headers: {
            "X-API-Key": process.env.EPA_API_KEY,
        },
    };
    request(options, function (error, response) {
        if (error) throw new Error(error);
        return JSON.parse(response.body).records
    });
}

//Updates DB record of Sites, Sends out email if conditions are met
function updateSites() {

    let records = fetchUpdate()

    for (let r in records) {

        let record = records[r]

        let query = {siteId: record.siteID, siteName: record.siteName};

        if (record.siteHealthAdvices) {
            let update = {siteId: record.siteID, siteName: record.siteName, status: record.siteHealthAdvices[0].healthAdvice}
        } else {
            let update = {siteId: record.siteID, siteName: record.siteName}
        }
        let options = {upsert: true, new: true, setDefaultsOnInsert: true, rawResult: true};

        Site.findOneAndUpdate(query, update, options, async function(error, result) {
            if (error) {
                console.log(error);
            } else if (result.lastErrorObject.updatedExisting && (result.value.status == 'Poor' || result.value.status =='Moderate')) {
                await emailController.sendSubMail(result.value.siteId, result.value.status, record.siteName)
            }
        });
    }
}

//Functionality testing function that injects the status "Poor" for Melbourne CBD
function injectStatus(status) {
    var query = {siteId: "4afe6adc-cbac-4bf1-afbe-ff98d59564f9", siteName: "Melbourne CBD"};
    var update = {status: status}
    var options = {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
        rawResult: true
    };
    Site.findOneAndUpdate(query, update, options, async function (error, result) {
        if (error) {
            console.log(error);
        } else if (result.lastErrorObject.updatedExisting && (result.value.status == 'Poor' || result.value.status == 'Moderate')) {
            const subs = await SiteSub.find({siteId: result.value.siteId}).exec()
            var emails = []
            for (let s in subs) {
                emails.push(subs[s].email)
            }
            emailController.nodeMailerSend(emails,
                "Air Quality " + result.value.status + " at " + "Melbourne CBD",
                "This message was sent to you by Inhalert. We will notify you when the status changes")
        }
    });
}

//private function may not need to export
module.exports.fetchUpdate = fetchUpdate;

module.exports.updateSites = updateSites;
module.exports.injectStatus = injectStatus;
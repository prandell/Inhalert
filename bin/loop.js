var request = require("request");
var mongoose = require('mongoose');
const Site = mongoose.model('Site');
const SiteSub = mongoose.model('SiteSub');

const emailController = require('../controllers/email-controller')

//Does everything in one. Need to separate
function getUpdate() {
    var data_type = "air";
    var options = {
        method: "GET",
        url:
            "https://gateway.api.epa.vic.gov.au/environmentMonitoring/v1/sites?environmentalSegment=" +
            data_type +
            // "&location=" +
            // location +
            "\n",
        headers: {
            "X-API-Key": process.env.EPA_API_KEY,
        },
    };
    request(options, function (error, response) {
        if (error) throw new Error(error);
        var records = JSON.parse(response.body).records

        for (let r in records) {
            var query = {siteId: records[r].siteID, siteName: records[r].siteName};
            if (records[r].siteHealthAdvices) {
                var update = {siteId: records[r].siteID, siteName: records[r].siteName, status: records[r].siteHealthAdvices[0].healthAdvice}
            } else {
                var update = {siteId: records[r].siteID, siteName: records[r].siteName}
            }
            options = {
                upsert: true,
                new: true,
                setDefaultsOnInsert: true,
                rawResult: true
            };
            Site.findOneAndUpdate(query, update, options, async function(error, result) {
                if (error) {
                    console.log(error);
                } else if (result.lastErrorObject.updatedExisting && (result.value.status == 'Poor' || result.value.status =='Moderate')) {
                    const subs = await SiteSub.find({siteId: result.value.siteId}).exec()
                    let emails = []
                    for (let s in subs) {
                        emails.push(subs[s].email)
                    }
                    emailController.nodeMailerSend(emails,
                        "Air Quality " + result.value.status + " at " + records[r].siteName,
                        "This message was sent to you by Inhalert. We will notify you when the status changes")
                }
            });
        }
    })
}

//Separated function just fetches records
function fetchUpdate() {
    let data_type = "air";
    let options = {
        method: "GET",
        url:
            "https://gateway.api.epa.vic.gov.au/environmentMonitoring/v1/sites?environmentalSegment=" +
            data_type +
            // "&location=" +
            // location +
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

//Separated function just mails out to all subbed users in bulk
async function sendSubMail(siteId, status, siteName) {
    const subs = await SiteSub.find({siteId: siteId}).exec()
    let emails = []
    for (let s in subs) {
        emails.push(subs[s].email)
    }
    emailController.nodeMailerSend(emails,
        "Air Quality " + status + " at " + siteName,
        "This message was sent to you by Inhalert. We will notify you when the status changes")
}

//Separated function combines above
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
                await sendSubMail(result.value.siteId, result.value.status, record.siteName)
            }
        });
    }
}


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


setInterval(function() {
    getUpdate();
}, 60000);

setTimeout(function() {
    injectStatus("Poor")
}, 61000)





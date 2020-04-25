var request = require("request");
var mongoose = require('mongoose');
const Site = mongoose.model('Site');
const SiteSub = mongoose.model('SiteSub');

const emailController = require('../controllers/email-controller')

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
            Site.findOneAndUpdate(query, update, options, function(error, result) {
                if (error) {
                    console.log(error);
                } else if (result.lastErrorObject.updatedExisting && (result.value.status == 'Poor' || result.value.status =='Moderate')) {
                    SiteSub.find({siteId: result.value.siteId}).then(subs => {
                        for (let s in subs) {
                            emailController.nodeMailerSend(subs[s].email,
                                "Air Quality "+result.value.status+ " at "+records[r].siteName,
                                "This message was sent to you by Inhalert. We will notify you when the status changes" )
                        }
                    });
                }

            });
        }
    })
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
    Site.findOneAndUpdate(query, update, options, function (error, result) {
        if (error) {
            console.log(error);
        } else if (result.lastErrorObject.updatedExisting && (result.value.status == 'Poor' || result.value.status == 'Moderate')) {
            SiteSub.find({siteId: result.value.siteId}).then(subs => {
                for (let s in subs) {
                    emailController.nodeMailerSend(subs[s].email,
                        "Air Quality " + result.value.status + " at " + "Melbourne CBD",
                        "This message was sent to you by Inhalert. We will notify you when the status changes")
                }
            });
        }
    });
}


setInterval(function() {
    getUpdate();
}, 180000);

setTimeout(function() {
    injectStatus("Poor")
}, 181000)





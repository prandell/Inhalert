var request = require("request");
var mongoose = require('mongoose');

const Site = mongoose.model('Site');
const SiteSub = mongoose.model('SiteSub');
const User = mongoose.model('User');


/**
 * Resetting database when required. Commented out.
 */
/**
SiteSub.deleteMany({},  function (err) {})
Site.deleteMany({},  function (err) {})
User.deleteMany({},  function (err) {})
SiteSub.collection.dropIndexes(function (err, results) {
    console.log(results)
});
Site.collection.dropIndexes(function (err, results) {
    console.log(results)
});
User.collection.dropIndexes(function (err, results) {
    console.log(results)
});
 */

/**
 * Initialisation of Site table from EPA.
 */
mongoose.set('useFindAndModify', false);
var options = {
    method: "GET",
    url:
        "https://gateway.api.epa.vic.gov.au/environmentMonitoring/v1/sites?environmentalSegment=air"+
        "\n",
    headers: {
        "X-API-Key": process.env.EPA_API_KEY,
    },
};
request(options, function (error, response) {
    if (error) throw new Error(error);
    var records = JSON.parse(response.body).records

    //Add each site individually, taking into account its type and status
    for (let r in records) {
        var query = {siteId: records[r].siteID, siteName: records[r].siteName};
        if (records[r].siteHealthAdvices) {
            if (records[r].siteHealthAdvices[0].healthAdvice) {
                var update = {
                    siteId: records[r].siteID,
                    siteName: records[r].siteName,
                    alerted: false,
                    status: records[r].siteHealthAdvices[0].healthAdvice
                }
            } else {
                var update = {siteId: records[r].siteID, siteName: records[r].siteName, alerted: false, status: "Unavailable"}
            }
        } else {
            var update = {siteId: records[r].siteID, siteName: records[r].siteName, alerted: false, status: "Camera"}
        }
        options = {upsert: true, new: true, setDefaultsOnInsert: true};
        Site.findOneAndUpdate(query, update, options, function(error, result) {
            if (error) {
                console.log(error);
            }
        });
    }
});

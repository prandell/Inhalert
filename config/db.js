var request = require("request");
var mongoose = require('mongoose');

const Site = mongoose.model('Site');
const SiteSub = mongoose.model('SiteSub');
const User = mongoose.model('User');

// Records deletion and management
// Site.deleteMany({},  function (err) {})
SiteSub.deleteMany({},  function (err) {})
// User.deleteMany({},  function (err) {})
SiteSub.collection.dropIndexes(function (err, results) {
    console.log(results)
});

//Upon Initialisation this script calls the EPA API and updates all site documents in the DB.
//If there are new sites, it will add them.
mongoose.set('useFindAndModify', false);
var data_type = "air";
var options = {
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
    var records = JSON.parse(response.body).records

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

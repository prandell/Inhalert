var request = require("request");
var mongoose = require('mongoose');
const Site = mongoose.model('Site');

//Delete all records (reset)
// Site.deleteMany({},  function (err) {})

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
        "X-API-Key": "050c16c08ef84cadb8f92d5d73074b95",
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
        options = {upsert: true, new: true, setDefaultsOnInsert: true};
        Site.findOneAndUpdate(query, update, options, function(error, result) {
            if (error) {
                console.log(error);
            }
        });
    }
});

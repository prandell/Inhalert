const mongoose = require('mongoose');
const request = require("request");
// Bring in User Model
const Site = mongoose.model('Site');
const SiteSub = mongoose.model('SiteSub')

const emailController = require('../controllers/email-controller')

//* ------------------ AUTOMATED FUNCTIONS -------------------*//

// Function called periodically, calls other functions and updates DB records of sites
const updateDB = function() {
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
        updateSites(JSON.parse(response.body).records)
    })
}

//Private function that loops through supplied records and updates Site DB
const updateSites = function(records) {

    for (let r in records) {

        let record = records[r]

        let query = {siteId: record.siteID};

        let update = {siteId: record.siteID, siteName: record.siteName}

        if (record.siteHealthAdvices) {
            if (record.siteHealthAdvices[0].healthAdvice) {
                update.status = record.siteHealthAdvices[0].healthAdvice
            } else {
                update.status = "Unavailable"
            }
        } else {
            update.status = "Camera"
        }
        let options = {upsert: true};

        Site.updateOne(query, update, options, function(error, result) {
            if (error) {
                console.log(error);
            }
        });
    }
}

//Checks the DB to determine whether alerts need to be sent
const checkStatus = async function() {
    const toTrue = await Site.find({status: {$nin: ["Good", "Unavailable", "Camera", null]}, alerted: false}).exec()
    const toFalse = await Site.find({status: {$in: ["Good"]}, alerted: true}).exec()
    for (let s in toTrue) {
        await emailController.sendSubMail(toTrue[s].siteId, toTrue[s].status, toTrue[s].siteName)
        await Site.updateOne({siteId: toTrue[s].siteId}, {alerted: true});
    }
    for (let s in toFalse) {
        await emailController.sendSubMail(toFalse[s].siteId, toFalse[s].status, toFalse[s].siteName)
        await Site.updateOne({siteId: toFalse[s].siteId}, {alerted: false});
    }
    return toTrue.concat(toFalse)
}

//Functionality testing function that injects the status "Poor" for Melbourne CBD
async function injectStatus(siteName, status) {
    // "4afe6adc-cbac-4bf1-afbe-ff98d59564f9"
    // "Melbourne CBD"
    var query = {siteName: siteName};
    var update = {status: status}
    var options = {
        upsert: true,
        new: true,
        setDefaultsOnInsert: true,
        rawResult: true
    };
    const result = await Site.findOneAndUpdate(query, update, options)
    return result
}


//*------------------------ MANUAL FUNCTIONS ----------------------------*//

//Update DB records of sites with new ones. Returns result summary
const updateDBWrapper = async function(req, res) {

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
    request(options, async function (error, response) {
        let updated = 0
        if (error) {
            throw new Error(error);
        } else {
            let records = JSON.parse(response.body).records
            for (let r in records) {

                let record = records[r]

                let query = {siteId: record.siteID};

                if (record.siteHealthAdvices) {
                    if (record.siteHealthAdvices[0].healthAdvice) {
                        var status = record.siteHealthAdvices[0].healthAdvice
                    } else {
                        var status = "Unavailable"
                    }
                } else {
                    var status = "Camera"
                }

                let result = await Site.updateOne(query, {status: status});
                if (result.nModified == 1) {
                    updated+=1
                }
            }
        }
        res.status(200).json({
            message: "Summary of Site update",
            updated: updated,
            unchanged: 40-updated
        })
    })
}

//Manually checks whether alerts need to be sent. Sends them out if they do and updates DB record
// to indicate alerts have been sent
const checkStatusWrapper = async function(req, res) {
    var sites = checkStatus()
    if (sites.length > 0) {
        res.status(200).json({
            message: "Alerts sent out for subscribers of the following sites",
            sites: sites
        })
    } else {
        // Messages cant be sent with a 304 (Not modified)
        res.status(304).send()
    }
}


//Manual wrapper for inject status so can be used as endpoint
function injectStatusWrapper(req, res) {
    let result = injectStatus(req.body.siteName, req.body.status)
    if (result) {
        res.status(200).json({
            message: "Injection successful",
            site: req.body.siteName,
            status: req.body.status,
            result: result
        })
    } else {
        res.status(400).json({
            message: "Injection unsuccessful, either site with provided site name doesnt exist or there was an error"
        })
    }
}

async function fetchSites(req, res) {
    let result = await Site.find().sort('siteName').exec()
    res.send(result)
}


module.exports.updateDB = updateDB;
module.exports.injectStatus = injectStatus;
module.exports.checkStatus = checkStatus;
//Manual
module.exports.updateDBWrapper = updateDBWrapper;
module.exports.checkStatusWrapper = checkStatusWrapper;
module.exports.injectStatusWrapper = injectStatusWrapper;
module.exports.fetchSites = fetchSites;
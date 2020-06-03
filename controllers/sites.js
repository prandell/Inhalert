const mongoose = require('mongoose');
const request = require("request");
// Bring in User Model
const Site = mongoose.model('Site');
const SiteSub = mongoose.model('SiteSub')

const emailController = require('../controllers/emails')

//* ------------------ AUTOMATED FUNCTIONS -------------------*//

/**
 * Updates the database with EPA's latest site data. Called periodically.
 * Args:
 *  None
 * Returns:
 *  Nothing, calls another function and exits
 */
const updateDB = function() {
    let options = {
        method: "GET",
        url:
            "https://gateway.api.epa.vic.gov.au/environmentMonitoring/v1/sites?environmentalSegment=air" +
            "\n",
        headers: {
            "X-API-Key": process.env.EPA_API_KEY,
        },
    };
    request(options, function (error, response) {
        if (error) throw new Error(error);
        console.log("Updating DB ...")
        updateSites(JSON.parse(response.body).records)
    })
}

//Private function that loops through supplied records and updates Site DB
/**
 * Updates the database with supplied records
 * Args:
 *  records: EPA records object of Site data
 * Returns:
 *  Nothing, updates DB and exits
 */
const updateSites = function(records) {

    for (let r in records) {
        let record = records[r]
        let query = {siteId: record.siteID};
        let update = {siteId: record.siteID, siteName: record.siteName}

        //If no health advice supplied, return Unavailable
        if (record.siteHealthAdvices) {
            if (record.siteHealthAdvices[0].healthAdvice) {
                update.status = record.siteHealthAdvices[0].healthAdvice
            } else {
                update.status = "Unavailable"
            }
        // Special case for camera sites, which have no health advice.
        } else {
            update.status = "Camera"
        }

        //Insert new sites if they are found
        let options = {upsert: true};

        Site.updateOne(query, update, options, function(error, result) {
            if (error) {
                console.log(error);
            }
        });
    }
}

/**
 * Checks Database for any updates which users should be notified about, and triggers these alerts.
 * Args:
 *  None
 * Returns:
 *  The list of Sites that alerts are to be sent out for
 */
const checkStatus = async function() {
    console.log("Checking status...")

    //If A site is not Good, Unavailable, or Camera, and it hasnt already been notified about,
    // it triggers the alert process
    const toTrue = await Site.find({status: {$nin: ["Good", "Unavailable", "Camera", null]}, alerted: false}).exec()

    //If a site has been notified about, and it has returned to Good, it triggers the alert process
    const toFalse = await Site.find({status: {$in: ["Good"]}, alerted: true}).exec()

    //Alerts
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

/**
 * Injects a status into the database for a particular site. Used for testing.
 * Args:
 *  siteName: The name of the site
 *  status: The status to inject
 * Returns:
 *  The result of the update to the database.
 */
async function injectStatus(siteName, status) {
    // "4afe6adc-cbac-4bf1-afbe-ff98d59564f9"
    // "Melbourne CBD"
    var query = {siteName: siteName};
    var update = {status: status}
    var options = {
        new: true
    };
    const result = await Site.findOneAndUpdate(query, update, options)
    return result
}


//*------------------------ MANUAL FUNCTIONS ----------------------------*//

/**
 * A wrapper function for updateDB, for manual endpoint testing
 * Args:
 *  req: Http request object
 *  res: Http response object
 * Returns:
 *  The summary of updated sites
 */
const updateDBWrapper = async function(req, res) {

    let options = {
        method: "GET",
        url:
            "https://gateway.api.epa.vic.gov.au/environmentMonitoring/v1/sites?environmentalSegment=air" +
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

/**
 * Manually triggers A status check, which may trigger alerts
 * Args:
 *  req: Http request object
 *  res: Http response object
 * Returns:
 *  A summary of alerts sent, or 304.
 */
const checkStatusWrapper = async function(req, res) {
    var sites = await checkStatus()
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

/**
 * Wrapper for manually injecting a site status.
 * Args:
 *  req: Http request object containing arguments for injectStatus in its body
 *  res: Http response object
 * Returns:
 *  Whether the injection was successful or not
 */
async function injectStatusWrapper(req, res) {
    let result = await injectStatus(req.body.siteName, req.body.status)
    if (result) {
        res.status(200).json({
            message: "Injection successful",
            site: req.body.siteName,
            status: req.body.status
        })
    } else {
        res.status(400).json({
            message: "Injection unsuccessful, either site with provided site name doesnt exist or there was an error"
        })
    }
}

/**
 * Retrieves all sites in the database as an array of records
 * Args:
 *  req: Http request object
 *  res: Http response object
 * Returns:
 *  Site records in database, sorted alphabetically.
 */
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
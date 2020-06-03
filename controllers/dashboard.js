const mongoose = require('mongoose');
const request = require("request");

// Bring in User Model
const Site = mongoose.model('Site');
const SiteSub = mongoose.model('SiteSub')

/**
 * Middleware function that Loads the Site information to populate the summary page
 * Args:
 *  req: Http request object with Id in url.
 *  res: Http response object
 *  next: next function in the request chain
 *  id: URL argument
 * Returns:
 *  next() passing summary object if success
 *  next() passing error messages if failure
 */
const getSiteSummary = function(req, res, next, id) {
    if (!id) {
        req.error='Error occured. Please enter postcode again.'
        next();
    }
    var options = {
        method: "GET",
        url:
            "https://gateway.api.epa.vic.gov.au/environmentMonitoring/v1/sites/" + id + "/parameters",
        headers: {
            "X-API-Key": process.env.EPA_API_KEY,
        },
    };
    request(options, function (error, response) {
        if (error) {
            req.error="Error occured. Please enter postcode again."
            next();
        }
        var resp = JSON.parse(response.body)

        if (resp.errorDescription) {
            req.error="Error occured. Please enter postcode again."
            next();
        } else {
            req.success_msg = 'Scroll down to see a scientific summary!'
            req.summary = resp;
            next();
        }
    })
}

/**
 * GET processing function for summary page
 * Args:
 *  req: Http request object with summary or errors passed from middleware
 *  res: Http response object
 * Returns:
 *  render with summary if success
 *  render with error messages if failure
 */
const sendSiteSummary = function(req, res) {
    if (req.error) {
        res.render('summary', {
            user: req.user,
            error: req.error
        });
    } else {
        // res.flash = req.flash
        res.render('summary', {
            user: req.user,
            summary: req.summary,
            success_msg: req.success_msg
        })
    }
}


module.exports.getSiteSummary = getSiteSummary;
module.exports.sendSiteSummary = sendSiteSummary;
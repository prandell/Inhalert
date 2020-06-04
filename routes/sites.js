const express = require('express');
const router = express.Router();

const siteController = require('../controllers/sites.js');


//*----------------------- AUTOMATIC ------------------------*//
/**
 * Updates DB records every 2 minutes
 */
setInterval(function() {
    siteController.updateDB();

    /**
     * Checks the status for alerts every 2 minutes, on the off minute
     */
    setTimeout(function() {
        siteController.checkStatus();
    }, 60000)

}, 120000);

/**
 * Injects a bad weather status a minute after deployment.
 * Not in use.
 */
/**
setTimeout(function() {
    siteController.injectStatus("Melbourne CBD", "Poor")
}, 150000)
*/

//*------------------------- MANUAL ----------------------------*//
/**
 * Update DB and get results
 */
router.get('/update', siteController.updateDBWrapper);

/**
 * Check status and trigger any alerts
 */
router.get('/check', siteController.checkStatusWrapper);

/**
 * Inject status condition for a Site
 */
router.post('/inject', siteController.injectStatusWrapper);

/**
 * Retrieve all sites
 */
router.get('/fetchAll', siteController.fetchSites);


module.exports = router;
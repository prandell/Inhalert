const express = require('express');
const router = express.Router();

const siteController = require('../controllers/site-controller.js');

//Updates DB every 2 minutes
setInterval(function() {
    siteController.fetchAndUpdate();

    //Checks for alerting every 2 minutes, offset by a minute
    setTimeout(function() {
        siteController.checkStatus();
    }, 60000)

}, 120000);

//Injects the bad status after a minute
setTimeout(function() {
    siteController.injectStatus("Melbourne CBD", "Poor")
}, 60000)


// Get site updates
router.get('/update', siteController.updateDB);

//Trigger emails to be sent by checking DB for updates
router.get('/trigger', siteController.checkStatusWrapper);

//Inject a status to a site (needs req.body.siteName and req.body.status)
router.get('/inject', siteController.injectStatusWrapper);


module.exports = router;
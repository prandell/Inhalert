const express = require('express');
const router = express.Router();

const siteController = require('../controllers/site-controller.js');

//*----------------------- AUTOMATIC ------------------------*//
//Updates DB every 2 minutes
// setInterval(function() {
//     siteController.updateDB();
//
//     //Checks for alerting every 2 minutes, offset by a minute
//     setTimeout(function() {
//         siteController.checkStatus();
//     }, 60000)
//
// }, 120000);
//
// //Injects the bad status after a minute
// setTimeout(function() {
//     siteController.injectStatus("Melbourne CBD", "Poor")
// }, 150000)


//*------------------------- MANUAL ----------------------------*//
// Get site updates
router.get('/update', siteController.updateDBWrapper);

//Trigger emails to be sent by checking DB for updates
router.get('/check', siteController.checkStatusWrapper);

//Inject a status to a site (needs req.body.siteName and req.body.status)
router.post('/inject', siteController.injectStatusWrapper);

//Get all sites
router.get('/fetchAll', siteController.fetchSites);


module.exports = router;
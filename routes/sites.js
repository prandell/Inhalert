const express = require('express');
const router = express.Router();

const siteController = require('../controllers/site-controller.js');

setInterval(function() {
    siteController.updateSites();
}, 60000);

setTimeout(function() {
    siteController.injectStatus("Poor")
}, 61000)

module.exports = router;
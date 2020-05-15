var express = require('express');
var router = express.Router();

const dashController = require('../controllers/dashboard-controller.js');

// Dashboard
router.get('/',  (req, res) =>
    res.render('index', {
        user: req.user
    })
);

//Handling siteId parameter
router.param('siteId', dashController.getSiteSummary);


//loading summary page
router.get('/siteSummary/:siteId', dashController.sendSiteSummary);

router.get('/siteSummary', function(req, res) {
    req.flash('error_msg', 'Please enter a valid Victorian postcode or select a site from the list below.');
    res.redirect('/dashboard');
});

module.exports=router;
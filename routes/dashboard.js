var express = require('express');
var router = express.Router();

const dashController = require('../controllers/dashboard.js');

/**
 * Loads index page passing in user, if present, and any error messages.
 */
router.get('/',  (req, res) =>
    res.render('index', {
        errors: req.errors,
        user: req.user
    })
);

/**
 * Middleware for siteId parameter
 */
router.param('siteId', dashController.getSiteSummary);

/**
 * siteSummary page
 */
router.get('/siteSummary/:siteId', dashController.sendSiteSummary);

/**
 * Used as a stepping stone to display error messages when bad input was passed to the search function.
 */
router.get('/siteSummary', function(req, res) {
    req.flash('error_msg', 'Please enter a valid Victorian postcode/suburb, or select a site from the list below.');
    res.redirect('/dashboard');
});

module.exports=router;
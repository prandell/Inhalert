var express = require('express');
var router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

/**
 * Forwards index request to dashboard
 */
router.get('/', forwardAuthenticated, (req, res) => {
  res.redirect('/dashboard')
});

/**
 * Loads About page passing in user, if present, and any error messages.
 */
router.get('/about', (req, res) => {
  res.render('about', {
    errors: req.errors,
    user: req.user
  })
})

module.exports = router;

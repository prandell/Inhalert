var express = require('express');
var router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

router.get('/', forwardAuthenticated, (req, res) => {
  res.redirect('/dashboard')
});

router.get('/about', (req, res) => {
  res.render('about', {
    errors: req.errors,
    user: req.user
  })
})

module.exports = router;

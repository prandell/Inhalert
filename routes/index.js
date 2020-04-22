var express = require('express');
var router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

//Welcome Page
router.get('/', forwardAuthenticated, (req, res) => {
  res.render('index');
});

module.exports = router;

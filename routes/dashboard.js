var express = require('express');
var router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// Dashboard
router.get('/', ensureAuthenticated, (req, res) =>
    res.render('dashboard', {
        user: req.user
    })
);

module.exports=router;
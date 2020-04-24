var express = require('express');
var router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

const emailController = require('../controllers/email-controller')

// Dashboard
router.get('/',  (req, res) =>
    res.render('dashboard', {
        user: req.user
    })
);

router.get('/send', ensureAuthenticated, emailController.sendEmail)


module.exports=router;
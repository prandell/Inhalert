var express = require('express');
var router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

const emailController = require('../controllers/emails')

/**
 * Used to send stock emails to test the functionality. No longer implemented anywhere on the website.
 */
router.get('/send', ensureAuthenticated, emailController.sendEmail)


module.exports=router;
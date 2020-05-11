var express = require('express');
var router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

const emailController = require('../controllers/email-controller')

//body msut be
router.get('/send', ensureAuthenticated, emailController.sendEmail)


module.exports=router;
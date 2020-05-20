const express = require('express');
const router = express.Router();
const {ensureAuthenticated, forwardAuthenticated } = require('../config/auth');


// Bring in User Controller
const userController = require('../controllers/user-controller.js');

// Get Registration form
router.get('/register', function(req, res){
  res.render('register');
});

//Create User
router.post('/register', userController.validationChecks, userController.registerUser);

// Login Form
router.get('/login', function(req, res) {
  res.render('login');
});

router.get('/', function(req, res) {
  res.redirect('/');
});

// Login Process
router.post('/login', userController.loginUser);

//logout
router.get('/logout', userController.logoutUser);


//*------------------ Preferences Routes -------------------* //
const prefController = require('../controllers/preferences-controller.js');

//Load preference form
router.get('/preferences', ensureAuthenticated, prefController.userSubscribed);

//Add Site preference
router.post('/preferences', ensureAuthenticated, prefController.selectSite);

module.exports = router;

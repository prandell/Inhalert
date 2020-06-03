const express = require('express');
const router = express.Router();
const {ensureAuthenticated, forwardAuthenticated } = require('../config/auth');


// Bring in User Controller
const userController = require('../controllers/users.js');

// Get Registration form
router.get('/register', function(req, res){
  res.render('register');
});

//Create User
router.post('/register', userController.validationChecks, userController.registerUser);

// Login Form
router.get('/login', forwardAuthenticated, function(req, res) {
  res.render('login');
});

// Login Process
router.post('/login', userController.loginUser);

//logout
router.get('/logout', userController.logoutUser);


//*------------------ Preferences Routes -------------------* //
const prefController = require('../controllers/preferences.js');

//Load preference form
router.get('/preferences', ensureAuthenticated, prefController.userSubscribed);

//Add Site preference
router.post('/preferences', ensureAuthenticated, prefController.selectSite);


//*------------------ Account Routes -------------------* //
const accountController = require('../controllers/account.js');

router.get('/account', ensureAuthenticated, (req, res) => {
  res.render('account', {
    user: req.user
  })
});

//Delete account
router.post('/delete', accountController.deletionChecks, accountController.deleteUser);

//Update email
router.post('/update', accountController.updateChecks, accountController.updateUser);

//All other routes
router.all('*', (req, res) => {
  req.flash('error_msg', '404: The page you tried to access doesn\'t exist');
  res.redirect('/dashboard')
});

module.exports = router;

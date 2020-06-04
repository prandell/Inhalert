const express = require('express');
const router = express.Router();
const {ensureAuthenticated, forwardAuthenticated } = require('../config/auth');

// Bring in User Controller
const userController = require('../controllers/users.js');

/**
 * Render registration form
 */
router.get('/register', function(req, res){
  res.render('register');
});

/**
 * Post registration form
 */
router.post('/register', userController.validationChecks, userController.registerUser);

/**
 * Render login form
 */
router.get('/login', forwardAuthenticated, function(req, res) {
  res.render('login');
});

/**
 * Post login form
 */
router.post('/login', userController.loginUser);

/**
 * Logout
 */
router.get('/logout', userController.logoutUser);


//*------------------ Preferences Routes -------------------* //
const prefController = require('../controllers/preferences.js');

/**
 * Render preference page
 */
router.get('/preferences', ensureAuthenticated, prefController.userSubscribed);

/**
 * Post preference update
 */
router.post('/preferences', ensureAuthenticated, prefController.selectSite);


//*------------------ Account Routes -------------------* //
const accountController = require('../controllers/account.js');

/**
 * Render account page, passing in user
 */
router.get('/account', ensureAuthenticated, (req, res) => {
  res.render('account', {
    user: req.user
  })
});

/**
 * Post a request to delete user account
 */
router.post('/delete', accountController.deletionChecks, accountController.deleteUser);

/**
 * Post a request to update email address
 */
router.post('/update', accountController.updateChecks, accountController.updateUser);

/**
 * redirect any other onward routes to dashboard
 */
router.all('*', (req, res) => {
  req.flash('error_msg', '404: The page you tried to access doesn\'t exist');
  res.redirect('/dashboard')
});

module.exports = router;

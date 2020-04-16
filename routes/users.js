const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport')


// Bring in User Controller
const userController = require('../controllers/user-controller.js');

//Passport
// GET THE FUNCTIONS FROM CONTROLLER
const initialisePassport = require('../config/passport-config')
initialisePassport(
    passport, userController.getUser, userController.getUserById
)

// Get Registration form
router.get('/register', function(req, res){
  res.render('register');
});

//Create User
router.post('/register', userController.registerUser);

// Login Form
router.get('/login', function(req, res) {
  res.render('login');
});

// Login Process
router.post('/login', userController.loginUser);

// // logout
// router.get('/logout', function(req, res){
//   req.logout();
//   req.flash('success', 'You are logged out');
//   res.redirect('/users/login');
// });

module.exports = router;

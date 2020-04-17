const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport')

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

// Login Process
router.post('/login', userController.loginUser);

//logout
router.get('/logout', userController.logoutUser);

module.exports = router;

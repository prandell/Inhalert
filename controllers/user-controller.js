const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const {check, validationResult} = require('express-validator');

// Bring in User Model
let User = require('../models/user');

const registerUser = function(req, res, next) {
    const name = req.body.name;
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const password2 = req.body.password2;

    //Validation of form
    check('name', 'Name is required').notEmpty();
    check('email', 'Email is required').notEmpty();
    check('email', 'Email is not valid').isEmail();
    check('username', 'Username is required').notEmpty();
    check('password', 'Password is required').notEmpty();
    check('password2', 'Passwords do not match').equals(req.body.password);

    //Get any of the errors
    let errors = validationResult(req);

    //If errors exist, re-render the page, passing along the errors
    if(!errors.isEmpty()) {
        res.render('register', {
            errors: errors
        });
    } else {
        let newUser = new User({
            name:name,
            email:email,
            username:username,
            password:password
        });

        //Encrypting the password and saving the user's credentials
        bcrypt.genSalt(10, function(err, salt){
            bcrypt.hash(newUser.password, salt, function(err, hash){
                if(err){
                    console.log(err);
                }
                newUser.password = hash;
                newUser.save(function(err){
                    if(err){
                        req.flash("error", err.message);
                        return res.render("register");
                    } else {
                        req.flash('success','You are now registered and can log in');
                        console.log(newUser)
                        res.redirect('/users/login');
                    }
                });
            });
        });
    }
};

const loginUser = function(req, res, next) {
    passport.authenticate('local', {
        successRedirect:'/',
        failureRedirect:'/users/login',
        failureFlash: true
    })(req, res, next);
};

const getUser = function(username) {
    let user = User.find(user => user.username == username);
    if (user == null) {
        user = User.find(user => user.email == username)
    }
    return user
}

const getUserById = function(id) {
   return User.find(user => user.id === id);
}


// var findAllCafes = function(req, res, next) {
//     Cafe.find()
//         .lean()
//         .then(function(doc) {
//             res.render('index', {items: doc});
//         });
// };
//
// var createCafe = function(req, res, next) {
//     var item = {
//         name:req.body.name,
//         address:req.body.address,
//         distance:req.body.distance,
//         rating:req.body.rating,
//         photo:req.body.photo
//     };
//
//     var data = new Cafe(item);
//     data.save();
//
//     res.redirect('/');
// };
//
// var updateCafe = function(req, res, next) {
//     var id = req.body.id;
//
//     Cafe.findById(id, function(err, doc) {
//         if (err) {
//             console.error('error, no cafe found');
//         }
//         doc.name = req.body.name;
//         doc.address = req.body.address;
//         doc.distance = req.body.distance;
//         doc.rating = req.body.rating;
//         doc.photo = req.body.photo;
//         doc.save();
//     });
//     res.redirect('/');
// };
//
// var deleteCafe = function(req, res, next) {
//     var id = req.body.id;
//     Cafe.findByIdAndRemove(id).exec();
//     res.redirect('/');
// };

module.exports.registerUser = registerUser;
module.exports.loginUser = loginUser;
module.exports.getUser = getUser;
module.exports.getUserById = getUserById;
// module.exports.findAllCafes = findAllCafes;
// module.exports.createCafe = createCafe;
// module.exports.updateCafe = updateCafe;
// module.exports.deleteCafe = deleteCafe;
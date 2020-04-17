const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const {check, validationResult} = require('express-validator');

// Bring in User Model
const User = mongoose.model('User');

//Express validator check array
const validationChecks = [check("name", 'Name is required').notEmpty(),
    check("email", 'Email is required').notEmpty(),
    check("password", 'Password is required').notEmpty(),
    check("password", 'Password must be at least 6 Characters').isLength({min:6}),
    //Email valid
    check("email", 'Email is not valid').isEmail(),
    //Passwords match
    check("password2", 'Passwords do not match').custom((value, {req, loc, path}) => {
        if (value !== req.body.password) {
            throw new Error("Passwords don't match");
        } else {
            return value;
        }
    })]

//Register user function
const registerUser = function(req, res) {
    const {name, email, password, password2} = req.body

    //Get any of the errors
    let errors = validationResult(req);

    console.log(errors)
    //If errors exist, re-render the page, passing along the errors
    if (!errors.isEmpty()) {
        res.render('register', {
            errors: errors.array(),
            name,
            email
        });
    } else {
        // Validation passed, but does user exist?
        User.findOne({email: email}).then(user => {
            if(user) {
                errors = [{msg: 'Email already exists'}]
                res.render('register', {
                    errors: errors,
                    name,
                    email
                });
            } else {
                const newUser = new User({
                    name: name,
                    email: email,
                    password: password
                });

                //Encrypting the password and saving the user's credentials
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if (err) throw err;
                        newUser.password = hash;
                        newUser
                            .save()
                            .then(user => {
                                req.flash(
                                    'success_msg',
                                    'You are now registered and can log in'
                                );
                                res.redirect('/users/login');
                            })
                            .catch(err => console.log(err));
                    });
                });
            }
        });
    }
}


//Login user function
const loginUser = function(req, res, next) {
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req,res,next);
}

//Logout user function
const logoutUser = function(req, res){
    req.logout();
    req.session.destroy();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/users/login');
}



module.exports.registerUser = registerUser;
module.exports.loginUser = loginUser;
module.exports.logoutUser = logoutUser;
module.exports.validationChecks = validationChecks;
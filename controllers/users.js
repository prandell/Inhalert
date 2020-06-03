const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const {check, validationResult} = require('express-validator');

// Bring in User Model
const User = mongoose.model('User');

/**
 * Form validation checking middleware. Occur prior to any database queries.
 */
const validationChecks = [check("name", 'Name is required').notEmpty(),
    check("email", 'Email is required').notEmpty(),
    check("password", 'Password is required').notEmpty(),
    check("password", 'Password must be at least 6 Characters').if(check("password").notEmpty()).isLength({min:6}),
    //Email valid
    check("email", 'Email is not valid').if(check("email").notEmpty()).isEmail(),
    //Passwords match
    check("password2", 'Passwords do not match').if(check("password").notEmpty()).custom((value, {req, loc, path}) => {
        if (value !== req.body.password) {
            throw new Error("Passwords don't match");
        } else {
            return value;
        }
    })]

/**
 * Registers a new user and redirects to preferences
 * Args:
 *  req: Http request object, with registration form values
 *  res: Http response object
 * Returns:
 *  re-renders register page if any validation fails
 *  redirects to preferences and adds new user to database on success
 */
const registerUser = function(req, res) {
    const {name, email, password, password2} = req.body
    //Get any of the errors
    let errors = validationResult(req);

    //If errors exist, re-render the page, passing along the errors
    if (!errors.isEmpty()) {
        res.status(400).render('register', {
            errors: errors.array(),
            name,
            email
        });
    } else {
        // Validation passed, but does user exist?
        User.findOne({email: email}).then(user => {
            if(user) {
                errors = [{msg: 'Email already exists'}]
                res.status(400).render('register', {
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
                            .save().then(user => {
                                req.login(user, function (err) {
                                    if (! err) {
                                        req.flash(
                                            'success_msg',
                                            'Finish registration by subscribing to a Site'
                                        );
                                        res.redirect('/users/preferences');
                                    } else {
                                        console.log(err)
                                        res.redirect('/users/login')
                                    }
                                })
                            })
                            .catch(err => console.log(err));
                    });
                });
            }
        });
    }
}


/**
 * Authenticates a user session and redirects to dashboard
 * Args:
 *  req: Http request object, containing login form values
 *  res: Http response object
 * Returns:
 *  re-renders login page on failed authentication
 *  redirects to dashboard on success
 */
const loginUser = function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
        if (err) { return next(err) }
        if (!user) {
            return res.status(401).render('login', { error: info.message })
        }
        req.login(user, function(err) {
            if (err) { return next(err); }
            req.flash(
                'success_msg',
                'Welcome '+user.name
            );
            return res.redirect('/dashboard');
        });
    })(req,res,next);
}

/**
 * Ends a user session
 * Args:
 *  req: Http request object
 *  res: Http response object
 * Returns:
 *  redirects to dashboard with success message
 */
const logoutUser = function(req, res){
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/dashboard');
}


module.exports.registerUser = registerUser;
module.exports.loginUser = loginUser;
module.exports.logoutUser = logoutUser;
module.exports.validationChecks = validationChecks;
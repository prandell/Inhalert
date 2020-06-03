const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const {check, validationResult} = require('express-validator');

// Bring in Models
const User = mongoose.model('User');
const SiteSub = mongoose.model('SiteSub');

//Form validation
const updateChecks = [check("email", 'Email is required').notEmpty(),
    check("password", 'Password is required').notEmpty(),
    check("email", 'Email is not valid').if(check("email").notEmpty()).isEmail()]

const deletionChecks = [check("password", 'Password is required').notEmpty()]

//Deleting user account
const deleteUser = function(req, res) {
    const {password} = req.body

    let errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(400).render('account', {
            user: req.user,
            errors: errors.array()
        });
    } else {
        //Make sure user exists, and check entered password is correct
        User.findOne({email: req.user.email}).then(async user => {
            bcrypt.compare(password, user.password, async (err, isMatch) => {
                if (err) throw err;
                if (isMatch) {
                    // First delete all subscriptions
                    await SiteSub.deleteMany({email: user.email},  function (err) {if (err) throw err})

                    //Then delete account
                    User.deleteOne({email: user.email}, function (err) {
                        if (err) throw err
                        req.flash(
                            'success_msg',
                            'Account deleted'
                        );
                        res.redirect('/dashboard');
                    })

                //If password is wrong, reload form
                } else {
                    res.status(401).render('account', {
                        user: req.user,
                        error: 'Incorrect password'
                    });
                }
            })

        })
    }
}

//Updating user email
const updateUser = function(req, res) {
    const {password, email} = req.body

    let errors = validationResult(req);

    if (!errors.isEmpty()) {
        res.status(400).render('account', {
            user: req.user,
            errors: errors.array()
        });
    } else {
        //Make sure user exists, and check entered password is correct
        User.findOne({email: req.user.email}).then(async currUser => {
            bcrypt.compare(password, currUser.password, async (err, isMatch) => {
                if (err) throw err;
                if (isMatch) {
                    //Make sure no other user exists for entered new email
                    User.findOne({email: email}).then(async exisUser => {
                        if (exisUser) {
                            errors = [{msg: 'Email already exists'}]
                            res.status(401).render('account', {
                                user: req.user,
                                errors: errors,
                                email
                            });
                        } else {
                            //Change email on all subscriptions
                            await SiteSub.updateMany({email: currUser.email}, {email: email},  function (err) {if (err) throw err})

                            //Change user email
                            User.updateOne({email: currUser.email}, {email: email}, function (err) {
                                if (err) throw err
                                req.flash(
                                    'success_msg',
                                    'Email updated'
                                );
                                res.redirect('/dashboard');
                            })
                        }
                    });
                } else {

                    //Reload form if password was wrong
                    res.status(401).render('account', {
                        user: req.user,
                        error: 'Incorrect password'
                    });
                }
            })
        })
    }
}

module.exports.deleteUser = deleteUser;
module.exports.updateUser = updateUser;
module.exports.deletionChecks = deletionChecks;
module.exports.updateChecks = updateChecks;
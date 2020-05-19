const mongoose = require('mongoose');

// Bring in User Model
const Site = mongoose.model('Site');
const SiteSub = mongoose.model('SiteSub')

const selectSite = function(req, res) {

    const {siteSelection} = req.body
    const siteId = siteSelection

    console.log('request body : ', siteId);
    for (let i = 0; i < siteId.length; i++) {
        Site.findOne({siteId: siteId[i]}).then(site => {
            if (!site) {
                errors = [{msg: 'Site could not be found'}]
                res.render('preferences', {
                    errors: errors
                });
            } else {
                SiteSub.findOne({email: req.user.email, siteId: siteId[i]}, function (err, result) {
                    if(err) {
                        console.log(err);
                    }
                    if(!result) {
                        const newSiteSub = new SiteSub({
                            email: req.user.email,
                            siteId: site.siteId
                        });
                        newSiteSub
                            .save()
                            .then(siteSub => {
                                console.log(siteSub);
                                req.flash(
                                    'success_msg',
                                    'You will now receive alerts for the selected site'
                                );
                                ///res.redirect('/dashboard');
                            })
                            .catch(err => console.log(err));
                    }
                })
            }
        })
    }
}

const userSubscribed = function (req, res) {
    SiteSub.find({email: req.user.email}, function(err, result) {
        if(err) {
            console.log(err);
        } else {
            console.log(result)
        }

    })
}

module.exports.selectSite = selectSite;
module.exports.userSubscribed = userSubscribed;
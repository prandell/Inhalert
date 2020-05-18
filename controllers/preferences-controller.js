const mongoose = require('mongoose');

// Bring in User Model
const Site = mongoose.model('Site');
const SiteSub = mongoose.model('SiteSub')

const selectSite = function(req, res) {
    const {siteSelection} = req.body
    const siteId = siteSelection
    Site.findOne({siteId: siteId}).then(site => {
        if(!site) {
            var error = 'Site could not be found'
            res.render('preferences', {
                error: error
            });
        } else {
            const newSiteSub = new SiteSub({
                email: req.user.email,
                siteId: site.siteId
            });
            newSiteSub
                .save()
                .then(siteSub => {
                    req.flash(
                        'success_msg',
                        'You will now receive alerts for the selected site'
                    );
                    res.redirect('/dashboard');
                })
                .catch(err => console.log(err));
        }
    });
}

module.exports.selectSite = selectSite;

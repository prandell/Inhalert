const mongoose = require('mongoose');

// Bring in User Model
const Site = mongoose.model('Site');
const SiteSub = mongoose.model('SiteSub')

const selectSite = async function(req, res) {
    await addSiteSubs(req, res)
    req.flash(
        'success_msg',
        'Preferences Updated Successfully'
    );
    res.redirect('/dashboard')
}

const addSiteSubs = async function (req, res) {
    const siteSelection = JSON.parse(req.body.siteSelection)

    var errors = []
    var success = []
    const ids = [];

    //Only selected sites are ones we wish to keep
    for (const selection of siteSelection) {
        //add them to a list
        await ids.push(selection.siteId)

        //make sure corresponding site exists
        await Site.findOne({siteId: selection.siteId}).then(async site => {
            if (!site) {
                await errors.push({msg: 'No site ID found for ' + selection.siteName})
            } else {
                //determine if site was already subbed to, if not save it
                await SiteSub.findOne({email: req.user.email, siteId: site.siteId}).then(async (siteSub) => {
                    if (!siteSub) {
                        let newSiteSub = await new SiteSub({
                            email: req.user.email,
                            siteId: site.siteId
                        });
                        await newSiteSub.save()
                            .then(async siteSubResult => {
                                await success.push(selection.siteName)
                            })
                            .catch(err => console.log(err));
                    } else {
                        //It exists already, leave it
                    }
                })
            }
        })
            .catch(err => console.log(err))
    }

    //Determine which sites are needed to be removed
    const inThere = await SiteSub.find({email: req.user.email}).exec()
    for (const subbed of inThere) {
        //If it was one of the selected sites do nothing
        if (ids.includes(subbed.siteId)) {
            continue

        //If it wasnt, remove it
        } else {
            await SiteSub.deleteOne({email: req.user.email, siteId: subbed.siteId})
        }
    }
}

const userSubscribed = async function (req, res) {
    var subbed = await SiteSub.find({email: req.user.email}).exec()
    var ids = []
    for (let i=0; i<subbed.length; i++) {
        await ids.push(subbed[i].siteId)
    }
    var subbedSites = await Site.find({siteId: {$in: ids}}).exec()
    res.render('preferences', {
        user: req.user,
        subbed: subbedSites
    });
}

module.exports.selectSite = selectSite;
module.exports.userSubscribed = userSubscribed;
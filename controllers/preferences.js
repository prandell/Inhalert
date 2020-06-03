const mongoose = require('mongoose');

// Bring in User Model
const Site = mongoose.model('Site');
const SiteSub = mongoose.model('SiteSub');
const statusNums = require('../models/statusNums').numKeys;

/**
 * Http handler function for updating site preferences
 * Args:
 *  req: Http request object with preference form information
 *  res: Http response object
 * Returns:
 *  redirects to dashboard with successful update message
 */
const selectSite = async function(req, res) {
    await addSiteSubs(req)
    req.flash(
        'success_msg',
        'Preferences Updated Successfully'
    );
    res.redirect('/dashboard')
}

/**
 * Preference update handler
 * Args:
 *  req: Http request object with preference form information
 *  res: Http response object
 * Returns:
 *  Nothing. Handles the preference updating process and exits.
 */
const addSiteSubs = async function (req) {
    const siteSelection = JSON.parse(req.body.siteSelection)
    const status = parseInt(req.body.statusSelection)

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
                //Update existing sitesub or add new one
                await SiteSub.findOneAndUpdate(
                    {email: req.user.email, siteId: site.siteId},
                    {status: status},
                    {upsert: true, new: true, setDefaultsOnInsert: true})
                    .then(async (siteSub) => {
                        await success.push(selection.siteName)
                    })
                    .catch(err=> console.log(err))
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

/**
 * Finds the current user preferences and loads them into the preference page.
 * Args:
 *  req: Http request object
 *  res: Http response object
 * Returns:
 *  renders preference page with current user preferences
 */
const userSubscribed = async function (req, res) {
    var subbed = await SiteSub.find({email: req.user.email}).exec()
    var ids = []
    for (let i=0; i<subbed.length; i++) {
        await ids.push(subbed[i].siteId)
    }

    //Uses the site Ids to get the site names.
    if (subbed[0]) {
        var status = statusNums[subbed[0].status]
    }
    var subbedSites = await Site.find({siteId: {$in: ids}}).exec()
    res.status(200).render('preferences', {
        user: req.user,
        subbed: subbedSites,
        threshold: status
    });
}

module.exports.selectSite = selectSite;
module.exports.userSubscribed = userSubscribed;
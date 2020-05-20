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

    console.log('request body: ', siteSelection);

    var errors = []
    var info = []
    var success = []
    const ids = [];

    for (const selection of siteSelection) {
        await ids.push(selection.siteId)
        await Site.findOne({siteId: selection.siteId}).then(async site => {
            if (!site) {

                await errors.push({msg: 'No site ID found for ' + selection.siteName})
            } else {

                await SiteSub.findOne({email: req.user.email, siteId: site.siteId}).then(async (siteSub) => {
                    if (!siteSub) {

                        let newSiteSub = await new SiteSub({
                            email: req.user.email,
                            siteId: site.siteId
                        });
                        await newSiteSub.save()
                            .then(async siteSubResult => {
                                console.log(siteSubResult);
                                await success.push(selection.siteName)
                                console.log(success)
                            })
                            .catch(err => console.log(err));
                    } else {

                    }
                })
            }
        })
            .catch(err => console.log(err))
    }

    const inThere = await SiteSub.find({email: req.user.email}).exec()
    console.log(ids)
    for (const subbed of inThere) {
        console.log(subbed.siteId)
        if (ids.includes(subbed.siteId)) {
            continue
        } else {
            await SiteSub.deleteOne({email: req.user.email, siteId: subbed.siteId})
        }
    }

    // var success_msg = 'Subscribed to '
    // if (success[0]) {
    //     for (const yes of success) {
    //         success_msg.concat(yes, ', ')
    //     }
    //     success_msg = success_msg.substring(0, success_msg.length - 2)
    //     console.log(success_msg)
    // }

    // console.log(errors)
    // console.log(info)
    // console.log(success)
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
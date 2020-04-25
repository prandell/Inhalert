var mongoose = require('mongoose');
const Site = mongoose.model('Site');
const SiteSub = mongoose.model('SiteSub');

const emailController = require('../controllers/email-controller')

var query = {siteId: "4afe6adc-cbac-4bf1-afbe-ff98d59564f9", siteName: "Melbourne CBD"};
var update = {status: "Poor"}
var options = {
    upsert: true,
    new: true,
    setDefaultsOnInsert: true,
    rawResult: true
};
Site.findOneAndUpdate(query, update, options, function(error, result) {
    if (error) {
        console.log(error);
    } else if (result.lastErrorObject.updatedExisting && (result.value.status == 'Poor' || result.value.status =='Moderate')) {
        SiteSub.find({siteId: result.value.siteId}).then(subs => {
            for (let s in subs) {
                emailController.nodeMailerSend(subs[s].email,
                    "Air Quality "+result.value.status+ " at "+ "Melbourne CBD",
                    "This message was sent to you by Inhalert. We will notify you when the status changes" )
            }
        });
    }
});
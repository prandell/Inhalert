const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Site Subscription model. It has a Many to one relationship with both Site and User.
 * It determines which users have subscribed to which sites, and the status number
 * representing the threshold by which users wish to be notified for.
 */
const SiteSubSchema = new Schema({
    email: {
        type: String,
        required: true,
        trim: true
    },
    siteId: {
        type: String,
        required: true,
        trim: true
    },
    status: {
        type: Number,
        required: true,
        default: 3
    }
}, {
    timestamps: true,
    collection: 'site_subs'
});

mongoose.model('SiteSub', SiteSubSchema);
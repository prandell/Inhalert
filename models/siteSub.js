const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// User Schema
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
    }
}, {
    timestamps: true,
    collection: 'site_subs'
});

mongoose.model('SiteSub', SiteSubSchema);
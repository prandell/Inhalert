const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Site Sub Schema.
// A new entry is created for each Site a user subscribes to.
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
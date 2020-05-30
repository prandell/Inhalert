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
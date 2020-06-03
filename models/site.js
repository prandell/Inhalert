const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Site model. Stores name, status, Id and a boolean representing whether alerts have been sent out
 * for this particular site or not.
 */
const SiteSchema = new Schema({
    siteName: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        trim: true,
        default: "Unavailable"
    },
    siteId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    alerted: {
        type: Boolean,
        required: true,
        default: false
    }
}, {
    timestamps: true,
    collection: 'sites'
});

mongoose.model('Site', SiteSchema);


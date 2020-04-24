const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Site Schema
const SiteSchema = new Schema({
    siteName: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    isActive: {
        type: Boolean,
        required: true
    },
    siteId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    }
}, {
    timestamps: true,
    collection: 'users'
});

mongoose.model('Site', SiteSchema);

//There seems to be 40 different sites. Found by "All Air Monitoring Sites" queries.
// https://gateway.api.epa.vic.gov.au/environmentMonitoring/v1/sites?environmentalSegment=air&location=[long,lat]
//Unique names and Ids. Usually have a "healthAdvice" (= "status" above) parameter nested, but not always
//These should be stored and updated

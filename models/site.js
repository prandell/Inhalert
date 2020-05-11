const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Site Schema
// Stores the Sensor Site along with its ID and current healthAdvice status
const SiteSchema = new Schema({
    siteName: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true,
        default: "Unavailable"
    },
    siteId: {
        type: String,
        required: true,
        unique: true,
        trim: true
    }
}, {
    timestamps: true,
    collection: 'sites'
});

mongoose.model('Site', SiteSchema);

//There seems to be 40 different sites. Found by "All Air Monitoring Sites" queries.
// https://gateway.api.epa.vic.gov.au/environmentMonitoring/v1/sites?environmentalSegment=air&location=[long,lat]
//Unique names and Ids. Usually have a "healthAdvice" (= "status" above) parameter nested, but not always
//These should be stored and updated

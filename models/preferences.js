const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// This model will be for enhancing the preferences a user can alter.
const PrefSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    // pollutants: {
    //     type: Array,
    //     required: true
    // },
    // when: {
    //     type: enum,
    //     required: true
    // }

}, {
    timestamps: true,
    collection: 'preferences'
});

mongoose.model('Preferences', PrefSchema);

const mongoose = require('mongoose');

// credit to https://github.com/bradtraversy/nodekb
// User Schema
const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    password: {
        type: String,
        required: true,
    }
}, {
    timestamps: true,
});

const User = module.exports = mongoose.model('User', UserSchema);

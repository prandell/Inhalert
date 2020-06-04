const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * User model. Users require a name, email and password (stored as a hash).
 */
const UserSchema = new Schema({
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
    password: {
        type: String,
        required: true,
    }
}, {
    timestamps: true,
    collection: 'users'
});
mongoose.model('User', UserSchema);

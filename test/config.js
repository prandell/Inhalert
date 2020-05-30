var mongoose = require('mongoose');

if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}
// mongoose.set('debug', true);
mongoose.connect(process.env.DB_TEST_URI, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true},
    function(err) {
        if(!err) {
        } else {
            console.log('Failed to connect to mongo!', err);
        }
    });
mongoose.connection.once('open', () => {
    console.log("Testing MongoDB database connection established successfully")
});

require('../models/user');
require('../models/site');
require('../models/siteSub')
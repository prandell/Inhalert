var mongoose = require('mongoose');

/**
 * Connects to database, starts config script and loads in all models
 */
// mongoose.set('debug', true);
mongoose.connect(process.env.DB_URI, {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true},
    function(err) {
        if(!err) {
        } else {
            console.log('Failed to connect to mongo!', err);
        }
    });
mongoose.connection.once('open', () => {
    console.log("MongoDB database connection established successfully")
});

require('./user');
require('./site');
require('./siteSub')
require('../config/db')


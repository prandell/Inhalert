var mongoose = require('mongoose');

const uri = "mongodb+srv://patrick:Inhalert1@cluster0-shs9r.mongodb.net/test?retryWrites=true&w=majority";

mongoose.connect(uri,
    function(err){
    if(!err){
        console.log('Connected to mongo.');
    }else{
        console.log('Failed to connect to mongo!', err);
    }
});


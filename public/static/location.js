const fetch = require("node-fetch");

module.exports = function(postcode) {

    console.log(postcode);

    var url = "http://v0.postcodeapi.com.au/suburbs/"+postcode+'.json';

    fetch(url)
        .then((resp) => resp.json())
        .then(data => {
            var location = [data[0].latitude.toString(), data[0].longitude.toString()].toString();
            console.log(location);
            return location;
        })
        .catch(error => {
            console.log(error);
        })
};


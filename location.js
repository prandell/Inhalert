const fetch = require("node-fetch");

function location(postcode) {

    var url = "http://v0.postcodeapi.com.au/suburbs/"+postcode+'.json';

    fetch(url)
        .then((resp) => resp.json())
        .then(data => {
            return {latitude : data[0].latitude, longitude : data[0].longitude};
        })
        .catch(error => {
            console.log(error);
        })
};

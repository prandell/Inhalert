var request = require("request");

var location = "[-37.8004,144.9681]"
var data_type = "air"; // or "water"
var options = {
  method: "GET",
  url:
    "https://gateway.api.epa.vic.gov.au/environmentMonitoring/v1/sites?environmentalSegment=" +
    data_type +
    // "&location=" +
    // location +
    "\n",
  headers: {
    "X-API-Key": "050c16c08ef84cadb8f92d5d73074b95",
  },
};
request(options, function (error, response) {
  console.log(options.url)
  if (error) throw new Error(error);

  console.log(response.body);
});
// Upon Load, query forecast (No location). Use this to display summary
// https://gateway.api.epa.vic.gov.au/environmentMonitoring/v1/forecasts?environmentalSegment=air
//
// After Entering postcode, use this to get site ID
// All sites (Takes in location header)
// https://gateway.api.epa.vic.gov.au/environmentMonitoring/v1/sites?environmentalSegment=air&location=[long,lat]
//
// By site ID with scientfic parameters
// https://gateway.api.epa.vic.gov.au/environmentMonitoring/v1/sites/c69ed768-34d2-4d72-86f3-088c250758a8/parameters


// POSTCODEAPI
// var request = require("request");
//
// var postcode= "3055"
// var options = {
//   method: "GET",
//   url:
//       "http://v0.postcodeapi.com.au/suburbs/" +
//       postcode +
//       ".json" +
//       "\n",
//   headers: {
//     "Accept": "application/json"
//   },
// };
// request(options, function (error, response) {
//   console.log(options.url)
//   if (error) throw new Error(error);
//
//   console.log(response.body);
// });
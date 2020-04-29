var request = require("request");

request(options, function (error, response) {
  console.log(options.url)
  if (error) throw new Error(error);

  console.log(response.body);
});


// Upon Load, query forecast (No location). Use this to display summary
// https://gateway.api.epa.vic.gov.au/environmentMonitoring/v1/forecasts?environmentalSegment=air
//
// After Entering postcode, use this to get site ID
// https://gateway.api.epa.vic.gov.au/environmentMonitoring/v1/sites?environmentalSegment=air&location=[long,lat]
//
// By site ID with scientfic parameters
// https://gateway.api.epa.vic.gov.au/environmentMonitoring/v1/sites/c69ed768-34d2-4d72-86f3-088c250758a8/parameters
// All sites (Takes in location header)

//POSTCODEAPI
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
var request = require("request");

var location = "melbourne";
var data_type = "air"; // or "water"
var options = {
  method: "GET",
  url:
    "https://gateway.api.epa.vic.gov.au/environmentMonitoring/v1/forecasts?environmentalSegment=" +
    data_type +
    "&location=" +
    location +
    "\n",
  headers: {
    "X-API-Key": "050c16c08ef84cadb8f92d5d73074b95",
  },
};
request(options, function (error, response) {
  if (error) throw new Error(error);
  console.log(response.body);
});

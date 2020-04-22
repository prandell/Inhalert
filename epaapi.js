var myHeaders = new Headers();
myHeaders.append("X-API-Key", "050c16c08ef84cadb8f92d5d73074b95");

var raw = "";

var requestOptions = {
  method: "GET",
  headers: myHeaders,
  body: raw,
  redirect: "follow",
};

fetch(
  "https://gateway.api.epa.vic.gov.au/environmentMonitoring/v1/forecasts?environmentalSegment=air&location=Melbourne\n",
  requestOptions
)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.log("error", error));

//Ajax is imported in layout.pug. Wont work without importing ajax.
//https://cors-anywhere.herokuapp.com/ is needed before url for CORS issues
//Everything inside done was just to get it working
function getForecastSummary() {
    var params = {
        // Request parameters
        "environmentalSegment": "air"
    };
    $.ajax({
        url: "https://cors-anywhere.herokuapp.com/https://gateway.api.epa.vic.gov.au/environmentMonitoring/v1/forecasts?" + $.param(params),
        beforeSend: function (xhrObj) {
            // Request headers
            xhrObj.setRequestHeader("X-API-Key", "050c16c08ef84cadb8f92d5d73074b95");
        },
        type: "GET",
        // Request body
        data: "",
    })
        .done(function (data) {
            console.log(data)
            document.getElementById("hi").textContent = "Summary"
            for (r in data.records) {
                console.log(r)
                document.getElementById("hi").innerHTML += "<li>" + data.records[r].regionName + ": " + data.records[r].title + "</li>";
            }
        })
        .fail(function () {
            console.log()
            alert("error");
        })
};
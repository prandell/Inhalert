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
            // document.getElementById("summaryTable").textContent = "Summary"
            for (let r in data.records) {
                if (document.getElementById("row"+r)) {
                    document.getElementById("row"+r).innerHTML=
                        "<td>" + data.records[r].regionName + "</td>"
                        + "<td id =" + "el" + r + ">"
                        + "<strong>"+ data.records[r].title + "</strong>"
                        + "</td>"
                } else {
                    document.getElementById("summaryTable").innerHTML += "<tr id =" + "row" + r + ">"
                        + "<td>" + data.records[r].regionName + "</td>"
                        + "<td id =" + "el" + r + ">"
                        + "<strong>" + data.records[r].title + "</strong>"
                        + "</td>"
                        + "</tr>";
                }

                document.getElementById("el"+r).style.color = data.records[r].colour
                if (r%2==0) {
                    document.getElementById("row"+r).className += " table-secondary"
                }
            }
        })
        .fail(function () {
            console.log()
            alert("error");
        })
};
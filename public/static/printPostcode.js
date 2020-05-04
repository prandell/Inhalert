function printPostcode() {
    let postcode = document.getElementById('whatsup').value
    $.ajax({
        url: "https://cors-anywhere.herokuapp.com/http://v0.postcodeapi.com.au/suburbs/" + postcode +
            ".json",
        beforeSend: function (xhrObj) {
            // Request headers
            xhrObj.setRequestHeader("Accept", "application/json");
        },
        type: "GET",
        // Request body
        data: "",
    }).done(function (data) {
        var location = `[${data[0].latitude}, ${data[0].longitude}]`
        console.log(location)
        var params = {
            // Request parameters
            "location": location
        };
        $.ajax({
            url: "https://cors-anywhere.herokuapp.com/https://gateway.api.epa.vic.gov.au/environmentMonitoring/v1/sites?environmentalSegment=air&" + $.param(params),
            beforeSend: function (xhrObj) {
                // Request headers
                xhrObj.setRequestHeader("X-API-Key", "050c16c08ef84cadb8f92d5d73074b95");
            },
            type: "GET",
            // Request body
            data: "",
        }).done(function (data) {
            var siteId = data.records[0].siteID
            $.ajax({
                url: `https://cors-anywhere.herokuapp.com/https://gateway.api.epa.vic.gov.au/environmentMonitoring/v1/sites/${siteId}/parameters`,
                beforeSend: function (xhrObj) {
                    // Request headers
                    xhrObj.setRequestHeader("X-API-Key", "050c16c08ef84cadb8f92d5d73074b95");
                },
                type: "GET",
                // Request body
                data: "",
            }).done(function (data) {
                console.log(data)
            });

        });
    });

}

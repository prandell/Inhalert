function convert_postcode() {
    let postcode = document.getElementById('whatsup').value
    if (postcode.length != 4 || isNaN(postcode)) {
        window.location = '/dashboard/siteSummary';
    }
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
        if (!data[0]) {
            console.log("Failed at postcode")
            window.location = '/dashboard/siteSummary';
            return
        }
        var location = `[${data[0].latitude}, ${data[0].longitude}]`
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
            if (!data.records|| !data.records[0].siteID) {
                console.log("failed at EPA")
                window.location = '/dashboard/siteSummary';
                return
            }
            var siteId = data.records[0].siteID
            window.location.href = '/dashboard/siteSummary/'+siteId
        });
    }).fail( function() {
        window.location = '/dashboard/siteSummary'
        return
    });

}

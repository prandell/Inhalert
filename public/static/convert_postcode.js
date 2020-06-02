function convert_postcode() {
    let postcode = document.getElementById('whatsup').value

    //Checking bad values
    // if (postcode.length != 4 || isNaN(postcode)) {
    //     window.location = '/dashboard/siteSummary';
    // }
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
        //Postcode doesnt exist
        if (!data[0]) {
            console.log("Failed at postcode")
            // window.location = '/dashboard/siteSummary';
            return
        }

        //Using longitude/latitude of postcode
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
            //No site close to this postcode (ie, its not Victorian)
            if (!data.records|| !data.records[0].siteID) {
                console.log("failed at EPA")
                window.location = '/dashboard/siteSummary';
                return
            }

            //Display the summary
            var siteId = data.records[0].siteID
            // window.location.href = '/dashboard/siteSummary/'+siteId
        });
    }).fail( function() {

        //Any other failure
        console.log("failed")
        // window.location = '/dashboard/siteSummary'
        return
    });

}

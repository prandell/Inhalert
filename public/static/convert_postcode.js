/**
 * Converts a postcode or suburb name into a longitude & latitude, suitable as parameters
 * to EPA to return the closest site information.
 * Args:
 *  postcode or suburb: In the form of a input value on /dashboard
 * Returns:
 *  Redirects to Summary page with loaded information.
 */
function convert_postcode() {
    //Get value in input field
    let postcode = document.getElementById('whatsup').value

    //Indicate that request is being processed
    document.getElementById('enter').innerText = 'Loading ...'

    //Its not a number, slightly different url
    if (isNaN(postcode)) {
        $.ajax({
            url: "https://cors-anywhere.herokuapp.com/http://v0.postcodeapi.com.au/suburbs.json?" + "name="+postcode+"&state=VIC",
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
                window.location = '/dashboard/siteSummary';
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
                window.location.href = '/dashboard/siteSummary/'+siteId
            });
        }).fail( function() {

            //Any other failure
            console.log("failed")
            window.location = '/dashboard/siteSummary'
            return
        });

    // Its a number. EXACT SAME LOGIC FOLLOWS.
    } else {
        if (postcode.length!= 4) {
            window.location = '/dashboard/siteSummary'
            return
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
            //Postcode doesnt exist
            if (!data[0]) {
                console.log("Failed at postcode")
                window.location = '/dashboard/siteSummary';
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
                window.location.href = '/dashboard/siteSummary/'+siteId
            });
        }).fail( function() {

            //Any other failure
            console.log("failed")
            window.location = '/dashboard/siteSummary'
            return
        });
    }
}

//Ajax is imported in layout.pug. Wont work without importing ajax.
//https://cors-anywhere.herokuapp.com/ is needed before url for CORS issues
//Everything inside done was just to get it working
function getSiteSummary() {
    $.ajax({
        url: "/sites/fetchAll",
        type: "GET",
        // Request body
        data: "",
    })
        .done(async function (data) {

            //Upon refresh being pressed, scroll to top and reset table
            if (document.getElementById("summaryTable").childElementCount > 2) {
                $('html, body').animate({
                    scrollTop: 250,
                }, 1000, "easeInOutExpo"); // for all browsers
                await sleep(1000)
                document.getElementById("summaryTable").innerHTML = "<thead class=\"table-primary\"><tr><th scope=\"col\">Site</th><th scope=\"col\">Air Quality Status</th></tr></thead>"
            }
            //Load in the colours array so that status values can be loaded in with their correct colour, not after being loaded
            $.getJSON("/static/colours.json", function (jsonstuff) {

                //Creating table entries from data
                for (let r in data) {

                    document.getElementById("summaryTable").innerHTML +=

                        //Giving each row group of 10 unique classes, for the see more button functionality
                        "<tr class =" + "rows" + Math.ceil(r / 10) + " id=" + "row" + r + ">"

                        //Adding values, and relevant classes
                        + "<td>"
                        + "<a" + " style=\"color:black;\"" + " href=\"/dashboard/siteSummary/" + data[r].siteId + "\">"
                        + data[r].siteName + "</a>"
                        + "</td>"
                        + "<td id =" + "el" + r + " class=" + "\"status_cell badge badge-pill\""
                        + " style=\"color:#f9faff;background-color:" + jsonstuff[data[r].status]+"\""
                        + ">"
                        + data[r].status
                        + "</td>"
                        + "</tr>";


                    //Alternating table row background colours
                    if (r % 2 == 0) {
                        document.getElementById("row" + r).className += " table-secondary"
                    }
                }

                //Hiding most of the entries
                var hide = document.querySelectorAll('.rows2, .rows3, .rows4')
                for (var i = 0; i < hide.length; i++) {
                    hide[i].style.display = 'none';
                }
            })
        })
        .fail(function () {
            alert("Error occured retrieving content");
        })
};

//Custom sleep function used in the timing of scrolling on refresh
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

//Show more button functionality
function loadMoreButton() {

    //Scroll first
    if (document.getElementById("loadmore").innerText=="Show Less") {
        $('html, body').animate({
            scrollTop: 180,
        }, 1000, "easeInOutExpo"); // for all browsers
    }

    //Second group of 10
    var second = document.getElementsByClassName('rows2')
    if (second[0].style.display == 'none') {
        for (var i=0; i<second.length; i++) {
            second[i].style.display='table-row';
        }
        return
    }

    //Third group of 10
    var third = document.getElementsByClassName('rows3')
    if (third[0].style.display == 'none') {
        for (var i=0; i<third.length; i++) {
            third[i].style.display='table-row';
        }
        return
    }

    //Last group of 10
    var fourth = document.getElementsByClassName('rows4')
    if (fourth[0].style.display == 'none') {
        for (var i=0; i<fourth.length; i++) {
            fourth[i].style.display='table-row';
        }
        document.getElementById('loadmore').innerText= "Show Less"
        return
    }

    //Back to the start
    setTimeout( function() {
        var hide = document.querySelectorAll('.rows2, .rows3, .rows4')
        for (var i=0; i<hide.length; i++) {
            hide[i].style.display='none';
        }
        document.getElementById('loadmore').innerText= "Show More"
    }, 1200)

    return
}

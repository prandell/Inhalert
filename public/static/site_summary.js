//Ajax is imported in layout.pug. Wont work without importing ajax.
//https://cors-anywhere.herokuapp.com/ is needed before url for CORS issues
//Everything inside done was just to get it working
function getSiteSummary() {
    $.ajax({
        url: "http://localhost:3000/sites/fetchAll",
        type: "GET",
        // Request body
        data: "",
    })
        .done(function (data) {

            //Creating table entries
            for (let r in data) {
                //Giving each row group of 10 unique classes, for the see more button functionality
                document.getElementById("summaryTable").innerHTML +=
                    //Giving each row group of 10 unique classes, for the see more button functionality
                    "<tr class =" + "rows" + Math.ceil(r/10) +  " id=" + "row"+ r + ">"

                    //Adding values, and relevant classes
                    + "<td>" + data[r].siteName + "</td>"
                    + "<td id =" + "el" + r + " class="+ "\"status_cell badge badge-pill\"" + ">"
                    + "<strong>" + data[r].status + "</strong>"
                    + "</td>"
                    + "</tr>";

                //Changing the colour of the badge depending on the status
                $.getJSON("/static/colours.json", function (data) {
                    document.getElementById("el" + r).style.backgroundColor = data[document.getElementById("el" + r).innerText]
                })

                //Alternating table row background colours
                if (r % 2 == 0) {
                    document.getElementById("row" + r).className += " table-secondary"
                }
            }

            //Hiding most of the entries
            var hide = document.querySelectorAll('.rows2, .rows3, .rows4')
            for (var i=0; i<hide.length; i++) {
                hide[i].style.display='none';
            }
        })
        .fail(function () {
            console.log()
            alert("error");
        })
};

//Show more button functionality
function loadMoreButton() {
    var second = document.getElementsByClassName('rows2')
    if (second[0].style.display == 'none') {
        for (var i=0; i<second.length; i++) {
            second[i].style.display='table-row';
        }
        return
    }

    var third = document.getElementsByClassName('rows3')
    if (third[0].style.display == 'none') {
        for (var i=0; i<third.length; i++) {
            third[i].style.display='table-row';
        }
        return
    }

    var fourth = document.getElementsByClassName('rows4')
    if (fourth[0].style.display == 'none') {
        for (var i=0; i<fourth.length; i++) {
            fourth[i].style.display='table-row';
        }
        document.getElementById('loadmore').innerText= "Show Less"
        setTimeout(function() {
            document.getElementById('loadmore').className += " js-scroll-trigger"
            document.getElementById('loadmore').href = "#top"
        }, 500)
        return
    }


    setTimeout( function() {
        var hide = document.querySelectorAll('.rows2, .rows3, .rows4')
        for (var i=0; i<hide.length; i++) {
            hide[i].style.display='none';
        }
    }, 500)
    setTimeout(function () {
        document.getElementById('loadmore').className = document.getElementById('loadmore').className.replace(" js-scroll-trigger", "")
        document.getElementById('loadmore').removeAttribute("href")
        document.getElementById('loadmore').innerText= "Show More"
    }, 1000)

    return
}

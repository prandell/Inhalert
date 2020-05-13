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
            // document.getElementById("summaryTable").textContent = "Summary"

            for (let r in data) {
                document.getElementById("summaryTable").innerHTML += "<tr class =" + "rows" + Math.ceil(r/10) + " id=" + "row"+ r + ">"
                    + "<td>" + data[r].siteName + "</td>"
                    + "<td id =" + "el" + r + ">"
                    + "<strong>" + data[r].status + "</strong>"
                    + "</td>"
                    + "</tr>";
                document.getElementById("el" + r).innerText
                $.getJSON("/static/colours.json", function (data) {
                    document.getElementById("el" + r).style.color = data[document.getElementById("el" + r).innerText]
                })
                if (r % 2 == 0) {
                    document.getElementById("row" + r).className += " table-secondary"
                }
            }
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
    }, 1000)
    setTimeout(function () {
        document.getElementById('loadmore').className = document.getElementById('loadmore').className.replace(" js-scroll-trigger", "")
        document.getElementById('loadmore').removeAttribute("href")
        document.getElementById('loadmore').innerText= "Show More"
    }, 1500)

    return
}

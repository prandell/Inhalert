
function populateSelect() {
    $.getJSON("/static/sites.json", function (data) {
        var select = document.getElementById('sel');
        for (var i = 0; i < data["sites"].length; i++) {
            select.innerHTML = select.innerHTML +
                '<option value="' + data["sites"][i]['siteID'] + '">' + data["sites"][i]['siteName'] + '</option>';
        }
    })
}

function show(element) {
    var msg = document.getElementById('msg');
    var value = element.options[element.selectedIndex].text.replace( /\s/g, '');
    var ele = document.getElementById(value);
    if(!ele) {
        msg.innerHTML +="<li class = 'subs' id ="+ element.options[element.selectedIndex].text.replace( /\s/g, '') + ' value =' + element.value + "> Selected: " + element.options[element.selectedIndex].text + "<span class='close'>x</span></li>";
    }
        ///+'ID: <b>' + element.value + '</b> </li> ';
}

function removeSelected() {
    /* Get all elements with class="close" */
    let closebutton = document.getElementsByClassName('close');
    let i;
    console.log(closebutton.length);
    for (i = 0; i< closebutton.length; i++) {
        closebutton[i].addEventListener("click", function () {
            this.parentNode.parentNode.removeChild(this.parentNode);
            ///this.parentElement.style.display = 'none';
            ///this.parentElement.innerHTML = 'none';
            console.log('button clicked');
        });
    }
}

async function getSubs() {
    const subs = document.getElementsByClassName('subs');
    let data = [];
    for (let i = 0; i < subs.length; i++) {
        data.push(subs[i].getAttribute('value'));
    }
    let siteToSub = {
        siteSelection: data
    }
    console.log(siteToSub);
    try {
        const response = await fetch('/users/preferences', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(siteToSub)
        })
                    console.log('completed!',response);
        } catch(err) {
            console.log(err);
        }
}

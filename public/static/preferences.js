
function populateSelect() {
    $.getJSON("/static/sites.json", function (data) {
        var select = document.getElementById('sel');
        for (var i = 0; i < data["sites"].length; i++) {
            select.innerHTML = select.innerHTML +
                "<option value=\"" + data["sites"][i]['siteID'] + "\"" + ">" + data["sites"][i]['siteName'] + '</option>';
        }
    })
}

function show(select) {
    //Changed variable name to 'select' as this is the element passed to show()
    var msg = document.getElementById('msg');
    var value = select.options[select.selectedIndex].value;

    var ele = document.getElementById(value);
    if (!ele) {
        msg.innerHTML += "<li class= \"selected\" id="+ value + " name=" + "\"" + select.options[select.selectedIndex].text + "\"" + " value =" + select.value + "> Selected: " + select.options[select.selectedIndex].text + "<span class='close'>x</span></li>";
    }
}

function removeSelected() {
    /* Get all elements with class="close" */
    let closebutton = document.getElementsByClassName('close');

    for (let i = 0; i< closebutton.length; i++) {
        closebutton[i].addEventListener("click", function () {
            this.parentNode.parentNode.removeChild(this.parentNode);
        });
    }
}


async function gatherPreferences() {
    const selected = document.getElementsByClassName('selected');
    let data = [];
    for (let i = 0; i < selected.length; i++) {
        await data.push({siteId: selected[i].getAttribute('value'), siteName: selected[i].getAttribute('name')});
    }
    return data
}

async function submitPreferences() {
    const siteToSub = await gatherPreferences()

    //Basically creating input for a form programmatically then submitting it
    //This was necessary to follow re-directs and display flash messages properly
    const preferences = document.createElement('input')
    preferences.type = 'hidden';
    preferences.name = 'siteSelection'
    preferences.value = JSON.stringify(siteToSub)

    const form = document.getElementById('preferences-form')
    form.appendChild(preferences)
    form.submit();
}

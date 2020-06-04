/**
 * Populates the select form with options when selected
 */
function populateSelect() {
    //Static site list.
    $.getJSON("/static/sites.json", function (data) {
        var select = document.getElementById('sel');
        for (var i = 0; i < data["sites"].length; i++) {
            select.innerHTML = select.innerHTML +
                "<option value=\"" + data["sites"][i]['siteID'] + "\"" + ">" + data["sites"][i]['siteName'] + '</option>';
        }
    })
    //Assigns colour to current status threshold, if its present.
    $.getJSON("/static/colours.json", function (data) {
        var color = data[document.getElementById('threshold').innerText.trim()]
        document.getElementById('threshold').style.color = color
    })
}

/**
 * Makes selected elements appear below the preference box.
 */
function show(select) {
    var msg = document.getElementById('msg');
    var value = select.options[select.selectedIndex].value;

    var ele = document.getElementById(value);
    if (!ele) {
        msg.innerHTML += "<li class= \"selected alert\" id="+ value + " name=" + "\"" + select.options[select.selectedIndex].text + "\"" + " value =" + select.value + " style=\"background-color:#b8daff;color:#495057;\"" + "> Selected: " + select.options[select.selectedIndex].text + "<span class='close'>×</span></li>";
    }
}

/**
 * Removes selections when 'x' is clicked on an individual selection
 */
function removeSelected() {
    /* Get all elements with class="close" */
    let closebutton = document.getElementsByClassName('close');

    for (let i = 0; i< closebutton.length; i++) {
        closebutton[i].addEventListener("click", function () {
            this.parentNode.parentNode.removeChild(this.parentNode);
        });
    }
}

/**
 * Gathers all selections for submitting
 */
async function gatherPreferences() {
    const selected = document.getElementsByClassName('selected');
    let data = [];
    for (let i = 0; i < selected.length; i++) {
        await data.push({siteId: selected[i].getAttribute('value'), siteName: selected[i].getAttribute('name')});
    }
    return data
}

/**
 * Programmatically creating a form and submitting it. This was chosen instead of using a 'multi-select'
 * form, which look much worse and dont behave in the same way.
 * This was necessary to follow re-directs and display flash messages properly
 */
async function submitPreferences() {
    const siteToSub = await gatherPreferences()
    const status = document.getElementById('status').value

    const preferences = document.createElement('input')
    preferences.type = 'hidden';
    preferences.name = 'siteSelection'
    preferences.value = JSON.stringify(siteToSub)

    const statusThresh = document.createElement('input')
    statusThresh.type = 'hidden';
    statusThresh.name = 'statusSelection'
    statusThresh.value = status

    const form = document.getElementById('preferences-form')
    form.appendChild(preferences)
    form.appendChild(statusThresh)
    form.submit();
}

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
    msg.innerHTML = 'Selected: <b>' + element.options[element.selectedIndex].text + '</b> </br>' +
        'ID: <b>' + element.value + '</b>';
}
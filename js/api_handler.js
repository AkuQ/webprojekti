/**
 *
 * @param {Date} date
 * @param callback
 */
function get_notes(date, callback) {
    date.setDate(1);
    var start = date.toISOString().substr(0, 10);

    date.setMonth(date.getMonth() + 1);
    date.setDate(0);
    var end = date.toISOString().substr(0, 10);

    REST_notes('GET', {start: start, end: end}, callback)
}

function put_notes(note, callback) {
    REST_notes('PUT', note, callback)
}

function delete_notes(note, callback) {
    REST_notes('DELETE', note, callback)
}

function REST_notes(method, params, callback) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            callback(JSON.parse(this.responseText));
        }
    };

    var url = 'http://vbox_ubuntu/calendar/api/index.php/notes';
    if(method === 'GET') {
        url += "?" + Object
            .keys(params)
            .map(function(key){
                return key+"="+encodeURIComponent(params[key])
            })
            .join("&")
    }

    xhttp.open(method, url);
    xhttp.setRequestHeader('Content-Type', 'application/json');
    xhttp.send(JSON.stringify(params));
}



var calendar_notes = {
    "2018-12-18": {
        0: {id: 0, title: 'test', description: 'test', date: '2018-12-18'},
        1: {id: 1, title: 'test', description: 'test', date: '2018-12-18'},
        2: {id: 2, title: 'test', description: 'test------------------|', date: '2018-12-18'},
        3: {id: 3, title: 'test....asdsadsadasdasdsad', description: 'test', date: '2018-12-18'},
        4: {id: 4, title: 'test', description: 'test', date: '2018-12-18'},
    }
};


/**
 * @param {Date} date
 * @param {Element} calendar
 */
function showMonth(date, calendar) {
    calendar.innerHTML = '';

    var date_it = new Date(date.getTime());
    date_it.setDate(0);
    date_it.setDate(date_it.getDate() - date_it.getDay() + 1);

    var displayed_months = {};
    displayed_months[date.getMonth()] = true;
    displayed_months[date_it.getMonth()] = true;

    var table = document.createElement("table");

    while(date_it.getMonth() in displayed_months) {
        var row = document.createElement("tr");

        for(var i = 0; i < 7; i++) {
            row.appendChild(genDateCellHTML(date_it));
            date_it.setDate(date_it.getDate() + 1);
        }
        table.appendChild(row);
    }
    calendar.appendChild(table);

    setCalendarListeners(table, date.getMonth());
    document.querySelector("#note").style.visibility = "hidden";
    document.querySelector("#right").style.visibility = "hidden";
}

/**
 *
 * @param {Date} date
 * @return {Element}
 */
function genDateCellHTML(date) {
    var cell = document.createElement("td");
    cell.id = date.toISOString().substr(0, 10);
    cell.setAttribute("month", date.getMonth().toString());
    cell.setAttribute("day", date.getDate().toString());
    cell.setAttribute("date", date.getTime().toString());
    cell.setAttribute("current_month", "false");

    refreshDateCellHTML(cell);

    return cell;
}

/**
 *
 * @param {Element} cell
 */
function refreshDateCellHTML(cell) {
    cell.innerHTML = "";

    var header = document.createElement("div");
    header.classList.add("header");
    {
        var label = document.createElement("label");
        label.innerHTML = cell.getAttribute("day");
        header.appendChild(label);

        var divider = document.createElement("hr");
        header.appendChild(divider);
    }
    cell.appendChild(header);


    var content = document.createElement("div");
    content.classList.add("content");
    for(var key in notes = (calendar_notes[cell.id] || {})) {
        var note = notes[key];
        content.innerHTML += note.title + "<br>";
    }
    cell.appendChild(content);

}

function setCalendarListeners(table, current_month) {
    table.querySelectorAll('td[month="' + current_month + '"]').forEach(function (cell) {
        cell.setAttribute("current_month", "true");

        cell.onclick = function (evt) {
            var date = new Date(parseInt(evt.currentTarget.getAttribute("date")));

            showNotesList(date.toISOString().substr(0, 10));
        }
    });
}

function showNotesList(iso_date) {
    var notes = calendar_notes[iso_date] || {};
    document.querySelector("#right h1").innerHTML = iso_date;

    var list = document.querySelector("#notes_list");
    list.innerHTML = "";

    for(var note_id in notes) {
        let note = notes[note_id];
        var note_item = document.createElement('li');
        {
            var title = document.createElement('div');
            title.innerHTML = note.title;
            title.onclick = function () {
                showNote(note);
            };

            note_item.appendChild(title);

            var delete_button = document.createElement("button");
            delete_button.innerHTML = "Delete";
            delete_button.onclick = function () {
                delete calendar_notes[iso_date][note.id];
                refreshDateCellHTML(document.getElementById(iso_date));
                showNotesList(iso_date);
            };
            note_item.appendChild(delete_button);
        }
        list.appendChild(note_item);
    }

    document.querySelector("#note_new").onclick = function () {
        showNote({id: null, title: "", description: "", date: iso_date})
    };

    document.querySelector("#note").style.visibility = "hidden";
    document.querySelector("#right").style.visibility = "visible";
}

function showNote(note) {
    var title = document.querySelector("#note_title");
    var description = document.querySelector("#note_description");
    var save = document.querySelector("#note_save");

    title.value = note.title;
    description.value = note.description;

    save.onclick = function() {
        note.title = title.value;
        note.description = description.value;
        saveNote(note);
    };

    document.querySelector("#note").style.visibility = "visible";
}

//temp
var id_counter = 100;

function saveNote(note) {
    if (note.id) {
        // calendar_notes[note.date][calendar_notes[note.date].length || 1] = note;
    }
    else {
        if(!calendar_notes[note.date])
            calendar_notes[note.date] = {};
        note.id = id_counter++;
        calendar_notes[note.date][note.id] = note;
    }
    showNotesList(note.date);
    refreshDateCellHTML(document.getElementById(note.date));
}
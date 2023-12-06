/*
 * function for filtering out information and pushing inside the table
 *
 * @param {JSON_OBJ} desc->course_section
 */

function push_to_table (datum) {


    for(let i=0; i< datum["classLabSchedule"].length; i++){

        // defining regex for filtering out Day, Time and Room subsequently from each iteration
        let room = datum["classLabSchedule"][i].match(/-\s*\d{2}:\d{2}\s(AM|PM)-\s*([^\)]+)/)[2];
        let day = datum["classLabSchedule"][i].match(/^\w+(?=\()/)[0];
        let time = datum["classLabSchedule"][i].match(/\d{2}:\d{2}\s(A|P)M-\d{2}:\d{2}\s(A|P)M/g)[0];

        // making the details for inserting inside table cell
        let details = `${datum['courseCode']}-${datum['courseDetails'].split("-")[1].replace(/^\[|\]$/g, '')}-${datum['empShortName']}-${room}`;

        // self explanatory I guess
        if (day == "Sunday") {
            switch (time) {
                case "08:00 AM-09:20 AM":
                    check("1-1", details);
                    break;
                case "09:30 AM-10:50 AM":
                    check("2-1", details);
                    break;
                case "11:00 AM-12:20 PM":
                    check("3-1", details);
                    break;
                case "12:30 PM-01:50 PM":
                    check("4-1", details);
                    break;
                case "02:00 PM-03:20 PM":
                    check("5-1", details);
                    break;
                case "03:30 PM-04:50 PM":
                    check("6-1", details);
                    break;
                case "05:00 PM-06:20 PM":
                    check("7-1", details);
                    break;
                default:
            }
        } else if (day == "Monday") {
            switch (time) {
                case "08:00 AM-09:20 AM":
                    check("1-2", details);
                    break;
                case "09:30 AM-10:50 AM":
                    check("2-2", details);
                    break;
                case "11:00 AM-12:20 PM":
                    check("3-2", details);
                    break;
                case "12:30 PM-01:50 PM":
                    check("4-2", details);
                    break;
                case "02:00 PM-03:20 PM":
                    check("5-2", details);
                    break;
                case "03:30 PM-04:50 PM":
                    check("6-2", details);
                    break;
                case "05:00 PM-06:20 PM":
                    check("7-2", details);
                    break;
                default:
            }
        } else if (day == "Tuesday") {
            switch (time) {
                case "08:00 AM-09:20 AM":
                    check("1-3", details);
                    break;
                case "09:30 AM-10:50 AM":
                    check("2-3", details);
                    break;
                case "11:00 AM-12:20 PM":
                    check("3-3", details);
                    break;
                case "12:30 PM-01:50 PM":
                    check("4-3", details);
                    break;
                case "02:00 PM-03:20 PM":
                    check("5-3", details);
                    break;
                case "03:30 PM-04:50 PM":
                    check("6-3", details);
                    break;
                case "05:00 PM-06:20 PM":
                    check("7-3", details);
                    break;
                default:
            }
        } else if (day == "Wednesday") {
            switch (time) {
                case "08:00 AM-09:20 AM":
                    check("1-4", details);
                    break;
                case "09:30 AM-10:50 AM":
                    check("2-4", details);
                    break;
                case "11:00 AM-12:20 PM":
                    check("3-4", details);
                    break;
                case "12:30 PM-01:50 PM":
                    check("4-4", details);
                    break;
                case "02:00 PM-03:20 PM":
                    check("5-4", details);
                    break;
                case "03:30 PM-04:50 PM":
                    check("6-4", details);
                    break;
                case "05:00 PM-06:20 PM":
                    check("7-4", details);
                    break;
                default:
            }
        } else if (day == "Thursday") {
            switch (time) {
                case "08:00 AM-09:20 AM":
                    check("1-5", details);
                    break;
                case "09:30 AM-10:50 AM":
                    check("2-5", details);
                    break;
                case "11:00 AM-12:20 PM":
                    check("3-5", details);
                    break;
                case "12:30 PM-01:50 PM":
                    check("4-5", details);
                    break;
                case "02:00 PM-03:20 PM":
                    check("5-5", details);
                    break;
                case "03:30 PM-04:50 PM":
                    check("6-5", details);
                    break;
                case "05:00 PM-06:20 PM":
                    check("7-5", details);
                    break;
                default:
            }
        } else if (day == "Saturday") {
            switch (time) {
                case "08:00 AM-09:20 AM":
                    check("1-7", details);
                    break;
                case "09:30 AM-10:50 AM":
                    check("2-7", details);
                    break;
                case "11:00 AM-12:20 PM":
                    check("3-7", details);
                    break;
                case "12:30 PM-01:50 PM":
                    check("4-7", details);
                    break;
                case "02:00 PM-03:20 PM":
                    check("5-7", details);
                    break;
                case "03:30 PM-04:50 PM":
                    check("6-7", details);
                    break;
                case "05:00 PM-06:20 PM":
                    check("7-7", details);
                    break;
                default:
            }
        } else {
            console.log("Somthing is wrong I am feeling it!!!");
        }
    }
}


/*
 * checks if the designated table cell is already booked or not
 * inserting in the designated table cells with details accordingly
 *
 * @param {String} table cells id (i.e. "row-column")
 * @param {String} already defined details that should be displayed in the cells
 */

function check(id, details) {

    let elem = document.getElementById(id);
    if (elem.innerHTML != "" && elem.innerHTML != details){
        elem.innerHTML = "<b>" + details + "</b>";
        elem.style.color = "red";
    } else {
        elem.innerHTML = details;
        elem.style.color = "white";
        elem.classList.add("tda")
    }
}

/*
 * removing all the table cells details
 */

function blanking_table(){
    for(let i=1; i<=7; i++){
        for(let j=1; j<=7; j++){
            let id = i + "-" + j;
            document.getElementById(id).innerHTML = "";
        }
    }
}







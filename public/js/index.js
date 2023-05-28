async function start() {

    // poking the schedules route for the json data
    const res = await fetch('/schedules');
    const schedule = await res.json();
    const data = [];

    // regex defined for filtering out the day, time and room from the string
    let re = /\w{2}\(\d{2}:\d{2}\s(A|P)M-\d{2}:\d{2}\s(A|P)M-\w{2}\d{5,6}\)/g;

    // making the data for passing in the dlb (dual list box)
    // also changing ["Day, Time, Room"] entry from string to array by using regex
    for (let i = 1; i < schedule.length; i++) {
        schedule[i]["Day, Time, Room"] = schedule[i]["Day, Time, Room"].match(re);
        data.push({
            value: i,
            text: `${schedule[i]['Course Code']}: sec-${schedule[i]['Section']}`,
            desc: schedule[i]

        });
    }

    // defining dlb
    let dlb = new DualListbox('.dlb', {

        // this function will be triggered when the add button is pressed within dlb
        addEvent: function (value) {
            if (this.selected.length < 6) {
                let flag = true;
                let data_index;
                let course_desc;
                // console.log(this.selected.length);
                for (let i = 0; i < this.selected.length - 1; i++) {
                    if (this.selected[i].innerHTML.split(':')[0] == data[value - 1]['desc']["Course Code"]) {
                        this.removeSelected(document.querySelector(`[data-id="${value}"]`));
                        document.querySelector('.warning').innerHTML = "You can not select same course";
                        flag = false;
                    }
                }
                if (flag) {
                    for (let i = 0; i < this.selected.length; i++) {
                        data_index = this.selected[i].getAttribute("data-id");
                        course_desc = data[data_index - 1]['desc'];
                        push_to_table(course_desc);
                    }
                    course_desc = data[data_index-1]['desc'];
                    info_populator("right", course_desc);
                    info_unpopulator("left");
                }
            } else {
                this.removeSelected(document.querySelector(`[data-id="${value}"]`));
                document.querySelector('.warning').innerHTML = "You cannot select more than 5 courses";
            }
        },

        // this function will be triggered when the remove button is pressed within dlb
        removeEvent: function (value) {
            let flag = true;
            let data_index;
            let course_desc;
            for (let i = 0; i < this.selected.length; i++) {
                for (let j = i + 1; j < this.selected.length; j++) {
                    if (this.selected[i].innerHTML.split(':')[0] == this.selected[j].innerHTML.split(':')[0]) {
                        flag = false;
                    }
                }
            }
            if (flag) {
                document.querySelector('.warning').innerHTML = "";
                blanking_table();
                for (let i = 0; i < this.selected.length; i++) {
                    data_index = this.selected[i].getAttribute("data-id")
                    push_to_table(data[data_index - 1]['desc']);
                }
                course_desc = data[value-1]['desc'];
                info_populator("left", course_desc);
                if(this.selected.length != 0){
                    data_index = this.selected[this.selected.length-1].getAttribute("data-id");
                    course_desc = data[data_index-1]['desc'];
                    info_populator("right", course_desc);
                } else {
                    info_unpopulator("right");
                }
            }
        },

        availableTitle: "Available Courses",
        selectedTitle: "Selected Courses",
        addButtonText: ">",
        removeButtonText: "<",
        removeAllButtonText: "<<",
        showAddAllButton: false,
        options: data
    });

    // function defined for for click event to be worked inside dlb
    dlb.addEventListener('click', (event) => {

        if (event.target.closest(".dual-listbox__available") && event.target.className == "dual-listbox__item dual-listbox__item--selected") {
            document.querySelector('.warning').innerHTML = "";
            let value = event.target.getAttribute('data-id');
            let course_desc = data[value - 1]["desc"]
            info_populator("left", course_desc);
        }
        if (event.target.closest(".dual-listbox__selected") && event.target.className == "dual-listbox__item dual-listbox__item--selected") {
            document.querySelector('.warning').innerHTML = "";
            let value = event.target.getAttribute('data-id');
            let course_desc = data[value - 1]["desc"]
            info_populator("right", course_desc);
        }
    });
}


/*
 * function for filtering out information and pushing inside the table
 *
 * @param {String} the side where infos should be populated
 * @param {JSON} course description
 */
function info_populator (side, course_desc) {

    document.querySelector(`.${side} #cname`).innerHTML = course_desc["Course Code"];
    document.querySelector(`.${side} #faculty`).innerHTML = course_desc["Faculty"];
    document.querySelector(`.${side} #section`).innerHTML = course_desc["Section"];
    document.querySelector(`.${side} #time`).innerHTML = course_desc["Day, Time, Room"];
    document.querySelector(`.${side} #avs`).innerHTML = course_desc["Total Seat"];
    document.querySelector(`.${side} #sb`).innerHTML = course_desc["Seat Booked"];
    document.querySelector(`.${side} #sr`).innerHTML = course_desc["Seat Remaining"];
}

/*
 * function for filtering out information and pushing inside the table
 *
 * @param {String} the side where infos should be removed
 */
function info_unpopulator (side) {

    document.querySelector(`.${side} #cname`).innerHTML = "";
    document.querySelector(`.${side} #faculty`).innerHTML = "";
    document.querySelector(`.${side} #section`).innerHTML = "";
    document.querySelector(`.${side} #time`).innerHTML = "";
    document.querySelector(`.${side} #avs`).innerHTML = "";
    document.querySelector(`.${side} #sb`).innerHTML = "";
    document.querySelector(`.${side} #sr`).innerHTML = "";
}



start();



async function start() {


    // poking the schedules route for the json data
    const res = await fetch('https://usis-cdn.eniamza.com/usisdump.json');
    const schedule = await res.json();
    schedule.sort(function(a, b) {
        return a["courseDetails"].localeCompare(b["courseDetails"]);
    });
    // console.log(schedule[0])
    const data = [];
    let course_and_exam = [];

    // regex defined for filtering out the day, time and room from the string
    let re = /(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\(\d{2}:\d{2}\s(AM|PM)-\d{2}:\d{2}\s(AM|PM)-[^\)]+\)/g    //Matches 


    // making the data for passing in the dlb (dual list box)
    // also changing ["Day, Time, Room"] entry from string to array by using regex
    for (let i = 1; i < schedule.length; i++) {
        schedule[i]["classLabSchedule"] = schedule[i]["classLabSchedule"].match(re);
        // console.log(schedule[i]["classLabSchedule"])
        //RESUME HERE
        data.push({
            value: i,
            text: `${schedule[i]['courseCode']}: sec-${schedule[i]['courseDetails'].split("-")[1].replace(/^\[|\]$/g, '')}`,
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
                for (let i = 0; i < this.selected.length - 1; i++) {
                    if (this.selected[i].innerHTML.split(':')[0] == data[value - 1]['desc']["courseCode"]) {
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
                    course_and_exam.push({ 
                        'courseCode': course_desc.courseCode, 
                        'dayNo': course_desc.dayNo 
                    });
                    populateExamWarning(findDuplicateExamDays(course_and_exam));
                    info_populator("right", course_desc);
                    info_unpopulator("left");
                }
                console.log(course_and_exam);
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
                course_and_exam = course_and_exam.filter(course => course.courseCode !== course_desc.courseCode);
                populateExamWarning(findDuplicateExamDays(course_and_exam));
                info_populator("left", course_desc);
                if(this.selected.length != 0){
                    data_index = this.selected[this.selected.length-1].getAttribute("data-id");
                    course_desc = data[data_index-1]['desc'];
                    info_populator("right", course_desc);
                } else {
                    info_unpopulator("right");
                }
            }
                console.log(course_and_exam);
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
            // console.log(course_desc);
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

    document.querySelector(`.${side} #cname`).innerHTML =  course_desc["courseCode"];
    document.querySelector(`.${side} #faculty`).innerHTML = `${course_desc["empName"]}-${course_desc["empShortName"]}`;
    document.querySelector(`.${side} #prereq`).innerHTML = course_desc["preRequisiteCourses"];
    document.querySelector(`.${side} #section`).innerHTML = course_desc['courseDetails'].split("-")[1].replace(/^\[|\]$/g, '')
    document.querySelector(`.${side} #time`).innerHTML = course_desc["classLabSchedule"];
    document.querySelector(`.${side} #exam`).innerHTML = course_desc["dayNo"];
    document.querySelector(`.${side} #avs`).innerHTML = course_desc["defaultSeatCapacity"];
    document.querySelector(`.${side} #sb`).innerHTML = course_desc["totalFillupSeat"];
    document.querySelector(`.${side} #sr`).innerHTML = course_desc["availableSeat"];
}

/*
 * function for filtering out information and pushing inside the table
 *
 * @param {String} the side where infos should be removed
 */
function info_unpopulator (side) {

    document.querySelector(`.${side} #cname`).innerHTML = "";
    document.querySelector(`.${side} #faculty`).innerHTML = "";
    document.querySelector(`.${side} #prereq`).innerHTML = ""
    document.querySelector(`.${side} #section`).innerHTML = "";
    document.querySelector(`.${side} #time`).innerHTML = "";
    document.querySelector(`.${side} #exam`).innerHTML = "";
    document.querySelector(`.${side} #avs`).innerHTML = "";
    document.querySelector(`.${side} #sb`).innerHTML = "";
    document.querySelector(`.${side} #sr`).innerHTML = "";
}



function findDuplicateExamDays(courses) {
    const dayMap = {};
    const duplicates = [];

    courses.forEach(course => {
        if (!dayMap[course.dayNo]) {
            dayMap[course.dayNo] = [course.courseCode];
        } else {
            if (!dayMap[course.dayNo].includes(course.courseCode)) {
                dayMap[course.dayNo].push(course.courseCode);
            }
            if (dayMap[course.dayNo].length > 1 && !duplicates.some(d => d.dayNo === course.dayNo)) {
                duplicates.push({ 
                    dayNo: course.dayNo, 
                    courseCodes: dayMap[course.dayNo] 
                });
            }
        }
    });

    return duplicates;
}

function populateExamWarning(duplicateDays) {
    const examWarningElement = document.querySelector('.examWarning');
    if (duplicateDays.length === 0) {
        examWarningElement.innerHTML = '';
    } else {
        const html = duplicateDays.map(day => `${day.courseCodes.join(', ')} exam clashes on ${day.dayNo}<br>`).join('');
        examWarningElement.innerHTML = html; // Populate inner HTML
    }
}


start();


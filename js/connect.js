
async function start() {

    
    // poking the schedules route for the json data
    const res = await fetch('https://usis-cdn.eniamza.com/connect.json');
    const scheduleData = await res.json();
    const schedule = scheduleData

    schedule.sort(function(a, b) {
        let courseA = `${a.courseCode}-${a.sectionName}`;
        let courseB = `${b.courseCode}-${b.sectionName}`;
        return courseA.localeCompare(courseB);
    });

    // sort the courses according to the section (ascending)
    // console.log(schedule[0])
    const data = [];
    let course_and_exam = [];

    // regex defined for filtering out the day, time and room from the string
    let re = /(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\(\d{1,2}:\d{2}\s(AM|PM)-\d{1,2}:\d{2}\s(AM|PM)(-[^\)]+)?\)(\\n(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)\(\d{1,2}:\d{2}\s(AM|PM)-\d{1,2}:\d{2}\s(AM|PM)(-[^\)]+)?\))*/gi;

    // making the data for passing in the dlb (dual list box)
    // also changing ["Day, Time, Room"] entry from string to array by using regex
    for (let i = 1; i < schedule.length; i++) {        
        //RESUME HERE


        let matches = schedule[i]["preRegSchedule"] ? schedule[i]["preRegSchedule"].match(re) : null;
    
        // If matches is null, store an empty array
        schedule[i]["preRegSchedule"] = matches ? matches : [];
        console.log(schedule[i])

        if (schedule[i]["preRegLabSchedule"]) {
            let labMatches = schedule[i]["preRegLabSchedule"].match(re);
            if (labMatches) {
                schedule[i]["preRegSchedule"].push(...labMatches); // Use spread operator to flatten the array
            }
        }

        data.push({
            value: i,
            text: `${schedule[i]['courseCode']}: sec-${schedule[i]['sectionName']}`,
            desc: schedule[i]
        });
    }

    console.log(data)

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
                    // const dateRegex = /\((\d{2}-\d{2}-\d{4})\)/;
                    // const timeRegex = /\((\d{2}:\d{2}\s(?:AM|PM)-\d{2}:\d{2}\s(?:AM|PM))\)/;

                    // let dateMatch = course_desc.dayNo.match(dateRegex);
                    // let timeMatch = course_desc.dayNo.match(timeRegex);

                    // console.log(dateMatch, timeMatch);

                    course_and_exam.push({ 
                        'courseCode': course_desc.courseCode, 
                        'date': course_desc?.sectionSchedule?.finalExamDate || 'N/A',
                        'time': course_desc?.sectionSchedule?.finalExamStartTime || 'N/A'

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
    document.querySelector(`.${side} #faculty`).innerHTML = `${course_desc["faculties"]}`;
    // document.querySelector(`.${side} #prereq`).innerHTML = course_desc["preRequisiteCourses"];
    document.querySelector(`.${side} #section`).innerHTML = course_desc['sectionName']
    document.querySelector(`.${side} #time`).innerHTML = course_desc["preRegSchedule"];
    document.querySelector(`.${side} #exam`).innerHTML = course_desc?.sectionSchedule?.finalExamDetail || 'N/A';
    document.querySelector(`.${side} #avs`).innerHTML = course_desc["capacity"];
    document.querySelector(`.${side} #sb`).innerHTML = course_desc["consumedSeat"];
    document.querySelector(`.${side} #sr`).innerHTML = course_desc["capacity"] - course_desc["consumedSeat"];
}

/*
 * function for filtering out information and pushing inside the table
 *
 * @param {String} the side where infos should be removed
 */
function info_unpopulator (side) {

    document.querySelector(`.${side} #cname`).innerHTML = "";
    document.querySelector(`.${side} #faculty`).innerHTML = "";
    // document.querySelector(`.${side} #prereq`).innerHTML = ""
    document.querySelector(`.${side} #section`).innerHTML = "";
    document.querySelector(`.${side} #time`).innerHTML = "";
    document.querySelector(`.${side} #exam`).innerHTML = "";
    document.querySelector(`.${side} #avs`).innerHTML = "";
    document.querySelector(`.${side} #sb`).innerHTML = "";
    document.querySelector(`.${side} #sr`).innerHTML = "";
}



function findDuplicateExamDays(courses) {
    const dayMap = {};
    const timeMap = {};
    const dateDuplicates = [];
    const timeDuplicates = [];

    courses.forEach(course => {
        // Track courses by date
        if (!dayMap[course.date]) {
            dayMap[course.date] = [course.courseCode];
        } else {
            if (!dayMap[course.date].includes(course.courseCode)) {
                dayMap[course.date].push(course.courseCode);
            }
            if (dayMap[course.date].length > 1 && !dateDuplicates.some(d => d.date === course.date)) {
                dateDuplicates.push({ 
                    date: course.date, 
                    courseCodes: dayMap[course.date] 
                });
            }
        }

        // Track courses by time
        const dateTimeKey = `${course.date} ${course.time}`;
        if (!timeMap[dateTimeKey]) {
            timeMap[dateTimeKey] = [course.courseCode];
        } else {
            if (!timeMap[dateTimeKey].includes(course.courseCode)) {
                timeMap[dateTimeKey].push(course.courseCode);
            }
            if (timeMap[dateTimeKey].length > 1 && !timeDuplicates.some(d => d.dateTime === dateTimeKey)) {
                timeDuplicates.push({ 
                    dateTime: dateTimeKey, 
                    courseCodes: timeMap[dateTimeKey] 
                });
            }
        }
    });

    console.log("Date Duplicates:", dateDuplicates);
    console.log("Time Duplicates:", timeDuplicates);
    return { dateDuplicates, timeDuplicates };
}

function populateExamWarning(duplicateDays) {
    const examWarningElement = document.querySelector('.examWarning');
    const { dateDuplicates, timeDuplicates } = duplicateDays;

    let html = '';

    if (dateDuplicates.length > 0) {
        html += '<strong>Date Clashes:</strong><br>';
        html += dateDuplicates.map(day => `${day.courseCodes.join(', ')} exam clashes on ${day.date}<br>`).join('');
    }

    if (timeDuplicates.length > 0) {
        html += '<strong>Time Clashes:</strong><br>';
        html += timeDuplicates.map(day => `${day.courseCodes.join(', ')} exam clashes on ${day.dateTime}<br>`).join('');
    }

    if (html === '') {
        examWarningElement.innerHTML = '';
    } else {
        examWarningElement.innerHTML = html; // Populate inner HTML
    }
}


start();


function push_to_table(datum) {
    console.log(datum);
    // Handle regular class schedules
    for(let i = 0; i < datum["preRegSchedule"].length; i++) {
        let schedule = datum["preRegSchedule"][i];
        
        // Skip lab schedules - they contain different room names (ending with 'L')
        if (schedule.includes("-L)")) {
            continue;
        }

        // Match the day part
        let dayMatch = schedule.match(/^\w+(?=\()/);
        let day = dayMatch ? dayMatch[0] : "Day not found";
        day = day.charAt(0).toUpperCase() + day.slice(1).toLowerCase();

        // Match the time part with more flexible regex
        let timeMatch = schedule.match(/(\d{1,2}):(\d{2})\s*(AM|PM)\s*-\s*(\d{1,2}):(\d{2})\s*(AM|PM)/i);
        if (!timeMatch) continue;

        // Reconstruct time with consistent format
        let [_, startHour, startMin, startMeridian, endHour, endMin, endMeridian] = timeMatch;
        let time = `${startHour.padStart(2, '0')}:${startMin} ${startMeridian.toUpperCase()}-${endHour.padStart(2, '0')}:${endMin} ${endMeridian.toUpperCase()}`;
        
        // making the details for inserting inside table cell
        let details = `${datum['courseCode']}-${datum.sectionName}-${datum['faculties']}-${datum['roomName']}`;

        // For regular classes, find the exact time slot
        let timeSlot = getExactTimeSlot(time);
        if (timeSlot) {
            let cellId = getCellId(day, timeSlot);
            if (cellId) {
                check(cellId, details);
            }
        }
    }

    // Handle lab schedules separately
    if (datum.labSchedules && datum.labSchedules.length > 0) {
        datum.labSchedules.forEach(lab => {
            let day = lab.day.charAt(0) + lab.day.slice(1).toLowerCase();
            
            // Convert 24-hour format to AM/PM format
            let startTime = convertTo12Hour(lab.startTime);
            let endTime = convertTo12Hour(lab.endTime);
            
            // Create lab details with lab room name
            let labDetails = `${datum['courseCode']}-${datum.sectionName}-${datum['faculties']}-${datum['labRoomName']}`;
            
            // For labs, find all affected standard time slots
            let slots = getAffectedTimeSlots(`${startTime}`, `${endTime}`);
            
            // Insert into each affected slot
            slots.forEach(slot => {
                let cellId = getCellId(day, slot);
                if (cellId) {
                    check(cellId, labDetails);
                }
            });
        });
    }
}

function convertTo12Hour(time24) {
    let [hours, minutes] = time24.split(':');
    hours = parseInt(hours);
    let meridian = hours >= 12 ? 'PM' : 'AM';
    
    if (hours > 12) hours -= 12;
    else if (hours === 0) hours = 12;
    
    return `${hours.toString().padStart(2, '0')}:${minutes} ${meridian}`;
}

function normalizeTimeFormat(time) {
    const timeRegex = /(\d{1,2}):(\d{2})\s*(AM|PM)\s*-\s*(\d{1,2}):(\d{2})\s*(AM|PM)/i;
    const match = time.match(timeRegex);
    if (!match) return time;

    const [_, h1, m1, mer1, h2, m2, mer2] = match;
    return `${h1.padStart(2, '0')}:${m1} ${mer1.toUpperCase()}-${h2.padStart(2, '0')}:${m2} ${mer2.toUpperCase()}`;
}

function parseTimeRange(time) {
    let [start, end] = time.split('-').map(t => t.trim());
    return [start, end];
}

function getExactTimeSlot(time) {
    const standardSlots = [
        "08:00 AM-09:20 AM",
        "09:30 AM-10:50 AM",
        "11:00 AM-12:20 PM",
        "12:30 PM-01:50 PM",
        "02:00 PM-03:20 PM",
        "03:30 PM-04:50 PM",
        "05:00 PM-06:20 PM"
    ];

    // Normalize both the input time and standard slots for comparison
    const normalizedTime = normalizeTimeFormat(time);
    const normalizedSlots = standardSlots.map(slot => normalizeTimeFormat(slot));
    
    const index = normalizedSlots.findIndex(slot => slot === normalizedTime);
    return index !== -1 ? standardSlots[index] : null;
}

function getAffectedTimeSlots(startTime, endTime) {
    const standardSlots = [
        "08:00 AM-09:20 AM",
        "09:30 AM-10:50 AM",
        "11:00 AM-12:20 PM",
        "12:30 PM-01:50 PM",
        "02:00 PM-03:20 PM",
        "03:30 PM-04:50 PM",
        "05:00 PM-06:20 PM"
    ];

    let startMinutes = timeToMinutes(startTime);
    let endMinutes = timeToMinutes(endTime);

    return standardSlots.filter(slot => {
        let [slotStart, slotEnd] = slot.split('-');
        let slotStartMinutes = timeToMinutes(slotStart);
        let slotEndMinutes = timeToMinutes(slotEnd);

        return (startMinutes <= slotEndMinutes && endMinutes >= slotStartMinutes);
    });
}

function timeToMinutes(time) {
    let [hourStr, minuteStr] = time.split(':');
    let [minutes, meridian] = minuteStr.split(' ');
    let hour = parseInt(hourStr);
    
    if (meridian.toUpperCase() === 'PM' && hour !== 12) {
        hour += 12;
    } else if (meridian.toUpperCase() === 'AM' && hour === 12) {
        hour = 0;
    }

    return hour * 60 + parseInt(minutes);
}

function getCellId(day, timeSlot) {
    const timeToRow = {
        "08:00 AM-09:20 AM": "1",
        "09:30 AM-10:50 AM": "2",
        "11:00 AM-12:20 PM": "3",
        "12:30 PM-01:50 PM": "4",
        "02:00 PM-03:20 PM": "5",
        "03:30 PM-04:50 PM": "6",
        "05:00 PM-06:20 PM": "7"
    };

    const dayToColumn = {
        "Sunday": "1",
        "Monday": "2",
        "Tuesday": "3",
        "Wednesday": "4",
        "Thursday": "5",
        "Friday": "6",
        "Saturday": "7"
    };

    let row = timeToRow[timeSlot];
    let column = dayToColumn[day];

    return row && column ? `${row}-${column}` : null;
}

function check(id, details) {
    let elem = document.getElementById(id);
    if (elem.innerHTML != "" && elem.innerHTML != details) {
        elem.innerHTML = "<b>" + details + "</b>";
        elem.style.color = "red";
    } else {
        elem.innerHTML = details;
        elem.style.color = "white";
        elem.classList.add("tda")
    }
}

function blanking_table(){
    for(let i=1; i<=7; i++){
        for(let j=1; j<=7; j++){
            let id = i + "-" + j;
            document.getElementById(id).innerHTML = "";
        }
    }
}
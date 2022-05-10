
async function first () {
    const res = await fetch('/schedules');

    const schedule = await res.json();

    const data = [];

    let re = /\w{2}\(\d{2}:\d{2}\s(A|P)M-\d{2}:\d{2}\s(A|P)M-\w{2}\d{5}\)/g;

    for(let i=1; i<schedule.length; i++){

        schedule[i]["Day, Time, Room"] = schedule[i]["Day, Time, Room"].match(re);

        data.push({
            value: i,
            text: `${schedule[i]['Course Code']}: sec-${schedule[i]['Section']}`,
            desc: schedule[i]
        });
    }

    //console.log(data);


    let dlb = new DualListbox('.dlb', {
                addEvent: function (value) {

                    let flag = true;
                   // console.log(this.selected.length);
                    for(let i=0; i<this.selected.length-1; i++){
                        if (this.selected[i].innerHTML.split(':')[0] == data[value-1]['desc']["Course Code"]){
                            document.querySelector('.warning').innerHTML = "You can not select same course";
                            flag = false;
                        }
                    }

                    if (flag){
                        for(let i=0; i<this.selected.length; i++){
                            let data_index = this.selected[i].getAttribute("data-id")
                            push_to_table(data[data_index-1]['desc']);
                        }
                    }
                },

                removeEvent: function (value) {
                    let flag = true;
                    for(let i=0; i<this.selected.length; i++){
                        for(let j=i+1; j<this.selected.length; j++){
                            if (this.selected[i].innerHTML.split(':')[0] == this.selected[j].innerHTML.split(':')[0]){
                                document.querySelector('.warning').innerHTML = "You can not select same course";
                                flag = false;
                            }
                        }
                    }

                    if(flag){
                        document.querySelector('.warning').innerHTML = "";

                        blanking_table();

                        for(let i=0; i<this.selected.length; i++){
                            let data_index = this.selected[i].getAttribute("data-id")
                            push_to_table(data[data_index-1]['desc']);
                        }

                    }
                },
                 
                availableTitle: "Available Courses",
                selectedTitle: "Selected Courses",
                addButtonText: ">",
                removeButtonText: "<",
                showAddAllButton: false,
                showRemoveAllButton: false,
                options: data
            });

    dlb.addEventListener('click', (event)=>{
        if(event.target.closest(".dual-listbox__available") && event.target.className=="dual-listbox__item dual-listbox__item--selected"){
            let value = event.target.getAttribute('data-id');
            let course_desc = data[value-1]["desc"]

            document.querySelector(".left #cname").innerHTML = "Course Name: " + course_desc["Course Code"];
            document.querySelector(".left #faculty").innerHTML = "Faculty: " + course_desc["Faculty"];
            document.querySelector(".left #section").innerHTML = "Section: " + course_desc["Section"];
            document.querySelector(".left #time").innerHTML = "Time: <br>" + course_desc["Day, Time, Room"];
            document.querySelector(".left #avs").innerHTML = "Total Seat: " + course_desc["Total Seat"];
            document.querySelector(".left #sb").innerHTML = "Seat Booked: " + course_desc["Seat Booked"];
            document.querySelector(".left #sr").innerHTML = "Remaining: " + course_desc["Seat Remaining"];

        } else if (event.target.closest(".dual-listbox__selected") && event.target.className=="dual-listbox__item dual-listbox__item--selected"){
            let value = event.target.getAttribute('data-id');
            let course_desc = data[value-1]["desc"]

            document.querySelector(".right #cname").innerHTML = "Course Name: " + course_desc["Course Code"];
            document.querySelector(".right #faculty").innerHTML = "Faculty: " + course_desc["Faculty"];
            document.querySelector(".right #section").innerHTML = "Section: " + course_desc["Section"];
            document.querySelector(".right #time").innerHTML = "Time: " + course_desc["Day, Time, Room"];
            document.querySelector(".right #avs").innerHTML = "Total Seat: " + course_desc["Total Seat"];
            document.querySelector(".right #sb").innerHTML = "Seat Booked: " + course_desc["Seat Booked"];
            document.querySelector(".right #sr").innerHTML = "Remaining: " + course_desc["Seat Remaining"];

        } else {
        }
    })
}


first();

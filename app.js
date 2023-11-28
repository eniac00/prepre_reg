const express = require('express')
const app = express()
const path = require('path');
const fs = require("fs")
// const fs = require('fs');
require('dotenv').config();
const port = process.env.PORT || 3000;

// middlewares

app.use(express.static(path.join(__dirname + '/public')));


// routes declaration

/* Below commented out section is for saving the fetched data into a json file
 * This is only for testing purpose */

app.get('/schedules', async (req, res) => {

    
    let response = await fetch("https://usis-cdn.eniamza.com/usisdump.json")
    data = await response.json()
    
    // fs.writeFile('./schedule.json', JSON.stringify(await data.json()), err => {
    //     if (err){
    //         console.log(err);
    //     }
    // });

    // console.log('schedule saved successfully');
    // console.log(data)
    res.json(data);


})

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
})


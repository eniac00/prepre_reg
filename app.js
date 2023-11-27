const express = require('express')
const app = express()
const path = require('path');
const {tabletojson} = require('tabletojson');
// const fs = require('fs');
require('dotenv').config();
const port = process.env.PORT || 3000;

// middlewares

app.use(express.static(path.join(__dirname + '/public')));


// routes declaration

/* Below commented out section is for saving the fetched data into a json file
 * This is only for testing purpose */

app.get('/schedules', (req, res) => {

    tabletojson.convertUrl(
        'https://web.archive.org/web/20230408032542/https://admissions.bracu.ac.bd/academia/admissionRequirement/getAvailableSeatStatus',
        { useFirstRowForHeadings: true },
        function (tableAsJson) {
            
            // fs.writeFile('./schedule.json', JSON.stringify(tableAsJson), err => {
            //     if (err){
            //         console.log(err);
            //     }
            // });

            // console.log('schedule saved successfully');
            return res.json(tableAsJson[0]);
        }
    );
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
})


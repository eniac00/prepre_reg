const tabletojson = require('tabletojson').Tabletojson;
const fs = require('fs');
require('dotenv').config();



function jsonsave (req, res, next) {

    tabletojson.convertUrl(
        process.env.URL,
        { useFirstRowForHeadings: true },
        function (tableAsJson) {
            fs.writeFile('./schedule.json', JSON.stringify(tableAsJson), err => {
                if (err){
                    console.log(err);
                }
            });

            console.log('schedule saved successfully');
        }
    );

    next();
}

module.exports = jsonsave;






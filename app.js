const express = require('express')
const app = express()
const path = require('path');
require('dotenv').config();
const port = process.env.PORT || 3000;
const jsonsave = require('./jsonsave');
const schedule = require('./schedule.json')[0]

// middlewares

app.use(express.static('public'));


// routes declaration

app.get('/', jsonsave, (req, res) => {
   res.sendFile(path.join(__dirname + '/public/index.html'));
})

app.get('/schedules', (req, res) => {
    return res.json(schedule);
})

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
})


const express = require('express');
const path = require('path');
require('dotenv').config();

const { google } = require("googleapis");



const app = express();

//FUNCTION DECLARATIONS

//function for formatting date object
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${day}/${month}/${year}`;
}

//function for getting the date for the start of the week given a date
function getStartOfWeek(date) {
    const weekStart = date;
    weekStart.setDate(weekStart.getDate() - weekStart.getDay() + (weekStart.getDay() === 0 ? -6 : 1));
    return formatDate(weekStart);
}

//SERVICE GET REQUESTS
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/functions', (req, res) => {
    res.sendFile(path.join(__dirname, 'functions.js'));
});

//get google sheet data and send it to the chart
//so that it can read.
app.get("/db", async (req, res) => {

    //define authentication object

    const auth = new google.auth.GoogleAuth({
        credentials: JSON.parse(process.env.GOOGLE_CREDENTIALS),
        scopes: "https://www.googleapis.com/auth/spreadsheets"
    });

    //get the client
    const client = await auth.getClient();

    //create instance of google sheets api
    const googleSheets = google.sheets({version: "v4", auth: client})

    // get metadata about spreadsheet
    const spreadsheetId = "1BA0Nv8qMi2DPNji250BQKT6SJdSi6ZC8y-KfQgY5fi4";

    //read rows from spreadsheet
    const getRows = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "Sheet1"
    })

    ////////////////////////////////////////////////////////////
    //manipulate the data to send to the website
    ///////////////////////////////////////////////////////////
    let dataSize = getRows.data.values.length;
    const attendance = {};

    weeks = [];
    const nHouse = [];
    const nPopping = [];
    const nBreaking = [];
    const nHipHop = [];
    const nKrump = [];
    const nFreeStyle = [];

    //count how many people came to each class per week and for which class
    for (let i = 1; i < dataSize; i++) {
        //get date
        let date = getRows.data.values[i][0].split(" ")[0];
        let dateSplit = date.split("/");

        //get start of week
        const dateObject = new Date(`${dateSplit[2]}-${dateSplit[0]}-${dateSplit[1]}`);
        week = getStartOfWeek(dateObject);
        
        //get class type
        let classType = getRows.data.values[i][1];
        //create attendance key by combining week and classType into a single string
        attendanceKey = week + "-" + classType;

        if (!weeks.includes(week)) {
            //for the weeks array to store all the weeks in order
            weeks.push(week);
        }

        if (attendance.hasOwnProperty(attendanceKey)) {
            //increase count if week-class key already exists in dictionary
            attendance[attendanceKey] += 1;
        } else {
            //we have encountered a new week-class combination
            //add week-class key to the dictionary if its not already in the dictionary
            attendance[attendanceKey] = 1;
        }
    }

    //update and form the res data structure
    let weeksSize = weeks.length;
    for (let i = 0; i < weeksSize; i++) {
        //for each week add the respective values to the nHouse, nPopping, nBreaking... arrays
        let week = weeks[i]; 
        
        if (attendance.hasOwnProperty(week + "-" + "House")) {
            nHouse.push(attendance[week + "-" + "House"]);
        } else {
            nHouse.push(0);
        }

        if (attendance.hasOwnProperty(week + "-" + "Breaking")) {
            nBreaking.push(attendance[week + "-" + "Breaking"]);
        } else {
            nBreaking.push(0);
        }

        if (attendance.hasOwnProperty(week + "-" + "Hip Hop")) {
            nHipHop.push(attendance[week + "-" + "Hip Hop"]);
        } else {
            nHipHop.push(0);
        }

        if (attendance.hasOwnProperty(week + "-" + "Popping")) {
            nPopping.push(attendance[week + "-" + "Popping"]);
        } else {
            nPopping.push(0);
        }

        if (attendance.hasOwnProperty(week + "-" + "Krump")) {
            nKrump.push(attendance[week + "-" + "Krump"]);
        } else {
            nKrump.push(0);
        }

        if (attendance.hasOwnProperty(week + "-" + "Freestyle Team")) {
            nFreeStyle.push(attendance[week + "-" + "Freestyle Team"]);
        } else {
            nFreeStyle.push(0);
        }
    }

    //data struct to send
    const ChartData = {
        labels : weeks,
        inputData : [nHouse, nPopping, nBreaking, nHipHop, nKrump, nFreeStyle]
    }

    res.send(ChartData);
});

app.listen(8080, 'localhost', () => {
    console.log('Server is listening on port 8080');
});
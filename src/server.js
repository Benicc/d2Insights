const express = require('express');
const path = require('path');

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


app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/functions', (req, res) => {
    res.sendFile(path.join(__dirname, 'functions.js'));
});

app.get('/users', (req, res) => {
    const users = [{
        id: "123",
        name: "Shaun",
    }, {
        id: "234",
        name: "Bob"
    }, {
        id: "345",
        name: "Sue"
    }]

    res.json(users);
});

//get google sheet data
//"https://www.googleapis.com/auth/spreadsheets"
app.get("/db", async (req, res) => {

    //define authentication object
    const auth = new google.auth.GoogleAuth({
        keyFile: "../credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets"
    });

    //get the client
    const client = await auth.getClient();

    //create instance of google sheets api
    const googleSheets = google.sheets({version: "v4", auth: client})

    // get metadata about spreadsheet
    const spreadsheetId = "1rbyNBeNzD9D4RJ0r0Ojpo0QlRLaudQ8t3c6CjuNKaMo";

    // const metaData = await googleSheets.spreadsheets.get({
    //     auth,
    //     spreadsheetId
    // });

    //read rows from spreadsheet

    const getRows = await googleSheets.spreadsheets.values.get({
        auth,
        spreadsheetId,
        range: "Sheet1"
    })

    //manipulate the data to send to the website

    let dataSize = getRows.data.values.length;
    
    //count how many attendees with
    
    const attendance = {};
    // const classes = [];

    dates = [];
    weeks = [];
    const nHouse = [];
    const nPopping = [];
    const nBreaking = [];
    const nHipHop = [];
    const nKrump = [];
    const nFreeStyle = [];

    //change date to week in attendace dictionary key
    //and then change the update function

    //count how many people came to each class
    for (let i = 1; i < dataSize; i++) {
        //get date
        let date = getRows.data.values[i][0].split(" ")[0];
        let dateSplit = date.split("/");

        //get start of week
        const dateObject = new Date(`${dateSplit[2]}-${dateSplit[0]}-${dateSplit[1]}`);
        week = getStartOfWeek(dateObject);
        console.log(dateSplit);
        
        //get class type
        let classType = getRows.data.values[i][1];
        //create attendance key by combining date and classType into a single string
        attendanceKey = week + "-" + classType;

        if (!weeks.includes(week)) {
            //for the array to store the weeks in order
            weeks.push(week);
        }

        
        if (!dates.includes(date)) {
            //for the array to store the dates in order
            dates.push(date);
        }

        if (attendance.hasOwnProperty(attendanceKey)) {
            //increase count if class already exists in dictionary
            attendance[attendanceKey] += 1;
        } else {
            // //add new class to the classes array if class is not in the dictionary
            // classes.push([attendanceKey]);
            //add class to the dictionary
            attendance[attendanceKey] = 1;
        }
    }

    let weeksSize = weeks.length;

    for (let i = 0; i < weeksSize; i++) {
        //for each date update the nHouse, nPopping, nBreaking... arrays

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

    const ChartData = {
        labels : weeks,
        inputData : [nHouse, nPopping, nBreaking, nHipHop, nKrump, nFreeStyle]
    }

    res.send(ChartData);
});


app.get('/dataSet', (req, res) => {
    const users = {values: [5, 19, 3, 5, 2, 3]};

    res.json(users);

})

app.listen(8080, 'localhost', () => {
    console.log('Server is listening on port 8080');
});
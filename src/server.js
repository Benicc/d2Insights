const express = require('express');
const path = require('path');

const { google } = require("googleapis");


const app = express();


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
        keyFile: "credentials.json",
        scopes: "https://www.googleapis.com/auth/spreadsheets"
    });

    //get the client
    const client = await auth.getClient();

    //create instance of google sheets api
    const googleSheets = google.sheets({version: "v4", auth: client})

    // get metadata about spreadsheet
    const spreadsheetId = "1rbyNBeNzD9D4RJ0r0Ojpo0QlRLaudQ8t3c6CjuNKaMo";

    const metaData = await googleSheets.spreadsheets.get({
        auth,
        spreadsheetId
    });

    res.send(metaData.data);
});


app.get('/dataSet', (req, res) => {
    const users = {values: [5, 19, 3, 5, 2, 3]};

    res.json(users);

})

app.listen(8080, 'localhost', () => {
    console.log('Server is listening on port 8080');
});
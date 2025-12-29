const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();

app.use(cors());

// all variables defined in the env file will 
// be available in the process.env variable
require('dotenv').config();

// enable express receiving JSON
app.use(express.json());

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;

// ROUTES BEGIN ///////////////////////////////////////////////////////////////

// route: a pairing between an URL and a function
// when the server recieves a request for the URL, the function will execute
app.get('/live', function (req, res) {
    res.send("Hello World");
})

app.get('/welcome', function (req, res) {
    res.send("Welcome!");
});

app.get('/goodbye', function (req, res) {
    res.send("Goodbye");
});

app.get('/api/places/search', async function (req, res) {
    const query = req.query;
    const options = {
        "params": query,
        "headers": {
            "Authorization": "Bearer " + process.env.FSQ_API_KEY,
            "Accept": "application/json",
            "X-Places-Api-Version": "2025-06-17"
        }
    }
    const response = await axios.get("https://places-api.foursquare.com/places/search", options);
    // console.log(response.data);
    // send back the data in JSON data
    res.json(response.data);
});

app.post('/deepseek/chat/completions', async function (req, res) {
    // get the user message 
    const userMessage = req.body.userMessage;
    const content = {
        "model": "tngtech/deepseek-r1t2-chimera:free",
        "messages": [
            {
                "role": "system",
                "content": "You are a helpful assistant that only responds with a RAW JSON object.Do not include any explanation, markdown, additional text or code fences.Give me the result as an array of JSON objects, where each object has the following key: name, address, latitude, longtitude"
            },
            {
                "role": "user",
                "content": userMessage
            }
        ]
    }
    const options = {
        "headers": {
            "Authorization":"Bearer " + OPENROUTER_API_KEY,
            "Content-Type":"application/json"
        }
    }
    const response = await axios.post("https://openrouter.ai/api/v1/chat/completions", content, options);
    res.json(response.data);
})

// NO ROUTES AFTER app.listen() ///////////////////////////////////////////////

// app.listen starts a new server 
// the first parameter is the PORT number
// the PORT number identifies the process (software) that is sending out 
// or recieving traffic
// A port number cannot be used by two process at the same time
app.listen(3001, function () {
    console.log("Server is running")
});

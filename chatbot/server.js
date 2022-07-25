const express    = require('express');
const bodyParser = require('body-parser');
const cors       = require('cors');

const chatbot = require('./chatbot/chatbot');

const port = 5000;

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Load HTML, CSS, Javascript etc of website.
app.use(express.static('./public'))

// Listen on given port.
app.listen(port, ()=>{
    console.log(`Server is listening on port ${port}.`);
});

// Handle post requests on /text_query
app.post('/text_query', async(req, res)=>{
    // Log request.
    console.log("Request:", req.body);
    // Get message and user id from request.
    const userText = req.body.userText;
    const userId   = req.body.userId;
    // Send request to dialogflow and wait for response.
    const resultQuery = await chatbot.textQuery(userText, userId);
    // Generate object from dialogflow answer.
    const resObj = {
        intentName: resultQuery.intent.displayName,
        userQuery: resultQuery.queryText,
        fulfillmentText: resultQuery.fulfillmentText
    };
    // Log response.
    console.log("Response", resObj)
    // Set response for the client.
    res.json(resObj);
});

// Handle errors.
app.all('*', (req, res)=>{
    // Log all errors.
    console.log("Error", req.url);
});

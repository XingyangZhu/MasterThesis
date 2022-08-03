const express    = require('express');
const bodyParser = require('body-parser');
const cors       = require('cors');
const chatbot1   = require('./chatbot-1/chatbot');
const chatbot2   = require('./chatbot-2/chatbot');

const port = process.env.PORT || 5000;

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Load HTML, CSS, Javascript etc of website.
app.use(express.static('./public'))

// ######################
// ## Default Homepage ##
// ######################

// Send HTML page for chatbot 1.
app.get('/', (req, res)=>{
    res.sendFile(__dirname + '/public/index.html');
});

// Handle post requests on /text_query for chatbot 1.
app.post('/text_query', async(req, res)=>{
    // Log request.
    console.log("\nRequest chatbot-1\n", req.body);
    // Get message and user id from request.
    const userText = req.body.userText;
    const userId   = req.body.userId;
    // Send request to dialogflow and wait for response.
    const resultQuery = await chatbot1.textQuery(userText, userId);

    // Get text, buttons and images from dialogflow answer.
    const resObj = createResultObject(resultQuery);

    // Log response.
    console.log("Response chatbot-1\n", resObj)
    // Set response for the client.
    res.json(resObj);
});

// ########################
// ## Chatbot 1 (german) ##
// ########################

// Send HTML page for chatbot 1.
app.get('/chatbot-1', (req, res)=>{
    res.sendFile(__dirname + '/public/chatbot-1.html');
});

// Handle post requests on /text_query for chatbot 1.
app.post('/chatbot-1/text_query', async(req, res)=>{
    // Log request.
    console.log("URL:", req.url);
    console.log("\nRequest chatbot-1\n", req.body);
    // Get message and user id from request.
    const userText = req.body.userText;
    const userId   = req.body.userId;
    // Send request to dialogflow and wait for response.
    const resultQuery = await chatbot1.textQuery(userText, userId);

    // Get text, buttons and images from dialogflow answer.
    const resObj = createResultObject(resultQuery);

    // Log response.
    console.log("Response chatbot-1\n", resObj)
    // Set response for the client.
    res.json(resObj);
});

// #########################
// ## Chatbot 2 (chinese) ##
// #########################

// Send HTML page for chatbot 2.
app.get('/chatbot-2', (req, res)=>{
    res.sendFile(__dirname + '/public/chatbot-2.html');
});

// Handle post requests on /text_query for chatbot 2.
app.post('/chatbot-2/text_query', async(req, res)=>{
    // Log request.
    console.log("URL:", req.url);
    console.log("\nRequest chatbot-2\n", req.body);
    // Get message and user id from request.
    const userText = req.body.userText;
    const userId   = req.body.userId;
    // Send request to dialogflow and wait for response.
    const resultQuery = await chatbot2.textQuery(userText, userId);

    // Get text, buttons and images from dialogflow answer.
    const resObj = createResultObject(resultQuery);

    // Log response.
    console.log("Response chatbot-2\n", resObj)
    // Set response for the client.
    res.json(resObj);
});

// #################################################
// ## Function to get data from dialogflow result ##
// #################################################

function createResultObject(resultQuery) {
    // Split result to get message.
    var resultTextArray = resultQuery.fulfillmentText.split("&&");
    // Save message.
    const message = resultTextArray[0];
    // Remove message from array.
    resultTextArray.shift();

    // Init buttons and images.
    let buttons = [];
    let images  = [];
    let links   = [];
    let extraMessages = [];

    // Fill container with images.
    resultTextArray.forEach(
        function (text) {
            // Check if text is an image.
            if (text.includes("IMG:")) {
                // Remove "IMG:" from text.
                text = text.replace("IMG:", "");
                // Append text to images array.
                images.push(text);
            }
            else if(text.includes("URL:")) {
                // Remove "URL:" from text.
                text = text.replace("URL:", "");
                // Append text to links array.
                links.push(text);
            }
            else if(text.includes("EXTRA_MSG:")) {
                // Remove "EXTRA_MSG:" from text.
                text = text.replace("EXTRA_MSG:", "");
                // Append text to extraMessages array.
                extraMessages.push(text);
            }
            // If no match, then it is a button.
            else {
                // Append text to buttons array.
                buttons.push(text);
            }
        }
    );

    // Generate object from dialogflow answer.
    const resObj = {
        intentName:      resultQuery.intent.displayName,
        userQuery:       resultQuery.queryText,
        fulfillmentText: resultQuery.fulfillmentText,
        message: message,
        buttons: buttons,
        images: images,
        links: links,
        extraMessages: extraMessages,
    };

    return resObj;
}

// ####################
// ## Listen on port ##
// ####################

// Listen on given port.
app.listen(port, ()=>{
    console.log(`Server is listening on port ${port}.`);
});

// ####################
// ## Error handling ##
// ####################

// Handle errors.
app.all('*', (req, res)=>{
    // Log all errors.
    console.log("Error", req.url);
});
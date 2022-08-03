const dialogflow = require('dialogflow');   // Load dialogflow API
const config     = require('./devkey');     // Load google service account

// Load google service account data.
const projectId = config.googleProjectId;
const credentials = {
    private_key:  config.googlePrivateKey,
    client_email: config.googleClientEmail
};

// Setup session client to connect with dialogflow.
const sessionClient = new dialogflow.SessionsClient({projectId, credentials});

// Handle text query request with dialogflow.
const textQuery = async(userText, userSessionId)=>{
    // Connect with dialogflow api
    const sessionPath = sessionClient.sessionPath(projectId, userSessionId);
    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: userText,
                languageCode: 'de-DE'
            }
        }
    };

    try {
        const response = await sessionClient.detectIntent(request);
        return response[0].queryResult;
    }
    catch(err) {
        console.log("ERROR:", err);
        return err;
    }
};

// Export the function.
module.exports = {
    textQuery
}
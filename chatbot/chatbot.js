const dialogflow = require('dialogflow');   // Load dialogflow API
const config     = require('./devkey');     // Load google service account

const projectId = config.googleProjectId;
const sessionId = config.dialogFlowSessionId;

const credentials = {
    client_email: config.googleClientEmail,
    private_key:  config.googlePrivateKey
};

const sessionClient = new dialogflow.SessionsClient({projectId, credentials});

const textQuery = async(userText, userId)=>{
    // Connect with dialogflow api
    const sessionPath = sessionClient.sessionPath(projectId, sessionId+userId);
    const request = {
        session: sessionPath,
        queryInput: {
            text: {
                text: userText,
                languageCode: config.dialogFlowSessionLanguageCode
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
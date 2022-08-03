async function getResponse(message) {
    // Set options for HTTP request to the node js server.
    const options = {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            "userText": message.text,
            "userId"  : userId
        }),
    };
    // Send message to node js backend server that forwards the request to dialogflow.
    const response = await fetch("/chatbot-1/text_query", options);
    // Unwrap response into json format.
    const data = await response.json();

    // console.log("Client", data);

    // Create answer.
    let answer = new ChatObject('teacher', data.message, data.buttons, data.images, data.links, data.extraMessages);
    // Return the answer.
    return answer;
}
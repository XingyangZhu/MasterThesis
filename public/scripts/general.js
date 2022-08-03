
// Generate random user id for each user. (Current time in seconds)
const userId = ( new Date().getTime() ).toString();

// Container for all messages.
let messages = [];

// Data class to know which user wrote what message.
class ChatObject {
    constructor(user, text, buttons=[], images=[], links=[], extraMessages=[]) {
        this.user = user;
        this.text = text;
        this.buttons = buttons;
        this.images = images;
        this.links = links;
        this.extraMessages = extraMessages;
    }
}

async function sendMessageFromButton()
{
    // Get clicked button id.
    const buttonId = event.target.id;
    // Get button element.
    const button = document.getElementById(buttonId);
    // Get button text.
    const buttonText = button.innerHTML;

    // Create new ChatObject with given input text.
    message = new ChatObject('person', buttonText);
    // Add message to messages array.
    messages.unshift(message);


    // Update chat conversation with new message.
    render(true);


    // Send message to dialogflow and get response.
    let answer = await getResponse(message);
    // Add answer to messages array.
    messages.unshift(answer);


    // Update chat conversation with new response.
    const timeout = Math.min(answer.text.length * 2, 2000);
    console.log(timeout.toString());
    setTimeout(render, timeout);
}

async function sendMessageFromInput()
{
    // Get chat input element.
    let input = document.getElementById('chat-input');
    // Get content of chat input field.                
    let inputText = input.value;
    // Create new ChatObject with given input text.
    let message = new ChatObject('person', inputText);
    // Do nothing if nothing was entered.
    if (inputText == "") {
        return;
    }
    // Add message to messages array.
    messages.unshift(message);
    // Clean up input field text.
    input.value = "";


    // Update chat conversation with new message.
    render(true);


    // Send message to dialogflow and get response.
    let answer = await getResponse(message);
    // Add answer to messages array.
    messages.unshift(answer);


    // Update chat conversation with new response.
    render();
}

function render(typing=false) {
    // Get current chat conversation element.
    let conversation = document.getElementById('chat-conversation');
    // Reset all messages currently displayed.
    conversation.innerHTML = "";

    if (typing == true) {
        // Create typing animation.
        addChatTypingAnimation(conversation);
    }

    // Create an element for all elements in messages array.
    messages.forEach(
        function (chatObject, chatObjectIndex) {
            // Add buttons to chat. (If they exist)
            addChatButtons(conversation, chatObject, chatObjectIndex);

            // Add extra messages to chat. (If they exist)
            addChatExtraMessage(conversation, chatObject);

            // Add links to chat. (If they exist)
            addChatLink(conversation, chatObject);

            // Add message to chat.
            addChatMessage(conversation, chatObject);

            // Add image to chat. (If exists)
            addChatImage(conversation, chatObject);
        }
    )
}

function addChatButtons(conversation, chatObject, chatObjectIndex) {
    // Check if buttons exist.
    if (chatObject.buttons.length > 0) {
        // Create new button container element.
        let buttonContainer = document.createElement('div');
        // Set element class.
        buttonContainer.className = 'answer-selection';

        // Fill container with buttons.
        chatObject.buttons.forEach(
            function (buttonText, buttonIndex) {
                // Only newest buttons
                if (chatObjectIndex == 0) {
                    // Create new button element.
                    let button = document.createElement('button');
                    // Set button text.
                    button.innerHTML = buttonText;
                    // Set button class.
                    button.className = 'answer-button';
                    // Set button id.
                    button.id = chatObject.text + buttonText; // TODO: Proper id?
                    // Set onClick method.
                    button.addEventListener("click", sendMessageFromButton);
                    // Deactivate buttons for old messages. (Message 0 is most recent message from dialogflow)
                    if (chatObjectIndex != 0) {
                        button.disabled = true;
                    }
                    // Append button to button container.
                    buttonContainer.appendChild(button);

                    // Check if more than 6 buttons.
                    if (buttonIndex == 5 && chatObject.buttons.length > 6) {
                        // Append container and create a new one.
                        conversation.appendChild(buttonContainer);
                        buttonContainer = document.createElement('div');
                        buttonContainer.className = 'answer-selection';
                    }
                }
            }
        );

        // Append button container element to conversation.
        conversation.appendChild(buttonContainer);
    }
}

function addChatMessage(conversation, chatObject) {
    // Create new div element for each message.
    let element = document.createElement('div');
    // Set text of message.
    element.innerText = chatObject.text;
    // Set class depending on which user.
    if (chatObject.user == 'person') {
        element.className = 'user-message';
    }
    else {
        element.className = 'teacher-message';
    }
    // Append element to conversation.
    conversation.appendChild(element);
}

function addChatImage(conversation, chatObject) {
    // Check if images exist.
    if (chatObject.images.length > 0) {
        // Create new image container element.
        let imgContainer = document.createElement('div');
        // Set element class.
        imgContainer.className = 'teacher-message';

        // Fill container with images.
        chatObject.images.forEach(
            function (imgURL) {
                // Create new image element.
                let img = document.createElement('img');
                // Set image URL.
                img.src = imgURL;
                // Append img to imgContainer.
                imgContainer.appendChild(img);
            }
        );

        // Append imgContainer to conversation.
        conversation.appendChild(imgContainer);
    }
}

function addChatLink(conversation, chatObject) {
    // Check if links exist.
    if (chatObject.links.length > 0) {
        // Fill container with links.
        chatObject.links.forEach(
            function (URL) {
                // Create new image container element.
                let linkContainer = document.createElement('div');
                // Set element class.
                linkContainer.className = 'teacher-message';

                // Create new anchor element.
                let anchor = document.createElement('a');
                // Set link text.
                anchor.innerHTML = URL;
                // Set anchor URL.
                anchor.href = URL;
                // Set target to open in new tab.
                anchor.target = '_blank';
                // Append anchor to linkContainer.
                linkContainer.appendChild(anchor);

                // Append linkContainer to conversation.
                conversation.appendChild(linkContainer);
            }
        );
    }
}

function addChatExtraMessage(conversation, chatObject) {
    // Check if links exist.
    if (chatObject.extraMessages.length > 0) {
        // Fill container with links.
        chatObject.extraMessages.forEach(
            function (extraMsg) {
                // Create new div container element.
                let msgContainer = document.createElement('div');
                // Set element class.
                msgContainer.className = 'teacher-message';
                // Set text of message.
                msgContainer.innerText = extraMsg;
                // Append msgContainer to conversation.
                conversation.appendChild(msgContainer);
            }
        );
    }
}

function addChatTypingAnimation(conversation) {
    // Create new div element for the typing animation.
    let typingAnimationContainer = document.createElement('div');
    // Set class (Only uses typing animation)
    typingAnimationContainer.className = 'teacher-message';

    // Create div elements for each dot.
    let dot1 = document.createElement('div');
    let dot2 = document.createElement('div');
    let dot3 = document.createElement('div');

    // Set class for dots.
    dot1.className = 'typing-dot';
    dot2.className = 'typing-dot';
    dot3.className = 'typing-dot';

    // Append dots into container.
    typingAnimationContainer.appendChild(dot1);
    typingAnimationContainer.appendChild(dot2);
    typingAnimationContainer.appendChild(dot3);

    // Append container to conversation.
    conversation.appendChild(typingAnimationContainer);
}

// Add event listener to input field.
let chatInput = document.getElementById('chat-input');
// Execute a function when the user presses a key on the keyboard
chatInput.addEventListener("keypress", function(event) {
    // If the user presses the "Enter" key on the keyboard
    if (event.key === "Enter") {
        // Cancel the default action, if needed
        event.preventDefault();
        // Trigger the button element with a click
        document.getElementById("chat-button").click();
    }
});

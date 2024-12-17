const form = document.getElementById('prompt');
const chatDiv = document.getElementById('chat');

async function loadChatHistory() {
    try {
        const response = await fetch('/api/history');
        if (!response.ok) {
            throw new Error(`Error loading chat history: ${response.status}`);
        }
        const history = await response.json();

        chatDiv.innerHTML = ''; // Clear the chat area
        history.forEach(([role, message]) => {
            const chatMessage = document.createElement('div');
            let msg = "";
            if(role != 'user'){
                let arr = message.diseases;
                let symptoms_list = message.symptoms;

                
                
                let ret = "The symptoms you listed: <br>";
                for(let i = 0; i < symptoms_list.length; i++){
                    ret += "- ";
                    ret += symptoms_list[i];
                    ret += "<br>";
                }
        
                ret += "<br>";
                ret += "Here is a list of possible diagnoses for diseases you might have: <br>";
                for(let i = 0; i < 10; i++){
                    if(arr[i][0].startsWith("0.000")) break;
                    if(arr[i][0].length > 7) arr[i][0] = arr[i][0].substring(0, 7);
                    ret += String(i + 1);
                    ret += ". ";
                    ret += arr[i][1];
                    ret += " (";
                    ret += arr[i][0];
                    ret += "%) <br>";
                }

                msg = ret;
            } else {
                msg = message;
            }
            chatMessage.innerHTML = `${role === 'user' ? 'You: ' : ''}${msg}`;
            chatMessage.classList.add('message', role === 'user' ? 'user-message' : 'bot-message');
            chatDiv.appendChild(chatMessage);
        });
        chatDiv.scrollTop = chatDiv.scrollHeight; // Scroll to the bottom
    } catch (error) {
        console.error(error);
    }
}

form.addEventListener('submit', async function (event) {
    event.preventDefault();

    const userPrompt = document.getElementById('userPrompt').value;

    // Display the user's message
    const userMessage = document.createElement('div');
    userMessage.textContent = `You: ${userPrompt}`;
    userMessage.classList.add('message', 'user-message');
    chatDiv.appendChild(userMessage);

    try {
        const response = await fetch('/api/prompt', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: userPrompt }),
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }

        let reply = await response.text();
        // console.log(reply);

        const res = JSON.parse(reply);
        // console.log(arr);
        const arr = res.diseases;
        const symptoms_list = res.symptoms;
        
        let ret = "The symptoms you listed: <br>";
        for(let i = 0; i < symptoms_list.length; i++){
            ret += "- ";
            ret += symptoms_list[i];
            ret += "<br>";
        }

        ret += "<br>";
        ret += "Here is a list of possible diagnoses for diseases you might have: <br>";
        for(let i = 0; i < 10; i++){
            if(arr[i][0].startsWith("0.000")) break;
            if(arr[i][0].length > 7) arr[i][0] = arr[i][0].substring(0, 7);
            ret += String(i + 1);
            ret += ". ";
            ret += arr[i][1];
            ret += " (";
            ret += arr[i][0];
            ret += "%) <br>";
        }

        // Display Gemini's response
        const botMessage = document.createElement('div');
        botMessage.innerHTML = `${ret}`;
        botMessage.classList.add('message', 'bot-message');
        chatDiv.appendChild(botMessage);

        chatDiv.scrollTop = chatDiv.scrollHeight; // Scroll to the bottom
    } catch (error) {
        console.error(error);
        const errorMessage = document.createElement('div');
        errorMessage.textContent = 'Error: Unable to fetch response.';
        errorMessage.classList.add('message', 'error-message');
        chatDiv.appendChild(errorMessage);
    }

    document.getElementById('userPrompt').value = ''; // Clear input
});

// Load chat history when the page loads
window.onload = loadChatHistory;

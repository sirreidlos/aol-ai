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
        history.forEach(([message, role]) => {
            const chatMessage = document.createElement('div');
            chatMessage.textContent = `${role === 'user' ? 'You' : 'Gemini'}: ${message}`;
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

        const reply = await response.text();

        // Display Gemini's response
        const botMessage = document.createElement('div');
        botMessage.textContent = `Gemini: ${reply}`;
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

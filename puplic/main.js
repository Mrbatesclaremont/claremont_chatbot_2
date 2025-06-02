const chatLog = document.getElementById('chat-log');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');

chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const message = userInput.value.trim();
    if (!message) return;

    appendMessage('You', message);
    userInput.value = '';

    const response = await fetch('/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
    });
    const data = await response.json();
    appendMessage('Bot', data.botMsg, data.flagged);
});

function appendMessage(sender, message, flagged = false) {
    const div = document.createElement('div');
    div.className = flagged ? 'msg flagged' : 'msg';
    div.innerHTML = `<strong>${sender}:</strong> ${message}`;
    chatLog.appendChild(div);
    chatLog.scrollTop = chatLog.scrollHeight;
}

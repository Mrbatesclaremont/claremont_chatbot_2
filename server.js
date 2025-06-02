const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const safeguard = require('./safeguard');

const app = express();
const PORT = process.env.PORT || 3000;

let chatLogs = []; // In-memory storage for demo

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/chat', (req, res) => {
    const userMsg = req.body.message;
    const { flagged, reason } = safeguard.check(userMsg);

    let botMsg;
    if (flagged) {
        botMsg = safeguard.friendlyResponse(reason);
        // Save flagged chat with reason
        chatLogs.push({ userMsg, botMsg, flagged: true, reason, timestamp: new Date() });
    } else {
        botMsg = safeguard.basicBotReply(userMsg);
        chatLogs.push({ userMsg, botMsg, flagged: false, timestamp: new Date() });
    }

    res.json({ botMsg, flagged, reason });
});

app.get('/logs', (req, res) => {
    // For demo: returns all chat logs
    res.json(chatLogs);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

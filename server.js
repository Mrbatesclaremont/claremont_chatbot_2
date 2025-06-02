const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const safeguard = require('./safeguard');
const { Configuration, OpenAIApi } = require('openai');

const app = express();
const PORT = process.env.PORT || 3000;

let chatLogs = []; // In-memory storage for demo

// Set your OpenAI API Key (use environment variable for security)
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // Set in your Glitch .env or locally
});
const openai = new OpenAIApi(configuration);

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/chat', async (req, res) => {
    const userMsg = req.body.message;
    const { flagged, reason } = safeguard.check(userMsg);

    let botMsg;
    if (flagged) {
        botMsg = safeguard.friendlyResponse(reason);
        // Save flagged chat with reason
        chatLogs.push({ userMsg, botMsg, flagged: true, reason, timestamp: new Date() });
        return res.json({ botMsg, flagged, reason });
    } else {
        // Use ChatGPT API
        try {
            const completion = await openai.createChatCompletion({
                model: "gpt-3.5-turbo", // or another model you have access to
                messages: [{role: "user", content: userMsg}]
            });
            botMsg = completion.data.choices[0].message.content;
        } catch (err) {
            console.error(err);
            botMsg = "Sorry, I couldn't respond right now.";
        }
        chatLogs.push({ userMsg, botMsg, flagged: false, timestamp: new Date() });
        return res.json({ botMsg, flagged: false });
    }
});

app.get('/logs', (req, res) => {
    res.json(chatLogs);
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

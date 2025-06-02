// Simple safeguarding: expand this with real keywords/patterns
const safeguardingKeywords = [
    { words: ['suicide', 'kill myself', 'self harm'], reason: 'self_harm' },
    { words: ['sex', 'nude', 'sext'], reason: 'inappropriate' },
    { words: ['damn', 'shit', 'fuck', 'crap'], reason: 'swearing' }
];

function check(message) {
    if (!message) return { flagged: false };
    const msg = message.toLowerCase();
    for (const group of safeguardingKeywords) {
        for (const word of group.words) {
            if (msg.includes(word)) {
                return { flagged: true, reason: group.reason };
            }
        }
    }
    return { flagged: false };
}

function friendlyResponse(reason) {
    switch (reason) {
        case 'self_harm':
            return "I'm really sorry you're feeling this way. Please talk to a trusted adult or call a helpline. You're not alone.";
        case 'inappropriate':
            return "Let's keep our chat friendly and safe for everyone. If you have questions, please ask in a respectful way.";
        case 'swearing':
            return "Let's try to use kind words. If you're upset, maybe talk to someone you trust.";
        default:
            return "I'm here to help! Let's keep our chat positive and safe.";
    }
}

// Basic echo bot for demo (replace with AI API later)
function basicBotReply(message) {
    return `You said: "${message}"`;
}

module.exports = { check, friendlyResponse, basicBotReply };

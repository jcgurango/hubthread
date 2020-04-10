const Reddit = require('snoowrap');

// Read environment.
require('dotenv').config();

const reddit = new Reddit({
    clientId: process.env.REDDIT_CLIENT_ID,
    clientSecret: process.env.REDDIT_CLIENT_SECRET,
    userAgent: process.env.REDDIT_USER_AGENT,
    refreshToken: process.env.REDDIT_REFRESH_TOKEN,
});

const executeProcess = require('./process');

const tick = async () => {
    try {
        console.log('Processing...');
        await executeProcess(reddit);
        console.log('Success.');
    } catch (e) {
        console.error(e);
    }

    if (process.argv[2] !== 'oneshot') {
        setTimeout(tick, 60000);
    }
};

tick();

const Reddit = require('snoowrap');

/**
 * @param {Reddit} reddit 
 * @param {String} author 
 * @param {String} title 
 * @returns {Promise<Reddit.Submission>}
 */
const latestThreadSearch = async (reddit, author, title) => {
    let after = null;

    // Find the first result with a matching author.
    const results = await reddit.search({
        subreddit: 'Philippines',
        restrictSr: true,
        sort: 'new',
        query: title,
        after,
    });
    
    for (let i = 0; i < results.length; i++) {
        // Check if this is what we're looking for.
        const result = results[i];

        if (result.author.name === author) {
            return result;
        }

        // Fetch more if necessary but only until 100.
        if (i === results.length - 1 && results.length < 100) {
            await results.fetchMore({ amount: 25 });
        }
    }

    return null;
};

/**
 * @param {Reddit} reddit
 */
module.exports = async (reddit) => {
    console.log('Retrieving latest RD...');
    const rd = await latestThreadSearch(reddit, 'the_yaya', 'random discussion');

    if (!rd) {
        throw new Error('RD not found!');
    }

    console.log('Retrieving latest help thread...');
    const help = await latestThreadSearch(reddit, 'AutoModerator', 'weekly help thread');

    if (!help) {
        throw new Error('Help thread not found!');
    }

    console.log('Retrieving latest "What to Do" thread...');
    const whatToDo = await latestThreadSearch(reddit, 'the_yaya', '"what to do in"');

    if (!whatToDo) {
        throw new Error('What to do in not found!');
    }

    const threadContent = (`
Welcome to the r/Philippines hub thread! Where are you trying to go?

- [${rd.title}](https://redd.it/${rd.id})
- [${help.title}](https://redd.it/${help.id})
- [${whatToDo.title}](https://redd.it/${whatToDo.id})
    `);

    console.log('Retrieving current thread content...');
    const currentSubmission = await reddit.getSubmission(process.env.HUB_THREAD_ID).fetch();

    if (currentSubmission.selftext.trim() !== threadContent.trim()) {
        console.log('Updating thread content to:');
        console.log(threadContent);

        await reddit.getSubmission(process.env.HUB_THREAD_ID).edit(threadContent);

        console.log('Updated. Old content:');
        console.log(currentSubmission.selftext);
    } else {
        console.log('Thread is up to date.');
    }
};
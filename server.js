const http = require('http');
const threadIds = require('./thread-ids');

const server = http.createServer(function (req, res) {
  let nextThread = process.env.HUB_THREAD_ID;

  if (req.url === '/what-to-do') {
    nextThread = threadIds.whatToDo;
  }

  if (req.url === '/random-discussion') {
    nextThread = threadIds.rd;
  }

  if (req.url === '/help') {
    nextThread = threadIds.help;
  }

  res.setHeader('Location', `https://redd.it/${nextThread}`);
  res.statusCode = 302;
  res.end();
});

module.exports = server;

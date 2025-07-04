const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

const app = express();
app.use(cors());
app.get('/health', (_, res) => res.send('OK'));

const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

let poll = null; // {question, options:[{text,votes}], active, endsAt}

io.on('connection', socket => {
socket.emit('state_update', poll); // send current state

socket.on('teacher:create_poll', data => { // {question, options[]}
poll = {
question : data.question,
options : data.options.map(t => ({ text: t, votes: 0 })),
endsAt : Date.now() + 60000,
active : true
};
io.emit('state_update', poll);
setTimeout(() => {
if (poll && poll.active) { poll.active = false; io.emit('state_update', poll); }
}, 60000);
});

socket.on('student:answer', idx => {
if (poll && poll.active && poll.options[idx]) {
poll.options[idx].votes += 1;
io.emit('state_update', poll);
}
});
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => console.log('Server running on port', PORT));

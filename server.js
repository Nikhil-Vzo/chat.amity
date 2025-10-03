const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');


const app = express();
const server = http.createServer(app);
const io = new Server(server);


const PORT = process.env.PORT || 3000;


app.use(express.static(path.join(__dirname, 'public')));


// Simple in-memory store for last 100 messages (for newcomers)
const messageHistory = [];
const MAX_HISTORY = 100;


io.on('connection', (socket) => {
console.log('a user connected', socket.id);


// send history
socket.emit('history', messageHistory);


socket.on('join', (nick) => {
socket.data.nick = nick || 'Anon';
socket.broadcast.emit('system', `${socket.data.nick} joined the chat`);
});


socket.on('message', (msg) => {
const payload = {
id: Date.now() + '-' + Math.random().toString(36).slice(2,8),
nick: socket.data.nick || 'Anon',
text: msg,
t: new Date().toISOString(),
};


// save history
messageHistory.push(payload);
if (messageHistory.length > MAX_HISTORY) messageHistory.shift();


io.emit('message', payload);
});


socket.on('disconnect', (reason) => {
if (socket.data.nick) {
socket.broadcast.emit('system', `${socket.data.nick} left the chat`);
}
console.log('user disconnected', socket.id, reason);
});
});


server.listen(PORT, () => {
console.log(`Server listening on http://localhost:${PORT}`);
});
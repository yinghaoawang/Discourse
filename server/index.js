const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origins: '*'
    }
});

app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});

io.on('connection', (socket) => {
    console.log('connect');
    socket.on('message', (data) => {
        const { message } = data;
        console.log('message received, sending', message);
        io.emit('message', { message });
    })

    socket.on('disconnect', () => {
        console.log('disconnect');
    })
});

server.listen(10101, () => {
  console.log('listening on *:10101');
});
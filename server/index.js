const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const io = require('socket.io')(server, {
    cors: {
        origin: '*',
    },
    path: '/socket.io'
});
const cors = require('cors');

app.use(cors({ origin: '*' }));

app.get('/', (req, res) => {
  res.send('<h1>Hello world, this is Discourse api</h1>');
});

io.on('connect', (socket) => {
    console.log('connect');
});

io.on('connection', (socket) => {
    console.log('connection');
    socket.on('message', (data) => {
        const { message } = data;
        console.log('message received, sending', message);
        io.emit('message', { message });
    })

    socket.on('disconnect', () => {
       console.log('disconnect');
    })
});

server.listen(1250, () => {
  console.log('listening on *:1250');
});
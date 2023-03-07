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
const { onSocketConnect } = require('./socketHandler')(io);
io.on('connect', onSocketConnect);

app.use(cors({ origin: '*' }));

app.get('/', (req, res) => {
  res.send('<h1>Hello world, this is Discourse api</h1>');
});

server.listen(1250, () => {
  console.log('listening on *:1250');
});

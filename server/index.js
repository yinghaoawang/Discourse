require('dotenv').config()
const fs = require('fs');
const express = require('express');
const app = express();
const https = require('https');
const server = https.createServer({
    key: fs.readFileSync(process.env.PATH_TO_PRIVATE_KEY),
    cert: fs.readFileSync(process.env.PATH_TO_CERTIFICATE) 
}, app);

const io = require('socket.io')(server, {
    secure: true,
    transports: ['websocket'],
});
const { onSocketConnect } = require('./socketHandler')(io);
io.on('connect', onSocketConnect);

app.get('/', (req, res) => {
  res.send('<h1>Hello world, this is Discourse api</h1>');
});

server.listen(1250, () => {
  console.log('listening on *:1250');
});

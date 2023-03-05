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

const serversDb = [{
  name: 'a',
  channels: [{
    name: 'first',
    posts: [
      { user: { name: 'guy' }, message: 'howdy', dateCreated: '2023-03-05T02:50:40.183Z'},
      { user: { name: 'guy' }, message: 'howdy', dateCreated: '2023-03-05T02:50:40.183Z'},
      { user: { name: 'guy' }, message: 'howdy', dateCreated: '2023-03-05T02:50:40.183Z'},
      { user: { name: 'guy' }, message: 'howdy', dateCreated: '2023-03-05T02:50:40.183Z'},
      { user: { name: 'guy' }, message: 'howdy', dateCreated: '2023-03-05T02:50:40.183Z'},
    ]
  }]
  
}, {
  name: 'b',
  channels: [{
    name: 'bchannel',
    posts: [
      { user: { name: 'guy' }, message: 'howdy', dateCreated: '2023-03-05T02:50:40.183Z'},
      { user: { name: 'guy' }, message: 'howdy', dateCreated: '2023-03-05T02:50:40.183Z'},
    ]
  },
  {
    name: 'yoyo',
    posts: [
      { user: { name: 'guy' }, message: 'howdy', dateCreated: '2023-03-05T02:50:40.183Z'},
      { user: { name: 'guy' }, message: 'hola', dateCreated: '2023-03-05T02:50:40.183Z'},
      { user: { name: 'guy' }, message: 'hola', dateCreated: '2023-03-05T02:50:40.183Z'},
      { user: { name: 'guy' }, message: 'bonjo', dateCreated: '2023-03-05T02:50:40.183Z'},
    ]
  }]
  
}, {
  name: 'c',
  channels: [{
    name: 'empty',
    posts: []
  }]
}];

const servers = serversDb.map((server, index) => ({
  id: index + 1,
  name: server.name,
  channels: server.channels.map(channel => ({ name: channel.name }))
}));

const sendMessage = (data, namespace = io) => {
  const { message, user, room } = data;
  console.log('sending message: ' + message + ' to ' + room + ' in ' + namespace.name);
  const dateCreated = new Date();
  namespace.to(room).emit('message', { message, user, dateCreated });
};

serversDb.forEach(server => {
  console.log('/' + server.name);
  const namespace = io.of('/' + server.name);
  namespace.on('connect', (socket) => {
    console.log('connected to ' + server.name);
    const { channels } = server;
    const firstChannel = channels[0];
    socket.join(firstChannel.name);
    socket.emit('postHistory', { posts: firstChannel.posts });

    socket.on('joinRoom', (data) => {
      console.log('join room ' + data.room);

      const { room, user } = data;
      socket.join(room);
      const channel = server.channels.find(c => c.name === room);
      const { posts } = channel;
      socket.emit('postHistory', { posts });
      sendMessage({ message: 'has joined the room', user, room }, namespace);
    })

    socket.on('leaveRoom', (data) => {
      console.log('leave room ' + data.room);

      const { room, user } = data;
      sendMessage({ message: 'has left the room', user, room }, namespace);
      socket.leave(room);
    })

    socket.on('message', (data) => sendMessage(data, namespace))
  });
});

io.on('connect', (socket) => {
  console.log('connect');
  socket.emit('servers', { servers });
  

  socket.on('disconnect', () => {
      console.log('disconnect');
  })
});

server.listen(1250, () => {
  console.log('listening on *:1250');
});

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
const PostTypes = {
  USER_MESSAGE: 'USER_MESSAGE',
  USER_LEAVE: 'USER_LEAVE',
  USER_JOIN: 'USER_JOIN',
}

app.use(cors({ origin: '*' }));

app.get('/', (req, res) => {
  res.send('<h1>Hello world, this is Discourse api</h1>');
});

const serversDb = [{
  name: 'a',
  channels: [{
    name: 'first',
    posts: [
      { user: { name: 'Admin' }, message: 'Hey, welcome to a-first', dateCreated: '2023-03-05T02:50:40.183Z'},
    ]
  }]
  
}, {
  name: 'b',
  channels: [{
    name: 'bchannel',
    posts: [
      { user: { name: 'guy' }, message: 'howdy, this is bchannel', dateCreated: '2023-03-05T02:50:40.183Z'},
    ]
  },
  {
    name: 'yoyo',
    posts: [
      { user: { name: 'eminem' }, message: 'balms r sweaty', dateCreated: '2023-03-05T02:50:40.183Z'},
      { user: { name: 'eminem' }, message: 'knees meat', dateCreated: '2023-03-05T02:50:40.183Z'},
      { user: { name: 'eminem' }, message: 'arms spaghetti', dateCreated: '2023-03-05T02:50:40.183Z'},
      { user: { name: 'eminem' }, message: 'moms are heavy', dateCreated: '2023-03-05T02:50:40.183Z'},
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

const sendMessage = ({ message, user, roomName, type, namespace }) => {
  console.log('sending message: ' + message + ' to ' + roomName + ' in ' + namespace.name);
  const dateCreated = new Date();
  namespace.to(roomName).emit('message', { message, user, dateCreated, type });
  serversDb.find(server => '/' + server.name === namespace.name).channels.find(channel => channel.name === roomName).posts.push({ message, user, dateCreated, type } );
};



serversDb.forEach(server => {
  console.log('/' + server.name);
  const namespace = io.of('/' + server.name);

  namespace.on('connect', (socket) => {
    console.log('connected to ' + server.name);

    const { channels } = server;

    const joinRoom = ({ user, roomName }) => {
      console.log('join room ' + roomName);
      socket.join(roomName);
      sendMessage({ message: 'has joined the room', user, roomName, type: PostTypes.USER_JOIN, namespace });
    }

    const firstChannel = channels[0];
    socket.join(firstChannel.name);
    socket.emit('postHistory', { posts: firstChannel.posts });

    socket.on('joinRoom', (data) => {
      const { roomName, user } = data;
      const channel = server.channels.find(c => c.name === roomName);
      const { posts } = channel;
      socket.emit('postHistory', { posts });
      joinRoom({ roomName, user });
    })

    socket.on('leaveRoom', (data) => {
      console.log('leave room ' + data.roomName);

      const { roomName, user } = data;
      sendMessage({ message: 'has left the room', user, roomName , type: PostTypes.USER_LEAVE, namespace });
      socket.leave(roomName);
    });

    socket.on('disconnect', (data) => {
      console.log(socket.rooms);
      console.log('disconnect');
    })

    socket.on('message', (data) => {
      console.log(data);
      sendMessage({ ...data, namespace })
    });
  })
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

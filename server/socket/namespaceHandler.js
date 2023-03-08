const serversDb = require('./serversDb');

const { PostTypes } = require('./socketConstants');

module.exports = (io) => {
    const onNamespaceConnect = ({ socket, server, namespace }) => {
        console.log('connected to ' + server.name);
        const { channels } = server;

        const sendMessage = ({ message, roomName, type }) => {
            const { user } = socket;
            console.log('sending message: ' + message + ' to ' + roomName + ' in ' + namespace.name);
            const dateCreated = new Date();
            namespace.to(roomName).emit('message', { message, dateCreated, type, user });
            serversDb.find(server => '/' + server.name === namespace.name).channels.find(channel => channel.name === roomName).posts.push({ message, dateCreated, type, user } );
        };

        const getCurrentRoom = () => {
            return [...socket.rooms][1];
        }

        const joinRoom = ({ roomName, user }) => {
            const channel = channels.find(c => c.name === roomName);
            const { posts } = channel;
            socket.emit('postHistory', { posts });
            socket.join(roomName);
            sendMessage({ message: 'has joined the channel', roomName, type: PostTypes.USER_JOIN });
        };

        const leaveRoom = ({ roomName = null, user }) => {
            if (roomName == null) roomName = getCurrentRoom();
            sendMessage({ message: 'has left the room', roomName, type: PostTypes.USER_LEAVE });
            socket.leave(roomName);
        }

        const onUpdateUser = ({ user }) => {
            socket.user = user;
        }

        const onDisconnecting = () => {
            console.log(getCurrentRoom());
            leaveRoom()
            console.log('disconnecting');
        }

        const onMessage = (payload) => {
            sendMessage(payload);
        };

        const onJoinRoom = (payload) => {
            joinRoom(payload);
        }

        const onLeaveRoom = (payload) => {
            leaveRoom(payload);
        }

        socket.on('message', onMessage);
        socket.on('disconnecting', onDisconnecting);
        socket.on('joinRoom', onJoinRoom);
        socket.on('leaveRoom', onLeaveRoom);
        socket.on('updateUser', onUpdateUser);
    }

    return {
        onNamespaceConnect
    }
}
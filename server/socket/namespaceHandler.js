const { PostTypes } = require('./socketConstants');
const { addPost, getChannels, addChannel, getPosts } = require('../db.utils');

module.exports = async (io) => {
    const onNamespaceConnect = async ({ socket, server, namespace }) => {
        console.log('connected to ' + server.name);

        let channels = await getChannels({ serverName: server.name });
        const channelData = { name: 'newChannel' + channels.length };
        await addChannel({ serverName: server.name, channelData });

        channels = await getChannels({ serverName: server.name });
        socket.emit('channels', { channels });

        const sendMessage = async ({ message, roomName, type }) => {
            const { user } = socket;
            console.log('sending message: ' + message + ' to ' + roomName + ' in ' + namespace.name);
            const dateCreated = new Date();
            namespace.to(roomName).emit('message', { message, dateCreated, type, user });
            const postData = { message, dateCreated, type, user };
            await addPost({ serverName: server.name, channelName: roomName, postData });
        };

        const getCurrentRoom = () => {
            return [...socket.rooms][1];
        }

        const joinRoom = async ({ roomName, message }) => {
            const posts = await getPosts({ serverName: server.name, channelName: roomName });
            socket.emit('posts', { posts });
            socket.join(roomName);
            if (message == null) {
                message = 'has joined the channel';
            }
            await sendMessage({ message, roomName, type: PostTypes.USER_JOIN });
        };

        const leaveRoom = async ({ roomName, message }) => {
            if (roomName == null) {
                console.error('Error handling leaveRoom: room does not exist');
                return;
            }
            if (message == null) {
                message = 'has left the channel';
            }
            await sendMessage({ message, roomName, type: PostTypes.USER_LEAVE });
            socket.leave(roomName);
        }

        const onUpdateUser = ({ user }) => {
            socket.user = user;
        }

        const onDisconnecting = () => {
            leaveRoom({ roomName: getCurrentRoom(), message: 'has signed out' });
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
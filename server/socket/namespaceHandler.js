const { PostTypes } = require('./socketConstants');
const { addPost, getChannels, addChannel, getPosts } = require('../db.utils');

module.exports = async (io) => {
    const onNamespaceConnect = async ({ socket, server, namespace }) => {
        console.log('connected to ' + server.name);

        const channels = await getChannels({ serverId: server.id });

        socket.emit('channels', { channels });

        const sendMessage = async ({ message, roomId, type }) => {
            const { user } = socket;
            console.log('sending message: ' + message + ' to ' + roomId + ' in ' + namespace.name);
            const dateCreated = new Date();
            namespace.to(roomId).emit('message', { message, dateCreated, type, user });
            const postData = { message, dateCreated, type, user };
            await addPost({ serverId: server.id, channelId: roomId, postData });
        };

        const getCurrentRoom = () => {
            return [...socket.rooms][1];
        }

        const joinRoom = async ({ roomId, message }) => {
            const posts = await getPosts({ serverId: server.id, channelId: roomId });
            socket.emit('posts', { posts });
            socket.join(roomId);
            if (message == null) {
                message = 'has joined the channel';
            }
            await sendMessage({ message, roomId, type: PostTypes.USER_JOIN });
        };

        const leaveRoom = async ({ roomId, message }) => {
            if (roomId == null) {
                console.error('Error handling leaveRoom: room does not exist');
                return;
            }
            if (message == null) {
                message = 'has left the channel';
            }
            await sendMessage({ message, roomId, type: PostTypes.USER_LEAVE });
            socket.leave(roomId);
        }

        const onUpdateUser = ({ user }) => {
            socket.user = user;
        }

        const onAddChannel = async ({ channelData}) => {
            let channels = await getChannels({ serverId: server.id });
            await addChannel({ serverId: server.id, channelData: { ...channelData, id: channels.length } });
            const nsp = io.of('/' + server.name);
            channels = await getChannels({ serverId: server.id });
            nsp.emit('channels', { channels });
        }

        const onDisconnecting = () => {
            leaveRoom({ roomId: getCurrentRoom(), message: 'has signed out' });
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
        socket.on('addChannel', onAddChannel);
    }

    return {
        onNamespaceConnect
    }
}
const { PostTypes } = require('./socketConstants');
const { addPost, getChannels, addChannel, getPosts } = require('../db.utils');

const getUsersInNamespace = ({ namespace }) => {
    const users = [];
    for (const [key, value] of namespace.sockets.entries()) {
        const { user } = value;
        if (!user) {
            console.error('Namespace socket user does not exist')
        } else {
            users.push(user);
        }
    }
    return users;
}

module.exports = async (io) => {
    const onNamespaceConnect = async ({ socket, server }) => {
        console.log('connected to ' + server.name);

        const namespace = io.of('/' + server.name);

        const sendChannels = async () => {
            const channels = await getChannels({ serverId: server.id });
            socket.emit('channels', { channels });
        }
        
        const sendUsers = () => {
            namespace.emit('serverUsers', { users: getUsersInNamespace({ namespace }), name: namespace.name });
        }

        const updateUser = ({ user }) => {
            socket.user = user;
            sendUsers();
        }

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
            sendUsers();
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
            sendUsers();
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

        const onDisconnect = () => {
            sendUsers();
            console.log('disconnect from ', namespace.name);
        }

        socket.on('getChannels', sendChannels);
        socket.on('getUsers', sendUsers);
        socket.on('message', sendMessage);
        socket.on('disconnecting', onDisconnecting);
        socket.on('disconnect', onDisconnect);
        socket.on('joinRoom', joinRoom);
        socket.on('leaveRoom', leaveRoom);
        socket.on('updateUser', updateUser);
        socket.on('addChannel', onAddChannel);
    }

    return {
        onNamespaceConnect
    }
}
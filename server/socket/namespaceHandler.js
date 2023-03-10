const { PostTypes } = require('./socketConstants');
const { addPost, getChannels, addChannel, getPosts, addServerUser, getServerUsers } = require('../db.utils');



module.exports = async (io) => {
    const onNamespaceConnect = async ({ socket, server }) => {
        const namespace = io.of('/' + server.name);

        const getUsersInNamespace = () => {
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
        
        const sendChannels = async () => {
            const channels = await getChannels({ serverId: server.id });
            socket.emit('channels', { channels });
        }
        
        const sendUsers = async () => {
            namespace.emit('serverUsers', { users: await getServerUsers({ serverId: server.id }), connectedUsers: await getUsersInNamespace({ namespace }), name: namespace.name });
        }

        const sendPosts = async ({ roomId }) => {
            const posts = await getPosts({ serverId: server.id, channelId: roomId });
            socket.emit('posts', { posts });
        }

        const updateUser = async ({ user, isOnConnect }) => {
            socket.user = user;
            if (isOnConnect) {
                await addServerUser({ serverId: server.id, serverUserData: user })
                await sendMessage({ message: 'has joined the server', serverId: server.id, type: PostTypes.USER_JOIN });
            }
            sendUsers();
        }

        const sendMessage = async ({ message, roomId, type }) => {
            const { user } = socket;
            const dateCreated = new Date();

            // if room not specified, use first room if exists
            if (roomId == null) {
                const channels = await getChannels({ serverId: server.id });
                if (channels.length === 0) return;

                roomId = channels[0].id;
            }
            console.log('sending message: ' + message + ' to room ' + roomId + ' in ' + namespace.name);

            namespace.to(roomId).emit('message', { message, dateCreated, type, user });
            const postData = { message, dateCreated, type, user };
            await addPost({ serverId: server.id, channelId: roomId, postData });
            
        };

        const getCurrentRoom = () => {
            return [...socket.rooms][1];
        }

        const joinRoom = async ({ roomId }) => {
            console.log('joining room', roomId);
            sendPosts({ roomId });
            socket.join(roomId);
            sendUsers();
        };

        const leaveRoom = async ({ roomId }) => {
            if (roomId == null) {
                console.error('Error handling leaveRoom: room does not exist');
                return;
            }
            socket.leave(roomId);
            sendUsers();
        }

        const onConnect = async () => {
            console.log('connected to ' + server.name);
        }

        const onDisconnecting = async () => {
            leaveRoom({ roomId: getCurrentRoom() });
            await sendMessage({ message: 'has left the server', serverId: server.id, type: PostTypes.USER_LEAVE });
        }
        
        const onDisconnect = () => {
            sendUsers();
            console.log('disconnect from ', namespace.name);
        }

        const onAddChannel = async ({ channelData}) => {
            console.log('adding channel');
            let channels = await getChannels({ serverId: server.id });
            await addChannel({ serverId: server.id, channelData: { ...channelData, id: channels.length } });
            const nsp = io.of('/' + server.name);
            channels = await getChannels({ serverId: server.id });
            nsp.emit('channels', { channels });
        }

        socket.on('getPosts', sendPosts);
        socket.on('getChannels', sendChannels);
        socket.on('getUsers', sendUsers);
        socket.on('message', sendMessage);
        socket.on('disconnecting', onDisconnecting);
        socket.on('disconnect', onDisconnect);
        socket.on('joinRoom', joinRoom);
        socket.on('leaveRoom', leaveRoom);
        socket.on('updateUser', updateUser);
        socket.on('addChannel', onAddChannel);

        onConnect();
    }

    return {
        onNamespaceConnect
    }
}
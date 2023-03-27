const { PostTypes } = require('./socketConstants');
const { addPost, getTextChannels, addTextChannel, getVoiceChannels, addVoiceChannel, getPosts, addServerUser, getServerUsers, getUser, setUser } = require('../db.utils');

module.exports = async (io) => {
    const onNamespaceConnect = async ({ socket, server }) => {
        const namespace = io.of('/' + server.name);

        const getUsersInNamespace = () => {
            const users = [];
            for (const [key, value] of namespace.sockets.entries()) {
                const nspSocket = value;
                if (!nspSocket?.user) {
                    console.error('Namespace socket user does not exist')
                } else {
                    users.push(nspSocket.user);
                }
            }
            return users;
        }
        
        const sendAllChannels = async (payload) => {
            const textChannels = await getTextChannels({ serverId: server.id });
            const voiceChannels = await getVoiceChannels({ serverId: server.id });
            if (payload != null && payload.target != null) {
                payload.target.emit('channels', { textChannels, voiceChannels });
            } else {
                socket.emit('channels', { textChannels, voiceChannels });
            }
        }
        
        const sendServerUsers = async () => {
            namespace.emit('serverUsers', { users: await getServerUsers({ serverId: server.id }), connectedUsers: await getUsersInNamespace({ namespace }), name: namespace.name });
        }

        const sendPosts = async ({ roomId }) => {
            const posts = await getPosts({ serverId: server.id, channelId: roomId });
            socket.emit('posts', { posts });
        }

        const updateServerUser = async ({ userId, isOnConnect=false, userData=null }) => {
            await addServerUser({ serverId: server.id, userId });
            if (userData != null) {
                setUser({ userId, userData });
            }
            const user = await getUser({ userId });
            socket.user = user;
            socket.userId = userId;

            if (isOnConnect) {
                const serverUsers = await getServerUsers({ serverId: server.id });
                const matchingUser = serverUsers.find(item => item?.userId === userId);
                if (!matchingUser) {
                    await sendMessage({ message: 'has joined the server', serverId: server.id, type: PostTypes.USER_JOIN, user });
                }
            }

            sendServerUsers();
        }

        const sendMessage = async ({ message, roomId, type, user }) => {
            if (user == null) {
                user = socket.user;
            }
            const dateCreated = new Date();

            // if room not specified, use first room if exists
            if (roomId == null) {
                const channels = await getTextChannels({ serverId: server.id });
                if (channels.length === 0) return;

                roomId = channels[0].id;
            }
            console.log('sending message: ' + message + ' to room ' + roomId + ' in ' + namespace.name);

            namespace.to(roomId).emit('message', { message, dateCreated, type, user });
            const postData = { message, dateCreated, type, user };
            await addPost({ serverId: server.id, channelId: roomId, postData });
            
        };

        const getCurrentRoomId = () => {
            return [...socket.rooms][1];
        }

        const joinRoom = async ({ roomId }) => {
            console.log('joining room', roomId);
            sendPosts({ roomId });
            socket.join(roomId);
            sendServerUsers();
        };

        const leaveRoom = async ({ roomId }) => {
            if (roomId == null) {
                console.error('Error handling leaveRoom: room does not exist');
                return;
            }
            socket.leave(roomId);
            sendServerUsers();
        }

        const onConnect = async () => {
            console.log('connected to ' + server.name);
        }

        const onDisconnecting = async () => {
            leaveRoom({ roomId: getCurrentRoomId() });
        }
        
        const onDisconnect = () => {
            sendServerUsers();
            console.log('disconnected from ', namespace.name);
        }

        const onAddTextChannel = async ({ textChannelData}) => {
            console.log('adding channel');
            let channels = await getTextChannels({ serverId: server.id });
            await addTextChannel({ serverId: server.id, textChannelData: { ...textChannelData, id: channels.length } });
            channels = await getTextChannels({ serverId: server.id });
            sendAllChannels({ target: namespace });
        }

        const onAddVoiceChannel = async ({ voiceChannelData}) => {
            console.log('adding voice channel');
            let voiceChannels = await getVoiceChannels({ serverId: server.id });
            await addVoiceChannel({ serverId: server.id, voiceChannelData: { ...voiceChannelData, id: voiceChannels.length } });
            voiceChannels = await getVoiceChannels({ serverId: server.id });
            sendAllChannels({ target: namespace });
        }

        socket.on('getPosts', sendPosts);
        socket.on('getChannels', sendAllChannels);
        socket.on('getServerUsers', sendServerUsers);
        socket.on('message', sendMessage);
        socket.on('disconnecting', onDisconnecting);
        socket.on('disconnect', onDisconnect);
        socket.on('joinRoom', joinRoom);
        socket.on('leaveRoom', leaveRoom);
        socket.on('updateServerUser', updateServerUser);
        socket.on('addTextChannel', onAddTextChannel);
        socket.on('addVoiceChannel', onAddVoiceChannel);

        onConnect();
    }

    return {
        onNamespaceConnect
    }
}
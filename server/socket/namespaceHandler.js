const { PostTypes } = require('./socketConstants');
const { addPost, getTextChannels, addTextChannel, getVoiceChannels, addVoiceChannel, getPosts, addServerUser, getServerUsers } = require('../db.utils');

const { voiceRooms, joinVoiceRoom, leaveVoiceRoom } = require('./voiceRooms');

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

        const sendVoiceRoomData = async (payload) => {
            if (payload != null && payload.target != null) {
                payload.target.emit('voiceRooms', { voiceRooms });
            } else {
                namespace.emit('voiceRooms', { voiceRooms });
            }
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
                const serverUsers = await getServerUsers({ serverId: server.id });
                const matchingUser = serverUsers.find(item => item.name === user.name);
                if (!matchingUser) {
                    await sendMessage({ message: 'has joined the server', serverId: server.id, type: PostTypes.USER_JOIN });
                }
                await addServerUser({ serverId: server.id, serverUserData: user });
            }
            sendUsers();
        }

        const sendMessage = async ({ message, roomId, type }) => {
            const { user } = socket;
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

        const getCurrentVoiceRoomId = () => {
            for (let voiceRoom of voiceRooms) {
                const matchingUser = voiceRoom?.users?.find(u => u.id == socket.id);
                if (matchingUser) return voiceRoom.roomId;
            }
            return null;
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

        const onJoinVoiceRoom = async ({ roomId }) => {
            console.log('joining vc room', roomId);
            joinVoiceRoom({ roomId, socket });
            sendVoiceRoomData();
        }

        const onLeaveVoiceRoom = async({ roomId }) => {
            console.log('leaving vc room', roomId);
            leaveVoiceRoom({ roomId, socket });
            sendVoiceRoomData();
        }

        const onConnect = async () => {
            console.log('connected to ' + server.name);
        }

        const onDisconnecting = async () => {
            leaveRoom({ roomId: getCurrentRoomId() });
            onLeaveVoiceRoom({ roomId: getCurrentVoiceRoomId() })
            // await sendMessage({ message: 'has left the server', serverId: server.id, type: PostTypes.USER_LEAVE });
        }
        
        const onDisconnect = () => {
            sendUsers();
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
        socket.on('getVoiceRooms', sendVoiceRoomData);
        socket.on('getUsers', sendUsers);
        socket.on('message', sendMessage);
        socket.on('disconnecting', onDisconnecting);
        socket.on('disconnect', onDisconnect);
        socket.on('joinRoom', joinRoom);
        socket.on('leaveRoom', leaveRoom);
        socket.on('joinVoiceRoom', onJoinVoiceRoom);
        socket.on('leaveVoiceRoom', onLeaveVoiceRoom);
        socket.on('updateUser', updateUser);
        socket.on('addTextChannel', onAddTextChannel);
        socket.on('addVoiceChannel', onAddVoiceChannel);

        onConnect();
    }

    return {
        onNamespaceConnect
    }
}
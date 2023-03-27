const { voiceRooms, joinVoiceRoom, leaveVoiceRoom, updateVoiceRoomUser } = require('./voiceRooms');

module.exports = async (io) => {
    const addVoiceRoomListeners = async ({ socket, namespace, server }) => {
        const sendVoiceRoomData = async (payload) => {
            if (payload != null && payload.target != null) {
                payload.target.emit('voiceRooms', { voiceRooms });
            } else {
                namespace.emit('voiceRooms', { voiceRooms });
            }
        }

        const voiceRoomEmit = ({ namespace = io, serverId = server.id, roomId, key, payload, excludeSelf = false }) => {
            const voiceRoom = voiceRooms.find(v => v.roomId === roomId && v.serverId === serverId);
            if (voiceRoom == null) {
                console.error('Voice room ' + roomId + ' could not be found in voiceRoomEmit');
                return;
            }
        
            const users = voiceRoom.users;
            if (users == null) throw new Error('Voice room does not have property users in voiceRoomEmit');
        
            for (const user of users) {
                if (excludeSelf && user.id == socket.id) continue;
                namespace.to(user.id).emit(key, payload);
            }
        }

        const getCurrentVoiceRoom = () => {
            for (const voiceRoom of voiceRooms) {
                const matchingUser = voiceRoom?.users?.find(u => u.id == socket.id);
                if (matchingUser) return voiceRoom;
            }
            return null;
        }

        const getCurrentVoiceRoomId = () => {
            if (socket.room?.id != null) return socket.room?.id;
            return  getCurrentVoiceRoom()?.id;
        }

        const onConnSignal = async ({ signal, connSocketId }) => {
            namespace.to(connSocketId).emit('wrtcSignal', { signal, connSocketId: socket.id })
            
        }

        const onConnInit = async ({ connSocketId }) => {
            namespace.to(connSocketId).emit('wrtcInit', { connSocketId: socket.id });
        }

        const joinVoiceRoomHandler = async ({ roomId }) => {
            console.log('joining vc room', roomId);
            const voiceRoom = joinVoiceRoom({ roomId, socket, serverId: server.id });

            if (voiceRoom == null) {
                console.error('Voice room could not be joined in joinVoiceRoomHandler');
                return;
            } 

            voiceRoomEmit({ namespace, roomId, key: 'userJoinedVoiceRoom' });
            if (voiceRoom.users?.length > 1) {
                voiceRoomEmit({ namespace, roomId, key: 'wrtcPrepare', payload: { connSocketId: socket.id }, excludeSelf: true });
            }
            socket.room = { id: roomId };

            sendVoiceRoomData();
        }

        const updateVoiceRoomUserHandler = async ({ roomId, serverId, userData }) => {
            updateVoiceRoomUser({ roomId, serverId, socket, userData: { id: socket.id, name: userData?.displayName } });
            sendVoiceRoomData();
        }

        const leaveVoiceRoomHandler = async({ roomId }) => {
            console.log('leaving vc room', roomId);
            voiceRoomEmit({ namespace, roomId, key: 'wrtcClose', payload: { connSocketId: socket.id } });
            voiceRoomEmit({ namespace, roomId, key: 'userLeftVoiceRoom' });
            socket.room = null;
            
            leaveVoiceRoom({ roomId, socket, serverId: server.id });
            sendVoiceRoomData();
        }

        const onDisconnect = async () => {
            console.log(getCurrentVoiceRoomId());
            leaveVoiceRoomHandler({ roomId: getCurrentVoiceRoomId() });
        }

        socket.on('getVoiceRooms', sendVoiceRoomData);
        socket.on('joinVoiceRoom', joinVoiceRoomHandler);
        socket.on('leaveVoiceRoom', leaveVoiceRoomHandler);
        socket.on('updateVoiceRoomUser', updateVoiceRoomUserHandler);
        socket.on('disconnect', onDisconnect);
        socket.on('wrtcSignal', onConnSignal);
        socket.on('wrtcInit', onConnInit);
    }

    return {
        addVoiceRoomListeners
    }
}
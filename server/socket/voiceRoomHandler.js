const { voiceRooms, joinVoiceRoom, leaveVoiceRoom } = require('./voiceRooms');

module.exports = async (io) => {
    const addVoiceRoomListeners = async ({ socket, namespace }) => {
        const sendVoiceRoomData = async (payload) => {
            if (payload != null && payload.target != null) {
                payload.target.emit('voiceRooms', { voiceRooms });
            } else {
                namespace.emit('voiceRooms', { voiceRooms });
            }
        }

        const voiceRoomEmit = ({ namespace = io, roomId, key, payload, excludeSelf = false }) => {
            const voiceRoom = voiceRooms.find(v => v.roomId === roomId);
            if (voiceRoom == null) {
                console.error('Voice room ' + roomId + ' could not be found in voiceRoomEmit');
                return;
            }
        
            console.log('emitting ' + key + ' to all users in ' + roomId);
            const users = voiceRoom.users;
            if (users == null) throw new Error('Voice room does not have property users in voiceRoomEmit');
        
            for (const user of users) {
                if (excludeSelf && user.id == socket.id) continue;
                console.log('to ' + user.id);
                namespace.to(user.id).emit(key, payload);
            }
        }

        const getCurrentVoiceRoomId = () => {
            for (const voiceRoom of voiceRooms) {
                const matchingUser = voiceRoom?.users?.find(u => u.id == socket.id);
                if (matchingUser) return voiceRoom.roomId;
            }
            return null;
        }

        const onConnSignal = async ({ signal, connSocketId }) => {
            namespace.to(connSocketId).emit('wrtcSignal', { signal, connSocketId: socket.id })
            
        }

        const onConnInit = async ({ connSocketId }) => {
            namespace.to(connSocketId).emit('wrtcInit', { connSocketId: socket.id });
        }

        const joinVoiceRoomHandler = async ({ roomId }) => {
            console.log('joining vc room', roomId);

            const voiceRoom = joinVoiceRoom({ roomId, socket });

            if (voiceRoom == null) {
                console.error('Voice room could not be joined in joinVoiceRoomHandler');
                return;
            } 
            if (voiceRoom.users?.length > 1) {
                voiceRoomEmit({ namespace, roomId, key: 'wrtcPrepare', payload: { connSocketId: socket.id }, excludeSelf: true });
            }

            sendVoiceRoomData();
        }

        const leaveVoiceRoomHandler = async({ roomId }) => {
            console.log('leaving vc room', roomId);
            voiceRoomEmit({ namespace, roomId, key: 'wrtcClose', payload: { connSocketId: socket.id } });
            
            leaveVoiceRoom({ roomId, socket });
            sendVoiceRoomData();
        }

        const onDisconnecting = async () => {
            leaveVoiceRoomHandler({ roomId: getCurrentVoiceRoomId() });
        }

        socket.on('getVoiceRooms', sendVoiceRoomData);
        socket.on('joinVoiceRoom', joinVoiceRoomHandler);
        socket.on('leaveVoiceRoom', leaveVoiceRoomHandler);
        socket.on('disconnecting', onDisconnecting);
        socket.on('wrtcSignal', onConnSignal);
        socket.on('wrtcInit', onConnInit);
    }

    return {
        addVoiceRoomListeners
    }
}
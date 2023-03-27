const voiceRooms = [];

const addUserToVoiceRoom = ({ voiceRoom, socket }) => {
    const user = {
        id: socket.id,
        name: socket.user?.displayName
    }
    console.log(socket.user);
    voiceRoom.users.push(user);
    return user;
}

const updateVoiceRoomUser = ({ roomId, serverId, socket, userData }) => {
    let voiceRoom = voiceRooms.find(v => v.roomId === roomId && v.serverId === serverId);
    if (voiceRoom == null) {
        voiceRoom = { roomId, users: [], serverId: serverId };
        voiceRooms.push(voiceRoom);
    }

    const matchingUserIndex = voiceRoom?.users?.findIndex(u => u.id === socket.id);
    if (matchingUserIndex === -1) {
        throw new Error('Could not find matching user in updateVoiceRoomUser');
    }

    if (userData != null) {
        voiceRoom.users[matchingUserIndex] = { ...userData, id: socket.id };
    } else {
        voiceRoom.users[matchingUserIndex] = {
            id: socket.id,
            name: socket.user?.displayName
        }
    }
    console.log('vc room users', voiceRoom.users);
}

const joinVoiceRoom = ({ roomId, socket, serverId }) => {
    let voiceRoom = voiceRooms.find(v => v.roomId === roomId && v.serverId === serverId);
    if (voiceRoom == null) {
        voiceRoom = { roomId, users: [], serverId: serverId };
        voiceRooms.push(voiceRoom);
    }

    if (voiceRoom.users == null) {
        voiceRoom.users = [];
    }

    const matchingUser = voiceRoom.users.find(u => u.id == socket.id);
    if (matchingUser != null) {
        console.error('User is already in voice room in joinVoiceRoom');
        return;
    }

    const user = addUserToVoiceRoom({ voiceRoom, socket });

    console.log('User ' + socket.id + ' successfully joined voice room ' + roomId);
    return voiceRoom;
}

const leaveVoiceRoom = ({ roomId, socket, serverId }) => {
    const voiceRoom = voiceRooms.find(v => v.roomId === roomId && v.serverId === serverId);
    
    if (voiceRoom == null) {
        console.error('Voice room is null in leaveVoiceRoom');
        return;
    }
    
    if (voiceRoom.users == null) {
        console.error('Users of voice room is null in leaveVoiceRoom')
        return;
    }
    
    const userIndex = voiceRoom.users.findIndex(u => u.id == socket.id);
    if (userIndex === -1) {
        console.error('Matching user of voice room not found in leaveVoiceRoom');
        return;
    }
    
    voiceRoom.users.splice(userIndex, 1);
    console.log('User ' + socket.id + ' successfully left voice room ' + roomId);
}

module.exports = {
    voiceRooms, joinVoiceRoom, leaveVoiceRoom, updateVoiceRoomUser
}
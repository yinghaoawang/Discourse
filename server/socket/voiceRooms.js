const voiceRooms = [];

const addUserToVoiceRoom = ({ voiceRoom, socket }) => {
    const user = {
        id: socket.id,
        name: socket.user?.name
    }
    voiceRoom.users.push(user);
    return user;
}

const joinVoiceRoom = ({ roomId, socket }) => {
    let voiceRoom = voiceRooms.find(v => v.roomId === roomId);
    if (voiceRoom == null) {
        voiceRoom = { roomId, users: [] };
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
}

const leaveVoiceRoom = ({ roomId, socket }) => {
    const voiceRoom = voiceRooms.find(v => v.roomId === roomId);
    console.log(voiceRoom, roomId);
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
    const userSpliced = voiceRoom.users.splice(userIndex, 1);
    console.log('spliced', userSpliced);

    console.log('User ' + socket.id + ' successfully left voice room ' + roomId);
}

module.exports = {
    voiceRooms, joinVoiceRoom, leaveVoiceRoom
}
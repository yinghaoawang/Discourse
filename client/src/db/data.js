import { generateRandomName } from "../util/helpers.util";

// Generate fake testing data
const generateRandomData = () => {
    // Generate global user data
    const userData = [];
    const userLength = Math.floor(Math.random() * 100 + 10);
    for (let userIndex = 0; userIndex < userLength; userIndex++) {
        userData.push({name: generateRandomName(Math.random() * 4 + 4)});
    }

    // Generate global server data
    const serverData = [];
    for (let serverIndex = 0; serverIndex < Math.random() * Math.random() * 20; serverIndex++) {
        const serverName = generateRandomName(8);

        // Populate server with random users from users pool
        const serverUsers = [];
        for (let i = 0; i < userData.length; i++) {
            if (Math.random() < .2) serverUsers.push(userData[i]);
        }
        if (userData.length === 0) {
            const randomUserIndex = Math.floor(Math.random() * userLength);
            serverUsers.push(userData[randomUserIndex]);
        }

        // Generate random channel data for each server
        const channelData = [];
        const channelLength = Math.random() * 5 + Math.random() * 3;
        for (let channelIndex = 0; channelIndex < channelLength; channelIndex++) {
            const channelName = generateRandomName(Math.random() * 5 + 3);

            // Generate random post data for each channel
            const postData = [];
            for (let i = 0; i < Math.random() * 50 + 10; i++) {
                const randomServerUserIndex = Math.floor(Math.random() * serverUsers.length);
                postData.push({user: serverUsers[randomServerUserIndex], message: `Hello to channel ${channelName} in ${serverName}`});
            }

            channelData.push({
                name: channelName,
                posts: postData
            });
        }

        serverData.push({
            id: serverIndex,
            name: serverName,
            users: serverUsers,
            channels: channelData
        });
    }

    // return { serverData, userData };
    return { serverData: [], userData: [] }
}
const { serverData, userData } = generateRandomData();

export { serverData, userData };
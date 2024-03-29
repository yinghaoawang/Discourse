const { redisClient } = require('./redis.utils');

const addUser = async ({ userId, userData }) => {
    const keyName = `users/${ userId }`;
    const cacheResults = await redisClient.get(keyName);
    if (cacheResults) {
        console.error('user ' + userId + ' exists in addUser, not overriding');
        return;
    } else {
        await redisClient.set(keyName, JSON.stringify(userData));
    }
}

const setUser = async ({ userId, userData }) => {
    const keyName = `users/${ userId }`;
    const cacheResults = await redisClient.get(keyName);
    if (!cacheResults) {
        console.error('user ' + userId + ' does not exist in setUser, not setting');
        return;
    } else {
        await redisClient.set(keyName, JSON.stringify(userData));
    }
}

const getUser = async ({ userId }) => {
    const keyName = `users/${ userId }`;
    const cacheResults = await redisClient.get(keyName);
    if (cacheResults) {
        return { ...JSON.parse(cacheResults), userId }; // bandaid
    } else {
        console.error('User ' + userId + ' does not exist.');
        return null;
    }
}

const addServer = async ({ serverData }) => {
    const keyName = 'servers';
    const cacheResults = await redisClient.get(keyName);
    if (cacheResults) {
        const servers = JSON.parse(cacheResults);
        await redisClient.set(keyName, JSON.stringify([...servers, serverData]));
    } else {
        await redisClient.set(keyName, JSON.stringify([serverData]));
    }
}

const getServers = async () => {
    const keyName = 'servers'; 
    const cacheResults = await redisClient.get(keyName);
    if (cacheResults) {
        return JSON.parse(cacheResults);
    } else {
        await redisClient.set(keyName, JSON.stringify([]));
        return [];
    }
}

const addTextChannel = async ({ serverId, textChannelData }) => {
    const keyName = `${ serverId }/text-channels`;
    const cacheResults = await redisClient.get(keyName);
    if (cacheResults) {
        const data = JSON.parse(cacheResults);
        await redisClient.set(keyName, JSON.stringify([...data, textChannelData]));
    } else {
        await redisClient.set(keyName, JSON.stringify([textChannelData]));
    }
}

const getTextChannels = async ({ serverId }) => {
    const keyName = `${ serverId }/text-channels`; 
    const cacheResults = await redisClient.get(keyName);
    if (cacheResults) {
        return JSON.parse(cacheResults);
    } else {
        await redisClient.set(keyName, JSON.stringify([]));
        return [];
    }
}

const addVoiceChannel = async ({ serverId, voiceChannelData }) => {
    const keyName = `${ serverId }/voice-channels`;
    const cacheResults = await redisClient.get(keyName);
    if (cacheResults) {
        const data = JSON.parse(cacheResults);
        await redisClient.set(keyName, JSON.stringify([...data, voiceChannelData]));
    } else {
        await redisClient.set(keyName, JSON.stringify([voiceChannelData]));
    }
}

const getVoiceChannels = async ({ serverId }) => {
    const keyName = `${ serverId }/voice-channels`; 
    const cacheResults = await redisClient.get(keyName);
    if (cacheResults) {
        return JSON.parse(cacheResults);
    } else {
        await redisClient.set(keyName, JSON.stringify([]));
        return [];
    }
}

const addPost = async ({ serverId, channelId, postData }) => {
    const keyName = `${ serverId }/${ channelId }/posts`; 
    const cacheResults = await redisClient.get(keyName);
    if (cacheResults) {
        const data = JSON.parse(cacheResults);
        await redisClient.set(keyName, JSON.stringify([...data, postData]));
    } else {
        await redisClient.set(keyName, JSON.stringify([postData]));
    }
}

const getPosts = async ({ serverId, channelId }) => {
    const keyName = `${ serverId }/${ channelId }/posts`; 
    const cacheResults = await redisClient.get(keyName);
    if (cacheResults) {
        return JSON.parse(cacheResults);
    } else {
        await redisClient.set(keyName, JSON.stringify([]));
        return [];
    }
}

const addServerUser = async ({ serverId, userId, update=false }) => {
    let user = await getUser({ userId });
    if (user == null) {
        console.error('DANGER: User does not exist in addServerUser, creating new user');
        await addUser({ userId, userData: { displayName: 'Unknown' }})
        user = await getUser({ userId });
    }
    
    const keyName = `${ serverId }/users`; 
    const cacheResults = await redisClient.get(keyName);
    if (cacheResults) {
        const data = JSON.parse(cacheResults);
        const matchingUserIndex = data.findIndex(item => userId === item.userId);
        if (matchingUserIndex !== -1) {
            if (update === true) {
                data[matchingUserIndex] = user;
            }
            await redisClient.set(keyName, JSON.stringify([...data]))
        } else {
            await redisClient.set(keyName, JSON.stringify([...data, user]))
        }
    } else {
        await redisClient.set(keyName, JSON.stringify([user]));
    }
}

const getServerUsers = async ({ serverId }) => {
    const keyName = `${ serverId }/users`; 
    const cacheResults = await redisClient.get(keyName);
    if (cacheResults) {
        return JSON.parse(cacheResults);
    } else {
        await redisClient.set(keyName, JSON.stringify([]));
        return [];
    }
}

module.exports = {
    addPost, getPosts, addServer, getServers, addTextChannel, getTextChannels, addVoiceChannel, getVoiceChannels, addServerUser, getServerUsers, addUser, getUser, setUser
}
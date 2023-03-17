const { redisClient } = require('./redis.utils');

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

const addServerUser = async ({ serverId, serverUserData }) => {
    const keyName = `${ serverId }/users`; 
    const cacheResults = await redisClient.get(keyName);
    if (cacheResults) {
        const data = JSON.parse(cacheResults);
        const matchingUser = data.find(item => serverUserData.name === item.name);
        if (matchingUser) {
            await redisClient.set(keyName, JSON.stringify([...data]))
        } else {
            await redisClient.set(keyName, JSON.stringify([...data, serverUserData]))
        }
    } else {
        await redisClient.set(keyName, JSON.stringify([serverUserData]));
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
    addPost, getPosts, addServer, getServers, addTextChannel, getTextChannels, addVoiceChannel, getVoiceChannels, addServerUser, getServerUsers
}
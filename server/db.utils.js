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

const addChannel = async ({ serverId, channelData }) => {
    const keyName = `${ serverId }/channels`;
    const cacheResults = await redisClient.get(keyName);
    if (cacheResults) {
        const data = JSON.parse(cacheResults);
        await redisClient.set(keyName, JSON.stringify([...data, channelData]));
    } else {
        await redisClient.set(keyName, JSON.stringify([channelData]));
    }
}

const getChannels = async ({ serverId }) => {
    const keyName = `${ serverId }/channels`; 
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

module.exports = {
    addPost, getServers, addServer, addChannel, getChannels, getPosts
}
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

const addChannel = async ({ serverName, channelData }) => {
    const keyName = `${ serverName }/channels`;
    const cacheResults = await redisClient.get(keyName);
    if (cacheResults) {
        const data = JSON.parse(cacheResults);
        await redisClient.set(keyName, JSON.stringify([...data, channelData]));
    } else {
        await redisClient.set(keyName, JSON.stringify([channelData]));
    }
}

const getChannels = async ({ serverName }) => {
    const keyName = `${ serverName }/channels`; 
    const cacheResults = await redisClient.get(keyName);
    if (cacheResults) {
        return JSON.parse(cacheResults);
    } else {
        await redisClient.set(keyName, JSON.stringify([]));
        return [];
    }
}

const addPost = async ({ serverName, channelName, postData }) => {
    const keyName = `${ serverName }/${ channelName }/posts`; 
    const cacheResults = await redisClient.get(keyName);
    if (cacheResults) {
        const data = JSON.parse(cacheResults);
        await redisClient.set(keyName, JSON.stringify([...data, postData]));
    } else {
        await redisClient.set(keyName, JSON.stringify([postData]));
    }
}

const getPosts = async ({ serverName, channelName }) => {
    const keyName = `${ serverName }/${ channelName }/posts`; 
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
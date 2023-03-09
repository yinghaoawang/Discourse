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
        const emptyServers = [];
        await redisClient.set(keyName, JSON.stringify(emptyServers));
        return emptyServers;
    }
}

const addPost = async ({ serverName, channelName, postData }) => {
    const keyName = `${ serverName }/${ channelName }/posts`; 
    const cacheResults = await redisClient.get(keyName);
    if (cacheResults) {
        const posts = JSON.parse(cacheResults);
        await redisClient.set(species, JSON.stringify([...posts, postData]));
    } else {
        await redisClient.set(species, JSON.stringify([postData]));
    }
}

module.exports = {
    addPost, getServers, addServer
}
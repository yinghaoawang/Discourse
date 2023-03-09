import { createContext, useState } from 'react';

export const ServerContext = createContext({
    servers: [],
    setServers: () => null,
    currentServer: null,
    channels: [],
    setChannels: () => null,
    currentChannel: null,
    setCurrentChannel: () => null,
    posts: [],
    setPosts: () => null,
});

export const ServerProvider = ({ children }) => {
    const [servers, setServers] = useState([]);
    const [currentServer, setCurrentServer] = useState(null);
    const [channels, setChannels] = useState([]);
    const [currentChannel, setCurrentChannel] = useState(null);
    const [posts, setPosts] = useState([]);
    const value = {
        servers, setServers,    
        currentServer, setCurrentServer,
        channels, setChannels,
        currentChannel, setCurrentChannel,
        posts, setPosts,
    };

    return <ServerContext.Provider value={ value }>{ children }</ServerContext.Provider>;
}
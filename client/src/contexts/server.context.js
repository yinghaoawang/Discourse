import { createContext, useState } from 'react';

export const ServerContext = createContext({
    servers: [],
    setServers: () => null,
    currentServer: null,
    setCurrentServerId: () => null,
    currentChannel: null,
    setCurrentChannel: () => null,
    currentPosts: [],
    setCurrentPosts: () => null,
});

export const ServerProvider = ({ children }) => {
    const [servers, setServers] = useState([]);
    const [currentServer, setCurrentServer] = useState(null);
    const [currentChannel, setCurrentChannel] = useState(null);
    const [currentPosts, setCurrentPosts] = useState([]);
    const value = { servers, setServers,
        currentServer, setCurrentServer,
        currentChannel, setCurrentChannel,
        currentPosts, setCurrentPosts,
    };

    return <ServerContext.Provider value={ value }>{ children }</ServerContext.Provider>;
}
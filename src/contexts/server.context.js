import { createContext, useState } from 'react';

export const ServerContext = createContext({
    servers: [],
    setServers: () => null,
    currentServer: null,
    setCurrentServerId: () => null,
    currentPosts: null,
    setCurrentPosts: () => null,
});

export const ServerProvider = ({ children }) => {
    const [servers, setServers] = useState([]);
    const [currentServer, setCurrentServer] = useState(null);
    const value = { servers, setServers, currentServer, setCurrentServer };

    return <ServerContext.Provider value={ value }>{ children }</ServerContext.Provider>;
}
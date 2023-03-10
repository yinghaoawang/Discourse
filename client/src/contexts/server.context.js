import { createContext, useState } from 'react';

export const ServerContext = createContext();

export const ServerProvider = ({ children }) => {
    const [servers, setServers] = useState([]);
    const [currentServer, setCurrentServer] = useState(null);
    const [channels, setChannels] = useState([]);
    const [currentChannel, setCurrentChannel] = useState(null);
    const [posts, setPosts] = useState([]);
    const [users, setUsers] = useState([]);
    const value = {
        servers, setServers,    
        currentServer, setCurrentServer,
        channels, setChannels,
        currentChannel, setCurrentChannel,
        posts, setPosts,
        users, setUsers
    };

    return <ServerContext.Provider value={ value }>{ children }</ServerContext.Provider>;
}
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
    users: [],
    setUsers: () => null,
    setCurrentServer: () => null,
    changeServer: () => null,
});

export const ServerProvider = ({ children }) => {
    const [servers, setServers] = useState([]);
    const [currentServer, setCurrentServer] = useState(null);
    const [channels, setChannels] = useState([]);
    const [currentChannel, setCurrentChannel] = useState(null);
    const [posts, setPosts] = useState([]);
    const [users, setUsers] = useState([]);
    const changeServer = (server) => {
        setCurrentChannel(null);
        setPosts([]);
        setUsers([]);
        setCurrentServer(server);
    }
    const value = {
        servers, setServers,    
        currentServer, setCurrentServer, changeServer,
        channels, setChannels,
        currentChannel, setCurrentChannel,
        posts, setPosts,
        users, setUsers
    };

    return <ServerContext.Provider value={ value }>{ children }</ServerContext.Provider>;
}
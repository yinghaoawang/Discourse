import { createContext, useState } from 'react';

export const ServerContext = createContext();

export const ServerProvider = ({ children }) => {
    const [servers, setServers] = useState([]);
    const [currentServer, setCurrentServer] = useState(null);
    const [textChannels, setTextChannels] = useState([]);
    const [voiceChannels, setVoiceChannels] = useState([]);
    const [currentTextChannel, setCurrentTextChannel] = useState(null);
    const [currentVoiceChannel, setCurrentVoiceChannel] = useState(null);
    const [posts, setPosts] = useState([]);
    const [users, setUsers] = useState([]);
    const value = {
        servers, setServers,    
        currentServer, setCurrentServer,
        textChannels, setTextChannels,
        voiceChannels, setVoiceChannels,
        currentTextChannel, setCurrentTextChannel,
        currentVoiceChannel, setCurrentVoiceChannel,
        posts, setPosts,
        users, setUsers
    };

    return <ServerContext.Provider value={ value }>{ children }</ServerContext.Provider>;
}
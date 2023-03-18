import io from 'socket.io-client';
import { createContext, useContext, useState } from 'react'
import { UserContext } from './user.context';
import { ServerContext } from './server.context';

let url = 'localhost:1250';
let options = { transports: ['websocket'] };
if (process.env.NODE_ENV === 'production') {
    url = process.env.REACT_APP_SOCKET_URL;
    options = {
        ...options,
        path: process.env.REACT_APP_SOCKET_PATH,
        secure: process.env.NODE_ENV ? true : false
    };
}

export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const { currentUser } = useContext(UserContext);
    const { currentTextChannel, setCurrentTextChannel,
        currentVoiceChannel, setCurrentVoiceChannel,
        setServers, setPosts, setVoiceChannels, setVoiceRooms,
        setTextChannels, setUsers, setCurrentServer } = useContext(ServerContext);
    
    const [socket, setSocket] = useState(null);
    const [isSocketConnecting, setIsSocketConnecting] = useState(false);

    const addSocketListeners = (newSocket) => {
        newSocket.on('servers', (data) => {
			const { servers } = data;
            console.log(data);  
			setServers(servers);
		});
    }

    const loadServers = () => {
        const currSocket = socket || io(url, options);
        console.log('loading servers');
        if (socket == null) {
            setSocket(currSocket);
        }

        currSocket.on('connect', () => {
            addSocketListeners(currSocket);
            currSocket.emit('getServers');
        })
    }

    const sendMessage = ({ message }) => {
        socket.emit('message', { message, user: currentUser, roomId: currentTextChannel.id });
    }

    const addTextChannel = ({ channelName }) => {
        const textChannelData = { name: channelName };
        socket.emit('addTextChannel', { textChannelData });
    }

    const addVoiceChannel = ({ channelName }) => {
        const voiceChannelData = { name: channelName };
        socket.emit('addVoiceChannel', { voiceChannelData });
    }

    const addServer = ({ serverName }) => {
        const serverData = { name: serverName };
        socket.emit('addServer', { serverData });
    }

    const addNspListeners = (newSocket) => {
        newSocket.on('posts', (data) => {
            console.log('posts', data);
            const { posts } = data;
            setPosts(posts);
        });

        newSocket.on('voiceRooms', (data) => {
            setVoiceRooms(data.voiceRooms);
        });
      
        newSocket.on('channels', (data) => {
            const { textChannels, voiceChannels } = data;
            console.log(textChannels, voiceChannels);
            setTextChannels(textChannels);
            setVoiceChannels(voiceChannels);

            const firstChannel = textChannels?.[0];
            if (firstChannel) {
                console.log('first channel exists');
                changeTextChannel({ textChannel: firstChannel, currentSocket: newSocket });
                console.log(newSocket);
                newSocket.emit('getPosts', { roomId: firstChannel.id })
            }
        });
      
        console.log('adding onmessage for', newSocket);
        newSocket.on('message', (data) => {
            console.log('message', data);
            const { message, user, dateCreated, type } = data;
            const newPost = {
                message, user, dateCreated, type
            };
            setPosts(posts => [...posts, newPost]);
        });
      
        newSocket.on('serverUsers', (data) => {
            console.log('users', data);
            const { users, connectedUsers } = data;
            const categorizedUsers = users.map(user => {
                if (connectedUsers.map(u => u.name).includes(user.name)) {
                        user.category = 'Online'
                    } else {
                        user.category = 'Offline'
                    }
                    return user;
                });
            setUsers(categorizedUsers);
        });
    }

    const changeSocket = (newSocket) => {
        setIsSocketConnecting(true);

        if (socket != null) {
            socket.close();
        }

        newSocket.on('connect', () => {
            console.log('connected');
            setIsSocketConnecting(false);

            addSocketListeners(newSocket);
            addNspListeners(newSocket);
            newSocket.emit('updateUser', { user: currentUser, isOnConnect: true });
            newSocket.emit('getChannels');
            newSocket.emit('getVoiceRooms');
        });

        setSocket(newSocket);
    }

    const changeNamespace = (namespace) => {
        changeSocket(io(url + namespace, options));
    }

    const updateSocketUser = () => {
        socket.emit('updateUser', { user: currentUser });
    }

    const changeServer = (data) => {
        let server = null;
        if (data != null) server = data.server;

        setCurrentTextChannel(null);
        setCurrentVoiceChannel(null);
        setPosts([]);
        setUsers([]);
        setCurrentServer(server);
        
        if (server == null) {
            changeNamespace('/');
        } else {
            changeNamespace('/' + server.name);
        }
    }

    const changeRoom = ({ roomId, currentSocket }) => {
        if (currentSocket == null) {
            currentSocket = socket;    
        }

        if (currentTextChannel != null) {
            currentSocket.emit('leaveRoom', { roomId: currentTextChannel.id });
        }
        currentSocket.emit('joinRoom', { roomId });
        console.log('CHANGE ROOM');
    }

    const changeVoiceRoom = ({ roomId, currentSocket }) => {
        if (currentSocket == null) {
            currentSocket = socket;    
        }

        if (currentVoiceChannel != null) {
            currentSocket.emit('leaveVoiceRoom', { roomId: currentVoiceChannel.id });
        }

        if (roomId != null) {
            currentSocket.emit('joinVoiceRoom', { roomId });
            console.log('CHANGE ROOM SUCCESS');
        } else {
            console.log('CHANGE ROOM FAIL');
        }
    }
    
    const changeTextChannel = ({ textChannel, currentSocket }) => {
        console.log(textChannel);
        changeRoom({ roomId: textChannel.id, currentSocket });
        setCurrentTextChannel(textChannel);
    }

    const changeVoiceChannel = ({ voiceChannel, currentSocket }) => {
        let roomId = null;
        if (voiceChannel != null) {
            roomId = voiceChannel.id;
        }
        changeVoiceRoom({ roomId, currentSocket });
        setCurrentVoiceChannel(voiceChannel);
    }

    const value = {
        socket, updateSocketUser,
        loadServers,
        addServer, addTextChannel, addVoiceChannel, sendMessage,
        changeServer, changeTextChannel, changeVoiceChannel,
        isSocketConnecting, setIsSocketConnecting
    };
    return <SocketContext.Provider value={ value }>{ children }</SocketContext.Provider>
}
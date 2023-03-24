import io from 'socket.io-client';
import { createContext, useContext, useState } from 'react'
import { UserContext } from './user.context';
import { ServerContext } from './server.context';
import { SettingsContext } from './settings.context';
import { closeAllPeerConnections, resetLocalStream, addWebRTCListeners } from '../util/webRTC.util';
import { getSocket, setSocket, url, options } from '../util/socket.util';
import { getFirstinputDevice, getFirstOutputDevice, playSound } from '../util/helpers.util';
import { PostTypes } from '../util/constants.util';


export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const { currentUser } = useContext(UserContext);
    const { voiceRooms, currentTextChannel, setCurrentTextChannel,
        currentVoiceChannel, setCurrentVoiceChannel,
        setServers, setPosts, setVoiceChannels, setVoiceRooms,
        setTextChannels, setUsers, setCurrentServer } = useContext(ServerContext);
    const { currentInputDevice, setCurrentInputDevice, currentOutputDevice, setCurrentOutputDevice } = useContext(SettingsContext);
    
    const [isSocketConnecting, setIsSocketConnecting] = useState(false);

    const addSocketListeners = (newSocket) => {
        newSocket.on('servers', (data) => {
			const { servers } = data;
			setServers(servers);
		});
    }

    const loadServers = () => {
        const currSocket = getSocket() || io(url, options);
        if (getSocket() == null) {
            setSocket(currSocket);
        }

        currSocket.on('connect', async () => {
            const inputDevice = currentInputDevice || await getFirstinputDevice();
            setCurrentInputDevice(inputDevice);

            const outputDevice = currentOutputDevice || await getFirstOutputDevice();
            setCurrentOutputDevice(outputDevice);

            addSocketListeners(currSocket);
            currSocket.emit('getServers');
        })
    }

    const sendMessage = ({ message }) => {
        getSocket().emit('message', { message, user: currentUser, roomId: currentTextChannel.id, type: PostTypes.USER_MESSAGE });
    }

    const addTextChannel = ({ channelName }) => {
        const textChannelData = { name: channelName };
        getSocket().emit('addTextChannel', { textChannelData });
    }

    const addVoiceChannel = ({ channelName }) => {
        const voiceChannelData = { name: channelName };
        getSocket().emit('addVoiceChannel', { voiceChannelData });
    }

    const addServer = ({ serverName }) => {
        const serverData = { name: serverName };
        getSocket().emit('addServer', { serverData });
    }

    const addNspListeners = (newSocket) => {
        newSocket.on('posts', (data) => {
            const { posts } = data;
            setPosts(posts);
        });

        newSocket.on('voiceRooms', (data) => {
            setVoiceRooms(data.voiceRooms);
        });
      
        newSocket.on('channels', (data) => {
            const { textChannels, voiceChannels } = data;
            setTextChannels(textChannels);
            setVoiceChannels(voiceChannels);

            const firstChannel = textChannels?.[0];
            if (firstChannel) {
                changeTextChannel({ textChannel: firstChannel, currentSocket: newSocket });
                newSocket.emit('getPosts', { roomId: firstChannel.id })
            }
        });
      
        newSocket.on('message', (data) => {
            const { message, user, dateCreated, type } = data;
            const newPost = {
                message, user, dateCreated, type
            };
            console.log(type);
            if (type === PostTypes.USER_MESSAGE) {
                playSound('message.wav');
            }
            setPosts(posts => [...posts, newPost]);
        });
      
        newSocket.on('serverUsers', (data) => {
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

    const changeSocket = (newSocket, namespace) => {
        setIsSocketConnecting(true);

        if (getSocket() != null) {
            getSocket().close();
        }

        newSocket.on('connect', () => {
            console.log('connected');
            setIsSocketConnecting(false);

            addSocketListeners(newSocket);
            addNspListeners(newSocket);
            addWebRTCListeners(newSocket, namespace);
            newSocket.emit('updateUser', { user: currentUser, isOnConnect: true });
            newSocket.emit('getChannels');
            newSocket.emit('getVoiceRooms');
        });

        setSocket(newSocket);
    }

    const changeNamespace = (namespace) => {
        closeAllPeerConnections();
        changeSocket(io(url + namespace, options), namespace);
    }

    const updateSocketUser = () => {
        getSocket().emit('updateUser', { user: currentUser });
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
            currentSocket = getSocket();    
        }

        if (currentTextChannel != null) {
            currentSocket.emit('leaveRoom', { roomId: currentTextChannel.id });
        }
        currentSocket.emit('joinRoom', { roomId });
    }

    

    const changeVoiceRoom = async ({ roomId, currentSocket }) => {
        if (currentSocket == null) {
            currentSocket = getSocket();
        }

        if (currentVoiceChannel != null) {
            currentSocket.emit('leaveVoiceRoom', { roomId: currentVoiceChannel.id });
            closeAllPeerConnections();
        }

        if (roomId != null) {
            const inputDevice = currentInputDevice || await getFirstinputDevice();
            setCurrentInputDevice(inputDevice);

            const outputDevice = currentOutputDevice || await getFirstOutputDevice();
            setCurrentOutputDevice(outputDevice);

            await resetLocalStream({ inputDevice });
            currentSocket.emit('joinVoiceRoom', { roomId });

            let voiceRoom = voiceRooms.find(v => v.roomId === roomId);
            if (voiceRoom == null) {
                console.error(voiceRooms);
                console.error('Voice room ' + roomId + ' could not be found in voiceRooms in changeVoiceRoom');
                voiceRoom = { users: [] };
            }
        }
    }

    const leaveVoiceChannel = async () => {
        await changeVoiceChannel({ voiceChannel: null });
    }
    
    const changeTextChannel = ({ textChannel, currentSocket }) => {
        changeRoom({ roomId: textChannel.id, currentSocket });
        setCurrentTextChannel(textChannel);
    }

    const changeVoiceChannel = async ({ voiceChannel, currentSocket }) => {
        let roomId = null;
        if (voiceChannel != null) {
            roomId = voiceChannel.id;
        }
        await changeVoiceRoom({ roomId, currentSocket });
        setCurrentVoiceChannel(voiceChannel);
    }

    const value = {
        updateSocketUser,
        loadServers, leaveVoiceChannel,
        addServer, addTextChannel, addVoiceChannel, sendMessage,
        changeServer, changeTextChannel, changeVoiceChannel,
        isSocketConnecting, setIsSocketConnecting
    };
    return <SocketContext.Provider value={ value }>{ children }</SocketContext.Provider>
}
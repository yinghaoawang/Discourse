import io from 'socket.io-client';
import { createContext, useContext, useState } from 'react'
import { UserContext } from './user.context';
import { ServerContext } from './server.context';
import { SettingsContext } from './settings.context';
import { closeAllPeerConnections, resetLocalStream, addWebRTCListeners } from '../util/webRTC.util';
import { getSocket, setSocket, url, options } from '../util/socket.util';
import { getFirstinputDevice, getFirstOutputDevice, playSound } from '../util/helpers.util';
import { ChannelTypes, PostTypes } from '../util/constants.util';
import { getAuth } from 'firebase/auth';


export const SocketContext = createContext();

export const SocketProvider = ({ children }) => {
    const { currentUser, setCurrentUser } = useContext(UserContext);
    const { voiceRooms, currentTextChannel, setCurrentTextChannel,
        currentVoiceChannel, setCurrentVoiceChannel, setSelectedChannelType,
        setServers, setPosts, setVoiceChannels, setVoiceRooms,
        setTextChannels, setUsers, setCurrentServer } = useContext(ServerContext);
    const { currentInputDevice, setCurrentInputDevice, currentOutputDevice, setCurrentOutputDevice } = useContext(SettingsContext);
    
    const [isSocketConnecting, setIsSocketConnecting] = useState(false);

    const addSocketListeners = (newSocket) => {
        newSocket.on('servers', (data) => {
			const { servers } = data;
			setServers(servers);
		});

        newSocket.on('updateCurrentUser', (payload) => {
            if (payload == null) {
                return;
            }
            
            const auth = getAuth();
            const userId = auth.currentUser.uid;
            const email = auth.currentUser.email;
            setCurrentUser({ email, userId, ...payload });
            getSocket().emit('getServers');
        })
    }

    const connectSocket = ({ loadServers = true, getUser = false }) => {
        const currSocket = getSocket() || io(url, options);
        setSocket(currSocket);

        currSocket.on('connect', async () => {
            const inputDevice = currentInputDevice || await getFirstinputDevice();
            setCurrentInputDevice(inputDevice);

            const outputDevice = currentOutputDevice || await getFirstOutputDevice();
            setCurrentOutputDevice(outputDevice);

            addSocketListeners(currSocket);
            if (loadServers) {
                currSocket.emit('getServers');
            }
            if (getUser) {
                const auth = getAuth();
                const userId = auth.currentUser.uid;
                getSocket().emit('getUser', { userId });
            }
        })
    }

    const sendMessage = ({ message }) => {
        getSocket().emit('message', { message, roomId: currentTextChannel.id, type: PostTypes.USER_MESSAGE });
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

        newSocket.on('userJoinedVoiceRoom', () => {
            console.log('user joined vc');
            playSound('join-room.mp3');
        });

        newSocket.on('userLeftVoiceRoom', () => {
            console.log('user left vc');
            playSound('leave-room.mp3');
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
            
            if (type === PostTypes.USER_MESSAGE) {
                playSound('message.wav');
            }
            setPosts(posts => [...posts, newPost]);
        });
      
        newSocket.on('serverUsers', (data) => {
            const { users, connectedUsers } = data;
            const categorizedUsers = users.map(user => {
                if (connectedUsers.map(u => u.userId).includes(user.userId)) {
                        const connectedUser = connectedUsers.find(u => u.userId === user.userId);
                        user = connectedUser;
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
            const auth = getAuth();
            const userId = auth.currentUser.uid;
            newSocket.emit('updateServerUser', { userId, isOnConnect: true });
            newSocket.emit('getChannels');
            newSocket.emit('getVoiceRooms');
        });

        setSocket(newSocket);
    }

    const changeNamespace = (namespace) => {
        closeAllPeerConnections();
        changeSocket(io(url + namespace, options), namespace);
    }
    const changeServer = (data) => {
        let server = null;
        if (data != null) server = data.server;

        leaveTextChannel();
        leaveVoiceChannel();
        setSelectedChannelType(null);
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
            console.log(currentVoiceChannel);
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
    
    const leaveTextChannel = async () => {
        await changeTextChannel({ textChannel: null });
    }
    
    const changeTextChannel = ({ textChannel, currentSocket }) => {
        if (textChannel != null) {
            changeRoom({ roomId: textChannel.id, currentSocket });
            setSelectedChannelType(ChannelTypes.TEXT);
        }
        setCurrentTextChannel(textChannel);
    }

    const changeVoiceChannel = async ({ voiceChannel, currentSocket }) => {
        let roomId = null;
        if (voiceChannel != null) {
            roomId = voiceChannel.id;
            setSelectedChannelType(ChannelTypes.VOICE);
        }
        await changeVoiceRoom({ roomId, currentSocket });
        setCurrentVoiceChannel(voiceChannel);
    }

    const value = {
        connectSocket, leaveVoiceChannel,
        addServer, addTextChannel, addVoiceChannel, sendMessage,
        changeServer, changeTextChannel, changeVoiceChannel,
        isSocketConnecting, setIsSocketConnecting
    };
    return <SocketContext.Provider value={ value }>{ children }</SocketContext.Provider>
}
import io from 'socket.io-client';
import { createContext, useContext, useState, useEffect } from 'react'
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
    const { currentChannel, setCurrentChannel, setServers, setPosts, setChannels, setUsers } = useContext(ServerContext);
    
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
        socket.emit('message', { message, user: currentUser, roomId: currentChannel.id });
    }

    const addChannel = ({ channelName }) => {
        const channelData = { name: channelName };
        socket.emit('addChannel', { channelData });
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
      
        newSocket.on('channels', (data) => {
            console.log('channels', data);
            const { channels } = data;
            setChannels(channels);

            const firstChannel = channels?.[0];
            if (firstChannel) {
                console.log('first channel exists');
                changeChannel({ channel: firstChannel, currentSocket: newSocket });
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
        });

        setSocket(newSocket);
    }

    const updateSocketUser = () => {
        socket.emit('updateUser', { user: currentUser });
    }
    
    const changeNamespace = (namespace) => {
        if (currentChannel != null) {
            setCurrentChannel(null);
        }

        changeSocket(io(url + namespace, options));
    }

    const changeRoom = ({ roomId, currentSocket }) => {
        if (currentSocket == null) {
            currentSocket = socket;    
        }

        if (currentChannel != null) {
            currentSocket.emit('leaveRoom', { roomId: currentChannel.id });
        }
        currentSocket.emit('joinRoom', { roomId });
        console.log('CHANGE ROOM');
    }
    
    const changeChannel = ({ channel, currentSocket }) => {
        console.log(channel);
        changeRoom({ roomId: channel.id, currentSocket });
        setCurrentChannel(channel);
    }

    const value = {
        socket, updateSocketUser,
        loadServers,
        addServer, addChannel, sendMessage,
        changeNamespace, changeChannel,
        isSocketConnecting, setIsSocketConnecting
    };
    return <SocketContext.Provider value={ value }>{ children }</SocketContext.Provider>
}
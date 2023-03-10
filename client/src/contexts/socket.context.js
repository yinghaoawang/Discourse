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

export const SocketContext = createContext({
    socket: null,
    changeNamespace: () => null,
    changeRoom: () => null,
    updateSocketUser: () => null,
    isSocketConnecting: false,
    setIsSocketConnecting: () => null
});

export const SocketProvider = ({ children }) => {
    const { currentUser } = useContext(UserContext);
    const { currentChannel, setCurrentChannel, setServers, setPosts, setChannels, setUsers } = useContext(ServerContext);
    
    const [socket, setSocket] = useState(null);
    const [isSocketConnecting, setIsSocketConnecting] = useState(false);

    const changeSocket = (newSocket) => {
        setIsSocketConnecting(true);

        if (socket != null) {
			socket.off('servers');
            socket.off('connect');
            socket.close();
        }

        newSocket.on('connect', () => {
            const onConnect = () => {
                console.log('connected');
                setIsSocketConnecting(false);

                newSocket.emit('updateUser', { user: currentUser, isOnConnect: true });
                newSocket.emit('getChannels');
            }

            newSocket.on('posts', (data) => {
                const { posts } = data;
                setPosts(posts);
            });
          
            newSocket.on('channels', (data) => {
                const { channels } = data;
                setChannels(channels);

                const firstChannel = channels?.[0];
                if (firstChannel) {
                    changeRoom(firstChannel.id);
                    setCurrentChannel(firstChannel);
                    newSocket.emit('getPosts', { roomId: firstChannel.id })
                }
            });
          
            newSocket.on('message', (data) => {
                const { message, user, dateCreated, type } = data;
                const newPost = {
                message, user, dateCreated, type
                };
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
            })

            onConnect();
        });

        newSocket.on('servers', (data) => {
			const { servers } = data;
			setServers(servers);
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

    const changeRoom = (roomId) => {
        if (currentChannel && roomId === currentChannel.id) return;
        
        if (currentChannel != null) {
            socket.emit('leaveRoom', { roomId: currentChannel.id });
        }
        socket.emit('joinRoom', { roomId });
    }

    const value = { socket, changeNamespace, changeRoom, updateSocketUser, isSocketConnecting, setIsSocketConnecting };
    return <SocketContext.Provider value={ value }>{ children }</SocketContext.Provider>
}
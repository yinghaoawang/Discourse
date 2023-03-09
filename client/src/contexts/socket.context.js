import io from 'socket.io-client';
import { createContext, useContext, useState, useEffect } from 'react'
import { UserContext } from './user.context';
import { ServerContext } from './server.context';

export const SocketContext = createContext({
    socket: null,
    changeNamespace: () => null,
    changeRoom: () => null,
    updateSocketUser: () => null
});

export const SocketProvider = ({ children }) => {
    const { currentUser } = useContext(UserContext);
    const { currentChannel, setCurrentChannel } = useContext(ServerContext);
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
    const [socket, setSocket] = useState(null);
    useEffect(() => {
        const newSocket = io(url, options);
        setSocket(newSocket);
    }, []);

    const updateSocketUser = () => {
        socket.emit('updateUser', { user: currentUser });
    }
    
    const changeNamespace = (namespace) => {
        if (currentChannel != null) {
            socket.emit('leaveRoom', { roomId: currentChannel.id });
            setCurrentChannel(null);
        }

        const fullUrl = url + namespace;
        setSocket(io(fullUrl, options));
    }

    const changeRoom = (roomId) => {
        if (currentChannel && roomId === currentChannel.id) return;
        
        if (currentChannel != null) {
            socket.emit('leaveRoom', { roomId: currentChannel.id });
        }
        updateSocketUser();
        socket.emit('joinRoom', { roomId });
    }

    const value = { socket, changeNamespace, changeRoom, updateSocketUser };
    return <SocketContext.Provider value={ value }>{ children }</SocketContext.Provider>
}
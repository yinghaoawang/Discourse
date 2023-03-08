import io from 'socket.io-client';
import { createContext, useContext, useState, useEffect } from 'react'
import { UserContext } from './user.context';
import { ServerContext } from './server.context';

export const SocketContext = createContext({
    socket: null,
    changeNamespace: () => null,
    changeRoom: () => null
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
            secure: process.env.REACT_APP_SOCKET_SECURE
        };
    }
    const [socket, setSocket] = useState(null);
    useEffect(() => {
        const newSocket = io(url, options);
        setSocket(newSocket);
    }, [])
    
    const changeNamespace = (namespace) => {
        if (currentChannel != null) {
            socket.emit('leaveRoom', { roomName: currentChannel.name, user: currentUser });
            setCurrentChannel(null);
        }

        const fullUrl = url + namespace;
        console.log(fullUrl);

        setSocket(io(fullUrl, options));
    }

    const changeRoom = (roomName) => {
        if (currentChannel != null) {
            socket.emit('leaveRoom', { roomName: currentChannel.name, user: currentUser });
        }
        socket.emit('joinRoom', { roomName, user: currentUser });
    }

    const value = { socket, changeNamespace, changeRoom };
    return <SocketContext.Provider value={ value }>{ children }</SocketContext.Provider>
}
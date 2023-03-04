import io from 'socket.io-client';
import { createContext } from 'react'

export const SocketContext = createContext({
    socket: null,
});

export const SocketProvider = ({ children }) => {
    let url = 'localhost:1250';
    let options = {};
    if (process.env.NODE_ENV === 'production') {
        url = process.env.REACT_APP_SOCKET_URL;
        options = {
            path: process.env.REACT_APP_SOCKET_PATH,
            secure: process.env.REACT_APP_SOCKET_SECURE
        };
    }
    const socket = io(url, options);
    const value = { socket };
    return <SocketContext.Provider value={ value }>{ children }</SocketContext.Provider>
}
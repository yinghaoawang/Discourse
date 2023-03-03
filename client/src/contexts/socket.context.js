import io from 'socket.io-client';
import { createContext } from 'react'

export const SocketContext = createContext({
    socket: null,
});

export const SocketProvider = ({ children }) => {
    const socket = io('localhost:1250');
    const value = { socket };
    return <SocketContext.Provider value={ value }>{ children }</SocketContext.Provider>
}
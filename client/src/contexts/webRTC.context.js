import { createContext, useState } from 'react';

export const WebRTCContext = createContext();

export const WebRTCProvider = ({ children }) => {
    const [localStream, setLocalStream] = useState(null);
    const value = { localStream, setLocalStream };

    return <WebRTCContext.Provider value={ value }>{ children }</WebRTCContext.Provider>;
}
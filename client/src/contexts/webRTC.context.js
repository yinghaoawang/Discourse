import { createContext, useState } from 'react';
import Peer from 'simple-peer';

const getConfig = () => {
    return {
        iceServers: [{
            urls: 'stun:stun.l.google.com:19302'
        }]
    }
}

export const WebRTCContext = createContext();

const getLocalStream = async () => {
    const stream = navigator.mediaDevices.getUserMedia({
        video: false,
        audio: true
    });

    return stream;
}

export const WebRTCProvider = ({ children }) => {
    const [peers, setPeers] = useState(null);
    const [stream, setStream] = useState(null);
    const prepareNewPeerConnection = ({ socketId, initiator }) => {
        const config = getConfig();
        peers[socketId] = new Peer({
            initiator,
            config,
        });
        // TODO
    };

    const value = { peers, setPeers, prepareNewPeerConnection, getLocalStream, stream, setStream };

    return <WebRTCContext.Provider value={ value }>{ children }</WebRTCContext.Provider>;
}
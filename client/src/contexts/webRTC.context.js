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

const getLocalStream = () => {
    const stream = navigator.mediaDevices.getUserMedia({
        video: false,
        audio: true
    });

    return stream;
}

export const WebRTCProvider = ({ children }) => {
    const [peers, setPeers] = useState(null);
    const [localStream, setLocalStream] = useState(null);
    const prepareNewPeerConnection = ({ socketId, isInitiator }) => {
        const config = getConfig();
        const peer = new Peer({
            initiator: isInitiator,
            config,
            stream: localStream
        });

        peers[socketId] = peer;
        peer.on('stream', (stream) => {

        })


    };

    const value = { peers, setPeers, prepareNewPeerConnection, getLocalStream, localStream, setLocalStream };

    return <WebRTCContext.Provider value={ value }>{ children }</WebRTCContext.Provider>;
}
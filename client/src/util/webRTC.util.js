import Peer from 'simple-peer';

const peers = [];
const streams = {};

const getConfig = () => {
    return {
        iceServers: [{
            urls: 'stun:stun.l.google.com:19302'
        }]
    }
}


const getLocalStream = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
        video: false,
        audio: true
    });

    return stream;
}

const prepareNewPeerConnection = ({ socketId, isInitiator, localStream }) => {
    const config = getConfig();
    const peer = new Peer({
        initiator: isInitiator,
        config,
        stream: localStream
    });

    peers[socketId] = peer;
    peer.on('stream', (stream) => {
        console.log('new stream came');
        // add stream
        streams = { ...streams, stream };
    });

    peer.on('signal', (data) => {
        const signalData = {
            signal: data,
            socketId,
        }
    });


};



export { streams, peers, getLocalStream, prepareNewPeerConnection };
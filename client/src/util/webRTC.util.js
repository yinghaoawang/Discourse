import Peer from 'simple-peer';
import { getSocket } from './socket.util';

let peers = {};
let streams = [];
let localStream = null;

const getConfig = () => {
    return {
        iceServers: [{
            urls: 'stun:stun.l.google.com:19302'
        }]
    }
}

const getLocalStream = async () => {
    if (localStream != null) return localStream;

    const stream = await navigator.mediaDevices.getUserMedia({
        video: false,
        audio: true
    });

    localStream = stream;
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

    peer.on('signal', (data) => {

        console.log('signal', data);
        const signalData = {    
            signal: data,
            connSocketId: socketId,
        }

        const socket = getSocket();
        socket.emit('webRTCConnSignal', { signalData });
    });

    peer.on('stream', (stream) => {
        console.log('new stream came');
        // add stream
        const audioObject = document.createElement('audio');
        audioObject.autoplay = true;
        // audioObject.controls = true;
        // audioObject.style.width = '150px';
        audioObject.srcObject = stream;

        const audioContainer = document.getElementById('audio-container');
        audioContainer.appendChild(audioObject);

        streams =  [...streams, stream];
    });

    console.log('peers', peers);
};

const addWebRTCListeners = (socket, namespace) => {
    socket.on('webRTCConnSignal', ({ signalData }) => {
        console.log('signal received', signalData);
        const { connSocketId, signal } = signalData;
        console.log(connSocketId, signal);
        peers[connSocketId].signal(signal);
    });

    socket.on('webRTCConnPrepare', async ({ connSocketId }) => {
        console.log('PREPARE', connSocketId);
        prepareNewPeerConnection({ socketId: connSocketId, isInitator: false, localStream: await getLocalStream() });
        socket.emit('webRTCConnInit', { connSocketId: connSocketId });
    });

    socket.on('webRTCConnInit', async ({ connSocketId }) => {
        prepareNewPeerConnection({ socketId: connSocketId, isInitiator: true, localStream: await getLocalStream() });
    });
}

export { streams, peers, getLocalStream, prepareNewPeerConnection, addWebRTCListeners };
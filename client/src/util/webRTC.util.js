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

const getAudioObjectIdFromSocketId = (socketId) => {
    return socketId + '-audio';
}

const prepareNewPeerConnection = ({ connSocketId, isInitiator, localStream }) => {
    const config = getConfig(); 
    const peer = new Peer({
        initiator: isInitiator,
        config,
        stream: localStream
    });

    peers[connSocketId] = peer;

    peer.on('signal', (data) => {

        console.log('signal', data);
        const signalData = {    
            signal: data,
            connSocketId,
        }

        const socket = getSocket();
        socket.emit('webRTCConnSignal', { signalData });
    });

    peer.on('stream', (stream) => {
        console.log('new stream came');

        const audioId = getAudioObjectIdFromSocketId(connSocketId);

        const existingAudioObject = document.getElementById(audioId);
        if (existingAudioObject) return;

        const audioObject = document.createElement('audio');
        audioObject.id = audioId;
        audioObject.autoplay = true;
        // audioObject.controls = true;
        audioObject.srcObject = stream;

        const audioContainer = document.getElementById('audio-container');
        audioContainer.appendChild(audioObject);

        streams =  [...streams, stream];
    });
    console.log('peers', peers);
};

const closePeerConnection = ({ connSocketId }) => {
    console.log('close connection ', connSocketId);
    const audioObject = document.getElementById(getAudioObjectIdFromSocketId(connSocketId));
    if (audioObject == null) throw new Error('Audio object could not be found in closePeerConnection');
    for (const track of audioObject.srcObject.getTracks()) {
        track.stop();
    }
    audioObject.remove();
    if (peers[connSocketId]) {
        peers[connSocketId].destroy();
    }
    delete peers[connSocketId];
}

const closeAllPeerConnections = () => {
    for (const key in peers) {
        closePeerConnection({ connSocketId: key });
    }
}

const addWebRTCListeners = (socket, namespace) => {
    socket.on('webRTCConnSignal', ({ signalData }) => {
        console.log('signal received', signalData);
        const { connSocketId, signal } = signalData;
        console.log(connSocketId, signal);
        peers[connSocketId].signal(signal);
    });

    socket.on('webRTCConnPrepare', async ({ connSocketId }) => {
        console.log('PREPARE', connSocketId);
        prepareNewPeerConnection({ connSocketId, isInitator: false, localStream: await getLocalStream() });
        socket.emit('webRTCConnInit', { connSocketId: connSocketId });
    });

    socket.on('webRTCConnInit', async ({ connSocketId }) => {
        prepareNewPeerConnection({ connSocketId, isInitiator: true, localStream: await getLocalStream() });
    });

    socket.on('webRTCConnClose', async ({ connSocketId }) => {
        closePeerConnection({ connSocketId });
    });
}

export { closePeerConnection, closeAllPeerConnections, getLocalStream, prepareNewPeerConnection, addWebRTCListeners };
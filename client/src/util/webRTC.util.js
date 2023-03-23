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

const resetLocalStream = async ({ inputDevice }) => {
    const inputDeviceId = inputDevice?.deviceId;
    const deviceId = inputDeviceId ? { exact: inputDeviceId } : null;
    const stream = await navigator.mediaDevices.getUserMedia({
        video: false,
        audio: { deviceId }
    });

    localStream = stream;
    return localStream;
}

const getLocalStream = async () => {
    if (localStream != null) return localStream;

    return await resetLocalStream({});
}

let wrapper = {};
const getOutputDevice = () => {
    return wrapper.outputDevice;
}
const setOutputDevice = (outputDevice) => {
    wrapper.outputDevice = outputDevice;
}

const getAudioObjectIdFromSocketId = (socketId) => {
    return socketId + '-audio';
}

const prepareNewPeerConnection = async ({ connSocketId, isInitiator }) => {
    console.log('preparing new connection: ', connSocketId, 'isInitiator', isInitiator)
    const localStream = await getLocalStream();
    const config = getConfig(); 
    const peer = new Peer({
        initiator: isInitiator,
        config,
        stream: localStream
    });

    peers[connSocketId] = peer;

    peer.on('signal', (data) => {
        const socket = getSocket();
        socket.emit('wrtcSignal', {    
            signal: data,
            connSocketId,
        });
    });

    peer.on('stream', async (stream) => {
        console.log('new stream came');

        const audioId = getAudioObjectIdFromSocketId(connSocketId);

        const existingAudioObject = document.getElementById(audioId);
        if (existingAudioObject) {
            console.log('AUDIO OBJECT EXISTS, NOT ADDING', audioId);
            return;
        }

        const audioObject = document.createElement('audio');
        audioObject.id = audioId;
        audioObject.autoplay = true;
        // audioObject.controls = true;
        const outputDevice = getOutputDevice();
        if (outputDevice != null) {
            console.log(outputDevice);
            await audioObject.setSinkId(outputDevice.deviceId);
        }
        
        audioObject.srcObject = stream;

        const audioContainer = document.getElementById('audio-container');
        audioContainer.appendChild(audioObject);

        streams =  [...streams, stream];
    });
    console.log('peers', peers);
};

const closePeerConnection = ({ connSocketId }) => {
    console.log('close connection ', connSocketId);
    try {
        const audioObjectId = getAudioObjectIdFromSocketId(connSocketId);
        if (connSocketId !== getSocket()?.id) {
            const audioObject = document.getElementById(audioObjectId);
            if (audioObject == null) throw new Error('Audio object could not be found in closePeerConnection');
            
            for (const track of audioObject.srcObject.getTracks()) {
                track.stop();
            }
            audioObject.remove();
        }
    } catch (error) {
        console.error(error);
    }
   
    if (peers[connSocketId] != null) {
        peers[connSocketId].destroy();
    }

    delete peers[connSocketId];
}

const closeAllPeerConnections = () => {
    for (const key in peers) {
        closePeerConnection({ connSocketId: key });
    }
    getLocalStream().then((stream) => {
        stream.getTracks().forEach(function(track) {
            track.stop();
        });
    });
}

const addWebRTCListeners = (socket, namespace) => {
    socket.on('wrtcPrepare', async ({ connSocketId }) => {
        await prepareNewPeerConnection({ connSocketId, isInitator: false });
        socket.emit('wrtcInit', { connSocketId });
    });

    socket.on('wrtcSignal', ({ connSocketId, signal }) => {
        console.log('signal', connSocketId, signal);
        peers[connSocketId].signal(signal);
    });

    socket.on('wrtcInit', async ({ connSocketId }) => {
        await prepareNewPeerConnection({ connSocketId, isInitiator: true });
    });

    socket.on('wrtcClose', async ({ connSocketId }) => {
        closePeerConnection({ connSocketId });
    });
}

export { closePeerConnection, closeAllPeerConnections, resetLocalStream, getLocalStream, getOutputDevice, setOutputDevice, prepareNewPeerConnection, addWebRTCListeners };
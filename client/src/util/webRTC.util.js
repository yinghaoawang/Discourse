import Peer from 'simple-peer';
import { getSocket } from './socket.util';

let peers = {};
let streams = {};
let localStream = null;

const checkStream = (stream) => {
    let hasVideo = false;
    let hasAudio = false;
 
    if (stream?.getAudioTracks().length) hasAudio = true;
 
    if (stream?.getVideoTracks().length) hasVideo = true;

    return { hasVideo, hasAudio }; 
 }

const getConfig = () => {
    return {
        iceServers: [{
            urls: 'stun:stun.l.google.com:19302'
        }]
    }
}

const stopLocalStream = () => {
    if (localStream == null) {
        console.error('localStream does not exist in stopLocalStream');
        return;
    }
    const stream = localStream;
    stream.getTracks().forEach(function(track) {
        track.stop();
    });
}

const captureScreen = async () => {
    let mediaStream = null;
    try {
        mediaStream = await navigator.mediaDevices.getDisplayMedia({
            video: {
                cursor: 'always',
                displaySurface: 'monitor'
            },
            audio: true
        });
    } catch (err) {
        console.error(err);
    }
    console.log(mediaStream);
    return mediaStream;
}

const resetLocalStream = async ({ inputDevice, isRecordVideo, isScreenSharing }) => {
    const inputDeviceId = inputDevice?.deviceId;
    const deviceId = inputDeviceId ? { exact: inputDeviceId } : null;
    let video = false;
    if (isRecordVideo) {
        video = { width: '640px', height: '480px' };
    }
    const deviceStream = await navigator.mediaDevices.getUserMedia({
        video,
        audio: { deviceId }
    });


    if (isScreenSharing) {
        const audioTrack = deviceStream.getAudioTracks()[0];
        const screenStream = await captureScreen();
        if (screenStream == null) return;
        
        screenStream.addTrack(audioTrack);
        localStream = screenStream;
    } else {
        localStream = deviceStream;
    }
    return localStream;
}

const getLocalStream = async () => {
    if (localStream != null) return localStream;

    console.error('local stream not found, creating blank one');
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
        console.log('new stream received');

        const { hasVideo, hasAudio } = checkStream(stream);
        console.log(hasVideo, hasAudio, stream, peer);

        const audioId = getAudioObjectIdFromSocketId(connSocketId);

        const existingAudioObject = document.getElementById(audioId);
        if (existingAudioObject) {
            console.error('AUDIO OBJECT EXISTS, NOT ADDING', audioId);
            return;
        }

        const audioObject = document.createElement('audio');
        audioObject.id = audioId;
        audioObject.autoplay = true;
        // audioObject.controls = true;
        const outputDevice = getOutputDevice();
        if (outputDevice != null && audioObject?.setSinkId != null) {
            await audioObject.setSinkId(outputDevice.deviceId);
        }
        
        audioObject.srcObject = stream;

        const audioContainer = document.getElementById('audio-container');
        audioContainer.appendChild(audioObject);

        streams[connSocketId] = stream;
        getSocket().emit('getVoiceRooms');
    });
    console.log('peers', peers);
    console.log('streams', streams);
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
   
    if (streams[connSocketId != null]) {
        streams[connSocketId].destroy();
    }
    if (peers[connSocketId] != null) {
        peers[connSocketId].destroy();
    }

    delete peers[connSocketId];
    delete streams[connSocketId];

    console.log('peers', peers);
    console.log('streams', streams);
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
        peers[connSocketId].signal(signal);
    });

    socket.on('wrtcInit', async ({ connSocketId }) => {
        await prepareNewPeerConnection({ connSocketId, isInitiator: true });
    });

    socket.on('wrtcClose', async ({ connSocketId }) => {
        closePeerConnection({ connSocketId });
    });
}

export { closePeerConnection, closeAllPeerConnections, resetLocalStream, getLocalStream,
    getOutputDevice, setOutputDevice, prepareNewPeerConnection, addWebRTCListeners,
    checkStream, streams, stopLocalStream };
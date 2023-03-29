import { getOutputDevice } from './webRTC.util.js';

const generateRandomName = (nameLength = 10) => {
    let res = '';
    for(let i = 0; i < nameLength; i++){
        const random = Math.floor(Math.random() * 26);
        res += String.fromCharCode('a'.charCodeAt(0) + random);
    };
    return res;
};

const getFirstinputDevice = async () => {
    const { inputDevices } = await getDevices();
    const inputDevice = inputDevices?.[0];
    return inputDevice;
}

const getFirstOutputDevice = async () => {
    const { outputDevices } = await getDevices();
    const outputDevice = outputDevices?.[0];
    return outputDevice;
}

const getDevices = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices();
    const inputDevices = devices.filter(({ kind }) => kind === 'audioinput');
    const outputDevices = devices.filter(({ kind }) => kind === 'audiooutput');
    return { devices, inputDevices, outputDevices };
}

const playSound = async (filename) => {
    const path = process.env.REACT_APP_BASENAME + '/' + filename;
    const audioObject = document.createElement('audio');
    audioObject.autoplay = true;
    // audioObject.controls = true;
    const outputDevice = getOutputDevice();
    if (outputDevice != null && audioObject?.setSinkId != null) {
        await audioObject.setSinkId(outputDevice.deviceId);
    }
    
    audioObject.src = path;

    audioObject.addEventListener('ended', () => {
        audioObject.remove();
    })

    const audioContainer = document.getElementById('audio-container');
    audioContainer.appendChild(audioObject);
}

export { generateRandomName, getDevices, getFirstinputDevice, getFirstOutputDevice, playSound };
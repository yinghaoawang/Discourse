import Modal from 'react-modal';
import { VscChromeClose as CloseIcon } from 'react-icons/vsc'
import '../../../../shared/modal/modal-layouts.scss';
import './settings-modal.styles.scss';
import { getDevices } from '../../../../../util/helpers.util';
import { SettingsContext } from '../../../../../contexts/settings.context';
import { SocketContext } from '../../../../../contexts/socket.context';
import { ServerContext } from '../../../../../contexts/server.context';
import { useContext, useEffect } from 'react';
Modal.setAppElement('#root');

const DeviceTypes = {
    INPUT: 'INPUT', 
    OUTPUT: 'OUTPUT'
}

const removeSelectOptions = (selectNode) => {
    while (selectNode.firstChild) {
        selectNode.removeChild(selectNode.lastChild);
    }
}

const SettingsModal = ({ closeModal, afterOpenModal, isModalOpen }) => {
    const { currentInputDevice, setCurrentInputDevice, currentOutputDevice, setCurrentOutputDevice } = useContext(SettingsContext);
    const { currentVoiceChannel } = useContext(ServerContext);
    const { changeVoiceChannel, } = useContext(SocketContext);

    const afterOpenModalWrapper = async () => {
        if (afterOpenModal != null) afterOpenModal();
        const inputDeviceSelect = document.getElementById('inputDeviceSelect');
        const outputDeviceSelect = document.getElementById('outputDeviceSelect');

        const { inputDevices, outputDevices } = await getDevices();

        const inputOptions = inputDevices.map(audioDevice => {
            return {
                value: audioDevice.deviceId,
                text: audioDevice.label
            };
        });

        const outputOptions = outputDevices.map(audioDevice => {
            return {
                value: audioDevice.deviceId,
                text: audioDevice.label
            };
        })

        createOptionsForSelect(inputDeviceSelect, inputOptions, { selectedValue: currentInputDevice?.deviceId });
        createOptionsForSelect(outputDeviceSelect, outputOptions, { selectedValue: currentOutputDevice?.deviceId });
    }


    const createOptionsForSelect = (selectNode, options, { removePreviousOptions = true, selectedValue } = {}) => {
        if (removePreviousOptions) {
            removeSelectOptions(selectNode);
        }

        for (const option of options) {
            const optionNode = document.createElement('option');
            optionNode.value = option.value;
            optionNode.text = option.text;
            selectNode.appendChild(optionNode);
        }
        
        selectNode.value = selectedValue;
    }

    useEffect(() => {
        // rejoin current room on input/output device change
        if (currentVoiceChannel == null) return;
        
        changeVoiceChannel({ voiceChannel: currentVoiceChannel });
    }, [currentInputDevice, currentOutputDevice])

    const changeInputDevice = async (value, type = DeviceTypes.INPUT) => {
        switch (type) {
            case DeviceTypes.INPUT:
            const { inputDevices } = await getDevices();
                const matchingInputDevice = inputDevices.find(d => d.deviceId === value);
                setCurrentInputDevice(matchingInputDevice);
                break;
            case DeviceTypes.OUTPUT:
                const { outputDevices } = await getDevices();
                const matchingOutputDevice = outputDevices.find(d => d.deviceId === value);
                setCurrentOutputDevice(matchingOutputDevice);
                break;
            default:
                throw new Error('Unhandled deviceType in changeInputDeviceHandler');
        }
    }

    return (
        <Modal
            isOpen={ isModalOpen }
            onAfterOpen={ afterOpenModalWrapper }
            onRequestClose={ closeModal }
            className='modal-content fit settings-modal-content modal-layout-1'
            overlayClassName='modal-overlay'
            closeTimeoutMS={ 200 }
            contentLabel="Settings"
        >
            <div className='content'>
                <div className='header'>
                    <div className='title'>
                        Settings
                    </div>
                    <button className='close-button' onClick={ closeModal }><CloseIcon size={ '25px' } /></button>
                </div>
                <div className='audio-settings-container'>
                    <div className='header'>Audio Settings</div>
                    <div className='content'>
                        <div className='input-device form-item'>
                            <label>Input Device</label>
                            <select onChange={ (e) => { changeInputDevice(e?.target?.value, DeviceTypes.INPUT) } } value={ currentInputDevice?.deviceId } id='inputDeviceSelect' />
                        </div>
                        <div className='output-device form-item'>
                            <label>Output Device</label>
                            <select onChange={ (e) => { changeInputDevice(e?.target?.value, DeviceTypes.OUTPUT) } } value={ currentOutputDevice?.deviceId } id='outputDeviceSelect' />
                        </div>
                    </div>
                    
                </div>
                
            </div>
            <div className='footer'>
                <div className='action-buttons-container'>
                    <button onClick={ closeModal }>Close</button>
                </div>
            </div>
            
        </Modal>
    );
    
}

export default SettingsModal;
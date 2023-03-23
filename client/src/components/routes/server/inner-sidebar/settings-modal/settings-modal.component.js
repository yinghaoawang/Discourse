import Modal from 'react-modal';
import { VscChromeClose as CloseIcon } from 'react-icons/vsc'
import '../../../../shared/modal/modal-layouts.scss';
import './settings-modal.styles.scss';
Modal.setAppElement('#root');

const removeSelectOptions = (selectNode) => {
    while (selectNode.firstChild) {
        selectNode.removeChild(selectNode.lastChild);
    }
}

const createOptionsForSelect = (selectNode, options, removePreviousOptions = true) => {
    if (removePreviousOptions) {
        removeSelectOptions(selectNode);
    }

    for (const option of options) {
        const optionNode = document.createElement('option');
        optionNode.value = option.value;
        optionNode.text = option.text;
        selectNode.appendChild(optionNode);
    }
}

const SettingsModal = ({ closeModal, afterOpenModal, isModalOpen }) => {
    const afterOpenModalWrapper = async () => {
        if (afterOpenModal != null) afterOpenModal();
        const inputDeviceSelect = document.getElementById('inputDeviceSelect');
        const outputDeviceSelect = document.getElementById('outputDeviceSelect');

        const devices = await navigator.mediaDevices.enumerateDevices();
        const inputDevices = devices.filter(({ kind }) => kind === 'audioinput');
        const outputDevices = devices.filter(({ kind }) => kind === 'audiooutput');

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

        createOptionsForSelect(inputDeviceSelect, inputOptions);
        createOptionsForSelect(outputDeviceSelect, outputOptions);
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
                            <select id='inputDeviceSelect' />
                        </div>
                        <div className='output-device form-item'>
                            <label>Output Device</label>
                            <select id='outputDeviceSelect' />
                        </div>
                    </div>
                    
                </div>
                
            </div>
            <div className='footer'>
                <div className='action-buttons-container'>
                    <button onClick={ closeModal }>Cancel</button>
                    <button type='submit' onClick={ () => null } className='submit-button'>Save Changes</button>
                </div>
            </div>
            
        </Modal>
    );
    
}

export default SettingsModal;
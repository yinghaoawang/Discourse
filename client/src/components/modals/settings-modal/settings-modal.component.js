import Modal from 'react-modal';
import { VscChromeClose as CloseIcon } from 'react-icons/vsc'
import '../modal-layouts.scss';
import './settings-modal.styles.scss';
import DeviceSettings from './device-settings/device-settings.component';
import AccountSettings from './account-settings/account-settings.component';
import UserProfileSettings from './user-profile-settings/user-profile-settings.component';
import { useContext, useEffect } from 'react';
import { SocketContext } from '../../../contexts/socket.context';
import { SettingsContext } from '../../../contexts/settings.context';
import { ServerContext } from '../../../contexts/server.context';
Modal.setAppElement('#root');

const SettingsModal = ({ closeModal, afterOpenModal, isModalOpen }) => {
    const afterOpenModalWrapper = async () => {
        if (afterOpenModal != null) afterOpenModal();
    }

    const { currentVoiceChannel } = useContext(ServerContext);
    const { changeVoiceChannel } = useContext(SocketContext);
    const { currentInputDevice, currentOutputDevice } = useContext(SettingsContext);

    useEffect(() => {
        // rejoin current room on input/output device change
        if (currentVoiceChannel == null) return;

        changeVoiceChannel({ voiceChannel: currentVoiceChannel });
    }, [currentInputDevice, currentOutputDevice]);

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
                <span className='header'>
                    <div className='title'>
                        Settings
                    </div>
                    <button className='close-button' onClick={ closeModal }><CloseIcon size={ '25px' } /></button>
                </span>
                <DeviceSettings />
                <UserProfileSettings />
                <AccountSettings />
                
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
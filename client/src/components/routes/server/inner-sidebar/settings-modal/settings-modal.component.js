import Modal from 'react-modal';
import { VscChromeClose as CloseIcon } from 'react-icons/vsc'
import { SocketContext } from '../../../../../contexts/socket.context';
import { useContext } from 'react';
import { getAuth, deleteUser, signOut } from 'firebase/auth';
import '../../../../shared/modal/modal-layouts.scss';
import './settings-modal.styles.scss';
import DeviceSettings from './device-settings.component.js/device-settings.component';
Modal.setAppElement('#root');

const SettingsModal = ({ closeModal, afterOpenModal, isModalOpen }) => {
    const { changeServer } = useContext(SocketContext);

    const signOutHandler = async () => {
        const auth = getAuth();
        
        try {
            await signOut(auth);
            changeServer(null);
        } catch (error) {
            const errorMessage = error.message;
            alert(errorMessage);
        }
    }

    const closeAccountHandler = async () => {
        const confirmRes = window.confirm('Your account will be deleted permanently. Proceed?');
        if (confirmRes === false) return;

        const auth = getAuth();
        const user = auth.currentUser;

        try {
            await deleteUser(user);
            changeServer(null);
        } catch(error) {
            const errorCode = error.code;
            if (errorCode === 'auth/requires-recent-login') {
                alert('Reauthenticate to close account.');
                signOutHandler();
            } else {
                const errorMessage = error.message;
                alert(errorMessage);
            }
        }
    }

    const afterOpenModalWrapper = async () => {
        if (afterOpenModal != null) afterOpenModal();
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
                <DeviceSettings isModalOpen={ isModalOpen } />
                
                <div className='account-settings-container'>
                    <div className='header'>Account Settings</div>
                    <div className='form-item'>
                        <div></div>
                        <div className='danger-buttons'>
                            <button className='close-account-button' onClick={ closeAccountHandler }>Close Account</button>
                            <button className='logout-button' onClick={ signOutHandler }>Sign out</button>
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
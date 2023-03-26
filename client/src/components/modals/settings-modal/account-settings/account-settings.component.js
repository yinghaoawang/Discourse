import { deleteUser, getAuth, signOut } from 'firebase/auth';
import { useContext } from 'react';
import { SocketContext } from '../../../../contexts/socket.context';
import './account-settings.styles.scss';

const AccountSettings = () => {
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

    return (
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
    );
}

export default AccountSettings;

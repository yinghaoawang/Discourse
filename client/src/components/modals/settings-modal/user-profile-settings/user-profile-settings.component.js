import { getAuth } from 'firebase/auth';
import { useContext, useEffect, useState } from 'react';
import { ServerContext } from '../../../../contexts/server.context';
import { UserContext } from '../../../../contexts/user.context';
import { getSocket } from '../../../../util/socket.util';
import './user-profile-settings.styles.scss';

const UserProfileSettings = () => {
    const [displayName, setDisplayName] = useState('');
    const [statusMessage, setStatusMessage] = useState('');
    const { currentUser } = useContext(UserContext);
    const { currentVoiceChannel, currentServer } = useContext(ServerContext);
    const email = currentUser.email;

    useEffect(() => {
        setDisplayName(currentUser.displayName || '');
        setStatusMessage(currentUser.statusMessage || '')
    }, [currentUser]);

    const updateUserProfileHandler = () => {
        const auth = getAuth();
        const userId = auth.currentUser.uid;
        const userData = { userId, displayName, statusMessage };
        getSocket().emit('updateUser', userData);
        getSocket().emit('updateServerUser', { userId, userData });
        if (currentVoiceChannel != null) {
            getSocket().emit('updateVoiceRoomUser', { roomId: currentVoiceChannel.id, serverId: currentServer.id, userData });
        }
    }

    return (
        <div className='user-profile-settings-container'>
            <div className='header'>User Profile</div>
            <div className='form-item'>
                <div>Email</div>
                <input value={ email } disabled />
            </div>
            <div className='form-item'>
                <div>Display Name</div>
                <input value={ displayName } onChange={ e => setDisplayName(e.target.value) } />
            </div>
            <div className='form-item'>
                <div>Status Message</div>
                <input value={ statusMessage } onChange={ e => setStatusMessage(e.target.value) } />
            </div>
            <div className='form-item'>
                <div></div>
                <button className='submit-button' onClick={ updateUserProfileHandler }>Update</button>
            </div>
        </div>
    );
}

export default UserProfileSettings;

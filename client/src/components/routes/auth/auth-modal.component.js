import Modal from 'react-modal';
import { ReactComponent as GoogleLogo } from '../../../assets/google-logo.svg';
import { useContext, useEffect, useState } from 'react';
import '../../shared/modal/modal-layouts.scss';
import './auth-modal.styles.scss';
import { UserContext } from '../../../contexts/user.context';
import { SocketContext } from '../../../contexts/socket.context';
Modal.setAppElement('#root');

const AuthModal = ({ closeModal, afterOpenModal, isModalOpen }) => {
    const { setCurrentUser } = useContext(UserContext);
	const { loadServers } = useContext(SocketContext);
    const afterOpenModalWrapper = async () => {
        if (afterOpenModal != null) afterOpenModal();
    }

    const [isLogin, setIsLogin] = useState(true);;

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');

    const toggleIsLogin = () => {
        setIsLogin(!isLogin);
    }

    const login = () => {
        setCurrentUser({ name: 'Test' + Math.floor(Math.random() * 1000) });
        loadServers();
    }

    const signUp = () => {
        setCurrentUser({ name: 'Test' + Math.floor(Math.random() * 1000) });
        loadServers();
    }

    return (
        <Modal
            isOpen={ isModalOpen }
            onAfterOpen={ afterOpenModalWrapper }
            // onRequestClose={ closeModal }
            className='modal-content fit auth-modal-content modal-layout-1'
            overlayClassName='modal-overlay'
            closeTimeoutMS={ 200 }
            contentLabel="Auth"
        >
            <div className='content'>
                <div className='left'>
                    <div className='header'>
                        <div className='title'>
                            { !isLogin ? 'Sign up' : 'Login' }
                        </div>
                    </div>
                    <div className='auth-container'>
                        <div className='form-item'>
                            <label htmlFor='auth-email'>Email</label>
                            <input id='auth-email' value={ email } onChange={ e => setEmail(e.target.value) } type='email' />
                        </div>
                        <div className='form-item'>
                            <label htmlFor='auth-password'>Password</label>
                            <input id='auth-password' value={ password } onChange={ e => setPassword(e.target.value) }  type='password' />
                        </div>
                        {
                            !isLogin && (
                            <>
                                {/* <div className='form-item'>
                                    <label htmlFor='auth-confirm-password'>Confirm Password</label>
                                    <input id='auth-confirm-password' type='password' />
                                </div> */}
                                <div className='form-item'>
                                    <label htmlFor='auth-display-name'>Display Name</label>
                                    <input id='auth-display-name' value={ displayName } onChange={ e => setDisplayName(e.target.value) } />
                                </div>
                            </>
                            )
                        }
                    </div>
                </div>
                <div className='vl' />
                <div className='right'>
                    <div className='api-buttons'>
                        <button className='api-button google'><GoogleLogo  />Continue with Google</button>
                    </div>
                </div>
                
            </div>
            <div className='footer'>
                <div className='action-buttons-container'>
                    <button onClick={ toggleIsLogin } className='button'>{ isLogin ? 'Sign up' : 'Login' }</button>
                    
                    { isLogin ? <button onClick={ login } className='submit-button'>Login</button>
                              : <button onClick={ signUp } className='submit-button'>Sign up</button>
                    }
                </div>
            </div>
            
        </Modal>
    );
    
}

export default AuthModal;
import Modal from 'react-modal';
import { useContext, useState, useEffect } from 'react';
import { VscChromeClose as CloseIcon } from 'react-icons/vsc'
import { FaHashtag as HashtagIcon } from 'react-icons/fa';
import { HiSpeakerWave as SpeakerIcon } from 'react-icons/hi2';
import { SocketContext } from '../../../../../contexts/socket.context';
import './create-channel-modal.styles.scss';
Modal.setAppElement('#root');

const ChannelTypeOptions = {
    TEXT: 'TEXT',
    VOICE: 'VOICE'
}

const CreateChannelModal = ({ closeModal, afterOpenModal, isModalOpen }) => {
    const [channelType, setChannelType] = useState('');
    const [channelName, setChannelName] = useState('');
    const { addTextChannel, addVoiceChannel } = useContext(SocketContext);

    const resetFormValues = () => {
        setChannelType(ChannelTypeOptions.TEXT);
        setChannelName('');
    }

    const submitModalHandler = (event) => {
        event.preventDefault();
        console.log('HEYA');
        const trimmedChannelName = channelName.trim();
        if (trimmedChannelName === '') {
            alert('Channel name cannot be empty.');
            return;
        }

        console.log(channelType, channelName);
        switch (channelType) {
            case ChannelTypeOptions.TEXT:
                addTextChannel({ channelName });
                break;
            case ChannelTypeOptions.VOICE:
                addVoiceChannel({ channelName });
                break;
            default:
                throw new Error('Unhandled channelType in submitModalHandler');
        }

        resetFormValues();
        closeModal();
    }

    useEffect(() => {
        resetFormValues();
    }, [])
    
    return (
        <Modal
            isOpen={ isModalOpen }
            onAfterOpen={ afterOpenModal }
            onRequestClose={ closeModal }
            className='modal-content fit create-channel-modal-content'
            overlayClassName='modal-overlay'
            closeTimeoutMS={ 200 }
            contentLabel="Create Channel"
        >
            <form onSubmit={ submitModalHandler }>
                <div className='top'>
                    <div className='header'>
                        <div className='title'>
                            Create Channel
                        </div>
                        <button className='close-button' onClick={ closeModal }><CloseIcon size={ '25px' } /></button>
                    </div>
                    <label className='channel-type-container' htmlFor='channelTypeText'>
                        <div className='header'>Channel Type</div>
                        <div className={ `option text ${ channelType === ChannelTypeOptions.TEXT ? 'selected' : ''}`} htmlFor='channelTypeText' >
                            <div className='icon'><HashtagIcon size={'23px'} /></div>
                            <div className='description'>
                                <div className='title'>Text</div>
                                <div className='details'>Send text, jokes, opinions, and puns</div>
                            </div>
                            <div className='input'>
                                <input checked={ channelType === ChannelTypeOptions.TEXT } id='channelTypeText' type='radio' value={ ChannelTypeOptions.TEXT } onChange={ e => setChannelType(e?.target?.value) } name='channelType' />
                            </div>
                        </div>
                        <label className={ `option voice ${ channelType === ChannelTypeOptions.VOICE ? 'selected' : ''}`} htmlFor='channelTypeVoice'>
                            <div className='icon'><SpeakerIcon size={'23px'} /></div>
                            <div className='description'>
                                <div className='title'>Voice</div>
                                <div className='details'>Hang out with your friends using voice</div>
                            </div>
                            <div className='input'>
                                <input checked={ channelType === ChannelTypeOptions.VOICE } id='channelTypeVoice' type='radio' value={ ChannelTypeOptions.VOICE } onChange={ e => setChannelType(e?.target?.value) } name='channelType'/>
                            </div>
                        </label>
                    </label>
                    <div className='channel-name-container'>
                        <div className='header'>Channel Name</div>
                        <div className='input-row'>
                            <div className='channel-input-symbol'>
                                { channelType === ChannelTypeOptions.TEXT ?
                                    <HashtagIcon size={ '15px' } /> :
                                    <SpeakerIcon size={ '15px' } />
                                }
                                
                            </div>
                            <input value={ channelName } onChange={ e => setChannelName(e?.target?.value) } />
                        </div>
                    </div>
                </div>
                <div className='bottom'>
                    <div className='action-buttons-container'>
                        <button onClick={ closeModal }>Cancel</button>
                        <button className='create-channel-button'>Create Channel</button>
                    </div>
                </div>
            </form>
            
        </Modal>
    );
    
}

export default CreateChannelModal;
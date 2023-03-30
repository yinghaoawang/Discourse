import { useContext, useState } from 'react';
import TextChannelItem from './text-channel-item/text-channel-item.component';
import CreateChannelModal from '../../../modals/create-channel-modal/create-channel-modal.component';
import VoiceChannelItem from './voice-channel-item/voice-channel-item.component';
import SettingsModal from '../../../modals/settings-modal/settings-modal.component';
import { UserContext } from '../../../../contexts/user.context';
import { IoMdMicOff as MutedMicIcon, IoMdMic as MicIcon } from 'react-icons/io';
import { IoVideocam as VideoIcon, IoVideocamOff as VideoOffIcon } from 'react-icons/io5';
import { HiPhoneMissedCall as HangUpIcon } from 'react-icons/hi';
import { IoSettingsSharp as SettingsIcon } from 'react-icons/io5';
import { FaPlus } from 'react-icons/fa';
import { ServerContext } from '../../../../contexts/server.context';
import { SocketContext } from '../../../../contexts/socket.context';
import './inner-sidebar.styles.scss';
import { resetLocalStream, stopLocalStream } from '../../../../util/webRTC.util';
import { SettingsContext } from '../../../../contexts/settings.context';

const InnerSidebar = ({ textChannels, voiceChannels }) => {
    const [isCreateChannelModalOpen, setIsCreateChannelModalOpen] = useState(false);
    const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
    const [isVideoCalling, setIsVideoCalling] = useState(false);
    const { currentInputDevice } = useContext(SettingsContext);
    const { currentVoiceChannel } = useContext(ServerContext);
    const { leaveVoiceChannel, changeVoiceChannel } = useContext(SocketContext);
    const { currentUser } = useContext(UserContext);

    const closeCreateChannelModal = () => {
        setIsCreateChannelModalOpen(false);
    }
    const openCreateChannelModal = () => {
        setIsCreateChannelModalOpen(true);
    }

    const closeSettingsModal = () => {
        setIsSettingsModalOpen(false);
    }
    const openSettingsModal = () => {
        setIsSettingsModalOpen(true);
    }
    
    const hangUpClickHandler = async () => {
        stopLocalStream();
        leaveVoiceChannel();
    }



    const videoChatClickHandler = async () => {
        const newIsVideoCalling = !isVideoCalling;
        let isRecordVideo = newIsVideoCalling;
        await resetLocalStream({ inputDevice: currentInputDevice, isRecordVideo });
        await changeVoiceChannel({ voiceChannel: currentVoiceChannel, isRecordVideo });

        setIsVideoCalling(newIsVideoCalling);
    }

    const displayChar = currentUser?.displayName?.charAt(0).toUpperCase() || '?';

    return (
        <div className="inner-sidebar-container">
            <CreateChannelModal closeModal={ closeCreateChannelModal } isModalOpen={ isCreateChannelModalOpen } />
            <SettingsModal closeModal={ closeSettingsModal } isModalOpen={ isSettingsModalOpen } />

            <div className='room-items-container'>
                <div className='channels-container'>
                    <div className='category-label'>Text channels</div>
                    { textChannels.map((textChannel, index) => 
                        <TextChannelItem key={ index } textChannel={ textChannel } />
                    )}
                    <div className='category-label'>Voice channels</div>
                    { voiceChannels.map((voiceChannel, index) => 
                        <VoiceChannelItem key={ index } voiceChannel={ voiceChannel } />
                    )}
                </div>
                <TextChannelItem className='new-room-item' onClick={ openCreateChannelModal }><FaPlus />New Channel</TextChannelItem>
            </div>
            
                <div className='voice-panel-container'>
                    <div className='user'>
                        <div className='icon'>{ displayChar }</div>
                        <div className='infobox'>
                            <div className='name'>{ currentUser.displayName }</div>
                            <div className='status'>{ currentUser.statusMessage || '' }</div>
                        </div>
                    </div>
                    <div className='buttons-container'>
                        { currentVoiceChannel != null && (
                            <>
                                <div onClick={ videoChatClickHandler } className='button'>{ isVideoCalling ? <VideoOffIcon size='20px' /> : <VideoIcon size='20px' /> }</div>
                                <div onClick={ hangUpClickHandler } className='button'><HangUpIcon size='20px' /></div>
                            </>
                        )}
                        <div onClick={ openSettingsModal } className='button'><SettingsIcon size='20px' /></div>
                    </div>
                </div>
            
        </div>
    );
};

export default InnerSidebar;

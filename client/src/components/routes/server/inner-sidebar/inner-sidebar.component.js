import { useContext, useState } from 'react';
import TextChannelItem from './text-channel-item/text-channel-item.component';
import CreateChannelModal from './create-channel-modal/create-channel-modal.component';
import VoiceChannelItem from './voice-channel-item/voice-channel-item.component';
import { UserContext } from '../../../../contexts/user.context';
import { IoMdMicOff as MutedMicIcon, IoMdMic as MicIcon } from 'react-icons/io';
import { HiPhoneMissedCall as HangUpIcon } from 'react-icons/hi';
import { IoSettingsSharp as SettingsIcon } from 'react-icons/io5';
import { FaPlus } from 'react-icons/fa';
import { ServerContext } from '../../../../contexts/server.context';
import { SocketContext } from '../../../../contexts/socket.context';
import './inner-sidebar.styles.scss';

const InnerSidebar = ({ textChannels, voiceChannels }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { currentVoiceChannel } = useContext(ServerContext);
    const { leaveVoiceChannel } = useContext(SocketContext);
    const { currentUser } = useContext(UserContext);

    const closeModal = () => {
        setIsModalOpen(false);
    }
    const openModal = () => {
        setIsModalOpen(true);
    }
    
    const hangUpClickHandler = () => {
        leaveVoiceChannel();
    }

    return (
        <div className="inner-sidebar-container">
            <div className='room-items-container'>
                <div className='channels-container'>
                    <div className='category-label'>Text channels</div>
                    <CreateChannelModal closeModal={ closeModal } isModalOpen={ isModalOpen } />
                    { textChannels.map((textChannel, index) => 
                        <TextChannelItem key={ index } textChannel={ textChannel } />
                    )}
                    <div className='category-label'>Voice channels</div>
                    { voiceChannels.map((voiceChannel, index) => 
                        <VoiceChannelItem key={ index } voiceChannel={ voiceChannel } />
                    )}
                </div>
                <TextChannelItem className='new-room-item' onClick={ openModal }><FaPlus />New Channel</TextChannelItem>
            </div>
            { currentVoiceChannel != null && (
                <div className='voice-panel-container'>
                    <div className='user'>
                        <div className='icon'>U</div>
                        <div className='infobox'>
                            <div className='name'>{ currentUser.name }</div>
                            <div className='status'>{ currentUser.statusMessage || '' }</div>
                        </div>
                    </div>
                    <div className='buttons-container'>
                        <div className='button'><MicIcon size='20px' /></div>
                        <div onClick={ hangUpClickHandler } className='button'><HangUpIcon size='20px' /></div>
                        <div className='button'><SettingsIcon size='20px' /></div>
                    </div>
                </div>
            )}
            
        </div>
    );
};

export default InnerSidebar;

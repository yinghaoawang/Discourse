import { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import TextChannelItem from './text-channel-item/text-channel-item.component';
import CreateChannelModal from './create-channel-modal/create-channel-modal.component';
import './inner-sidebar.styles.scss';
import VoiceChannelItem from './voice-channel-item/voice-channel-item.component';


const InnerSidebar = ({ textChannels, voiceChannels }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const closeModal = () => {
        setIsModalOpen(false);
    }
    const openModal = () => {
        setIsModalOpen(true);
    }

    return (
        <div className="inner-sidebar-container">
            <div className='category-label'>Text channels</div>
            <div className='channels-container'>
                <CreateChannelModal closeModal={ closeModal } isModalOpen={ isModalOpen } />
                { textChannels.map((textChannel, index) => 
                    <TextChannelItem key={ index } textChannel={ textChannel } />
                )}
                { voiceChannels.map((voiceChannel, index) => 
                    <VoiceChannelItem key={ index } voiceChannel={ voiceChannel } />
                )}
                <TextChannelItem className='new-room-item' onClick={ openModal }><FaPlus />New Channel</TextChannelItem>
            </div>
        </div>
    );
};

export default InnerSidebar;

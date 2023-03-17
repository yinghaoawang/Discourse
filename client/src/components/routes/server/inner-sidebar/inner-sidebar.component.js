import { useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import ChannelItem from './channel-item/channel-item.component';
import CreateChannelModal from './create-channel-modal/create-channel-modal.component';
import './inner-sidebar.styles.scss';


const InnerSidebar = ({ channels }) => {
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
                { channels.map((channel, index) => 
                    <ChannelItem key={ index } channel={ channel } />
                )}
                <ChannelItem className='new-room-item' onClick={ openModal }><FaPlus />New Channel</ChannelItem>
            </div>
        </div>
    );
};

export default InnerSidebar;

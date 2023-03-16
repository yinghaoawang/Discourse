import { useContext, useState } from 'react';
import { FaPlus } from 'react-icons/fa';
import { SocketContext } from '../../../../contexts/socket.context';
import ChannelItem from './channel-item/channel-item.component';
import CreateChannelModal from './create-channel-modal/create-channel-modal.component';
import './inner-sidebar.styles.scss';


const InnerSidebar = ({ channels }) => {
    const { addChannel } = useContext(SocketContext);
    const [isModalOpen, setIsModalOpen] = useState(true);

    const closeModal = () => {
        setIsModalOpen(false);
    }
    const openModal = () => {
        setIsModalOpen(true);
    }

    const createNewChannelHandler = () => {
        const channelName = prompt('What is the name of the channel?')?.trim();
        if (channelName == null || channelName.length === 0) {
            return;
        }
        addChannel({ channelName });
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

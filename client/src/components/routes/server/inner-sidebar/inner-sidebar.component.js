import { useContext } from 'react';
import { FaPlus } from 'react-icons/fa';
import { SocketContext } from '../../../../contexts/socket.context';
import ChannelItem from './channel-item/channel-item.component';
import './inner-sidebar.styles.scss';

const InnerSidebar = ({ channels }) => {
    const { addChannel } = useContext(SocketContext);
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
                
                { channels.map((channel, index) => 
                    <ChannelItem key={ index } channel={ channel } />
                )}
                <ChannelItem className='new-room-item' onClick={ createNewChannelHandler }><FaPlus />New Channel</ChannelItem>
            </div>
        </div>
    );
};

export default InnerSidebar;

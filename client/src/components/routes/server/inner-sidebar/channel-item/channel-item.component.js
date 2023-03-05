import { useContext } from 'react';
import { FaHashtag } from 'react-icons/fa';
import { ServerContext } from '../../../../../contexts/server.context';
import { SocketContext } from '../../../../../contexts/socket.context';
import './channel-item.styles.scss';

const ChannelItem = ({ channel }) => {
    const { currentChannel, setCurrentChannel } = useContext(ServerContext);
    const { changeRoom } = useContext(SocketContext);
    const channelClickHandler = () => {
        changeRoom(channel.name);
        setCurrentChannel(channel);
    }

    const isSelected = currentChannel === channel;

    return (
        <div onClick={ channelClickHandler } className={ `channel-item-container ${ isSelected ? 'selected' : '' }` }><FaHashtag />{ channel.name }</div>
    );
}

export default ChannelItem;
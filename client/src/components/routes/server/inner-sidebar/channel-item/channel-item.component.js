import { useContext } from 'react';
import { FaHashtag } from 'react-icons/fa';
import { ServerContext } from '../../../../../contexts/server.context';
import { SocketContext } from '../../../../../contexts/socket.context';
import './channel-item.styles.scss';

const ChannelItem = ({ channel, className, children, ...props }) => {
    const { currentChannel } = useContext(ServerContext);
    const { changeChannel } = useContext(SocketContext);
    const channelClickHandler = () => {
        if (channel == null) return;
        changeChannel({ channel });
    }

    const isSelected = currentChannel != null && channel != null &&
        currentChannel.id === channel.id;

    return (
        <div onClick={ channelClickHandler } className={ `channel-item-container ${ className } ${ isSelected ? 'selected' : '' }` } { ...props }>
            { children ? children :
            <>
                <FaHashtag /> { channel?.name }
            </>
            }
        </div>
    );
}

export default ChannelItem;
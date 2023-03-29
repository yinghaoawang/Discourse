import { useContext } from 'react';
import { FaHashtag } from 'react-icons/fa';
import { ServerContext } from '../../../../../contexts/server.context';
import { SocketContext } from '../../../../../contexts/socket.context';
import { ChannelTypes } from '../../../../../util/constants.util';
import './text-channel-item.styles.scss';

const TextChannelItem = ({ textChannel, className, children, ...props }) => {
    const { currentTextChannel, selectedChannelType } = useContext(ServerContext);
    const { changeTextChannel } = useContext(SocketContext);
    const channelClickHandler = () => {
        if (textChannel == null) return;
        changeTextChannel({ textChannel });
    }

    const isSelected = currentTextChannel != null && textChannel != null &&
        currentTextChannel.id === textChannel.id && selectedChannelType === ChannelTypes.TEXT;

    return (
        <div onClick={ channelClickHandler } className={ `channel-item-container ${ className } ${ isSelected ? 'selected' : '' }` } { ...props }>
            { children ? children :
            <>
                <FaHashtag />
                <span className='text'>{ textChannel?.name }</span>
            </>
            }
        </div>
    );
}

export default TextChannelItem;
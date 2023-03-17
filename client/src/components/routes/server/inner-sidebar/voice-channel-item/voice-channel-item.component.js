import { useContext } from 'react';
import { HiSpeakerWave } from 'react-icons/hi2';
import { ServerContext } from '../../../../../contexts/server.context';
import { SocketContext } from '../../../../../contexts/socket.context';
// import './voice-channel-item.styles.scss';

const VoiceChannelItem = ({ voiceChannel, className, children, ...props }) => {
    const { currentVoiceChannel } = useContext(ServerContext);
    const { changeVoiceChannel } = useContext(SocketContext);

    const isSelected = currentVoiceChannel != null && voiceChannel != null &&
        currentVoiceChannel.id === voiceChannel.id;

    const channelClickHandler = () => {
        if (voiceChannel == null) return;
        if (currentVoiceChannel != null && voiceChannel.id === currentVoiceChannel.id && isSelected) {
            changeVoiceChannel({ voiceChannel: null });
        } else {
            changeVoiceChannel({ voiceChannel });
        }
        console.log(voiceChannel, currentVoiceChannel);;
    }

    

    return (
        <div onClick={ channelClickHandler } className={ `channel-item-container ${ className } ${ isSelected ? 'selected' : '' }` } { ...props }>
            { children ? children :
            <>
                <HiSpeakerWave /> { voiceChannel?.name }
            </>
            }
        </div>
    );
}

export default VoiceChannelItem;
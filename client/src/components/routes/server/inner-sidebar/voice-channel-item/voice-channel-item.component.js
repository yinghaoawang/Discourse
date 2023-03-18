import { useContext } from 'react';
import { HiSpeakerWave } from 'react-icons/hi2';
import { ServerContext } from '../../../../../contexts/server.context';
import { SocketContext } from '../../../../../contexts/socket.context';
import './voice-channel-item.styles.scss';

const VoiceChannelItem = ({ voiceChannel, className, children, ...props }) => {
    const { currentVoiceChannel, voiceRooms } = useContext(ServerContext);
    const { changeVoiceChannel } = useContext(SocketContext);
    const voiceRoom = voiceRooms.find(v => v.roomId === voiceChannel.id);
    const voiceUsers = voiceRoom?.users;

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
        <>
            <div onClick={ channelClickHandler } className={ `channel-item-container ${ className } ${ isSelected ? 'selected' : '' }` } { ...props }>
                { children ? children :
                <>
                    <HiSpeakerWave /> { voiceChannel?.name }
                </>
                }
            </div>
            <div className='voice-channel-users'>
                { voiceUsers != null && voiceUsers.map(voiceUser => {
                const displayChar = voiceUser?.name?.charAt(0).toUpperCase() || '?';
                
                return (
                    <div className='channel-user'>
                        <div className='icon'>
                            <div className='char'>{ displayChar }</div>
                        </div>
                        <div className='username'>
                            { voiceUser.name }
                        </div>
                        <div className='mic-icons'></div>
                    </div>
                )})}
            </div>
        </>
        
    );
}

export default VoiceChannelItem;
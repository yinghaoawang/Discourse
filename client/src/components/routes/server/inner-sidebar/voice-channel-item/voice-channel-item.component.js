import { useContext } from 'react';
import { HiSpeakerWave as SpeakerIcon } from 'react-icons/hi2';
import { IoMdMicOff as MuteIcon } from 'react-icons/io';
import { ServerContext } from '../../../../../contexts/server.context';
import { SocketContext } from '../../../../../contexts/socket.context';
import { WebRTCContext } from '../../../../../contexts/webRTC.context';
import './voice-channel-item.styles.scss';

const VoiceChannelItem = ({ voiceChannel, className, children, ...props }) => {
    const { stream } = useContext(WebRTCContext);
    const { currentVoiceChannel, voiceRooms } = useContext(ServerContext);
    const { changeVoiceChannel } = useContext(SocketContext);
    const voiceRoom = voiceRooms.find(v => v.roomId === voiceChannel.id);
    const voiceUsers = voiceRoom?.users;

    const isMuted = stream == null;

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
            <div onClick={ channelClickHandler } className={ `channel-item-container voice-channel ${ className } ${ isSelected ? 'selected' : '' }` } { ...props }>
                { children ? children :
                <>
                    <SpeakerIcon /> { voiceChannel?.name }
                </>
                }
            </div>
            <div className='voice-channel-users'>
                { voiceUsers != null && voiceUsers.map((voiceUser, index) => {
                const displayChar = voiceUser?.name?.charAt(0).toUpperCase() || '?';
                
                return (
                    <div key={ index } className='channel-user group'>
                        <div className='user'>
                            <div className='icon'>
                                <div className='char'>{ displayChar }</div>
                            </div>
                            <div className='username'>
                                { voiceUser.name }
                            </div>
                        </div>
                        <div className='mic-icons'>
                            { isMuted && <MuteIcon /> }
                        </div>
                    </div>
                )})}
            </div>
        </>
        
    );
}

export default VoiceChannelItem;
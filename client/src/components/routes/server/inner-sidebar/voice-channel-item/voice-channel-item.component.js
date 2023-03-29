import { useContext } from 'react';
import { HiSpeakerWave as SpeakerIcon } from 'react-icons/hi2';
import { IoMdMicOff as MuteIcon } from 'react-icons/io';
import { ServerContext } from '../../../../../contexts/server.context';
import { SocketContext } from '../../../../../contexts/socket.context';
import { ChannelTypes } from '../../../../../util/constants.util';
import './voice-channel-item.styles.scss';

const VoiceChannelItem = ({ voiceChannel, className, children, ...props }) => {
    const { currentVoiceChannel, voiceRooms, currentServer, selectedChannelType, setSelectedChannelType } = useContext(ServerContext);
    const { changeVoiceChannel } = useContext(SocketContext);
    const voiceRoom = voiceRooms.find(v => v.roomId === voiceChannel.id && v.serverId === currentServer.id);
    const voiceUsers = voiceRoom?.users;

    const isMuted = false;

    const isSelected = currentVoiceChannel != null && voiceChannel != null &&
        currentVoiceChannel.id === voiceChannel.id && selectedChannelType === ChannelTypes.VOICE;

    const channelClickHandler = () => {
        if (voiceChannel == null) return;
        if (currentVoiceChannel == null) {
            // Do nothing if clicking on current voice channel
            // leaveVoiceChannel();
            changeVoiceChannel({ voiceChannel });
        } else {
            setSelectedChannelType(ChannelTypes.VOICE);
        }
    }

    return (
        <>
            <div onClick={ channelClickHandler } className={ `channel-item-container voice-channel ${ className } ${ isSelected ? 'selected' : '' }` } { ...props }>
                { children ? children :
                <>
                    <SpeakerIcon />
                    <span className='text'>{ voiceChannel?.name }</span>
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
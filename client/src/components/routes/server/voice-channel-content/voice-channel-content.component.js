import { useContext, useEffect, useState } from 'react';
import { ServerContext } from '../../../../contexts/server.context';
import './voice-channel-content.styles.scss';

const VoiceChannelContent = () => {
    const [users, setUsers] = useState([1]);
    const { voiceRooms, currentVoiceChannel, currentServer } = useContext(ServerContext);
    useEffect(() => {
        const boardContainer = document.getElementById('boardContainer');
        const boardSize = Math.ceil(Math.sqrt(users.length));
        boardContainer.style.gridTemplateColumns = `repeat(${ boardSize }, 1fr)`;
    }, [users]);

    useEffect(() => {
        const getCurrentVoiceRoom = () => {
            if (currentServer == null || currentVoiceChannel == null || voiceRooms == null) return;
            const matchingVoiceRoom = voiceRooms.find(r => r.serverId === currentServer.id && r.roomId === currentVoiceChannel.id);
            return matchingVoiceRoom;
        }
        console.log(currentVoiceChannel, currentServer, voiceRooms);
        const currentVoiceRoomUsers = getCurrentVoiceRoom()?.users || [];
        setUsers([...currentVoiceRoomUsers]);
    }, [voiceRooms])
    

    return (
        <div className='voice-channel-content-container'>
            <div id='boardContainer' className='board-container'>
                { users.map ((user, index) => {
                    return (
                        <div className='board-item' key={ index }>
                            <div className='stream-content'>
                                { user.stream ? <video>Video</video>
                                    : 
                                    <div className='no-stream'>
                                        {/* <div className='icon'>R</div> */}
                                    </div>
                                }
                            </div>

                            <div className='meta'>
                                <div className='left'>
                                    { user?.name || 'Username' }
                                </div>
                                <div className='right'>
                                    {/* right */}
                                </div>
                            </div>
                            
                        </div>
                    )
                })}
            </div>
        </div>
    );
};

export default VoiceChannelContent;

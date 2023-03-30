import { useContext, useEffect, useState } from 'react';
import { ServerContext } from '../../../../contexts/server.context';
import { getSocket } from '../../../../util/socket.util';
import { getLocalStream, streams } from '../../../../util/webRTC.util';
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

        const updateVoiceRoomContent = async () => {
            const currentVoiceRoomUsers = getCurrentVoiceRoom()?.users || [];
            console.log('vc users', currentVoiceRoomUsers, getSocket().id);
            const voiceRoomUsersWithStream = await Promise.all(currentVoiceRoomUsers.map(async (user) => {
                if (user.id === getSocket().id) {
                    console.log('im the user');
                    user.stream = await getLocalStream();
                    console.log(user.stream);
                    return user;
                }
                const stream = streams[user.id];
                console.log('stream found', stream);
                user.stream = stream;
                return user;
            }));
            console.log('users w/ stream', voiceRoomUsersWithStream);
    
            setUsers([...voiceRoomUsersWithStream]);
        }

        updateVoiceRoomContent();
        
    }, [voiceRooms])

    const videoRefHandler = (ref, user) => {
        if (!ref) return;
        ref.srcObject = user?.stream;
        // if (user.id === getSocket().id) ref.muted = true;
        ref.muted = true;
    };
    

    return (
        <div className='voice-channel-content-container'>
            <div id='boardContainer' className='board-container'>
                { users.map ((user, index) => {
                    return (
                        <div className='board-item' key={ index }>
                            <div className='stream-content'>
                                { user.stream ? <video autoPlay ref={ ref => videoRefHandler(ref, user) }>Video</video>
                                    : 
                                    <div className='no-stream'>
                                        {/* <div className='icon'>R</div> */}
                                    </div>
                                }
                            </div>
                            <div>
                                <div className='meta'>
                                    <div className='left'>
                                        { user?.name || 'Username' }
                                    </div>
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

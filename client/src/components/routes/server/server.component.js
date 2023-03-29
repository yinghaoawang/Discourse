import InnerSidebar from './inner-sidebar/inner-sidebar.component';
import UsersSidebar from './users-sidebar/users-sidebar.component';
import TextChannelContent from './text-channel-content/text-channel-content.component';
import './server.styles.scss';
import { useContext, useEffect } from 'react';
import { ServerContext } from '../../../contexts/server.context';
import { useNavigate, useParams } from 'react-router-dom';
import { SocketContext } from '../../../contexts/socket.context';
import { UserContext } from '../../../contexts/user.context';
import { ChannelTypes } from '../../../util/constants.util';
import VoiceChannelContent from './voice-channel-content/voice-channel-content.component';

const Server = () => {
  const { id } = useParams();
  const { currentUser } = useContext(UserContext);
  const { servers, currentTextChannel, textChannels, voiceChannels, currentServer, posts, users, selectedChannelType } = useContext(ServerContext);
  const { changeServer } = useContext(SocketContext);
  const navigate = useNavigate();

  // handles loading a server on page refresh
  useEffect(() => {
    if (servers.length === 0 || currentServer != null) return;

    // sets current server to the corresponding params id
    const server = servers.find(s => s.id === parseInt(id));

    if (server == null) return;

    changeServer({ server });
  }, [servers]);

  useEffect(() => {
    if (currentUser == null) {
      navigate('/');
    }
  }, [currentUser]);


  return (
  <div className='server-container'>
      { currentServer ?
      <>
        <InnerSidebar textChannels={ textChannels } voiceChannels={ voiceChannels } />
        <div className='server-content'>
          { selectedChannelType === ChannelTypes.TEXT && currentTextChannel && <TextChannelContent posts={ posts } /> }
          { selectedChannelType === ChannelTypes.VOICE && <VoiceChannelContent /> }
        </div>
        <UsersSidebar users={ users } />
      </>
      : <div className='flex justify-center items-center w-full'>Server does not exist</div>
      }
  </div>
  );
};

export default Server;

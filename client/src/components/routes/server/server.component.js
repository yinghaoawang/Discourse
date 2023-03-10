import InnerSidebar from './inner-sidebar/inner-sidebar.component';
import BottomChatbar from './bottom-chatbar/bottom-chatbar.component';
import UsersSidebar from './users-sidebar/users-sidebar.component';
import './server.styles.scss';
import { useContext, useEffect } from 'react';
import { ServerContext } from '../../../contexts/server.context';
import { useParams } from 'react-router-dom';
import PostItem from './post-item/post-item.component';
import { SocketContext } from '../../../contexts/socket.context';

const Server = () => {
  const { id } = useParams();
  const { servers, currentChannel, channels, currentServer, posts, changeServer, users } = useContext(ServerContext);
  const { changeNamespace } = useContext(SocketContext);

  // handles loading a server on page refresh
  useEffect(() => {
    if (servers.length === 0 || currentServer != null) return;

    // sets current server to the corresponding params id
    const server = servers.find(s => s.id === parseInt(id));

    if (server == null) return;

    changeServer(server);
    changeNamespace('/' + server.name);
  }, [servers]);

  const reversedPosts = [...posts].reverse();

  return (
    <div className='server-container'>
        { currentServer ?
        <>
          <InnerSidebar channels={ channels } />
          <div className='content-bottom-chatbar-container'>
            { currentChannel ? <>
                <div className='content-container'>
                { reversedPosts.map((post, index) => {
                  return <PostItem key={ index } post={ post } />
                })}
              </div>
              <BottomChatbar />
            </> : ''
            }
            
          </div>
          <UsersSidebar users={ users } />
        </>
        : <div className='flex justify-center items-center w-full'>Server does not exist</div>
      }
        
    </div>
  );
};

export default Server;

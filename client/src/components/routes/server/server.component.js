import InnerSidebar from './inner-sidebar/inner-sidebar.component';
import BottomChatbar from './bottom-chatbar/bottom-chatbar.component';
import UsersSidebar from './users-sidebar/users-sidebar.component';
import './server.styles.scss';
import { useContext, useEffect, useRef } from 'react';
import { ServerContext } from '../../../contexts/server.context';
import { useParams } from 'react-router-dom';
import PostItem from './post-item/post-item.component';
import { SocketContext } from '../../../contexts/socket.context';

const Server = () => {
  const { id } = useParams();
  const { servers, currentServer, currentChannel, currentPosts, setCurrentPosts, setCurrentServer, setCurrentChannel } = useContext(ServerContext);
  const { socket, changeRoom, changeNamespace } = useContext(SocketContext);

  // handles loading a server on page refresh
  useEffect(() => {
    if (servers.length === 0 || currentServer != null) return;

    // sets current server to the corresponding params id
    const matchingServer = servers.find(s => s.id === parseInt(id));
    if (matchingServer === null) throw new Error('uh oh cheerio');
    setCurrentServer(matchingServer);

    // sets corresponding namespace to server w/ params id
    const server = servers.find(s => s.id === parseInt(id));
    console.log(id, servers, server);
    setCurrentServer(server);
    changeNamespace('/' + server.name);
  }, [servers]);

  // gets post history and socket listeners on server load
  useEffect(() => {
    if (socket == null) return;
  
    socket.on('postHistory', (data) => {
      const { posts } = data;
      setCurrentPosts(posts);
    });

    socket.on('message', (data) => {
        const { message, user, dateCreated } = data;
        const newPost = {
          message, user, dateCreated
        };
        setCurrentPosts(posts => [...posts, newPost]);
    })
    return () => {
        socket.off('message');
        socket.off('postHistory');
    }
  }, [socket]);

  // selects first channel on server load
  useEffect(() => {
    if (currentServer == null) return;
    const { channels } = currentServer;
    const firstChannel = channels?.[0] || null;
    if (!firstChannel) return;

    changeRoom(firstChannel.name);
    setCurrentChannel(firstChannel);
  }, [socket, currentServer])

  return (
    <div className='server-container'>
        { currentServer ?
        <>
          <InnerSidebar channels={ currentServer?.channels || [] } />
          <div className='content-bottom-chatbar-container'>
            <div className='content-container'>
              { currentPosts.map((post, index) => {
                return <PostItem key={ index } post={ post } />
              })}
            </div>
            <BottomChatbar />
          </div>
          <UsersSidebar users={ currentServer?.users || [] } />
        </>
        : <div className='flex justify-center items-center w-full'>Server does not exist</div>
        }
        
    </div>
  );
};

export default Server;

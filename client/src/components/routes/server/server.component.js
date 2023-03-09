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
  const { servers, currentChannel, channels, currentServer, posts, setPosts, setChannels, setCurrentServer, setCurrentChannel } = useContext(ServerContext);
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
    setCurrentServer(server);
    changeNamespace('/' + server.name);
  }, [servers]);

  // gets post history and socket listeners on server load
  useEffect(() => {
    if (socket == null) return;
  
    socket.on('posts', (data) => {
      const { posts } = data;
      setPosts(posts);
    });

    socket.on('channels', (data) => {
      const { channels } = data;
      setChannels(channels);
    });

    socket.on('message', (data) => {
        const { message, user, dateCreated, type } = data;
        const newPost = {
          message, user, dateCreated, type
        };
        setPosts(posts => [...posts, newPost]);
    })
    return () => {
        socket.off('message');
        socket.off('posts');
        socket.off('channels')
    }
  }, [socket]);

  // selects first channel on server load
  useEffect(() => {
    if (currentServer == null || channels.length === 0) return;
    const firstChannel = channels?.[0];
    if (!firstChannel) return;

    changeRoom(firstChannel.name);
    setCurrentChannel(firstChannel);
  }, [socket, currentServer, channels]);

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
          <UsersSidebar users={ currentServer?.users || [] } />
        </>
        : <div className='flex justify-center items-center w-full'>Server does not exist</div>
        }
        
    </div>
  );
};

export default Server;

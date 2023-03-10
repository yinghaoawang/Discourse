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
  const { servers, currentChannel, channels, currentServer, posts, setPosts, setChannels, changeServer, setCurrentChannel, setUsers, users } = useContext(ServerContext);
  const { socket, isSocketConnecting, changeRoom, changeNamespace } = useContext(SocketContext);

  // handles loading a server on page refresh
  useEffect(() => {
    if (servers.length === 0 || currentServer != null) return;

    // sets current server to the corresponding params id
    const server = servers.find(s => s.id === parseInt(id));

    if (server == null) return;

    changeServer(server);
    changeNamespace('/' + server.name);
  }, [servers]);

  // gets post history and socket listeners on server load
  useEffect(() => {
    if (socket == null || isSocketConnecting === true) return;

    socket.emit('getChannels');
    socket.emit('getUsers');
  
    socket.on('posts', (data) => {
      console.log('posts', data);
      const { posts } = data;
      setPosts(posts);
    });

    socket.on('channels', (data) => {
      console.log('channels', data);

      const { channels } = data;
      setChannels(channels);
    });

    socket.on('message', (data) => {
        const { message, user, dateCreated, type } = data;
        const newPost = {
          message, user, dateCreated, type
        };
        setPosts(posts => [...posts, newPost]);
    });

    socket.on('serverUsers', (data) => {
      console.log('users', data);
      const { users } = data;
      setUsers(users);
    })

    return () => {
      socket.off('message');
      socket.off('posts');
      socket.off('channels')
      socket.on('serverUsers')
  }
  }, [isSocketConnecting]);

  // selects first channel on server load
  useEffect(() => {
    if (isSocketConnecting === true) return
    if (currentChannel != null && channels.find(c => c.id === currentChannel.id)) return;

    const firstChannel = channels?.[0];
    if (!firstChannel) return;

    changeRoom(firstChannel.id);
    setCurrentChannel(firstChannel);
  }, [channels]);

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

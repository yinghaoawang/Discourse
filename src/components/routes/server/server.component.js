import { useEffect, useState, useCallback, useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import InnerSidebar from './inner-sidebar/inner-sidebar.component';
import BottomChatbar from './bottom-chatbar/bottom-chatbar.component';
import UsersSidebar from './users-sidebar/users-sidebar.component';
import Loader from '../../shared/loader.component';
import { serverData } from '../../../db/data';
import { ServerContext } from '../../../contexts/server.context';
import './server.styles.scss';

const PostCard = ({user, post}) => {
    return (
        <div className="flex py-1 px-4 mt-2 hover:bg-gray-600 transition-all duration-100 ease-in">
            <div className="mr-3 shrink-0">
                <div className="icon">{user?.name?.[0].toUpperCase() || '?'}</div>
            </div>
            <div className="flex flex-col basis-full">
                <div className="font-semibold">{user.name}</div>
                <div>{post.content}</div>
            </div>
        </div>
    );
}

const Server = () => {
    const { serverId } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [isChannelLoading, setIsChannelLoading] = useState(false);
    const [postData, setPostData] = useState([]);
    const [channelIndex, setChannelIndex] = useState(0);
    const navigate = useNavigate();
    const serverContext = useContext(ServerContext);
    useEffect(() => {
      serverContext.setServerId(serverId);
    }, [serverContext, serverId])
    
    

    const onClickChannel = useCallback((index) => {
      setIsChannelLoading(true);
      setChannelIndex(index);
    }, []);

    useEffect(() => {
      // load all post data
      setTimeout(() => {
        const posts = serverData[serverId]?.channels[channelIndex]?.posts;
        if (posts == null) navigate('/');
      
        
        // adjust the size of server messages container and textarea on page loaded
        setIsChannelLoading(false);
        setIsLoading(false);

        setPostData(posts);
      }, Math.random() * 500 + 250);
    }, [channelIndex, navigate, serverId, postData]);

    useEffect(() => {
      setIsLoading(true);
      onClickChannel(0);
    }, []);

  return (
    <div className='w-full flex'>
        <InnerSidebar selectedChannelIndex={channelIndex} onClickChannel={onClickChannel} channels={isLoading ? [] : serverData[serverId].channels} />
        <div className='server-right-container'>
          {isChannelLoading ? <Loader /> :
            <div className='channel-content-container'>
              {postData.map((data, i) =>
                <PostCard key={`channel${channelIndex}post${i}`} user={data.user} post={data.post} />
              )}
            </div>
          }
          <BottomChatbar postData={postData} setPostData={setPostData} />
        </div>
        <UsersSidebar users={isLoading ? [] : serverData[serverId].users} />
    </div>
  );
};

export default Server;

import { useEffect, useState, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import InnerSidebar from './InnerSidebar';
import BottomChatbar from './BottomChatbar';
import { resizeTextArea } from './BottomChatbar';
import UsersSidebar from './UsersSidebar';
import Loader from '../common/Loader';
import { serverData } from '../../db/data';

const PostCard = ({user, post}) => {
    return (
        <div className="flex py-1 px-4 mt-2 hover:bg-gray-600 transition-all duration-100 ease-in">
            <div className="mr-3 shrink-0">
                <div className="icon">{user?.name?.[0].toUpperCase() || '?'}</div>
            </div>
            <div className="flex flex-col basis-full">
                <div className="font-semibold">{user.name}</div>
                <div>{post.content}{post.content}{post.content}{post.content} {post.content}{post.content}{post.content}{post.content} {post.content}{post.content}{post.content}{post.content} {post.content}{post.content}{post.content}{post.content} {post.content}{post.content}{post.content}{post.content} {post.content}{post.content}{post.content}{post.content} {post.content}{post.content}{post.content}{post.content} {post.content}{post.content}{post.content}{post.content}</div>
                <div>{post.content}</div>
                <div>{post.content}</div>
                <div>{post.content}</div>
            </div>
        </div>
    );
}

const resetContainerSize = () => {
  const container = document.getElementById('channel-content-container');
  // container.scrollTop = container.scrollHeight;
  container.scrollTo(0, container.scrollHeight);
}

const Server = () => {
    const { serverId } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [isChannelLoading, setIsChannelLoading] = useState(false);
    const [postData, setPostData] = useState([]);
    const [channelIndex, setChannelIndex] = useState(0);
    const navigate = useNavigate();

    const onClickChannel = useCallback((index) => {
      console.log('loading channel ' + index);
      setChannelIndex(index);
      setIsChannelLoading(true);
      // load all post data
      setTimeout(async () => {
        const posts = serverData[serverId]?.channels[channelIndex]?.posts;
        if (posts == null) navigate('/');
        setPostData(posts);
        setIsLoading(false);
        setIsChannelLoading(false);
        // adjust the size of server messages container and textarea on page loaded
        setTimeout(() => {
          resizeTextArea();
          resetContainerSize();
        }, 0);
      }, Math.random() * 500 + 250);
    }, [channelIndex, navigate, serverId]);

    useEffect(() => {
      console.log('loading server ' + serverId);
      setIsLoading(true);
      setChannelIndex(0);
      setTimeout(() => {
        setIsLoading(false);
      }, Math.random() * 500 + 500);
    }, [serverId]);

    useEffect(() => {
      onClickChannel(channelIndex);
    }, [onClickChannel, channelIndex]);

  return (
    <div className='w-full flex'>
      {isLoading ? <Loader /> :
        <>
        <InnerSidebar onClickChannel={onClickChannel} channels={serverData[serverId].channels} />
        <div className='flex flex-col basis-full bg-gray-700 text-gray-300'>
          {isChannelLoading ? <Loader /> :
          <div id="channel-content-container" className="reverse scrolling-container h-[calc(var(--doc-height)-var(--chatbar-height))]">
            {postData.map((data, i) =>
              <PostCard key={i} user={data.user} post={data.post} />
            )}
          </div>
          }
          <BottomChatbar />
        </div>
        <UsersSidebar server={serverData[serverId]} />
        </>
      }
    </div>
  );
};

export default Server;

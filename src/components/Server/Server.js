import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import InnerSidebar from './InnerSidebar';
import BottomChatbar from './BottomChatbar';
import { resizeTextArea } from './BottomChatbar';
import UsersSidebar from './UsersSidebar';
import Loader from '../common/Loader';
import { generateRandomName } from '../../App';

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
  container.scrollTop = container.scrollHeight;
}

const Server = () => {
    const { serverId } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [postData, setPostData] = useState([]);

    useEffect(() => {
      setIsLoading(true);

      // load all post data
      setTimeout(() => {
        let samplePostData = [];
        for (let i = 0; i < 80; i++) samplePostData.push({user: {name: generateRandomName(8)}, post: {content: 'Hello to server ' + serverId}});
        setPostData(samplePostData);
        setIsLoading(false);
        // adjust the size of server messages container and textarea on page loaded
        setTimeout(() => {
          resizeTextArea();
          resetContainerSize();
        }, 0);
      }, Math.random() * 509 + 250);
    }, [serverId]);

  return (
    <div className='w-full flex'>
      {isLoading ? <Loader /> :
        <>
        <InnerSidebar />
        <div className='flex flex-col basis-full bg-gray-700 text-gray-300'>
          <div id="channel-content-container" className="reverse scrolling-container h-[calc(var(--doc-height)-var(--chatbar-height))]">
            {postData.map((data, i) =>
              <PostCard key={i} user={data.user} post={data.post} />
            )}
          </div>
          <BottomChatbar />
        </div>
        <UsersSidebar />
        </>
      }
    </div>
  );
};

export default Server;

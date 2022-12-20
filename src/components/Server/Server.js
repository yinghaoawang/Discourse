import { useEffect } from 'react';
import InnerSidebar from './InnerSidebar';
import BottomChatbar from './BottomChatbar';
import UsersSidebar from './UsersSidebar';

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

const Server = () => {
    useEffect(() => {
        const container = document.getElementById('channel-content-container');
        container.scrollTop = container.scrollHeight;
    }, []);

  let samplePostData = [];
  for (let i = 0; i < 80; i++) samplePostData.push({user: {name: generateRandomName(8)}, post: {content: 'Hello'}});

  return (
    <div className='w-full flex'>
      <InnerSidebar />
      <div className='flex flex-col basis-full bg-gray-700 text-gray-300'>
        <div id="channel-content-container" className="reverse scrolling-container h-[calc(var(--doc-height)-var(--chatbar-height))]">
          {samplePostData.map((data, i) => 
            <PostCard key={i} user={data.user} post={data.post} />
          )}
        </div>
        <BottomChatbar />
      </div>
      <UsersSidebar />
    </div>
  );
};

const generateRandomName = nameLength => {
    let res = '';
    for(let i = 0; i < nameLength; i++){
        const random = Math.floor(Math.random() * 26);
        res += String.fromCharCode('a'.charCodeAt(0) + random);
    };
    return res;
};

export default Server;

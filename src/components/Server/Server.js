import { useEffect } from 'react';
import InnerSidebar from './InnerSidebar';
import BottomChatbar from './BottomChatbar';
import UsersSidebar from './UsersSidebar';

const Server = () => {
  let sampleText = [];
  for (let i = 0; i < 80; i++) sampleText.push(<div key={'s' + i}>Hello</div>);

  return (
    <div className='content flex'>
      <InnerSidebar />
      <div className='flex flex-col basis-full bg-gray-700 text-gray-300'>
        <div className="scrolling-container p-4 h-[calc(var(--doc-height)-var(--chatbar-height))]">
          {sampleText}
        </div>
        <BottomChatbar />
      </div>
      <UsersSidebar />
    </div>
  );
};

export default Server;

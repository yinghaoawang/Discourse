import InnerSidebar from './inner-sidebar/inner-sidebar.component';
import BottomChatbar from './bottom-chatbar/bottom-chatbar.component';
import UsersSidebar from './users-sidebar/users-sidebar.component';
import './server.styles.scss';

const Server = () => {
  return (
    <div className='w-full flex'>
        <InnerSidebar />
        <div className='server-right-container'>
            <div className='channel-content-container'>
            </div>
          <BottomChatbar />
        </div>
        <UsersSidebar />
    </div>
  );
};

export default Server;

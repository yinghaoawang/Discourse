import InnerSidebar from './inner-sidebar/inner-sidebar.component';
import BottomChatbar from './bottom-chatbar/bottom-chatbar.component';
import UsersSidebar from './users-sidebar/users-sidebar.component';
import './server.styles.scss';
import { useContext, useEffect } from 'react';
import { ServerContext } from '../../../contexts/server.context';
import { useParams } from 'react-router-dom';

const Server = () => {
  const { id } = useParams();
  const { servers, currentServer, setCurrentServer, setCurrentChannel } = useContext(ServerContext);

  useEffect(() => {
    if (currentServer == null && servers?.length > 0) {
      const matchingServer = servers.find(s => s.id === parseInt(id));
      if (matchingServer === null) throw new Error('uh oh cheerio');
      setCurrentServer(matchingServer);
    }
  }, [servers])

  useEffect(() => {
    if (currentServer != null) {
      const { channels } = currentServer;
      const firstChannel = channels[0] || null;
      if (!firstChannel) return;

      setCurrentChannel(firstChannel);
    }
  }, [currentServer])
  
  return (
    <div className='server-container'>
        { currentServer ?
        <>
          <InnerSidebar channels={ currentServer?.channels || [] } />
          <div className='content-bottom-chatbar-container'>
            <div className='content-container'>
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

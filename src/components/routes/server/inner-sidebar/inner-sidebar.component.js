import { useContext } from 'react';
import { FaHashtag } from 'react-icons/fa';
import { ServerContext } from '../../../../contexts/server.context';
import './inner-sidebar.styles.scss';

const Channel = ({ channel }) => {
    const { currentChannel, setCurrentChannel } = useContext(ServerContext);
    const channelClickHandler = () => {
        setCurrentChannel(channel);
    }

    return (
        <div onClick={ channelClickHandler } className={ `channel-container ${ currentChannel === channel ? 'selected' : '' }` }><FaHashtag />{ channel.name }</div>
    );
}

const InnerSidebar = ({ channels }) => {
    return (
        <div className="inner-sidebar-container">
            <div className='category-label'>Text channels</div>
            <div className='channels-container'>
                { channels.map((channel, index) => 
                    <Channel key={ index } channel={ channel } />
                )}
            </div>
        </div>
    );
};

export default InnerSidebar;

import ChannelItem from './channel-item/channel-item.component';
import './inner-sidebar.styles.scss';

const InnerSidebar = ({ channels }) => {
    return (
        <div className="inner-sidebar-container">
            <div className='category-label'>Text channels</div>
            <div className='channels-container'>
                { channels.map((channel, index) => 
                    <ChannelItem key={ index } channel={ channel } />
                )}
            </div>
        </div>
    );
};

export default InnerSidebar;

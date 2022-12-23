import { FaHashtag } from 'react-icons/fa';

let lastSelectedChannel;
const selectChannel = (event) => {
    if (lastSelectedChannel != null) lastSelectedChannel.classList.remove('selected');
    event.target.classList.add('selected');
    lastSelectedChannel = event.target;
}

const InnerSidebar = ({ channels, onClickChannel }) => {
    return (
        <div className="scrolling-container
        w-inner-sidebar p-2
        flex flex-col shrink-0
        bg-gray-800 text-gray-400">
            <InnerSidebarCategoryLabel name="Text channels" />
            <ul>
                {channels.map((data, i) => 
                    <InnerSidebarChannelCard onClickChannel={onClickChannel} channelIndex={i} key={i} channel={data} />
                )}
            </ul>
        </div>
    );
};

const InnerSidebarChannelCard = ({ channel, onClickChannel, channelIndex }) => {
    return (
        <li className="hover:bg-gray-600 p-2 flex flex-row items-center" onClick={() => {
            // selectChannel();
            onClickChannel(channelIndex)
        }}>
            <span className="shrink-0"><FaHashtag /></span><span className="ellipsis-container pl-1 font-semibold text-center">{channel.name}</span>
        </li>
    );
}

const InnerSidebarCategoryLabel = ({name}) => {
    return (
        <div className="category-label mt-2">
            {name}
        </div>
    );
}

export default InnerSidebar;

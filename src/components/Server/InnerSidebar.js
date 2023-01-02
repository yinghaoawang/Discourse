import { useState } from 'react';
import { FaHashtag } from 'react-icons/fa';

const InnerSidebar = ({ channels, onClickChannel }) => {
    const [selectedChannelIndex, setSelectedChannelIndex] = useState(0);

    return (
        <div className="scrolling-container
        w-inner-sidebar p-2
        flex flex-col shrink-0
        bg-gray-800 text-gray-400">
            <InnerSidebarCategoryLabel name="Text channels" />
            <ul>
                {channels.map((data, i) => 
                    <InnerSidebarChannelCard setSelectedChannelIndex={setSelectedChannelIndex} selectedChannelIndex={selectedChannelIndex} onClickChannel={onClickChannel} channelIndex={i} key={i} channel={data} />
                )}
            </ul>
        </div>
    );
};

const InnerSidebarChannelCard = ({ channel, onClickChannel, channelIndex, selectedChannelIndex, setSelectedChannelIndex }) => {
    return (
        <li className={`hover:bg-gray-600 p-2 flex flex-row items-center ${(selectedChannelIndex === channelIndex) ? 'selected' : ''}`}
            onClick={(e) => {
                setSelectedChannelIndex(channelIndex);
                onClickChannel(channelIndex)
            }
        }>
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

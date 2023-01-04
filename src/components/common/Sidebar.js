import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FaCompass, FaEnvelope, FaPlus } from 'react-icons/fa';
import { serverData } from '../../db/data';

const Sidebar = () => {
  const [selectedServerIndex, setSelectedServerIndex] = useState(-999);
  const onServerClick = (serverIndex) => {
    console.log(serverIndex);
    setSelectedServerIndex(serverIndex);
  };

  return (
    <div
        id="sidebar"
        className="w-left-sidebar overflow-x-hidden scrolling-container
        flex flex-col shrink-0 
        bg-gray-900 text-white"
    >
      <SidebarIcon icon={<FaEnvelope size='26' />} serverIndex={'-1'} selectedServerIndex={selectedServerIndex} onServerClick={onServerClick} text="Direct Messages" link='/messages' />
      {
        serverData.map((serverData, i) => <SidebarIcon key={i} link={`/server/${serverData.id}`} text={serverData.name} serverIndex={i} onServerClick={onServerClick} selectedServerIndex={selectedServerIndex} icon={
        <span>{serverData.name?.[0]?.toUpperCase() || '?' }</span>
      } />)
      }
      <SidebarIcon icon={<FaPlus size='22' />} selectedServerIndex={selectedServerIndex} text="Add New Server" />
      <SidebarIcon icon={<FaCompass size='24' /> } selectedServerIndex={selectedServerIndex} text="Explore" link='/explore' />
    </div>
  );
};

const SidebarIcon = ({ icon, text = 'Tooltip placeholder', link, selectedServerIndex, onServerClick, serverIndex }) => {
    const moveTooltip = (event) => {
        const tooltip = event.target.querySelector('.sidebar-tooltip');
        if (tooltip == null) return;
        tooltip.style.top = event.target.getBoundingClientRect().top + 'px';
    };

    return (
        <Link to={link || ''} className={`sidebar-icon icon group ${selectedServerIndex === serverIndex ? 'selected' : ''}`} onClick={() => onServerClick != null ? onServerClick(serverIndex) : ''} onMouseOver={moveTooltip}>
          {icon}

            <span className='sidebar-tooltip group-hover:scale-100'>{text}</span>
        </Link>
    )
};

export default Sidebar;

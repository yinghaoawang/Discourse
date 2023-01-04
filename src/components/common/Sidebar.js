import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { FaCompass, FaEnvelope, FaPlus } from 'react-icons/fa';
import { serverData } from '../../db/data';
import { ServerContext } from '../../contexts/ServerContext';

const Sidebar = () => {
  

  return (
    <div
        id="sidebar"
        className="w-left-sidebar overflow-x-hidden scrolling-container
        flex flex-col shrink-0 
        bg-gray-900 text-white"
    >
      <SidebarIcon icon={<FaEnvelope size='26' />} serverIndex={'-1'} text="Direct Messages" link='/messages' />
      {
        serverData.map((serverData, i) => <SidebarIcon key={i} link={`/server/${serverData.id}`} text={serverData.name} serverIndex={i} icon={
        <span>{serverData.name?.[0]?.toUpperCase() || '?' }</span>
      } />)
      }
      <SidebarIcon icon={<FaPlus size='22' />} text="Add New Server" />
      <SidebarIcon icon={<FaCompass size='24' /> } text="Explore" link='/explore' />
    </div>
  );
};

const SidebarIcon = ({ icon, text = 'Tooltip placeholder', link, serverIndex }) => {
  const serverContext = useContext(ServerContext);

  const onServerClick = () => {
    if (serverIndex === null) return;

    serverContext.setServerId(serverIndex);
  };

  const moveTooltip = (event) => {
      const tooltip = event.target.querySelector('.sidebar-tooltip');
      if (tooltip == null) return;
      tooltip.style.top = event.target.getBoundingClientRect().top + 'px';
  };

  return (
      <Link to={link || ''} className={`sidebar-icon icon group ${serverContext.serverId == serverIndex && serverIndex !== undefined ? 'selected' : ''}`} onClick={onServerClick} onMouseOver={moveTooltip}>
        {icon}

          <span className='sidebar-tooltip group-hover:scale-100'>{text}</span>
      </Link>
  )
};

export default Sidebar;

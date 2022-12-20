import { Link } from 'react-router-dom';
import { FaCompass, FaEnvelope, FaPlus } from 'react-icons/fa';

const Sidebar = () => {
  const serverData = ['A', 'B', 'C'];
  for (let i = 0; i < 22; i++) serverData.push('D');

  return (
    <div
        id="sidebar"
        className="w-left-sidebar overflow-x-hidden scrolling-container
        flex flex-col shrink-0 
        bg-gray-900 text-white"
    >
      <SidebarIcon icon={<FaEnvelope size='26' />} link='/messages' />
      {
        serverData.map((serverData, i) => <SidebarIcon key={i} link='/' icon={
        <span>{serverData}</span>
      } />)
      }
      <SidebarIcon icon={<FaPlus size='22' />} />
      <SidebarIcon icon={<FaCompass size='24' /> } link='/explore' />
    </div>
  );
};

const SidebarIcon = ({ icon, text = 'Tooltip placeholder', link }) => {
    const moveTooltip = (event) => {
        const tooltip = event.target.querySelector('.sidebar-tooltip');
        if (tooltip == null) return;
        tooltip.style.top = event.target.getBoundingClientRect().top + 'px';
    };

    return (
        <Link to={link || ''} className='sidebar-icon icon group' onMouseOver={moveTooltip}>
            {icon}

            <span className='sidebar-tooltip group-hover:scale-100'>{text}</span>
        </Link>
    )
};

export default Sidebar;

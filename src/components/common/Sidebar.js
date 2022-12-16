
import { FaCompass, FaEnvelope, FaPlus } from 'react-icons/fa';

const Sidebar = () => {
    return <div className="w-left-sidebar flex flex-col shrink-0 bg-gray-900 text-white">
        <SidebarIcon icon={<FaEnvelope size="26" />} />
        <SidebarIcon icon={<span>A</span>}/>
        <SidebarIcon icon={<span>B</span>}/>
        <SidebarIcon icon={<span>C</span>}/>
        <SidebarIcon icon={<span>D</span>}/>
        <SidebarIcon icon={<span>D</span>}/>
        <SidebarIcon icon={<FaPlus size="22" />} />
        <SidebarIcon icon={<FaCompass size="24" />} />
    </div>
};

const SidebarIcon = ({ icon, text = 'Tooltip placeholder' }) => (
    <div className="sidebar-icon icon group">
        {icon}
        
        <span className="sidebar-tooltip group-hover:scale-100">{text}</span>
    </div>
);

export default Sidebar;
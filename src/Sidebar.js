
import { FaCompass, FaEnvelope, FaPlus } from 'react-icons/fa';

const Sidebar = () => {
    return <div className="fixed top-0 left-0 h-screen w-16 m-0 flex flex-col bg-gray-900 text-white">
        <SidebarIcon icon={<FaEnvelope size="28" />} />
        <SidebarIcon icon={<FaPlus size="28" />} />
        <SidebarIcon icon={<FaCompass size="28" />} />
    </div>
};

const SidebarIcon = ({ icon }) => (
    <div className="sidebar-icon">
        {icon}
    </div>
);

export default Sidebar;
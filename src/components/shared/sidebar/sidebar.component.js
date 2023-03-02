import { useContext } from 'react';
import { FaHome, FaPlus, FaCompass } from 'react-icons/fa';
import { ServerContext } from '../../../contexts/server.context';
import SidebarIcon from './sidebar-icon/sidebar-icon.component';
import './sidebar.styles.scss';

const Sidebar = () => {
    const { servers } = useContext(ServerContext);

    return (
        <div className='sidebar-container'>
            <SidebarIcon text="Home" link='/'><FaHome size='26' /></SidebarIcon>
            { servers.map((server, index) => {
                const { name, id } = server;
                const displayChar = name?.charAt(0).toUpperCase() || '?';
                return <SidebarIcon key={ index } tooltipText={ name } server={ server }>
                    <span>{ displayChar }</span>
                </SidebarIcon>;
            })}
            <SidebarIcon text="Add New Server"><FaPlus size='22' /></SidebarIcon>
            <SidebarIcon text="Explore" link='/explore'><FaCompass size='24' /></SidebarIcon>
        </div>
    );
};

export default Sidebar;

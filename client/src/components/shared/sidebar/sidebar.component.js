import { useContext } from 'react';
import { FaHome, FaPlus } from 'react-icons/fa';
import { ServerContext } from '../../../contexts/server.context';
import { SocketContext } from '../../../contexts/socket.context';
import SidebarIcon from './sidebar-icon/sidebar-icon.component';
import './sidebar.styles.scss';

const Sidebar = () => {
    const { servers } = useContext(ServerContext);
    const { addServer } = useContext(SocketContext);
    const createNewServerHandler = () => {
        const serverName = prompt('What is the name of the server?')?.trim();
        if (serverName == null || serverName.length === 0) {
            // alert('Server was not created.');
            return;
        }
        addServer({ serverName });
    }

    return (
        <div className='sidebar-container'>
            <SidebarIcon tooltipText="Home" link='/'><FaHome size='26' /></SidebarIcon>
            { servers.map((server, index) => {
                const { name } = server;
                const displayChar = name?.charAt(0).toUpperCase() || '?';
                return <SidebarIcon key={ index } tooltipText={ name } server={ server }>
                    <span>{ displayChar }</span>
                </SidebarIcon>;
            })}
            <SidebarIcon onClick={ createNewServerHandler } tooltipText="Add New Server"><FaPlus size='22' /></SidebarIcon>
            {/* <SidebarIcon tooltipText="Explore" link='/explore'><FaCompass size='24' /></SidebarIcon> */}
        </div>
    );
};

export default Sidebar;

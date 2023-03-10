import { useContext, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ServerContext } from '../../../../contexts/server.context';
import { SocketContext } from '../../../../contexts/socket.context';
import './sidebar-icon.styles.scss';

const SidebarIcon = ({ link, tooltipText = 'Tooltip placeholder', server, className, children, ...props }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { currentServer, changeServer } = useContext(ServerContext);
    const { changeNamespace } = useContext(SocketContext);
    const tooltip = useRef(null);
  
    const iconClickHandler = () => {
        if (server == null && link == null) {
            return;
        }

        if (server != null) {
            changeServer(server);
            changeNamespace('/' + server.name);
            navigate(`/server/${ server.id }`);
        } else if (link != null) {
            navigate(link);
            changeServer(null);
            changeNamespace('/');
        } else {
            throw new Error('Invalid icon, link or server does not exist.')
        }
    };
  
    const iconHoverHandler = (event) => {
        if (tooltip.current == null) return;
        const target = { event };
        if (!target?.getBoundingClientRect) return;
        tooltip.current.style.top = target.getBoundingClientRect().top + 'px';
    };

    const isSelected = (currentServer != null && server != null &&
        currentServer.id === server.id) ||
        (server == null && link === location.pathname);
    
    return (
        <div className={ `sidebar-icon-container group ${ isSelected ? 'selected' : '' } ${ className || '' }`} onClick={ iconClickHandler } onMouseOver={ iconHoverHandler } { ...props }>
            <div className='icon-child'>
                { children }
            </div>
            <span ref={ tooltip } className='sidebar-tooltip group-hover:scale-100'>{ tooltipText }</span>
        </div>
        
    )
  };

  export default SidebarIcon;
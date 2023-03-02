import { useContext, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ServerContext } from '../../../../contexts/server.context';
import './sidebar-icon.styles.scss';

const SidebarIcon = ({ link, tooltipText = 'Tooltip placeholder', server, className, children, ...props }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { currentServer, setCurrentServer } = useContext(ServerContext);
    const tooltip = useRef(null);
  
    const iconClickHandler = () => {
        if (server == null && link == null) {
            return;
        }

        if (server != null) {
            setCurrentServer(server);
            navigate(`/server/${ server.id }`)
        } else if (link != null) {
            navigate(link);
            setCurrentServer(null);
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

    const isSelected = (currentServer === server && currentServer != null) ||
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
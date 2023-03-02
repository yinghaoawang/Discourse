import { useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ServerContext } from '../../../contexts/server.context';
import './sidebar-icon.styles.scss';

const SidebarIcon = ({ link='', text = 'Tooltip placeholder', server, className, children, ...props }) => {
    const navigate = useNavigate();
    const { currentServer, setCurrentServer } = useContext(ServerContext);
    const tooltip = useRef(null);
  
    const iconClickHandler = () => {
        if (currentServer === server) return;
        setCurrentServer(server);
        navigate(`/server/${ server.id }`)
        console.log('server changed ', server);
    };
  
    const iconHoverHandler = (event) => {
        if (tooltip.current == null) return;
        tooltip.current.style.top = event.target.getBoundingClientRect().top + 'px';
    };
  
    return (
        <div className={ `sidebar-icon-container group ${ className }`} onClick={ iconClickHandler } onMouseOver={ iconHoverHandler } { ...props }>
            <div className='icon-child'>
                { children }
            </div>
            <span ref={ tooltip } className='sidebar-tooltip group-hover:scale-100'>{ text }</span>
        </div>
        
    )
  };

  export default SidebarIcon;
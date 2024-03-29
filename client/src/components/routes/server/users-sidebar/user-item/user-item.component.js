import './user-item.styles.scss'

const UserItem = ({ user }) => {
    const displayChar = user?.displayName?.charAt(0)?.toUpperCase() || '?';
    const { category } = user;
    return (
        <div className={ `user-item-container ${ category === 'Offline' ? 'offline' : '' }` }>
            <div className='icon'>
                <span>{ displayChar }</span>
            </div>
            <div className='infobox'>
                <div className='name'>{ user.displayName }</div>
                <div className='status'>{ user.statusMessage || '' }</div>
            </div>  
        </div>
    );
};

export default UserItem;
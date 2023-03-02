import './user-item.styles.scss'

const UserItem = ({ user }) => {
    const displayChar = user.name.charAt(0).toUpperCase();
    return (
        <div className='user-item-container'>
            <div className='icon'>
                <span>{ displayChar }</span>
            </div>
            <div className='infobox'>
                <div className='name'>{ user.name }</div>
                <div className='status'>{ user.statusMessage || '' }</div>
            </div>  
        </div>
    );
};

export default UserItem;
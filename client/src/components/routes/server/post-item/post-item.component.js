import './post-item.styles.scss';
import Moment from 'react-moment';

const PostTypes = {
    USER_MESSAGE: 'USER_MESSAGE',
    USER_LEAVE: 'USER_LEAVE',
    USER_JOIN: 'USER_JOIN',
}

const PostItem = ({ post }) => {
    const { message, user, dateCreated, type = PostTypes.USER_MESSAGE } = post;
    const displayChar = user?.name?.charAt(0).toUpperCase() || '?';

    let displayMessage = message;
    switch (type) {
        case PostTypes.USER_LEAVE:
            displayMessage = `${ user.name } has left the room.`
            break;
        case PostTypes.USER_JOIN:
            displayMessage = `${ user.name } has joined the room.`
            break;
        case PostTypes.USER_MESSAGE:
            break;
        default:
            throw new Error('Unhandled post type ' + type);
    }

    return (
        <div className={`post-item-container ${ type !== PostTypes.USER_MESSAGE ? 'system-message' : 'user-message' }`}>
            <div className='icon'>
                <div className='char'>{ displayChar }</div>
            </div>
            
            <div className='message-col'>
                <div className='metadata'>
                    <div className='username'>{ user?.name || '?' }</div>
                    <div className='timestamp'><Moment format='hh:mm A' date={ dateCreated }></Moment></div>
                </div>
                
                <div className='message'>{ displayMessage }</div>
            </div>
        </div>
    );
}

export default PostItem;
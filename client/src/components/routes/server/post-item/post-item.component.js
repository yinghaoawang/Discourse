import './post-item.styles.scss';
import { PostTypes } from '../../../../util/constants.util';
import Moment from 'react-moment';

const PostItem = ({ post }) => {
    const { message, user = { name: '?'}, dateCreated, type = PostTypes.USER_MESSAGE } = post;
    const displayChar = user?.displayName?.charAt(0).toUpperCase() || '?';

    let displayMessage = message;
    switch (type) {
        case PostTypes.USER_LEAVE:
            displayMessage = `${ user?.displayName } ${ message }`
            break;
        case PostTypes.USER_JOIN:
            displayMessage = `${ user?.displayName } ${ message }`
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
                    <div className='username'>{ user?.displayName || '?' }</div>
                    <div className='timestamp'><Moment format='hh:mm A' date={ dateCreated }></Moment></div>
                </div>
                
                <div className='message'>{ displayMessage }</div>
            </div>
        </div>
    );
}

export default PostItem;
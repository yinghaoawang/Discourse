import './post-item.styles.scss';
import Moment from 'react-moment';

const PostItem = ({ post }) => {
    const { message, user, dateCreated } = post;
    console.log(dateCreated);
    const displayChar = user?.name?.charAt(0).toUpperCase() || '?';
    return (
        <div className='post-item-container'>
            <div className='icon'>
                <div className='char'>{ displayChar }</div>
            </div>
            <div className='message-col'>
                <div className='metadata'>
                    <div className='username'>{ user?.name || '?' }</div>
                    <div className='timestamp'><Moment format='hh:mm A' date={ dateCreated }></Moment></div>
                </div>
                <div className='message'>{ message }</div>
            </div>
        </div>
    );
}

export default PostItem;
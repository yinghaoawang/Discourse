import './post-item.styles.scss';

const PostItem = ({ post }) => {
    const { message, user } = post;
    const displayChar = user?.name?.charAt(0).toUpperCase();
    return (
        <div className='post-item-container'>
            <div className='icon'>
                <div className='char'>{ displayChar }</div>
            </div>
            <div className='message-col'>
                <div className='metadata'>
                    <div className='username'>{ user?.name || '?' }</div>
                    <div className='timestamp'>{ 'Today at 11:43am' }</div>
                </div>
                <div className='message'>{ message }</div>
            </div>
        </div>
    );
}

export default PostItem;
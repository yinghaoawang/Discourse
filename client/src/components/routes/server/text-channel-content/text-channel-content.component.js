import PostItem from './post-item/post-item.component';
import BottomChatbar from './bottom-chatbar/bottom-chatbar.component';
import './text-channel-content.styles.scss';

const TextChannelContent = ({ posts }) => {
    const reversedPosts = [...posts].reverse();

    return (
        <div className='content-bottom-chatbar-container'>
            <div className='content-container'>
                { reversedPosts.map((post, index) => {
                    return <PostItem key={index} post={post} />;
                })}
            </div>
            <BottomChatbar />
        </div>
    );
};

export default TextChannelContent;

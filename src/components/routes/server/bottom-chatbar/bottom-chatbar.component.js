import { useRef } from 'react';
import './bottom-chatbar.styles.scss';

const BottomChatbar = ({postData, setPostData}) => {
    const textAreaRef =  useRef(null);
    
    return (
        <div className='bottom-chatbar-container'>
            <textarea ref={ textAreaRef } rows='3'
                placeholder='Write your message here'
                ></textarea>
        </div>
    );
};

export default BottomChatbar;
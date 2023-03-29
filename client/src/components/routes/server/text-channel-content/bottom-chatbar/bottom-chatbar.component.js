import { useRef, useContext } from 'react';
import { SocketContext } from '../../../../../contexts/socket.context';
import './bottom-chatbar.styles.scss';

const BottomChatbar = () => {
    const textAreaRef =  useRef(null);
    const { sendMessage } = useContext(SocketContext);

    const keyDownHandler = (event) => {
        if (event.keyCode === 13 && !event.shiftKey) {
            event.preventDefault();
            const message = textAreaRef.current.value;
            if (message === '') return;

            sendMessage({ message });
            textAreaRef.current.value = '';
        }
    }
    
    return (
        <div className='bottom-chatbar-container'>
            <textarea ref={ textAreaRef } onKeyDown={ keyDownHandler }
            rows='3' placeholder='Write your message here' />
        </div>
    );
};

export default BottomChatbar;
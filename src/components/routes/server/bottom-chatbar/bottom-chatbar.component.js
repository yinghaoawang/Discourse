import { useRef, useCallback } from 'react';

const BottomChatbar = ({postData, setPostData}) => {
    const textAreaRef =  useRef(null);

    const onKeyDown = useCallback((e) => {
        if (e.keyCode === 13 && e.ctrlKey) {
            postData.unshift({user: {name: 'hey'}, post: {content: textAreaRef.current.value}});
            textAreaRef.current.value = '';
            setPostData(postData => [...postData]);
        }
    }, [postData, setPostData]);
    

    

    return (
        <div id="bottom-bar" className="bg-gray-700 p-4 pt-0 shrink-0 overflow-auto">
            <textarea ref={textAreaRef} id="chat-textarea" rows="2"
                className="w-full p-2 rounded-md
                bg-gray-600 placeholder-gray-400 text-white
                outline-none resize-none"
                placeholder="Write your message here"
                onKeyDown={onKeyDown}
                ></textarea>
        </div>
    );
};

export default BottomChatbar;
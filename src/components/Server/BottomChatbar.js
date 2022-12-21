const maxTextareaHeight = '120';
const resizeTextArea = (e) => {
    const textarea = e?.target || document.getElementById('chat-textarea');
    setTimeout(() => {
        // resets textarea size for shrinking
        textarea.style.height = 'auto';

        // resizes text area
        textarea.style.height = textarea.scrollHeight + 'px';
        if (textarea.scrollHeight > maxTextareaHeight){
            textarea.style.cssText = 'overflow: scroll !important';
            textarea.style.cssText = 'height: ' + maxTextareaHeight + 'px';
        }
        // adjust css global '--chatbar-height' for container resizing
        const containerHeight = document.getElementById('bottom-bar').clientHeight;
        const paddingHeight = containerHeight - textarea.clientHeight;
        document.documentElement.style.setProperty('--chatbar-height', `${textarea.clientHeight + paddingHeight}px`);

        // resets textarea position
        textarea.blur();
        textarea.focus();
    }, 0);
};

const BottomChatbar = () => {
    return (
        <div id="bottom-bar" className="bg-gray-700 p-4 pt-0">
            <textarea id="chat-textarea" rows="1" onKeyDown={resizeTextArea}
                className="w-full p-2 rounded-md resize-none
                bg-gray-600 placeholder-gray-400 text-white
                outline-none"
                placeholder="Write your message here"></textarea>
        </div>
    );
};

export default BottomChatbar;
export { resizeTextArea };
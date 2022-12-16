const BottomChatbar = () => {
    const maxTextareaHeight = '120';
    const resizeTextArea = (e) => {
        const textarea = e.target;
        setTimeout(() => {
            textarea.style.height = 0;
            textarea.style.height = textarea.scrollHeight + 'px';
            if (textarea.scrollHeight > maxTextareaHeight){
                textarea.style.cssText = 'overflow: scroll !important';
                textarea.style.cssText = 'height: ' + maxTextareaHeight + 'px';
            }
            const containerHeight = document.getElementById('bottom-bar').clientHeight;
            const paddingHeight = containerHeight - textarea.clientHeight;
            document.documentElement.style.setProperty('--chatbar-height', `${textarea.clientHeight + paddingHeight}px`);
        });
    };

    return (
        <div id="bottom-bar" className="h-[--chatbar-height]
          bg-gray-700 p-4 pt-0">
            <textarea rows="1" onKeyDown={resizeTextArea} className="w-full p-2 rounded-md resize-none bg-gray-600 placeholder-gray-400 text-white outline-none" placeholder="Write your message here"></textarea>
        </div>
    );
};

export default BottomChatbar;
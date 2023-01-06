const BottomChatbar = () => {
    return (
        <div id="bottom-bar" className="bg-gray-700 p-4 pt-0 shrink-0 overflow-auto">
            <textarea id="chat-textarea" rows="1"
                className="w-full p-2 rounded-md
                bg-gray-600 placeholder-gray-400 text-white
                outline-none resize-none"
                placeholder="Write your message here"></textarea>
        </div>
    );
};

export default BottomChatbar;
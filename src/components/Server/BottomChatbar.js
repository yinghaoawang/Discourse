const BottomChatbar = () => {
    return (
        <div className="h-chatbar
          bg-gray-700 p-4 pt-0">
            <textarea rows="4" className="w-full p-2 rounded-md resize-none bg-gray-600 placeholder-gray-400 text-white outline-none" placeholder="Write your message here"></textarea>
        </div>
    );
};

export default BottomChatbar;
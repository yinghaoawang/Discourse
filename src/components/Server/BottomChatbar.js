const BottomChatbar = () => {
    return (
        <div className="fixed top-[calc(100vh-theme('spacing.chatbar'))] h-chatbar left-[calc(theme('spacing.inner-sidebar')+theme('spacing.left-sidebar'))]
            w-[calc(100%-theme('spacing.left-sidebar')-theme('spacing.inner-sidebar')-theme('spacing.right-sidebar'))] 
          bg-gray-700 p-4 pt-0">
            <textarea rows="4" class="p-2.5 h-full w-full rounded-md bg-gray-600 placeholder-gray-400 text-white outline-none" placeholder="Write your message here"></textarea>
        </div>
    );
};

export default BottomChatbar;
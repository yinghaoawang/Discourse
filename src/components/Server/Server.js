import InnerSidebar from "./InnerSidebar";
import BottomChatbar from "./BottomChatbar";
import UsersSidebar from "./UsersSidebar";

const Server = () => {
    let sampleText = [];
    for (let i = 0; i < 80; i++) sampleText.push(<div>Hello</div>);

    return (
    <div className="content flex">
        <InnerSidebar />
        <div className="flex flex-col basis-full p-4 bg-gray-700 text-gray-300">
            <div className="overflow-auto h-[calc(var(--doc-height)-theme('spacing.chatbar'))] ">
                {sampleText}
            </div>
            <BottomChatbar />
        </div>
        <UsersSidebar />
    </div>
    );
};

export default Server;
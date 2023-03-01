const UsersSidebar = ({ users = [] }) => {
    return (
        <div className="w-right-sidebar scrolling-container
        pt-2 px-2
        flex flex-col
        bg-gray-900 text-gray-400">
            <CategoryLabel name="Users" />
            {users.map((user, i) => (
                <UsersSidebarCard key={i} user={user} />
            ))}
        </div>
    );
};

const CategoryLabel = ({ name }) => {
    return (
        <div className="category-label ml-4 mt-2">
            {name}
        </div>
    );
}

const UsersSidebarCard = ({ user }) => {
    return (
        <div className="flex items-center w-full h-12 hover:bg-gray-700 mt-1 p-2">
            <div className="icon mx-3">
                <span className="w-full text-center text-xl text-white mt-[-4px]">{user.name.charAt(0).toUpperCase()}</span>
            </div>
            <div className="flex flex-col leading-5 w-full">
                <div className="font-semibold">{ user.name }</div>
                <div className="text-xs w-36 ellipsis-container">{ user.statusMessage || '' }</div>
            </div>  
        </div>
    );
};

export default UsersSidebar;

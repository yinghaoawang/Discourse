const UsersSidebar = () => {
    return (
        <div className="w-right-sidebar scrolling-container
        pt-2 px-2
        flex flex-col shrink-0
        bg-gray-900 text-gray-400">
            <UsersSidebarCategoryLabel name={'Online'} />
            <UsersSidebarCard user={{ name: 'Alan'}}/>
            <UsersSidebarCard user={{ name: 'JoJo'}}/>
            <UsersSidebarCategoryLabel name={'Offline'} />
            <UsersSidebarCard user={{ name: 'Fan Zhendong', statusMessage: '我喜欢冰淇淋'}}/>
            <UsersSidebarCard user={{ name: 'Lebron James', statusMessage: 'When you have one of the best players on the court being unselfish, I think that transfers to the other players.'}}/>
            <UsersSidebarCard user={{ name: 'Zebra'}}/>
            <UsersSidebarCard user={{ name: 'Zebra'}}/>
            <UsersSidebarCard user={{ name: 'Zebra'}}/>
            <UsersSidebarCard user={{ name: 'Zebra'}}/>
            <UsersSidebarCard user={{ name: 'Zebra'}}/>
            <UsersSidebarCard user={{ name: 'Zebra'}}/>
            <UsersSidebarCard user={{ name: 'Zebra'}}/>
            <UsersSidebarCard user={{ name: 'Zebra'}}/>
            <UsersSidebarCard user={{ name: 'Zebra'}}/>
            <UsersSidebarCard user={{ name: 'Zebra'}}/>
            <UsersSidebarCard user={{ name: 'Zebra'}}/>
            <UsersSidebarCard user={{ name: 'Zebra'}}/>
            <UsersSidebarCard user={{ name: 'Zebra'}}/>
            <UsersSidebarCard user={{ name: 'Zebra'}}/>
            <UsersSidebarCard user={{ name: 'Zebra'}}/>
            <UsersSidebarCard user={{ name: 'Zebra'}}/>
            <UsersSidebarCard user={{ name: 'Zebra'}}/>
            <UsersSidebarCard user={{ name: 'Zebra'}}/>
            <UsersSidebarCard user={{ name: 'Zebra'}}/>
            <UsersSidebarCard user={{ name: 'Zebra'}}/>
            <UsersSidebarCard user={{ name: 'Zebra'}}/>
            <UsersSidebarCard user={{ name: 'Zebra'}}/>
            <UsersSidebarCard user={{ name: 'Zebra'}}/>
            <UsersSidebarCard user={{ name: 'Zebra'}}/>
            <UsersSidebarCard user={{ name: 'Zebra'}}/>
            <UsersSidebarCard user={{ name: 'Zebra'}}/>
            <UsersSidebarCard user={{ name: 'Zebra'}}/>
            <UsersSidebarCard user={{ name: 'Zebra'}}/>
            <UsersSidebarCard user={{ name: 'Zebra'}}/>
            <UsersSidebarCard user={{ name: 'Zebra'}}/>
        </div>
    );
};

const UsersSidebarCategoryLabel = ({ name }) => {
    return (
        <div className="category-label ml-4 mt-4">
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

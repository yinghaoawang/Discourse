import UserItem from './user-item/user-item.component';
import './users-sidebar.styles.scss';

const UsersSidebar = ({ users }) => {
    const categories = users.reduce((acc, user) => {
        const { category } = user;
        if (!acc.includes(category)) acc.push(category)
        return acc;
    }, []);

    const offlineKey = 'Offline';

    if (categories.includes(offlineKey)) {
        const offlineIndex = categories.indexOf(offlineKey)
        categories.splice(offlineIndex, 1)
        categories.push(offlineKey);
    }

    return (
        <div className='users-sidebar-container'>
            { categories.map((category, categoryIndex) => {
                const usersInCategory = users.filter(user => user.category === category);
                return (
                    <div key={ categoryIndex } className='category-users-container'>
                        <div className='category-label'>{ `${ category } - ${ usersInCategory.length }` }</div>
                        { usersInCategory.map((user, userIndex) => 
                            <UserItem key={ userIndex } user={ user } />
                        )}
                    </div>
                )
            })}
        </div>
    );
};

export default UsersSidebar;

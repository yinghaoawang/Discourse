import UserItem from './user-item/user-item.component';
import './users-sidebar.styles.scss';

const UsersSidebar = ({ users }) => {
    return (
        <div className='users-sidebar-container'>
            <div className="category-label">Users</div>
            { users.map((user, i) => (
                <UserItem key={i} user={user} />
            ))}
        </div>
    );
};

export default UsersSidebar;

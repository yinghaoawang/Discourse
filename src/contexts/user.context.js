import { createContext, useState } from 'react';

export const UserContext = createContext({
    users: [],
    setUsers: () => null,
    currentUser: null,
    setCurrentUser: () => null,
});

export const UserProvider = ({ children }) => {
    const [users, setUsers] = useState([]);
    const [currentUser, setCurrentUser] = useState(null);
    const value = { users, setUsers, currentUser, setCurrentUser };

    return <UserContext.Provider value={ value }>{ children }</UserContext.Provider>;
}
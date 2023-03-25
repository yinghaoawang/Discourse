import { createContext, useState } from 'react';


export const UserContext = createContext({
    users: [],
    setUsers: () => null,
});

export const UserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const value = { currentUser, setCurrentUser };

    return <UserContext.Provider value={ value }>{ children }</UserContext.Provider>;
}
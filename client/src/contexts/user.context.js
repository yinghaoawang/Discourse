import { createContext, useState } from 'react';
import { useStatePersist } from 'use-state-persist';


export const UserContext = createContext({
    users: [],
    setUsers: () => null,
});

export const UserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useStatePersist('@currentUser');
    const value = { currentUser, setCurrentUser };

    return <UserContext.Provider value={ value }>{ children }</UserContext.Provider>;
}
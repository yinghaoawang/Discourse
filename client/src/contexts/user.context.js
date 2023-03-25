import { createContext, useEffect, useState } from 'react';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from '../util/firebase.util';

export const UserContext = createContext({
    users: [],
    setUsers: () => null,
});

export const UserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const value = { currentUser, setCurrentUser };

    // useEffect(() => {
    //     onAuthStateChanged(auth, (user) => {
    //         if (user) {
    //             // User is signed in, see docs for a list of available properties
    //             // https://firebase.google.com/docs/reference/js/firebase.User
    //             setCurrentUser({
    //                 name: user.uid,
    //                 id: user.uid
    //             })
    //             // ...
    //         } else {
    //             // User is signed out
    //             setCurrentUser(null);            
    //         }
    //         console.log(user);
    //     });
    // }, [])

    return <UserContext.Provider value={ value }>{ children }</UserContext.Provider>;
}
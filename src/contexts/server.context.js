import { createContext, useState } from 'react';

export const ServerContext = createContext({
    serverId: null,
    setServerId: () => null,
});
export const ServerProvider = ({children}) => {
    const [serverId, setServerId] = useState(-999);
    const value = {serverId, setServerId};

    return <ServerContext.Provider value={value}>{children}</ServerContext.Provider>
}
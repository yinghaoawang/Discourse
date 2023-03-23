import { createContext, useState, useEffect } from 'react';

export const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
    const [micInput, setMicInput] = useState(null);
    const value = { micInput, setMicInput };

    useEffect(() => {
        console.log(micInput);
    }, [micInput]);


    return <SettingsContext.Provider value={ value }>{ children }</SettingsContext.Provider>;
}
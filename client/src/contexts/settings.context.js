import { createContext, useState } from 'react';

export const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
    const [currentInputDevice, setCurrentInputDevice] = useState(null);
    const [currentOutputDevice, setCurrentOutputDevice] = useState(null);
    const value = { currentInputDevice, setCurrentInputDevice, currentOutputDevice, setCurrentOutputDevice };

    return <SettingsContext.Provider value={ value }>{ children }</SettingsContext.Provider>;
}

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from './App';
import { ServerProvider } from './contexts/server.context';
import { UserProvider } from './contexts/user.context';
import { SocketProvider } from './contexts/socket.context';
import { SettingsProvider } from './contexts/settings.context';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <ServerProvider>
            <UserProvider>
                <SettingsProvider>
                    <SocketProvider>
                        <App />
                    </SocketProvider>
                </SettingsProvider>
            </UserProvider>
        </ServerProvider>
    </React.StrictMode>
);

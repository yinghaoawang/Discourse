import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { ServerProvider } from './contexts/server.context';
import { UserProvider } from './contexts/user.context';
import { SocketProvider } from './contexts/socket.context';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <ServerProvider>
            <UserProvider>
                <SocketProvider>
                    <App />
                </SocketProvider>
            </UserProvider>
        </ServerProvider>
    </React.StrictMode>
);

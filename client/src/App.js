import { Outlet, createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import Sidebar from './components/shared/sidebar/sidebar.component';
import Server from './components/routes/server/server.component';
import ErrorPage from './components/routes/error/error-page.component';
import Explore from './components/routes/explore/explore.component';
import DirectMessages from './components/routes/direct-messages/direct-messages.component';
import Home from './components/routes/home/home.component';
import { UserContext } from './contexts/user.context';
import { SettingsContext } from './contexts/settings.context';
import { setOutputDevice } from './util/webRTC.util';
import AuthModal from './components/routes/auth/auth-modal.component';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './util/firebase.util';
import { SocketContext } from './contexts/socket.context';

const NavbarWrapper = () => {
	const { currentUser, setCurrentUser } = useContext(UserContext);
	const { connectSocket } = useContext(SocketContext);
	const { currentOutputDevice } = useContext(SettingsContext);
	useEffect(() => {
		
		onAuthStateChanged(auth, (user) => {
            if (user) {
				connectSocket({ loadServers: false, getUser: true });
            } else {
                setCurrentUser(null);
                console.log('user not exist');
            }
        });
    }, []);

	// updates webrtc's output device to match react component's output device
	useEffect(() => {
		setOutputDevice(currentOutputDevice);
	}, [currentOutputDevice]);

	const isAuthModalOpen = currentUser === null;

	return (
		<div className='body-container'>
			<AuthModal isModalOpen={ isAuthModalOpen } />
			<Sidebar />
			<div id='audio-container'></div>
			<Outlet />
		</div>
	);
}

const routes = [{
	path: '',
	element: <NavbarWrapper />,
	errorElement: <ErrorPage />,
	children: [
		{ path: '', element: <Home /> },
		{ path: 'server/:id', element: <Server /> },
		{ path: 'explore/', element: <Explore /> },
		{ path: 'messages/', element: <DirectMessages /> }
	]
}];

const router = createBrowserRouter(routes, {
	basename: process.env.REACT_APP_BASENAME
});

const App = () => {
	return <RouterProvider router={ router } />;
};

export default App;

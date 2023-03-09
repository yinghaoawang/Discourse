import { Outlet, createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import Sidebar from './components/shared/sidebar/sidebar.component';
import Server from './components/routes/server/server.component';
import ErrorPage from './components/routes/error/error-page.component';
import Explore from './components/routes/explore/explore.component';
import DirectMessages from './components/routes/direct-messages/direct-messages.component';
import Home from './components/routes/home/home.component';
import { ServerContext } from './contexts/server.context';
import { UserContext } from './contexts/user.context';
import { SocketContext } from './contexts/socket.context';

const NavbarWrapper = () => {
	return (
		<div className='body-container'>
			<Sidebar />
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
	basename: '/discourse'
});

const App = () => {
	const { servers, setServers } = useContext(ServerContext);
	const { setCurrentUser } = useContext(UserContext);
	const { socket } = useContext(SocketContext);
	
	useEffect(() => {
		while (true) {
			if (process.env.NODE_ENV === 'development') {
				setCurrentUser({ name: 'Test' });
				break;
			}
			
			const username = prompt('What is your name?')?.trim();
			if (username != null && username.length !== 0) {
				setCurrentUser({ name: username });
				break;
			}
		}
	}, [])

	useEffect(() => {
		if (socket == null) return;
		socket.on('servers', (data) => {
			const { servers } = data;
			setServers(servers);
		});
		
		return () => {
			socket.off('servers');
		}
	}, [socket]);

	return <RouterProvider router={ router } />;
};

export default App;

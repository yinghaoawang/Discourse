import { Outlet, createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useContext, useEffect } from 'react';
import Sidebar from './components/shared/sidebar/sidebar.component';
import Server from './components/routes/server/server.component';
import ErrorPage from './components/routes/error/error-page.component';
import Explore from './components/routes/explore/explore.component';
import DirectMessages from './components/routes/direct-messages/direct-messages.component';
import Home from './components/routes/home/home.component';
import { serverData, userData } from './db/data';
import { ServerContext } from './contexts/server.context';
import { UserContext } from './contexts/user.context';

const Navigation = () => {
	return (
		<div className='flex'>
			<Sidebar />
			<Outlet />
		</div>
	);
}

const routes = [{
	path: '',
	element: <Navigation />,
	errorElement: <ErrorPage />,
	children: [
		{ path: '', element: <Home /> },
		{ path: 'server/:serverId', element: <Server /> },
		{ path: 'explore/', element: <Explore /> },
		{ path: 'messages/', element: <DirectMessages /> }
	]
}];

const router = createBrowserRouter(routes, {
	basename: '/discourse'
});

const App = () => {
	const { setServers } = useContext(ServerContext);
	const { setUsers } = useContext(UserContext);

	useEffect(() => {
		const loadServers = async () => {
			setServers(serverData);
		}

		const loadUsers = async () => {
			setUsers(userData);
		}

		loadServers().catch(console.error);
		loadUsers().catch(console.error);
	}, []);

	return <RouterProvider router={ router } />;
};

export default App;

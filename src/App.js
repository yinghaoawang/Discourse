import { Outlet, createBrowserRouter, RouterProvider } from 'react-router-dom';
import { useEffect } from 'react';
import Sidebar from './components/shared/sidebar.component';
import Server from './components/routes/server/server.component';
import ErrorPage from './components/routes/error/error-page.component';
import Explore from './components/routes/explore/explore.component';
import DirectMessages from './components/routes/direct-messages/direct-messages.component';
import Home from './components/routes/home/home.component';

const routes = [
	{
		path: '',
		element: <NavbarWrapper />,
		errorElement: <ErrorPage />,
		children: [
			{
				path: '',
				element: <Home />
			},
			{
				path: 'server/:serverId',
				element: <Server />
			},
			{
				path: 'explore/',
				element: <Explore />
			},
			{
				path: 'messages/',
				element: <DirectMessages />
			}
		]
	}
];

const router = createBrowserRouter(routes, {
	basename: '/discourse'
});

function NavbarWrapper() {
	return (
		<div className='flex'>
			<Sidebar />
			<Outlet />
		</div>
	);
}

const App = () => {
	useEffect(() => {
		initializeEvents();
	}, []);

	return <RouterProvider router={router} />;
};

function initializeEvents() {}

export default App;

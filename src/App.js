import { Outlet, createBrowserRouter, RouterProvider } from "react-router-dom";    
import { useEffect, useState } from 'react';
import { ServerContext } from "./contexts/ServerContext";
import Sidebar from './components/common/Sidebar';
import Server from './components/Server/Server';
import ErrorPage from "./components/common/ErrorPage";
import ExploreServers from "./components/ExploreServers/ExploreServers";
import DirectMessages from "./components/DirectMessages/DirectMessages";
import Home from "./components/Home/Home";

const routes = [{
  path: "",
  element: <NavbarWrapper />,
  errorElement: <ErrorPage />,
  children: [
    {
      path: "",
      element: <Home />
    },
    {
      path: "server/:serverId",
      element: <Server />,
    },
    {
      path: "explore/",
      element: <ExploreServers />
    },
    {
      path: "messages/",
      element: <DirectMessages />
    }
  ]
}];

const router = createBrowserRouter(routes, {
  basename: "/discourse",
});

function NavbarWrapper() {
  const [serverId, setServerId] = useState(-999);

  return (
    <ServerContext.Provider value={{serverId, setServerId}}>
      <div className="flex">
            <Sidebar />
            <Outlet />
      </div>
    </ServerContext.Provider>
    
  );
}

const App = () => {
  useEffect(() => {
    initializeEvents();
  }, []);

  return (
    <RouterProvider router={router} />
  );
}

function initializeEvents() {
  
}

export default App;
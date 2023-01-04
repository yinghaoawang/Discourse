import { Outlet, createBrowserRouter, RouterProvider } from "react-router-dom";    
import { useEffect, useState } from 'react';
import './App.css';
import { ServerContext } from "./contexts/ServerContext";
import Sidebar from './components/common/Sidebar';
import Server from './components/Server/Server';
import ErrorPage from "./components/common/ErrorPage";
import ExploreServers from "./components/ExploreServers/ExploreServers";
import DirectMessages from "./components/DirectMessages/DirectMessages";
import Home from "./components/Home/Home";

const router = createBrowserRouter([{
  path: "/",
  element: <NavbarWrapper />,
  errorElement: <ErrorPage />,
  children: [
    {
      path: "/",
      element: <Home />
    },
    {
      path: "/server/:serverId",
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
}]);

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
  const documentHeight = () => {
    const doc = document.documentElement;
    doc.style.setProperty('--doc-height', `${Math.max(doc.clientHeight, window.innerHeight)}px`);
   }
   window.addEventListener('onload', documentHeight);
   window.addEventListener('resize', documentHeight);
   window.addEventListener('orientationchange', documentHeight);
   documentHeight();
}

export default App;
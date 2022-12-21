import { Outlet, createBrowserRouter, RouterProvider } from "react-router-dom";    
import { useEffect } from 'react';
import './App.css';
import Sidebar from './components/common/Sidebar';
import Server from './components/Server/Server';
import ErrorPage from "./components/common/ErrorPage";
import ExploreServers from "./components/ExploreServers/ExploreServers";
import DirectMessages from "./components/DirectMessages/DirectMessages";

const generateRandomName = nameLength => {
  let res = '';
  for(let i = 0; i < nameLength; i++){
      const random = Math.floor(Math.random() * 26);
      res += String.fromCharCode('a'.charCodeAt(0) + random);
  };
  return res;
};

const router = createBrowserRouter([{
  path: "/",
  element: <NavbarWrapper />,
  errorElement: <ErrorPage />,
  children: [
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
  return (
    <div className="flex">
      <Sidebar />
      <Outlet />
    </div>
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
    const doc = document.documentElement
    doc.style.setProperty('--doc-height', `${window.innerHeight}px`);
   }
   window.addEventListener('onload', documentHeight);
   window.addEventListener('resize', documentHeight);
   documentHeight();
}

export default App;
export { generateRandomName };

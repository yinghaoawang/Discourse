import logo from './logo.svg';
import { useEffect } from 'react';
import './App.css';
import Sidebar from './components/common/Sidebar';
import Server from './components/Server/Server';

const App = () => {
  useEffect(() => {
    initializeEvents();
  }, []);

  return (
    <div className="flex">
      <Sidebar />
      <Server />
    </div>
  );
}

function initializeEvents() {
  const documentHeight = () => {
    const doc = document.documentElement
    doc.style.setProperty('--doc-height', `${window.innerHeight}px`);
   }
   window.addEventListener('resize', documentHeight);
   documentHeight();
}

export default App;

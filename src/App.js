import logo from './logo.svg';
import './App.css';
import Sidebar from './components/common/Sidebar';
import Server from './components/Server/Server';

const App = () => {
  return (
    <div className="flex">
      <Sidebar />
      <Server />
    </div>
  );
}

export default App;

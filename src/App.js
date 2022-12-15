import logo from './logo.svg';
import './App.css';
import Sidebar from './components/common/Sidebar';
import Server from './components/Server/Server';

const App = () => {
  return (
    <div className="flex">
      <Sidebar />
      <div className="content">
        <Server />
      </div>
    </div>
  );
}

export default App;

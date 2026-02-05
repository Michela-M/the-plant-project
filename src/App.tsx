import Dashboard from './pages/Dashboard';
import Encyclopedia from './pages/Encyclopedia';
import MyCollection from './pages/MyCollection';
import Login from './pages/Login';
import Header from './Header';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignUp from './pages/SignUp';

function App() {
  return (
    <div className="bg-stone-100 min-h-screen">
      <BrowserRouter>
        <Header />

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/Encyclopedia" element={<Encyclopedia />} />
          <Route path="/Collection" element={<MyCollection />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/SignUp" element={<SignUp />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

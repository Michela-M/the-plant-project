import Dashboard from './pages/Dashboard';
import Encyclopedia from './pages/Encyclopedia';
import MyCollection from './pages/MyCollection';
import Header from './Header';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <div className="bg-stone-100 min-h-screen">
      <BrowserRouter>
        <Header />

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/Encyclopedia" element={<Encyclopedia />} />
          <Route path="/Collection" element={<MyCollection />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

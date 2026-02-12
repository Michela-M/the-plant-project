import Dashboard from './pages/Dashboard';
import Encyclopedia from './pages/Encyclopedia';
import MyCollection from './pages/MyCollection';
import Login from './pages/Login';
import AddPlant from './pages/AddPlant';
import Header from './Header';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignUp from './pages/SignUp';
import PlantDetails from './pages/PlantDetails';
import EditPlant from './pages/EditPlant';

function App() {
  return (
    <div className="bg-stone-100 min-h-screen">
      <BrowserRouter>
        <Header />

        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/encyclopedia" element={<Encyclopedia />} />
          <Route path="/collection" element={<MyCollection />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/add-plant" element={<AddPlant />} />
          <Route path="/plants/:id" element={<PlantDetails />} />
          <Route path="/plants/:id/edit" element={<EditPlant />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;

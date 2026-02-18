import Dashboard from './pages/Dashboard';
import Encyclopedia from './features/encyclopedia/pages/Encyclopedia';
import MyCollection from './features/collection/pages/MyCollection';
import Login from './pages/Login';
import AddPlant from './features/collection/pages/AddPlant';
import Navigation from './Navigation';
import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import SignUp from './pages/SignUp';
import PlantDetails from './features/collection/pages/PlantDetails';
import EditPlant from './features/collection/pages/EditPlant';
import { ToastProvider } from '@context/toast/ToastContext';

function App() {
  return (
    <ToastProvider>
      <div className="bg-stone-100 min-h-screen">
        <BrowserRouter>
          <Navigation />

          <Routes>
            <Route path="/" element={<Encyclopedia />} />
            <Route path="/encyclopedia" element={<Encyclopedia />} />
            <Route path="/collection" element={<MyCollection />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/add-plant" element={<AddPlant />} />
            <Route path="/plants/:id" element={<PlantDetails />} />
            <Route path="/plants/:id/edit" element={<EditPlant />} />
          </Routes>
        </BrowserRouter>
      </div>
    </ToastProvider>
  );
}

export default App;

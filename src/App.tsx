import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';

import { AuthProvider } from '@context/auth/AuthContext';
import AddPlant from '@features/collection/pages/AddPlant';
import EditPlant from '@features/collection/pages/EditPlant';
import Dashboard from '@features/dashboard/pages/Dashboard';
import Encyclopedia from '@features/encyclopedia/pages/Encyclopedia';

import { ToastProvider } from '@context/toast/ToastContext';
import ProtectedRoute from '@features/auth/components/ProtectedRoute';
import Login from '@features/auth/pages/Login';
import SignUp from '@features/auth/pages/SignUp';
import MyCollection from '@features/collection/pages/MyCollection';
import PlantDetails from '@features/collection/pages/PlantDetails';
import SpeciesDetails from '@features/encyclopedia/pages/SpeciesDetails';
import Glossary from '@features/glossary/pages/Glossary';
import Navigation from './navigation/Navigation';

function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <div className="bg-stone-100 min-h-screen">
          <BrowserRouter>
            <Navigation />

            <Routes>
              <Route path="/" element={<Encyclopedia />} />
              <Route path="/encyclopedia" element={<Encyclopedia />} />
              <Route path="/species/:id" element={<SpeciesDetails />} />
              <Route
                path="/collection"
                element={
                  <ProtectedRoute>
                    <MyCollection />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<SignUp />} />
              <Route
                path="/add-plant"
                element={
                  <ProtectedRoute>
                    <AddPlant />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/plants/:id"
                element={
                  <ProtectedRoute>
                    <PlantDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/plants/:id/edit"
                element={
                  <ProtectedRoute>
                    <EditPlant />
                  </ProtectedRoute>
                }
              />
              <Route path="/glossary" element={<Glossary />} />
            </Routes>
          </BrowserRouter>
        </div>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;

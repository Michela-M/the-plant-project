import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import AddPlant from '@features/collection/pages/AddPlant';
import { AuthProvider } from '@context/auth/AuthContext';
import Dashboard from '@features/dashboard/Dashboard';
import EditPlant from '@features/collection/pages/EditPlant';
import Encyclopedia from '@features/encyclopedia/pages/Encyclopedia';

import Login from '@features/auth/pages/Login';
import MyCollection from '@features/collection/pages/MyCollection';
import Navigation from './navigation/Navigation';
import PlantDetails from '@features/collection/pages/PlantDetails';
import ProtectedRoute from '@features/auth/components/ProtectedRoute';
import SignUp from '@features/auth/pages/SignUp';
import { ToastProvider } from '@context/toast/ToastContext';

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
            </Routes>
          </BrowserRouter>
        </div>
      </AuthProvider>
    </ToastProvider>
  );
}

export default App;

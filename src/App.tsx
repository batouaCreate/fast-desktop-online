import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Dashboard from './pages/Dashboard';
import Departs from './pages/Departs';
import Borderaux from './pages/Borderaux';
import Colis from './pages/Colis';
import Reception from './pages/Reception';
import Bagages from './pages/Bagages';
import Destinations from './pages/Destinations';
import Settings from './pages/Settings';
import Chauffeurs from './pages/Chauffeurs';
import Convoyeurs from './pages/Convoyeurs';
import Cars from './pages/Cars';
import "./App.css";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <ToastProvider>
          <Router>
            <Routes>
            {/* Routes publiques */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />

            {/* Routes protégées */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/departs"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Departs />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/destinations"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Destinations />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/colis"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Colis />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/reception"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Reception />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/borderaux"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Borderaux />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/bagages"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Bagages />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/chauffeurs"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Chauffeurs />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/convoyeurs"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Convoyeurs />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/cars"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Cars />
                  </Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <Layout>
                    <Settings />
                  </Layout>
                </ProtectedRoute>
              }
            />

            {/* Redirection par défaut */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Router>
        </ToastProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;

// src/App.js
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import LandingPage from './pages/Landing';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProjectDashboard from './pages/ProjectDashboard';
import Database from './pages/Database';
import PrivacyPolicy from './pages/PrivacyPolicy';
import Views from './pages/Views';
import URLs from './pages/URLS';
import Settings from './pages/Settings';
import ComingSoon from './pages/ComingSoon';
import Publish from './pages/Publish';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<LandingPage />} />
          <Route path='/register' element={<Signup />} />
          <Route path='/login' element={<Login />} />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/publish" 
            element={
              <ProtectedRoute>
                <Publish />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/project/:projectId" 
            element={
              <ProtectedRoute>
                <ProjectDashboard />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/project/:projectId/database" 
            element={
              <ProtectedRoute>
                <Database />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/project/:projectId/views" 
            element={
              <ProtectedRoute>
                <Views />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/project/:projectId/urls" 
            element={
              <ProtectedRoute>
                <URLs />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/project/:projectId/settings" 
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/project/:projectId/permissions" 
            element={
              <ProtectedRoute>
                <ComingSoon />
              </ProtectedRoute>
            } 
          />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
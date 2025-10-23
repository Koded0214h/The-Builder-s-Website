import { BrowserRouter, Routes, Route} from 'react-router-dom';
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
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/register' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/publish" element={<Publish />} />
        <Route path="/project/:projectId" element={<ProjectDashboard />} />
        <Route path="/project/:projectId/database" element={<Database />} />
        <Route path="/project/:projectId/views" element={<Views />} />
        <Route path="/project/:projectId/urls" element={<URLs />} />
        <Route path="/project/:projectId/settings" element={<Settings />} />
        <Route path="/project/:projectId/permissions" element={<ComingSoon />} />
        <Route path="/privacy-policy" element={<PrivacyPolicy />} />

      </Routes>
    </BrowserRouter>
  )
}

export default App;
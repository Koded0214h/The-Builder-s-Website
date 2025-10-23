import { BrowserRouter, Routes, Route} from 'react-router-dom';
import LandingPage from './pages/Landing';
import Signup from './pages/Signup';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProjectDashboard from './pages/ProjectDashboard';
import Database from './pages/Database';

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<LandingPage />} />
        <Route path='/register' element={<Signup />} />
        <Route path='/login' element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/project/:projectId" element={<ProjectDashboard />} />
        <Route path="/project/:projectId/database" element={<Database />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App;
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import Login from './pages/Login.jsx'
import SignUpForm from './pages/Signup.jsx'
import Dashboard from './pages/Dashboard.jsx'
import AddPassword from './pages/AddPassword.jsx'
import GithubScan from './pages/GithubScan.jsx'
import PrivateRoute from './components/PrivateRoute.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUpForm />} />
        {/* follow this format for new routes to ensure we have protected access */}
        <Route path="/githubscan" element={<PrivateRoute><GithubScan /></PrivateRoute>} />
        <Route path="/addpassword" element={<PrivateRoute><AddPassword /></PrivateRoute>} />
        <Route path='/dashboard' element={<PrivateRoute><Dashboard/></PrivateRoute>}/>
      </Routes>
    </Router>
  </StrictMode>,
)

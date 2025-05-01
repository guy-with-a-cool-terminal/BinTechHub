import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom' // Import Router and Routes
import './index.css'
import App from './App.jsx'
import Login from './pages/Login.jsx'
import SignUpForm from './pages/Signup.jsx'
import Dashboard from './pages/Dashboard.jsx'
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUpForm />} />
      </Routes>
    </Router>
  </StrictMode>,
)

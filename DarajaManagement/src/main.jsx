import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import App from './App.jsx'
import Login from './pages/Login.jsx'
import SignUp from './pages/Signup.jsx'
import Credentials from './pages/Credentials.jsx'
import StkPush from './pages/StkPush.jsx'
import Dashboard from './pages/Dashboard.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/signup" element={<SignUp/>} />
        <Route path="/credentials" element={<Credentials/>} />
        <Route path="/stkpush" element={<StkPush/>} />
        <Route path="/dashboard" element={<Dashboard/>} />
      </Routes>
    </Router>
  </StrictMode>,
)

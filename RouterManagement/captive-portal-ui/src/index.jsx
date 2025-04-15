import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import CaptivePortal from './pages/CaptivePortal';
import PaymentSuccess from './pages/PaymentSuccess';
import NotFound from './pages/NotFound';
import './index.css';
import AuthForm from './pages/AuthForm';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<CaptivePortal />} />
          <Route path="success" element={<PaymentSuccess />} />
          <Route path="login" element={<AuthForm />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

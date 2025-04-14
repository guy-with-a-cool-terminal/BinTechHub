import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import CaptivePortal from './pages/CaptivePortal';
import PaymentSuccess from './pages/PaymentSuccess';
import NotFound from './pages/NotFound';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CaptivePortal />} />
        <Route path="/success" element={<PaymentSuccess />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

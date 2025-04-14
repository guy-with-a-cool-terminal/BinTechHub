import React from 'react';
import { Outlet } from 'react-router-dom';  // <== Key part!

const App = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <header>
        {/* Header Content */}
      </header>
      <main>
        <Outlet />  {/* This renders the nested page content like CaptivePortal, PaymentSuccess */}
      </main>
      <footer>
        {/* Footer Content */}
        <div className="text-4xl font-bold text-green-600">
  Tailwind is active
</div>

      </footer>
    </div>
  );
};

export default App;

import React, { useEffect, useState } from 'react';
import { Network } from 'lucide-react';
import { NavLink } from 'react-router-dom';

function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Common classes for nav links (non-active)
  const baseLinkClasses = 'px-3 py-1 rounded-md transition-colors text-gray-700 hover:text-indigo-600';

  return (
    <header
      className={`w-full sticky top-0 z-50 backdrop-blur bg-white/80 transition-shadow duration-300 ${
        scrolled ? 'shadow-md' : 'shadow-sm'
      } p-4 md:p-6 flex flex-col md:flex-row items-center justify-between`}
    >
      {/* Left: App Title */}
      <div className="flex items-center text-indigo-600 text-lg md:text-xl font-semibold mb-4 md:mb-0">
        <Network className="w-6 h-6 mr-2" />
        Daraja Credentials Manager
      </div>

      {/* Right: Navigation */}
      <nav className="flex flex-wrap justify-center gap-4 text-sm md:text-base">
        <NavLink
          to="/dashboard"
          className={({ isActive }) =>
            isActive
              ? 'text-indigo-600 font-medium border-b-2 border-indigo-600 px-3 py-1 rounded-md'
              : baseLinkClasses
          }
        >
          Dashboard
        </NavLink>
        <NavLink
          to="/credentials"
          className={({ isActive }) =>
            isActive
              ? 'text-indigo-600 font-medium border-b-2 border-indigo-600 px-3 py-1 rounded-md'
              : baseLinkClasses
          }
        >
          Credentials
        </NavLink>
        <NavLink
          to="/stkpush"
          className={({ isActive }) =>
            isActive
              ? 'text-indigo-600 font-medium border-b-2 border-indigo-600 px-3 py-1 rounded-md'
              : baseLinkClasses
          }
        >
          STK Push
        </NavLink>
      </nav>
    </header>
  );
}

export default Header;

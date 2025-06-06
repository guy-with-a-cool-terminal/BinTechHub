import React, { useState } from 'react';
import { Network, Menu, X } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';
import { Link as ScrollLink } from 'react-scroll';

function LandingPageHeader() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navLinkClass =
    'cursor-pointer text-gray-700 hover:text-indigo-600 transition px-3 py-1 rounded-md';

  return (
    <header className="w-full bg-white shadow-sm px-4 md:px-6 py-4 flex items-center justify-between z-10 relative">
      {/* Logo */}
      <div className="flex items-center text-indigo-600 text-lg md:text-xl font-semibold">
        <Network className="w-6 h-6 mr-2" />
        Daraja Credentials Manager
      </div>

      {/* Desktop Navigation */}
      <nav className="hidden md:flex items-center gap-4 text-sm md:text-base">
        <ScrollLink
          to="about"
          smooth={true}
          duration={500}
          offset={-70}
          className={navLinkClass}
        >
          About
        </ScrollLink>
        <ScrollLink
          to="features"
          smooth={true}
          duration={500}
          offset={-70}
          className={navLinkClass}
        >
          Features
        </ScrollLink>
        <ScrollLink
          to="contact"
          smooth={true}
          duration={500}
          offset={-70}
          className={navLinkClass}
        >
          Contact
        </ScrollLink>

        <RouterLink
          to="/login"
          className="ml-4 bg-indigo-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-indigo-700 transition"
        >
          Login
        </RouterLink>
      </nav>

      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="md:hidden p-2 text-gray-700"
        aria-label="Toggle Menu"
      >
        {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Dropdown */}
      {isMobileMenuOpen && (
        <div className="absolute top-full left-0 w-full bg-white shadow-md py-4 px-4 flex flex-col gap-3 md:hidden z-50">
          <ScrollLink
            to="about"
            smooth={true}
            duration={500}
            offset={-70}
            className="text-gray-700 hover:text-indigo-600"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            About
          </ScrollLink>
          <ScrollLink
            to="features"
            smooth={true}
            duration={500}
            offset={-70}
            className="text-gray-700 hover:text-indigo-600"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Features
          </ScrollLink>
          <ScrollLink
            to="contact"
            smooth={true}
            duration={500}
            offset={-70}
            className="text-gray-700 hover:text-indigo-600"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            Contact
          </ScrollLink>
          <RouterLink
            to="/login"
            onClick={() => setIsMobileMenuOpen(false)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-md font-semibold text-center"
          >
            Login
          </RouterLink>
        </div>
      )}
    </header>
  );
}

export default LandingPageHeader;

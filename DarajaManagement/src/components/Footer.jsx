import React from 'react';
import { Network } from 'lucide-react';

function Footer(){
    const currentYear = new Date().getFullYear();
    return(
         <footer className="w-full px-4 py-6 text-sm text-gray-600">
                <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
                  <div className="flex items-center text-indigo-600 font-semibold">
                    <Network className="w-4 h-4 mr-1" />
                    Daraja Credentials Manager
                  </div>
                  <div className="flex items-center gap-4">
                    <select className="bg-transparent text-gray-700 rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500">
                      <option>English</option>
                      <option>Spanish</option>
                      <option>French</option>
                    </select>
                    <span>&copy; {currentYear} Daraja Credentials Manager.</span>
                  </div>
                </div>
              </footer>
    )
}
export default Footer;
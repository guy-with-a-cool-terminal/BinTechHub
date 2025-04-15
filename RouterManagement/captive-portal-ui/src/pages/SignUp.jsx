import { EnvelopeIcon, LockClosedIcon, UserIcon } from '@heroicons/react/20/solid'; // Import icons
import { useNavigate } from 'react-router-dom'; // import navigate

export default function SignUpForm() {
  const navigate = useNavigate()

  const handleSwitchToLogin = () =>{
    navigate('/login');
}

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      {/* Blurred Background Images (Adjust paths if needed) */}
      <div
        className="fixed top-0 left-0 w-1/3 h-full bg-cover bg-center blur-lg"
        style={{ backgroundImage: 'url(/images/blurred-left.jpg)' }}
      ></div>
      <div
        className="fixed top-0 right-0 w-1/3 h-full bg-cover bg-center blur-lg"
        style={{ backgroundImage: 'url(/images/blurred-right.jpg)' }}
      ></div>

      <div className="relative bg-white p-8 rounded-xl shadow-md w-full max-w-md text-center z-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Create Account</h2>
        <p className="text-sm text-gray-600 mb-6">Sign up to access the network</p>
        <form className="space-y-4">
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <UserIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                placeholder="Full Name"
                className="w-full pl-10 pr-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <EnvelopeIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="email"
                placeholder="Your Email address"
                className="w-full pl-10 pr-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockClosedIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full pl-10 pr-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <LockClosedIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="password"
                placeholder="Confirm your password"
                className="w-full pl-10 pr-4 py-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 hover:bg-green-600 text-white py-3 rounded-full font-semibold focus:outline-none focus:ring-2 focus:ring-green-500 shadow-md transition duration-200"
          >
            Sign Up
          </button>
        </form>
        <p className="mt-6 text-sm text-gray-600">
          Already have an account?{" "}
          <a href="#" onClick={handleSwitchToLogin} className="text-blue-500 hover:underline">
            Log In
          </a>
        </p>
      </div>
    </div>
  );
}
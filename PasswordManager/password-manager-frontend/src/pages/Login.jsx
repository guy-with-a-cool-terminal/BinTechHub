import { EnvelopeIcon, LockClosedIcon } from '@heroicons/react/20/solid'; // Import icons
import { useNavigate } from 'react-router-dom'; // import navigate

export default function Login() {
  const navigate = useNavigate()

  const handleSwitchToSignup = () =>{
    navigate('/signup');
}

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      {/* Blurred Background Images (You might need to adjust the image paths) */}
      <div
        className="fixed top-0 left-0 w-1/3 h-full bg-cover bg-center blur-lg"
        style={{ backgroundImage: 'url(/images/blurred-left.jpg)' }}
      ></div>
      <div
        className="fixed top-0 right-0 w-1/3 h-full bg-cover bg-center blur-lg"
        style={{ backgroundImage: 'url(/images/blurred-right.jpg)' }}
      ></div>

      <div className="relative bg-white p-8 rounded-xl shadow-md w-full max-w-md text-center z-10">
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Access Account</h2>
        <p className="text-sm text-gray-600 mb-6">Log in to access the network</p>
        <form className="space-y-4">
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
            <div className="text-right mt-1">
              <a href="#" className="text-sm text-blue-500 hover:underline">
                Forgot password?
              </a>
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-md transition duration-200"
          >
            Log In
          </button>
        </form>
        <p className="mt-6 text-sm text-gray-600">
          Need to create an account?{" "}
          <a href="signup" onClick={handleSwitchToSignup} className="text-blue-500 hover:underline">
            Sign Up
          </a>
        </p>
      </div>
    </div>
  );
}
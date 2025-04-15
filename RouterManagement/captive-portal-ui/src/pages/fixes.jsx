export default function PaymentSuccess() {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-4 py-12 text-center text-gray-800">
        <div className="max-w-2xl w-full">
          <h1 className="text-2xl md:text-3xl font-bold mb-6">
            SUCCESS! YOUR PAYMENT HAS BEEN COMPLETED
          </h1>
  
          <ol className="text-left text-base md:text-lg mb-10 space-y-3 px-4">
            <li>
              1. Please click on 'GET YOUR CAPTIVE PORTAL ACCESS' to view your
              payment details and get your Wi-Fi access.
            </li>
            <li>
              2. Enjoy your unrestricted access to the internet!
            </li>
          </ol>
  
          <div className="text-center">
            <h2 className="text-lg font-semibold mb-4">Quick Access Links</h2>
            <div className="flex flex-col md:flex-row justify-center items-center gap-6 text-blue-600 underline">
              <a href="#">FAQs</a>
              <a href="#">Need support? Contact us</a>
              <a href="#">Go to Captive Portal Directly</a>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
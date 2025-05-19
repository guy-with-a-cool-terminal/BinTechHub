// Base URL for your backend API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://bintechhubapi.onrender.com/api/mpesa/";

/**
 * Utility function to perform fetch with a timeout.
 * Helps prevent hanging requests when backend is slow or unreachable.
 *
 * @param {string} resource - The URL to fetch
 * @param {object} options - Fetch options (method, headers, body, etc.)
 * @param {number} timeout - Timeout in milliseconds (default is 10 seconds)
 * @returns {Promise<Response>} - The fetch response
 */
function fetchWithTimeout(resource, options = {}, timeout = 10000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout); // Cancel request after timeout

  return fetch(resource, {
    ...options,
    signal: controller.signal, // Connect the controller to the fetch
  }).finally(() => clearTimeout(id)); // Clear timeout when done
}

/**
 * Send an STK Push request to the backend to initiate payment via M-Pesa
 *
 * @param {string} phoneNumber - The user's phone number in MSISDN format (e.g., 254712345678)
 * @param {number} amount - The amount to charge the user
 * @returns {Promise<object>} - JSON response from the backend
 */
export async function sendSTKPush(phoneNumber, amount) {
  const endpoint = `${API_BASE_URL}stkpush/`;

  const payload = {
    phone_number: phoneNumber,
    amount: amount,
  };

  try {
    const response = await fetchWithTimeout(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      // If server responded with an error status
      throw new Error(data?.error || "STK push failed. Please try again.");
    }

    // Return the backend's success response
    return data;
  } catch (error) {
    // Log and propagate error for frontend handling
    console.error("STK push error:", error);
    throw error;
  }
}

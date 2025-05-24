// Base URL for your backend API
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://bintechhubapi.onrender.com/api/mpesa/";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api/mpesa/";


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

export async function sendSTKPush(phoneNumber, amount,serviceType = 'captive_portal') {
  const endpoint = `${API_BASE_URL}stkpush/`;

  const payload = {
    phone_number: phoneNumber,
    amount: amount,
    service_type: serviceType,
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

export async function initiateAndConfirmPayment(phoneNumber, amount, serviceType = "captive_portal", onSuccess, onFailure) {
  try {
    const stkResponse = await sendSTKPush(phoneNumber, amount, serviceType);
    const checkoutId = stkResponse.CheckoutRequestID;

    if (!checkoutId) throw new Error("Missing CheckoutRequestID in response.");

    // Poll for payment status
    const pollInterval = setInterval(async () => {
      try {
        const statusRes = await fetch(`${API_BASE_URL}status/?checkout_id=${checkoutId}`);
        const statusData = await statusRes.json();

        if (statusData.status === "Success") {
          clearInterval(pollInterval);
          onSuccess?.();
        } else if (statusData.status === "Failed") {
          clearInterval(pollInterval);
          onFailure?.("Payment failed.");
        }
      } catch (pollErr) {
        console.warn("Polling error:", pollErr);
      }
    }, 3000);

    return stkResponse;
  } catch (err) {
    console.error("Payment initiation failed:", err);
    onFailure?.(err.message || "Payment failed.");
    throw err;
  }
}

// Base URL for your backend API
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "https://bintechhubapi.onrender.com/api/mpesa/";
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api/mpesa/";


function fetchWithTimeout(resource, options = {}, timeout = 10000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);

  return fetch(resource, {
    ...options,
    signal: controller.signal,
  }).finally(() => clearTimeout(id));
}

export async function sendSTKPush(phoneNumber, amount, serviceType = 'captive_portal') {
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
      // Log detailed error, but return a generic one
      console.error("STK Push backend error:", data);
      throw new Error("Something went wrong during payment initiation. Please try again.");
    }

    return data;
  } catch (error) {
    console.error("STK push network/client error:", error);
    throw new Error("Failed to reach payment service. Check your network and try again.");
  }
}

export async function initiateAndConfirmPayment(phoneNumber, amount, serviceType = "captive_portal", onSuccess, onFailure) {
  try {
    const stkResponse = await sendSTKPush(phoneNumber, amount, serviceType);
    const checkoutId = stkResponse.CheckoutRequestID;

    if (!checkoutId) throw new Error("Unable to initiate payment at the moment.");

    let attempts = 0;
    const maxAttempts = 10;
    const intervalMs = 3000;

    const pollInterval = setInterval(async () => {
      attempts += 1;

      try {
        const statusRes = await fetch(`${API_BASE_URL}status/?checkout_id=${checkoutId}`);
        const statusData = await statusRes.json();

        if (statusData.status === "Success") {
          clearInterval(pollInterval);
          onSuccess?.();
        } else if (statusData.status === "Failed") {
          clearInterval(pollInterval);
          onFailure?.("Payment was not successful.");
        } else if (attempts >= maxAttempts) {
          clearInterval(pollInterval);
          onFailure?.("Payment verification timed out. Please check again later.");
        }
      } catch (pollErr) {
        console.warn("Polling error:", pollErr);
        // Optional: Fail fast on polling error
        if (attempts >= maxAttempts) {
          clearInterval(pollInterval);
          onFailure?.("Unable to verify payment status. Try again later.");
        }
      }
    }, intervalMs);

    return stkResponse;
  } catch (err) {
    console.error("Payment initiation failed:", err);
    onFailure?.(err.message || "Payment could not be started.");
    throw err;
  }
}

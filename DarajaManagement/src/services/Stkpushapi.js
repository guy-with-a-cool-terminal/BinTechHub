import http from "./http";

export async function sendSTKPush(phoneNumber,amount,serviceType='captive_portal') {
    try {
        const response = await http.post('/mpesa/stkpush/',{
            phone_number: phoneNumber,
            amount,
            service_type: serviceType,
        });
        return response.data;
    } catch (error) {
        console.error("STK Push error:", error.response?.data || error.message);
        throw new Error("Failed to initiate payment. Please try again.");
    }
}

// payment initiation
export async function initiateAndConfirmPayment(phoneNumber,amount,serviceType='captive_portal',onSuccess,onFailure) {
    try {
        const stkResponse = await sendSTKPush(phoneNumber, amount, serviceType);
        const checkoutId = stkResponse.CheckoutRequestID;
        if (!checkoutId) throw new Error("Unable to initiate payment:-(");

        let attempts = 0;
        const maxAttempts = 10;
        const intervalMs = 3000;

        const pollInterval = setInterval(async () => {
            attempts++;
            try{
            const statusResponse = await http.get(`/mpesa/status/?checkout_id=${checkoutId}`);
            const status = statusResponse.data.status;

            if (status === "Success"){
                clearInterval(pollInterval);
                onSuccess?.();
            }else if (status === "Failed"){
                clearInterval(pollInterval);
                onFailure?.("Payment failed");
            }else if (attempts >= maxAttempts){
                clearInterval(pollInterval);
                onFailure?.("Payment verification timed out.")
            }     
    } catch (pollError) {
        console.warn("Polling error:", pollError);
        if (attempts >= maxAttempts) {
          clearInterval(pollInterval);
          onFailure?.("Could not verify payment status.");
        }
    }
}, intervalMs);
return stkResponse;

}catch(err){
    console.error("Payment process failed:", err);
    onFailure?.(err.message || "Payment initiation failed.");
    throw err;
  }
}


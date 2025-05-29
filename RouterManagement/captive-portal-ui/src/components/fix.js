const handlePayment = async () => {
  if (!method) return;

  if (method === "Mpesa") {
    if (!phoneNumber || !/^\d{10,12}$/.test(phoneNumber)) {
      setToast("Please enter a valid phone number.");
      return;
    }

    const formattedPhone = phoneNumber.startsWith("254")
      ? phoneNumber
      : phoneNumber.replace(/^0/, "254");

    try {
      setLoading(true); // Show loading spinner
      setToast("STK Push sent! Check your phone.");

      await initiateAndConfirmPayment(
        formattedPhone,
        plan.price,
        "captive_portal",
        () => {
          setToast("Payment confirmed!");
          onClose();
          navigate("/success"); // ✅ Only navigate after success
        },
        (error) => {
          setToast(error || "Payment failed.");
          setLoading(false); // Stop loading on failure
        }
      );
    } catch (error) {
      setToast(`Payment failed: ${error.message}`);
      setLoading(false); // Stop loading on catch
    }
  } else {
    setToast(`Proceeding to pay Sh ${plan.price} with ${method}`);
    onClose();
  }
};

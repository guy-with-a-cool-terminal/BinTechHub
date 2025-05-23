

### ✅ **Already Done (Backend)**

1. **STK Push API (`STKPushAPIView`)**

   * Accepts `phone_number` and `amount`.
   * Initiates STK push.
   * ✅ *You already implemented this.*

2. **Callback Handling (`mpesa_callback`)**

   * Receives M-Pesa response.
   * Extracts payment data.
   * Validates & saves to the `Payment` model.
   * ✅ *This is already done.*

---

### 🚧 **To Do (Backend)**

3. **Save `CheckoutRequestID`**

   * From STK push response, save `CheckoutRequestID` in the `Payment` model to uniquely track each transaction.
   * 🟡 *Minor update to your `STKPushAPIView` and model.*

4. **Payment Status Endpoint**

   * Create an API endpoint like `/api/payment-status/?checkout_id=...`
   * It checks `Payment` by `checkout_id` and returns `status: Success | Pending | Failed`.
   * 🔧 *New endpoint required.*

---

### 🚧 **To Do (Frontend)**

5. **Store `checkout_id`**

   * After STK push request, capture `checkout_id` from the response.
   * 🟡 *Update frontend to save this.*

6. **Poll Payment Status**

   * Call `/api/payment-status/?checkout_id=...` every few seconds until status is `Success` or timeout.
   * 🔁 *Add polling logic to existing pages.*

7. **Redirect**

   * Based on payment status, show a success or error page.
   * ✅ *You mentioned you already have pages — just hook up logic.*

---


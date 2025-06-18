1. **Models Overview**

### `Customer`

* Represents a customer identified by their phone number.
* Used to link payments to individual users.

### `MpesaCredential`

* Stores M-Pesa credentials **per merchant** (shortcode).
* Includes `consumer_key`, `consumer_secret`, `passkey`, and environment (sandbox or production).

### `Payment`

* Logs every payment made through STK push.
* Stores status (`Pending`, `Success`, `Failed`), `CheckoutRequestID`, M-Pesa receipt number, amount, and associated `shortcode`.
* Also tracks optional data like `service_type`, `access_duration_minutes`, and `start_time` for things like captive portals.

---

## ⚙️ 2. **DynamicMpesaClient Class**

This class is a **custom implementation** that replaces the static `django-daraja` SDK. Its job is to:

### `__init__()`

* Accepts merchant-specific credentials (from `MpesaCredential`) and stores them.
* Chooses base URL depending on whether you're in `"sandbox"` or `"production"` mode.
* Automatically fetches an **OAuth access token** from M-Pesa.

### `_get_access_token()`

* Authenticates using the provided `consumer_key` and `consumer_secret` and retrieves a Bearer token used for all requests.

### `stk_push(...)`

* Sends an STK Push request to M-Pesa using the merchant’s shortcode.
* Dynamically builds the encoded password using the merchant’s passkey + timestamp.
* Sends the payload to M-Pesa’s `/stkpush/processrequest` endpoint.

### `payment_status(receipt_number)`

* Placeholder/mock for confirming a payment from M-Pesa using a receipt number.
* You can replace it with actual M-Pesa `transaction status` queries (optional).

---

## 🌐 3. **Views**

### `STKPushAPIView` (POST)

This is the **entry point for initiating payment**:

* Accepts:

  * `phone_number` (user initiating payment),
  * `amount`,
  * `shortcode` (to load correct merchant credentials),
  * optional `service_type`.
* Validates inputs.
* Loads the corresponding `MpesaCredential` for the shortcode.
* Creates an instance of `DynamicMpesaClient`.
* Makes the `stk_push()` call to M-Pesa.
* If successful:

  * Extracts `CheckoutRequestID`.
  * Logs the request in the `Payment` table with status `"Pending"`.

### `mpesa_callback` (POST)

This view is called **asynchronously by M-Pesa** after the user completes or cancels the payment:

* Validates the POST payload.
* Extracts details like:

  * `Amount`, `MpesaReceiptNumber`, `PhoneNumber`, `TransactionDate`, `CheckoutRequestID`.
* Parses the timestamp into a proper `datetime` object.
* Loads the original payment from `Payment` using `CheckoutRequestID`.
* Loads correct `MpesaCredential` using `payment.shortcode`.
* Optionally verifies the payment status (e.g. to match amounts).
* Updates the `Payment` object with:

  * `status` (Success or Failed),
  * `transaction_date`, `receipt number`, `phone number`.
* Links the payment to a `Customer` (create if doesn't exist).
* If `service_type == captive_portal` and the payment succeeded, calculates and stores internet access time.

### `PaymentStatusView` (GET)

Used by your frontend to **poll and check status** of a payment using the `checkout_id`.

* If payment exists: return its status.
* If not: returns `"Pending"`.

---

## 🧮 4. `calculate_access_time(amount)`

Business logic for captive portal:

* Converts M-Pesa amount to minutes of access time.
* (e.g. 50 KES → 120 minutes)

---

## ✅ Is It Dynamic?

Yes — everything is **fully dynamic per shortcode**, meaning:

* You can onboard multiple businesses using different M-Pesa credentials.
* Each time an STK Push is sent or a callback is received, your system uses the **correct credentials for that merchant** based on the shortcode.

---

## 📌 What You Need to Provide

As the developer or service owner, you’re responsible for:

* Setting up **callback URL** on M-Pesa dashboard.
* Providing correct `shortcode`, `consumer_key`, `consumer_secret`, and `passkey` per merchant (stored in DB).
* Making sure your frontend sends:

  * `phone_number`, `amount`, and the correct `shortcode`.

---

## 🔒 Security Notes

* Ensure `MpesaCredential` fields are encrypted or secured (e.g. using Django-encrypted-fields or vault).
* You should validate callback authenticity (IP whitelisting or HMAC).

---

Let me know if you’d like:

* Actual M-Pesa `TransactionStatus` API instead of the placeholder.
* A webhook signature verification system.
* A frontend JS/React/Vue snippet for initiating STK Pushes.

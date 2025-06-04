---

# Step-by-Step Plan for Adding Multi-Developer Support to Your DRF M-Pesa API

---

### **What you have done already:**

* A working **Payment and User (payer) model** that tracks payments per phone number.
* API endpoints to:

  * Trigger STK Push with fixed Daraja credentials from `.env`.
  * Receive M-Pesa callback to update payment status.
  * Query payment status.
* No authentication or developer-level separation yet.
* Payment flow and database schema suited for single-developer (yourself).

---

### **Goal:**

Allow multiple developers to use your API **independently**, each with their own Daraja credentials, and keep payment data separate by developer, without affecting how payers or payments work.

---

### **Step 1: Design a Developer Model**

* Create a new **Developer** model that stores:

  * Developer identity info (email, Firebase UID, etc.).
  * Their unique Daraja credentials (consumer key & secret).
* This model will link payments to the developer making the API call.

---

### **Step 2: Add Developer Link to Payment Model**

* Add a foreign key from Payment to Developer.
* This links every payment to the developer responsible for it.
* The User model (payer) stays the same, tracking phone numbers of payers.

---

### **Step 3: Implement Authentication**

* Integrate Firebase Authentication on your frontend.
* Pass Firebase ID tokens with every API request.
* On the backend, verify Firebase token to identify the calling developer.
* Retrieve the developer’s record from the DB using the Firebase UID.

---

### **Step 4: Modify STK Push Logic**

* Instead of loading Daraja credentials from `.env`, load them from the **calling developer’s record**.
* Initialize the MpesaClient with the developer's credentials.
* Proceed with STK push as usual.

---

### **Step 5: Link Payments to Developers in API**

* When creating the Payment record after STK push, link it to the developer identified from the token.
* On payment callbacks:

  * Identify the developer via payment’s developer field.
  * No changes needed to callback except maybe logging for developer context.

---

### **Step 6: Secure API Endpoints**

* Restrict sensitive API views (STKPush, PaymentStatus) to **authenticated developers only**.
* Reject requests with invalid or missing Firebase tokens.

---

### **Step 7: Update Frontend SDK**

* Require developers to authenticate with Firebase.
* Pass Firebase token in API calls.
* Make no changes to payment data (phone, amount, etc.), just add auth header.

---

### **Step 8: Test and Validate**

* Test with multiple developer accounts, each with their own Daraja credentials.
* Ensure payments are correctly attributed to the right developer.
* Verify isolation — developers cannot see or affect each other’s data.

---

### **Summary:**

| Existing             | Change Needed? | Where to Modify                | Notes                                       |
| -------------------- | -------------- | ------------------------------ | ------------------------------------------- |
| `User` (payer) model | No             | N/A                            | Remains for phone tracking                  |
| `Payment` model      | Yes            | Add developer FK               | Link payments to developers                 |
| `STKPushAPIView`     | Yes            | Load creds from developer      | Use developer’s Daraja keys instead of .env |
| `mpesa_callback`     | Minimal        | Possibly add developer logging | Payments linked by checkout ID still valid  |
| Auth system          | Yes            | Add Firebase auth validation   | Identify calling developer                  |
| API permissions      | Yes            | Restrict sensitive views       | Allow only authenticated developers         |
| Frontend SDK         | Yes            | Add Firebase token handling    | Pass token in API calls                     |


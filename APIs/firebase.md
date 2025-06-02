---

# Step 1 Plan: Implement Firebase Auth for Developers

---

### 1. **Firebase Project Setup**

* Create a new Firebase project in [Firebase Console](https://console.firebase.google.com).
* Enable Authentication:

  * Activate Email/Password sign-in (or other providers as needed).
* Obtain Firebase config details (API key, project ID, etc.) for frontend.

---

### 2. **Frontend Authentication**

* Build a simple frontend interface (React, Vue, or plain JS) for:

  * Developer registration (sign-up).
  * Developer login (sign-in).
* Use Firebase client SDK to handle sign-up/login flows.
* On login success, obtain **Firebase ID token** from the client.

---

### 3. **Backend Firebase Admin Setup**

* Install and configure Firebase Admin SDK in Django backend.
* Securely add Firebase service account credentials (JSON) to your backend.
* Write utility functions to verify Firebase ID tokens from incoming requests.

---

### 4. **Create Developer Model**

* Define a `Developer` Django model with fields:

  * Firebase UID (unique identifier).
  * Email (optional but recommended).
  * Daraja credentials (consumer key & secret).
* Implement logic to create/update Developer records on first verified login.

---

### 5. **Middleware or Decorator for Auth**

* Create Django middleware or DRF authentication class to:

  * Extract Firebase ID token from request headers.
  * Verify the token with Firebase Admin SDK.
  * Attach the authenticated developer instance to `request.user` or `request.developer`.

---

### 6. **Protect API Endpoints**

* Modify your API views (e.g., STKPushAPIView) to:

  * Require authentication.
  * Access the authenticated developer’s Daraja credentials.
* Reject requests without valid Firebase token.

---

### 7. **Testing & Validation**

* Test developer sign-up and login flows on frontend.
* Test backend token verification and access control.
* Confirm API calls include Firebase token and are properly authenticated.
* Verify Developer model is created and linked correctly.

---

### Deliverables for Step 1:

* Working frontend for developer login/signup with Firebase.
* Firebase Admin setup and token verification in Django.
* Developer model and DB records tied to Firebase UID.
* Auth-protected API endpoints using Firebase tokens.

---


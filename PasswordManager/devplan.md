
### **Frontend Plan:**

#### 1. **User Authentication (Frontend)**
   - **Frontend:**  
     - Provide login and signup forms (email/password).
     - Display **2FA** input when applicable.
     - **JWT tokens** storage for session management (in memory or local storage).
     - Show success/error messages (e.g., "Login Successful", "Invalid Credentials").
   
   - **Backend:**  
     - Validate user credentials.
     - Handle **JWT** token generation and authentication.
     - Manage **2FA** (send codes, validate on backend).

---

#### 2. **Password Vault (Dashboard)**
   - **Frontend:**  
     - Display the list of saved passwords in a user-friendly table or grid.
     - Show only **titles**/metadata of passwords (website, app name), hide actual passwords initially.
     - Provide **search, filter, and sort** options for passwords.
     - Allow **password reveal** functionality (decrypted password).
     - Display a **password strength indicator** (in the UI).
   
   - **Backend:**  
     - Fetch user’s **password data** from the server, decrypted using the user's credentials or session.
     - Ensure **password encryption** when storing and retrieving passwords.

---

#### 3. **Add/Store Password (Frontend)**
   - **Frontend:**  
     - Provide an **add password form** to allow users to input new credentials (title, username, password, etc.).
     - Implement **password generator** for secure password creation.
     - **Field validation** (e.g., password strength check).
   
   - **Backend:**  
     - Handle **password creation**, validating inputs.
     - Encrypt the password before saving it to the database.
     - Store it securely, ensuring **zero-knowledge architecture** (only the user can decrypt it).

---

#### 4. **Edit/Delete Passwords (Frontend)**
   - **Frontend:**  
     - Allow users to **edit** or **delete** passwords from the vault.
     - Show confirmation prompts before deleting.
   
   - **Backend:**  
     - Handle **password editing** and re-encrypting if needed.
     - Handle **deletion** (securely removing from the database).

---

#### 5. **GitHub Repo Scanning (Frontend)**
   - **Frontend:**  
     - Allow users to **sign in with GitHub** via OAuth to access their repositories.
     - **Display scanned repositories** and their status (e.g., "No secrets found" or "Exposed secrets detected").
     - Allow users to **select repos to scan**.
     - **Show detailed scan results**: Highlight lines with exposed secrets, show file names, and offer actions (e.g., “Fix this secret”).
     - Provide **notifications** or alerts for new secrets discovered.
   
   - **Backend:**  
     - Use GitHub's API to **fetch repositories** and their files (public or private with user consent).
     - **Scan files for secrets** using regex or custom patterns.
     - Return the scan results (secrets found) to the frontend.

---

#### 6. **Settings (Frontend)**
   - **Frontend:**  
     - Allow users to **change password**, manage **2FA**, and configure other account settings.
     - **Export Vault** functionality (download encrypted password file).
   
   - **Backend:**  
     - **Change password** logic (verify old password, hash the new one).
     - Manage **2FA settings** and handle secret keys for 2FA (e.g., Google Authenticator).
     - **Export encrypted data** when the user requests a vault export.

---

#### 7. **Responsive Design & UI/UX (Frontend)**
   - **Frontend:**  
     - Use **Tailwind CSS** for styling, ensuring the app is responsive across devices (mobile, tablet, desktop).
     - Provide visual feedback (loading spinners, success/error notifications).
     - Ensure accessibility and usability (keyboard navigation, high-contrast UI, etc.).
   
   - **Backend:**  
     - No direct responsibility for UI, but ensure that the data is structured and returned in a way that’s easy to display (JSON format).

---

#### 8. **Security & Encryption (Frontend)**
   - **Frontend:**  
     - Handle **encryption** on the frontend (AES or RSA) for sensitive data.
     - Store **tokens** securely (JWT tokens in memory or local storage).
     - Prevent XSS/CSRF attacks (sanitize inputs and outputs).
   
   - **Backend:**  
     - Encrypt/decrypt passwords using strong algorithms (AES-256) before storing and after retrieval.
     - Validate incoming requests for **authorization** and **authentication** (via JWT).

---

### **Summary of Responsibilities**:

#### **Frontend (You’ll Handle)**:
- **UI/UX**: Login, dashboard, add/edit password forms, GitHub repo scanning interface.
- **State management**: Handle frontend state (React Context or Zustand) for session, passwords, and scan results.
- **GitHub OAuth**: Allow GitHub login to fetch repos.
- **API communication**: Handle user input, show loading states, and display feedback.

#### **Backend **:
- **User authentication**: Handle login, signup, JWT generation, and 2FA.
- **Password management**: Store, retrieve, edit, delete, and encrypt passwords.
- **GitHub scanning**: Fetch repos via GitHub API, scan files for secrets, and return results.
- **Data security**: Encrypt passwords and sensitive data on storage, ensure secure communication (HTTPS).

---


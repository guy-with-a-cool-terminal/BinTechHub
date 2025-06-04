const handleLogin = async (event) => {
  event.preventDefault();
  // ...validation code...

  setIsLoading(true);
  try {
    const firebaseAuth = getAuth();
    const userCredential = await signInWithEmailAndPassword(firebaseAuth, email, password);
    const idToken = await userCredential.user.getIdToken();
    console.log("ID Token:", idToken);
    localStorage.setItem('firebase_token', idToken);
    await api.login(idToken, email);
    navigate('/dashboard');
  } catch (err) {
    console.error('Login failed:', err);
    setError('Login failed. Please check your credentials and try again.');
  } finally {
    setIsLoading(false);
  }
};

const handleGoogleLogin = async () => {
  setError('');
  setIsGoogleLoading(true);
  try {
    const provider = new GoogleAuthProvider();
    const firebaseAuth = getAuth();
    const result = await signInWithPopup(firebaseAuth, provider);
    const user = result.user;
    const idToken = await user.getIdToken();
    console.log("ID Token:", idToken);
    localStorage.setItem('firebase_token', idToken);
    await api.login(idToken, user.email);
    navigate('/dashboard');
  } catch (err) {
    console.error('Google login failed:', err);
    setError('Google login failed. Please try again.');
  } finally {
    setIsGoogleLoading(false);
  }
};

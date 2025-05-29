// index.js

// Replace this with your actual Firebase config
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};

// Utility to load Firebase scripts
function loadFirebaseSDKs(callback) {
  const scripts = [
    "https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js",
    "https://www.gstatic.com/firebasejs/9.22.2/firebase-auth-compat.js"
  ];

  let loadedCount = 0;

  scripts.forEach(src => {
    const script = document.createElement("script");
    script.src = src;
    script.onload = () => {
      loadedCount++;
      if (loadedCount === scripts.length && typeof callback === "function") {
        callback();
      }
    };
    script.onerror = () => {
      console.error("❌ Failed to load Firebase script:", src);
      alert("Error loading authentication scripts. Please check your internet connection.");
    };
    document.head.appendChild(script);
  });
}

// Load Firebase and bind functions to window
loadFirebaseSDKs(() => {
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();

  console.log("✅ Firebase initialized");

  // Email/password login
  window.handleLogin = function () {
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;

    if (!email || !password) {
      alert("⚠️ Please enter both email and password.");
      return;
    }

    auth.signInWithEmailAndPassword(email, password)
      .then(userCredential => {
        const user = userCredential.user;
        alert(`✅ Welcome back, ${user.email}`);
        // You can redirect or update UI here
        console.log("Logged in:", user);
      })
      .catch(error => {
        console.error("Login error:", error);
        alert("❌ Login failed: " + error.message);
      });
  };

  // Google Sign-In
  window.handleGoogleLogin = function () {
    const provider = new firebase.auth.GoogleAuthProvider();

    auth.signInWithPopup(provider)
      .then(result => {
        const user = result.user;
        alert(`✅ Signed in with Google: ${user.displayName}`);
        console.log("Google user:", user);
        // You can redirect or update UI here
      })
      .catch(error => {
        console.error("Google sign-in error:", error);
        alert("❌ Google Sign-in failed: " + error.message);
      });
  };

  // Optional: Detect auth state (e.g., stay logged in)
  auth.onAuthStateChanged(user => {
    if (user) {
      console.log("👤 User is signed in:", user.email);
      // Redirect to dashboard or home if desired
    } else {
      console.log("🔓 No user signed in");
    }
  });
});

// Import necessary Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-analytics.js";
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  GithubAuthProvider,
  signInAnonymously,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCNq7fiEkZ5BU4lBroNWi9HILTCu1J_zAQ",
  authDomain: "revylux-dbf65.firebaseapp.com",
  databaseURL: "https://revylux-dbf65-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "revylux-dbf65",
  storageBucket: "revylux-dbf65.firebasestorage.app",
  messagingSenderId: "76979548631",
  appId: "1:76979548631:web:7c45a62671e8fb350f5b92",
  measurementId: "G-743SYYSRD9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

// Initialize Firebase Auth
const auth = getAuth(app);

// Provider instances
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

// Check authentication state on page load
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in
    window.location.href = './dashboard.html';
  }
});

// Handle Google Sign In
document.querySelector('.fa-google').parentElement.addEventListener('click', async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    // Handle successful login
    window.location.href = './dashboard.html';
  } catch (error) {
    console.error("Google Sign In Error:", error);
    alert("Failed to sign in with Google. Please try again.");
  }
});

// Handle GitHub Sign In
document.querySelector('.fa-github').parentElement.addEventListener('click', async () => {
  try {
    const result = await signInWithPopup(auth, githubProvider);
console.log(result);  // Cek apakah result berhasil
window.location.href = './dashboard.html';
  } catch (error) {
    console.error("GitHub Sign In Error:", error);
    alert("Failed to sign in with GitHub. Please try again.");
  }
});

// Handle Anonymous Sign In
document.querySelector('.fa-user-secret').parentElement.addEventListener('click', async () => {
  try {
    const result = await signInAnonymously(auth);
    window.location.href = './dashboard.html';
  } catch (error) {
    console.error("Anonymous Sign In Error:", error);
    alert("Failed to sign in anonymously. Please try again.");
  }
});

// Handle Email/Password Sign In
document.querySelector('form').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;
  
  try {
    const result = await signInWithEmailAndPassword(auth, email, password);
    window.location.href = './dashboard.html';
  } catch (error) {
    console.error("Email Sign In Error:", error);
    alert("Failed to sign in with email/password. Please check your credentials.");
  }
});

// Handle "Forgot Password" link
document.querySelector('.text-gray-400').addEventListener('click', (e) => {
  e.preventDefault();
  const email = document.getElementById('email').value;
  if (!email) {
    alert("Please enter your email address first.");
    return;
  }
  // You can implement password reset functionality here
  alert("Password reset functionality would go here");
});

// Function to handle logout (to be used on user.com)
export const handleLogout = async () => {
  try {
    await signOut(auth);
    window.location.href = '/login.html'; // Redirect to login page after logout
  } catch (error) {
    console.error("Logout Error:", error);
    alert("Failed to log out. Please try again.");
  }
};

// Handle page load
document.addEventListener('DOMContentLoaded', () => {
  // Clear form fields on page load
  document.getElementById('email').value = '';
  document.getElementById('password').value = '';
});
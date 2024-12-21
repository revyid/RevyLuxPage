// Import necessary Firebase modules
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword,
    sendEmailVerification,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";

// Firebase configuration (use your existing config)
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
const auth = getAuth(app);

// Get DOM elements
const signupForm = document.getElementById('signupForm');
const successMessage = document.getElementById('successMessage');
const errorMessage = document.getElementById('errorMessage');

// Function to show message
const showMessage = (element, message) => {
    element.style.display = 'block';
    element.textContent = message;
    setTimeout(() => {
        element.style.display = 'none';
    }, 5000);
};

// Handle signup form submission
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Get form values
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Clear previous error messages
    errorMessage.style.display = 'none';
    successMessage.style.display = 'none';
    
    // Validate passwords match
    if (password !== confirmPassword) {
        showMessage(errorMessage, "Passwords do not match!");
        return;
    }
    
    // Validate password strength (at least 6 characters)
    if (password.length < 6) {
        showMessage(errorMessage, "Password should be at least 6 characters long!");
        return;
    }
    
    try {
        // Create user account
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // Send verification email
        await sendEmailVerification(user);
        
        // Show success message
        showMessage(successMessage, "Account created! Please check your email for verification link.");
        
        // Clear form
        signupForm.reset();
        
        // Optional: You can redirect to a different page or show different UI
        setTimeout(() => {
            window.location.href = '/login.html';
        }, 5000);
        
    } catch (error) {
        // Handle specific error cases
        let errorMsg = "An error occurred during signup.";
        
        switch (error.code) {
            case 'auth/email-already-in-use':
                errorMsg = "This email is already registered.";
                break;
            case 'auth/invalid-email':
                errorMsg = "Invalid email address.";
                break;
            case 'auth/operation-not-allowed':
                errorMsg = "Email/password accounts are not enabled. Please contact support.";
                break;
            case 'auth/weak-password':
                errorMsg = "Password is too weak. Please choose a stronger password.";
                break;
            default:
                errorMsg = error.message;
        }
        
        showMessage(errorMessage, errorMsg);
        console.error("Signup Error:", error);
    }
});

// Check authentication state changes
onAuthStateChanged(auth, (user) => {
    if (user) {
        // If user is signed in but not verified, show appropriate message
        if (!user.emailVerified) {
            showMessage(successMessage, "Please verify your email address.");
        }
    }
});

// Clear form fields on page load
document.addEventListener('DOMContentLoaded', () => {
    signupForm.reset();
});
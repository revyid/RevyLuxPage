import { 
    initializeApp 
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { 
    getAuth, 
    onAuthStateChanged,
    updateProfile,
    sendPasswordResetEmail,
    signOut
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-auth.js";
import { 
    getStorage, 
    ref, 
    uploadBytes, 
    getDownloadURL 
} from "https://www.gstatic.com/firebasejs/11.1.0/firebase-storage.js";

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
const auth = getAuth(app);
const storage = getStorage(app);

// Check authentication state on page load
onAuthStateChanged(auth, (user) => {
    if (!user) {
        // Redirect to login if not authenticated
        window.location.href = './login.html';
        return;
    }
    // Update UI with user info if authenticated
    updateUserUI(user);
});

// Update UI with user info
function updateUserUI(user) {
    document.getElementById('profilePic').src = user.photoURL || '/api/placeholder/150/150';
    document.getElementById('displayName').textContent = user.displayName || 'Anonymous User';
    document.getElementById('userEmail').textContent = user.email || 'No email set';
}

// Show success modal
function showSuccessModal(title, message) {
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalMessage').textContent = message;
    document.getElementById('successModal').classList.remove('hidden');
}

// Close modal
window.closeModal = function() {
    document.getElementById('successModal').classList.add('hidden');
}

// Handle profile picture update
document.getElementById('profilePicInput').addEventListener('change', async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
        const storageRef = ref(storage, `profile-pictures/${auth.currentUser.uid}`);
        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);

        await updateProfile(auth.currentUser, {
            photoURL: downloadURL
        });

        updateUserUI(auth.currentUser);
        showSuccessModal('Success!', 'Profile picture updated successfully!');
    } catch (error) {
        console.error(error);
        alert('Failed to update profile picture. Please try again.');
    }
});

// Handle profile picture URL update
document.getElementById('profilePicURLForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const url = document.getElementById('profilePicURL').value;

    try {
        await updateProfile(auth.currentUser, {
            photoURL: url
        });
        updateUserUI(auth.currentUser);
        showSuccessModal('Success!', 'Profile picture updated successfully!');
        document.getElementById('profilePicURL').value = '';
    } catch (error) {
        console.error(error);
        alert('Failed to update profile picture. Please try again.');
    }
});

// Handle display name update
document.getElementById('displayNameForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const newName = document.getElementById('newDisplayName').value;

    try {
        await updateProfile(auth.currentUser, {
            displayName: newName
        });
        updateUserUI(auth.currentUser);
        showSuccessModal('Success!', 'Display name updated successfully!');
        document.getElementById('newDisplayName').value = '';
    } catch (error) {
        console.error(error);
        alert('Failed to update display name. Please try again.');
    }
});

// Handle password reset (continued)
document.getElementById('resetPasswordBtn').addEventListener('click', async () => {
    const email = auth.currentUser.email;
    if (!email) {
        alert('No email associated with this account.');
        return;
    }

    try {
        await sendPasswordResetEmail(auth, email);
        showSuccessModal('Success!', 'Password reset email sent! Please check your inbox.');
    } catch (error) {
        console.error(error);
        alert('Failed to send password reset email. Please try again.');
    }
});

// Handle logout
document.getElementById('logoutButton').addEventListener('click', async () => {
    try {
        await signOut(auth);
        window.location.href = './login.html';
    } catch (error) {
        console.error(error);
        alert('Failed to log out. Please try again.');
    }
});

// Ensure forms are cleared when modal is closed
document.getElementById('successModal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('successModal')) {
        closeModal();
    }
});

// Initialize tooltips and other UI elements
document.addEventListener('DOMContentLoaded', () => {
    // Add loading state handlers to all forms
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', (e) => {
            const submitButton = form.querySelector('button[type="submit"]');
            if (submitButton) {
                submitButton.disabled = true;
                submitButton.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Updating...';
            }
        });
    });

    // Add password visibility toggle
    const passwordInput = document.getElementById('newPassword');
    if (passwordInput) {
        const togglePassword = document.createElement('button');
        togglePassword.type = 'button';
        togglePassword.className = 'absolute right-12 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700';
        togglePassword.innerHTML = '<i class="fas fa-eye"></i>';
        togglePassword.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            togglePassword.innerHTML = type === 'password' ? '<i class="fas fa-eye"></i>' : '<i class="fas fa-eye-slash"></i>';
        });
        passwordInput.parentElement.style.position = 'relative';
        passwordInput.parentElement.insertBefore(togglePassword, passwordInput.nextSibling);
    }

    // Add file size validation for profile picture upload
    const profilePicInput = document.getElementById('profilePicInput');
    if (profilePicInput) {
        profilePicInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                // Check file size (max 5MB)
                if (file.size > 5 * 1024 * 1024) {
                    alert('File size must be less than 5MB');
                    profilePicInput.value = '';
                    return;
                }
                
                // Check file type
                if (!file.type.startsWith('image/')) {
                    alert('Please upload an image file');
                    profilePicInput.value = '';
                    return;
                }
            }
        });
    }

    // Add input validation for email
    const emailInput = document.getElementById('newEmail');
    if (emailInput) {
        emailInput.addEventListener('input', () => {
            const email = emailInput.value;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const submitButton = emailInput.closest('form').querySelector('button[type="submit"]');
            
            if (emailRegex.test(email)) {
                emailInput.classList.remove('border-red-500');
                emailInput.classList.add('border-green-500');
                submitButton.disabled = false;
            } else {
                emailInput.classList.remove('border-green-500');
                emailInput.classList.add('border-red-500');
                submitButton.disabled = true;
            }
        });
    }

    // Add input validation for display name
    const displayNameInput = document.getElementById('newDisplayName');
    if (displayNameInput) {
        displayNameInput.addEventListener('input', () => {
            const displayName = displayNameInput.value.trim();
            const submitButton = displayNameInput.closest('form').querySelector('button[type="submit"]');
            
            if (displayName.length >= 3 && displayName.length <= 30) {
                displayNameInput.classList.remove('border-red-500');
                displayNameInput.classList.add('border-green-500');
                submitButton.disabled = false;
            } else {
                displayNameInput.classList.remove('border-green-500');
                displayNameInput.classList.add('border-red-500');
                submitButton.disabled = true;
            }
        });
    }

    // Add input validation for password
    const passwordUpdateInput = document.getElementById('newPassword');
    if (passwordUpdateInput) {
        passwordUpdateInput.addEventListener('input', () => {
            const password = passwordUpdateInput.value;
            const submitButton = passwordUpdateInput.closest('form').querySelector('button[type="submit"]');
            
            // Password must be at least 8 characters, contain uppercase, lowercase, number, and special character
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
            
            if (passwordRegex.test(password)) {
                passwordUpdateInput.classList.remove('border-red-500');
                passwordUpdateInput.classList.add('border-green-500');
                submitButton.disabled = false;
            } else {
                passwordUpdateInput.classList.remove('border-green-500');
                passwordUpdateInput.classList.add('border-red-500');
                submitButton.disabled = true;
            }
        });
    }

    // Add debounce to URL input
    const urlInput = document.getElementById('profilePicURL');
    if (urlInput) {
        let debounceTimer;
        urlInput.addEventListener('input', () => {
            clearTimeout(debounceTimer);
            const submitButton = urlInput.closest('form').querySelector('button[type="submit"]');
            submitButton.disabled = true;

            debounceTimer = setTimeout(() => {
                const url = urlInput.value;
                const urlRegex = /^(https?:\/\/.*\.(?:png|jpg|jpeg|gif|webp))$/i;
                
                if (urlRegex.test(url)) {
                    urlInput.classList.remove('border-red-500');
                    urlInput.classList.add('border-green-500');
                    submitButton.disabled = false;
                } else {
                    urlInput.classList.remove('border-green-500');
                    urlInput.classList.add('border-red-500');
                    submitButton.disabled = true;
                }
            }, 500);
        });
    }
});
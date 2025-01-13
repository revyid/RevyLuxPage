// Import Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-app.js";
import { getDatabase, ref, get, set, onValue } from "https://www.gstatic.com/firebasejs/11.1.0/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCNq7fiEkZ5BU4lBroNWi9HILTCu1J_zAQ",
  authDomain: "revylux-dbf65.firebaseapp.com",
  databaseURL: "https://revylux-dbf65-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "revylux-dbf65",
  storageBucket: "revylux-dbf65.appspot.com",
  messagingSenderId: "76979548631",
  appId: "1:76979548631:web:7e1e0b914330631b0f5b92",
  measurementId: "G-RB2DP9N6CS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Referensi ke data views di database
const viewsRef = ref(database, "views");

// Fungsi untuk mendapatkan dan memperbarui views
export async function updateAndDisplayViews(elementId) {
  try {
    // Ambil data views dari database
    const snapshot = await get(viewsRef);
    let currentViews = snapshot.exists() ? snapshot.val() : 0;

    // Tambahkan 1 view
    await set(viewsRef, currentViews + 1);

    // Tampilkan views di elemen HTML
    document.getElementById(elementId).textContent = currentViews + 1;

    // Update data secara real-time jika ada perubahan
    onValue(viewsRef, (snapshot) => {
      const updatedViews = snapshot.val();
      document.getElementById(elementId).textContent = updatedViews;
    });
  } catch (error) {
    console.error("Error updating views:", error);
  }
}


// Fungsi untuk menghitung uptime menggunakan Realtime Database
export async function calculateUptime(elementId) {
  const uptimeRef = ref(database, 'uptime/startTime');
  
  try {
    // Cek apakah sudah ada startTime di database
    const snapshot = await get(uptimeRef);
    let startTime;
    
    if (!snapshot.exists()) {
      // Jika belum ada startTime, set waktu mulai
      startTime = new Date().getTime();
      await set(uptimeRef, startTime);
      console.log("Setting start time in Firebase:", startTime);
    } else {
      startTime = snapshot.val();
      console.log("Start Time from Firebase:", startTime);
    }

    // Update uptime setiap detik
    setInterval(() => {
      const currentTime = new Date().getTime();
      const uptime = currentTime - startTime;
      const uptimeSeconds = Math.floor(uptime / 1000);
      const hours = Math.floor(uptimeSeconds / 3600);
      const minutes = Math.floor((uptimeSeconds % 3600) / 60);
      const seconds = uptimeSeconds % 60;

      // Tampilkan uptime di elemen HTML
      const element = document.getElementById(elementId);
      if (element) {
        element.textContent = `${hours} hours, ${minutes} minutes, ${seconds} seconds`;
      }
      
      console.log(`Uptime: ${hours}h ${minutes}m ${seconds}s`);
    }, 1000);

    // Listen untuk perubahan startTime
    onValue(uptimeRef, (snapshot) => {
      if (snapshot.exists()) {
        startTime = snapshot.val();
        console.log("Start time updated:", startTime);
      }
    });

  } catch (error) {
    console.error("Error in calculateUptime:", error);
    document.getElementById(elementId).textContent = "Error calculating uptime";
  }
}

// Fungsi untuk reset uptime
export async function resetUptime(elementId) {
  const uptimeRef = ref(database, 'uptime/startTime');
  
  try {
    // Set waktu baru
    const newStartTime = new Date().getTime();
    await set(uptimeRef, newStartTime);
    
    console.log("Uptime reset, new start time:", newStartTime);
    
    // Update display langsung
    document.getElementById(elementId).textContent = "0 hours, 0 minutes, 0 seconds";
  } catch (error) {
    console.error("Error resetting uptime:", error);
    document.getElementById(elementId).textContent = "Error resetting uptime";
  }
}

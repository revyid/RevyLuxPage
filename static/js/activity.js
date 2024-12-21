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

// Fungsi untuk menghitung uptime
export function calculateUptime(elementId) {
  let startTime = localStorage.getItem("startTime");
  console.log("Start Time from localStorage:", startTime); // Debugging log

  // Jika belum ada startTime, set waktu mulai
  if (!startTime) {
    const currentTime = new Date().getTime();
    console.log("Setting start time:", currentTime); // Debugging log
    localStorage.setItem("startTime", currentTime);
    startTime = currentTime; // Pastikan startTime sudah di-set
  }

  // Update uptime setiap detik
  setInterval(() => {
    const currentTime = new Date().getTime();
    const uptime = currentTime - startTime; // Waktu dalam milidetik
    const uptimeSeconds = Math.floor(uptime / 1000); // Uptime dalam detik
    const hours = Math.floor(uptimeSeconds / 3600);
    const minutes = Math.floor((uptimeSeconds % 3600) / 60);
    const seconds = uptimeSeconds % 60;

    // Tampilkan uptime di elemen HTML
    document.getElementById(elementId).textContent = `${hours} hours, ${minutes} minutes, ${seconds} seconds`;
    console.log(`Uptime: ${hours} hours, ${minutes} minutes, ${seconds} seconds`); // Debugging log
  }, 1000); // Update setiap detik
}
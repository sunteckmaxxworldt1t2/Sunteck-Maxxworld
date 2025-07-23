// notification.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyBuR-YwstGzMU9HSGrogNbBqTXN9hr6l80",
  authDomain: "sunteck1-36a23.firebaseapp.com",
  projectId: "sunteck1-36a23",
  storageBucket: "sunteck1-36a23.firebasestorage.app",
  messagingSenderId: "562096685576",
  appId: "1:562096685576:web:3bf98573623f55051107bd",
  measurementId: "G-ND03031XQ9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Responsive Navbar Functions
const navLinks = document.getElementById("navLinks");
window.showmenu = function () {
  navLinks.style.right = "0";
};
window.hidemenu = function () {
  navLinks.style.right = "-200px";
};

// Popup Slideshow Logic
let currentIndex = 0;
let currentImages = [];

window.openPopup = function (data) {
  document.getElementById('popupOverlay').style.display = 'flex';
  document.getElementById('popupTitle').textContent = data.title;
  document.getElementById('popupDescription').innerHTML = `<strong>Description:</strong> ${data.description}`;
  document.getElementById('popupDate').innerHTML = `<strong>Date & Time:</strong> ${new Date(data.eventDateTime.seconds * 1000).toLocaleString()}`;
  currentImages = data.images || [];
  currentIndex = 0;
  showSlide();
};

function showSlide() {
  const container = document.getElementById('popupImageContainer');
  if (currentImages.length === 0) {
    container.innerHTML = '<img src="https://via.placeholder.com/600x250?text=No+Image" />';
    return;
  }
  container.innerHTML = `<img src="${currentImages[currentIndex]}" alt="Slide Image" />`;
}

window.changeSlide = function (step) {
  currentIndex = (currentIndex + step + currentImages.length) % currentImages.length;
  showSlide();
};

window.closePopup = function () {
  document.getElementById('popupOverlay').style.display = 'none';
};

// Fetch and Display Events
const eventContainer = document.getElementById("eventContainer");

async function fetchEvents() {
  const querySnapshot = await getDocs(collection(db, "events"));
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    const safeData = JSON.stringify(data).replace(/'/g, "&#39;");
    const eventHTML = `
      <div class="event-card" onclick='openPopup(${safeData})'>
        <h2>${data.title || "No Title"}</h2>
        <p><strong>Description:</strong> ${data.description || "N/A"}</p>
        <p><strong>Date & Time:</strong> ${new Date(data.eventDateTime?.seconds * 1000).toLocaleString()}</p>
        <div class="event-images">
          ${(data.images || []).slice(0, 3).map(url => `<img src="${url}" alt="Event Image" />`).join('')}
        </div>
      </div>
    `;
    eventContainer.innerHTML += eventHTML;
  });
}

fetchEvents();

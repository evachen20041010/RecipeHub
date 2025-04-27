import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import {
  getAuth,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyABrQw6GQegeUAc1KeFbN2dyIjfnpDHax4",
  authDomain: "recipehub-f0e58.firebaseapp.com",
  projectId: "recipehub-f0e58",
  storageBucket: "recipehub-f0e58.appspot.com",
  messagingSenderId: "704003148200",
  appId: "1:704003148200:web:82607f79411f493277759d",
  measurementId: "G-R9LGHW1J2J"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// 顯示登入狀態與控制導覽列
onAuthStateChanged(auth, (user) => {
  const userInfo = document.getElementById("user-info");
  const authLink = document.getElementById("auth-link");
  const profileLink = document.getElementById("profile-link");

  if (user) {
    const name = user.displayName || user.email;
    document.getElementById("username").textContent = name;

    // 控制導覽列
    userInfo.style.display = "flex";
    authLink.style.display = "none";
    profileLink.style.display = "inline";
  } else {
    // 未登入
    userInfo.style.display = "none";
    authLink.style.display = "inline";
    profileLink.style.display = "none";
  }
});

// 登出功能
document.getElementById("logout-btn").addEventListener("click", () => {
  signOut(auth).then(() => {
    alert("已登出");
    window.location.href = "pages/auth.html";
  });
});

// 選單開關
const navToggle = document.querySelector(".nav-toggle");
const header = document.querySelector("header");

navToggle.addEventListener("click", () => {
  header.classList.toggle("nav-open");
});

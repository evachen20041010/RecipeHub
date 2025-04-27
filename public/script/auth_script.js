// Firebase 設定與初始化
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    sendEmailVerification,
    signInWithPopup,
    GoogleAuthProvider,
    GithubAuthProvider
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
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();
const db = getFirestore(app);

// Email 註冊
document.getElementById("register-btn").addEventListener("click", () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    createUserWithEmailAndPassword(auth, email, password)
        .then(async (userCredential) => {
            const user = userCredential.user;

            // 寄驗證信
            await sendEmailVerification(user);

            // Firestore 初始資料寫入
            await setDoc(doc(db, "users", user.uid), {
                uid: user.uid,
                email: user.email,
                username: "",  // 初始空，讓使用者自己設定
                bio: "",
                favorites: [],
                createdAt: new Date()
            });

            alert("註冊成功，請驗證您的信箱！");
        })
        .catch((error) => {
            alert(error.message);
        });
});

// Email 登入
document.getElementById("login-btn").addEventListener("click", () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            if (userCredential.user.emailVerified) {
                alert("登入成功！");
                window.location.href = "../index.html";
            } else {
                alert("請先驗證您的信箱！");
            }
        })
        .catch((error) => {
            alert(error.message);
        });
});

// Google 登入 (Popup)
document.getElementById("google-btn").addEventListener("click", () => {
    signInWithPopup(auth, googleProvider)
        .then(async (result) => {
            const user = result.user;

            // 檢查 Firestore 中是否已有資料
            const userDocRef = doc(db, "users", user.uid);
            const userDocSnap = await getDoc(userDocRef);

            if (!userDocSnap.exists()) {
                // 若不存在，建立初始資料
                await setDoc(userDocRef, {
                    uid: user.uid,
                    email: user.email,
                    bio: "",
                    favorites: [],
                    createdAt: new Date()
                });
            }

            alert("Google 登入成功！");
            window.location.href = "../index.html";
        })
        .catch((error) => {
            alert(error.message);
        });
});

// GitHub 登入 (Popup)
document.getElementById("github-btn").addEventListener("click", () => {
    signInWithPopup(auth, githubProvider)
        .then(async (result) => {
            const user = result.user;

            const userDocRef = doc(db, "users", user.uid);
            const userDocSnap = await getDoc(userDocRef);

            if (!userDocSnap.exists()) {
                await setDoc(userDocRef, {
                    uid: user.uid,
                    email: user.email,
                    bio: "",
                    favorites: [],
                    createdAt: new Date()
                });
            }

            alert("GitHub 登入成功！");
            window.location.href = "../index.html";
        })
        .catch((error) => {
            alert(error.message);
        });
});

// 忘記密碼
document.getElementById("reset-btn").addEventListener("click", () => {
    const email = document.getElementById("email").value;
    sendPasswordResetEmail(auth, email)
        .then(() => {
            alert("重設密碼信已寄出！");
        })
        .catch((error) => {
            alert(error.message);
        });
});

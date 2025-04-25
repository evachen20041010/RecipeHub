import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    GoogleAuthProvider,
    GithubAuthProvider,
    signInWithRedirect,
    getRedirectResult,
    sendPasswordResetEmail,
    sendEmailVerification,
    deleteUser
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

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

// ========== 登入結果處理 (for redirect 登入回來時) ==========
getRedirectResult(auth)
    .then((result) => {
        if (result && result.user) {
            alert("登入成功！");
            window.location.href = "index.html";
        }
    })
    .catch((err) => {
        if (err.code !== "auth/no-auth-event") {
            alert(`登入失敗：${err.message}`);
        }
    });

// ========== 註冊 ==========
document.getElementById("signup-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const name = document.getElementById("signup-name").value;
    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await sendEmailVerification(userCredential.user);
        alert("註冊成功！驗證信已寄出，請至信箱確認。");
    } catch (err) {
        alert(`註冊失敗：${err.message}`);
    }
});

// ========== Email 登入 ==========
document.getElementById("login-form")?.addEventListener("submit", async (e) => {
    e.preventDefault();
    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;
    try {
        await signInWithEmailAndPassword(auth, email, password);
        alert("登入成功！");
        window.location.href = "index.html";
    } catch (err) {
        alert(`登入失敗：${err.message}`);
    }
});

// ========== Google 登入 ==========
document.getElementById("google-login")?.addEventListener("click", () => {
    const provider = new GoogleAuthProvider();
    signInWithRedirect(auth, provider);
});

// ========== GitHub 登入 ==========
document.getElementById("github-login")?.addEventListener("click", () => {
    const provider = new GithubAuthProvider();
    signInWithRedirect(auth, provider);
});

// ========== 忘記密碼 ==========
document.getElementById("reset-password")?.addEventListener("click", async () => {
    const email = prompt("請輸入你的註冊信箱");
    if (email) {
        try {
            await sendPasswordResetEmail(auth, email);
            alert("重設密碼信已寄出！");
        } catch (err) {
            alert(`錯誤：${err.message}`);
        }
    }
});

// ========== 重發驗證信 ==========
document.getElementById("verify-email")?.addEventListener("click", async () => {
    if (auth.currentUser) {
        try {
            await sendEmailVerification(auth.currentUser);
            alert("驗證信已寄出！");
        } catch (err) {
            alert(`錯誤：${err.message}`);
        }
    } else {
        alert("請先登入帳戶。");
    }
});

// ========== 刪除帳號 ==========
document.getElementById("delete-account")?.addEventListener("click", async () => {
    if (auth.currentUser && confirm("確定要刪除帳號嗎？此操作無法復原！")) {
        try {
            await deleteUser(auth.currentUser);
            alert("帳號已刪除。");
        } catch (err) {
            alert(`錯誤：${err.message}`);
        }
    }
});

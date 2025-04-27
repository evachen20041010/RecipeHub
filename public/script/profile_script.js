import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import {
    getAuth,
    onAuthStateChanged,
    sendPasswordResetEmail,
    deleteUser,
    sendEmailVerification
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import {
    getFirestore,
    doc,
    getDoc,
    updateDoc,
    deleteDoc,
    query,
    collection,
    where,
    getDocs
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

// 顯示使用者資訊
onAuthStateChanged(auth, async (user) => {
    if (user) {
        const userDocSnap = await getDoc(doc(db, "users", user.uid));

        if (userDocSnap.exists()) {
            const userData = userDocSnap.data();

            // 更新基本資訊顯示
            document.getElementById("display-username").textContent = userData.username || "未設定";
            document.getElementById("display-bio").textContent = userData.bio || "未設定";

            // 預設編輯欄位
            document.getElementById("edit-section-username").value = userData.username || "";
            document.getElementById("edit-section-bio").value = userData.bio || "";

            // 顯示收藏的食譜
            await loadFavorites(userData.favorites || []);

            // 檢查信箱驗證狀態
            if (user.emailVerified) {
                document.getElementById("email-status").textContent = "已驗證";
                document.getElementById("resend-verification-btn").style.display = "none";
            } else {
                document.getElementById("email-status").textContent = "尚未驗證";
                document.getElementById("resend-verification-btn").style.display = "inline-block";
            }
        }
    } else {
        window.location.href = "auth.html";
    }
});

// 重新寄送驗證信
document.getElementById("resend-verification-btn").addEventListener("click", () => {
    const user = auth.currentUser;
    sendEmailVerification(user)
        .then(() => {
            alert("驗證信已重新寄出，請至信箱查收！");
        })
        .catch((error) => {
            alert(error.message);
        });
});

// 編輯按鈕切換
document.getElementById("edit-profile-btn").addEventListener("click", () => {
    document.getElementById("edit-section").style.display = "block";
});

// 儲存資料
document.getElementById("save-profile-btn").addEventListener("click", async () => {
    const user = auth.currentUser;
    const username = document.getElementById("edit-section-username").value.trim();
    const bio = document.getElementById("edit-section-bio").value.trim();

    if (!username) {
        alert("請填寫名稱！");
        return;
    }

    if (user) {
        try {
            await updateDoc(doc(db, "users", user.uid), {
                username,
                bio
            });

            console.log("更新成功", { username, bio });

            // 更新畫面
            document.getElementById("display-username").textContent = username;
            document.getElementById("display-bio").textContent = bio;

            alert("個人資料已儲存！");
            document.getElementById("edit-section").style.display = "none";
        } catch (error) {
            console.error("Firestore 更新失敗", error);
            alert("更新失敗：" + error.message);
        }
    }
});

// 顯示收藏的食譜
async function loadFavorites(favoriteIds) {
    if (!favoriteIds.length) return;

    const favoritesList = document.getElementById("favorites-list");
    favoritesList.innerHTML = "";

    // Firestore 支援 "in" 最多 10 筆，請根據實際需求分批查詢
    const q = query(collection(db, "recipes"), where("__name__", "in", favoriteIds.slice(0, 10)));
    const querySnapshot = await getDocs(q);

    querySnapshot.forEach((doc) => {
        const data = doc.data();
        const li = document.createElement("li");
        li.innerHTML = `
            <span>${data.title}</span>
            <a href="recipe_detail.html?id=${doc.id}" class="view-detail-btn">查看詳情</a>
        `;
        favoritesList.appendChild(li);
    });
}

// 修改密碼
document.getElementById("change-password-btn").addEventListener("click", () => {
    const email = auth.currentUser.email;
    sendPasswordResetEmail(auth, email)
        .then(() => {
            alert("重設密碼信已寄出！");
        })
        .catch((error) => {
            alert(error.message);
        });
});

// 刪除帳號
document.getElementById("delete-account-btn").addEventListener("click", async () => {
    const user = auth.currentUser;
    const userDocRef = doc(db, "users", user.uid);

    if (confirm("確定要刪除帳號？此操作無法還原。")) {
        try {
            await deleteDoc(userDocRef);
            await deleteUser(user);
            alert("帳號與資料已刪除");
            window.location.href = "auth.html";
        } catch (error) {
            alert("刪除失敗：" + error.message);
        }
    }
});

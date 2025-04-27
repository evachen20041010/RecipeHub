import { initializeApp, getApps, getApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import {
    getFirestore,
    doc,
    getDoc,
    updateDoc,
    arrayUnion,
    arrayRemove,
    Timestamp
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import {
    getAuth,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";

// Firebase 初始化
const firebaseConfig = {
    apiKey: "AIzaSyABrQw6GQegeUAc1KeFbN2dyIjfnpDHax4",
    authDomain: "recipehub-f0e58.firebaseapp.com",
    projectId: "recipehub-f0e58",
    storageBucket: "recipehub-f0e58.appspot.com",
    messagingSenderId: "704003148200",
    appId: "1:704003148200:web:82607f79411f493277759d",
    measurementId: "G-R9LGHW1J2J"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);
const auth = getAuth(app);

let currentUser = null;
let currentRecipeId = new URLSearchParams(window.location.search).get("id");
let recipeDocRef = doc(db, "recipes", currentRecipeId);
let userFirestoreData = null;

onAuthStateChanged(auth, async (user) => {
    if (user) {
        currentUser = user;
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        userFirestoreData = userDocSnap.exists() ? userDocSnap.data() : null;
        loadRecipeDetail();
    } else {
        alert("請先登入！");
        window.location.href = "auth.html";
    }
});

async function loadRecipeDetail() {
    const docSnap = await getDoc(recipeDocRef);
    if (docSnap.exists()) {
        const data = docSnap.data();

        // 顯示標題與圖片
        document.getElementById("recipe-title").textContent = data.title;
        document.getElementById("recipe-image").src = data.imageUrl || "https://via.placeholder.com/800x400?text=暫無圖片";

        // 顯示材料
        const ingredientsList = document.getElementById("recipe-ingredients");
        ingredientsList.innerHTML = "";
        data.ingredients.forEach(item => {
            const li = document.createElement("li");
            li.textContent = item;
            ingredientsList.appendChild(li);
        });

        // 顯示步驟
        document.getElementById("recipe-steps").innerHTML = marked.parse(data.steps);

        // 收藏狀態
        document.getElementById("favorites-count").textContent = data.favoritesCount || 0;
        if (data.favorites && data.favorites.includes(currentUser.uid)) {
            document.getElementById("favorite-btn").textContent = "💔 取消收藏";
        }

        // 顯示留言
        const commentsList = document.getElementById("comments-list");
        commentsList.innerHTML = "";
        (data.comments || []).forEach(comment => {
            const li = document.createElement("li");
            const timeFormatted = comment.timestamp ? formatTimestamp(comment.timestamp.toDate()) : "時間不明";
            li.innerHTML = `
                <span class="comment-author">${comment.uid}</span>
                <span>${comment.content}</span>
                <span class="comment-time">${timeFormatted}</span>
            `;
            commentsList.appendChild(li);
        });

    } else {
        alert("找不到該食譜！");
    }
}


// 收藏 / 取消收藏
document.getElementById("favorite-btn").addEventListener("click", async () => {
    const docSnap = await getDoc(recipeDocRef);
    const data = docSnap.data();
    const userDocRef = doc(db, "users", currentUser.uid);
    const userDocSnap = await getDoc(userDocRef);
    const userData = userDocSnap.data();

    let newFavorites = data.favorites || [];
    let newCount = data.favoritesCount || 0;

    if (newFavorites.includes(currentUser.uid)) {
        // 取消收藏
        await updateDoc(recipeDocRef, {
            favorites: arrayRemove(currentUser.uid),
            favoritesCount: newCount - 1
        });

        await updateDoc(userDocRef, {
            favorites: arrayRemove(currentRecipeId)
        });

        document.getElementById("favorite-btn").textContent = "❤️ 收藏";
        document.getElementById("favorites-count").textContent = newCount - 1;
    } else {
        // 收藏
        await updateDoc(recipeDocRef, {
            favorites: arrayUnion(currentUser.uid),
            favoritesCount: newCount + 1
        });

        await updateDoc(userDocRef, {
            favorites: arrayUnion(currentRecipeId)
        });

        document.getElementById("favorite-btn").textContent = "💔 取消收藏";
        document.getElementById("favorites-count").textContent = newCount + 1;
    }
});

// 發送留言
document.getElementById("submit-comment-btn").addEventListener("click", async () => {
    const commentContent = document.getElementById("comment-input").value.trim();
    if (commentContent) {
        await updateDoc(recipeDocRef, {
            comments: arrayUnion({
                uid: userFirestoreData?.username || currentUser.email || currentUser.uid,
                content: commentContent,
                timestamp: Timestamp.now()
            })
        });
        alert("留言已發送！");
        document.getElementById("comment-input").value = "";
        loadRecipeDetail(); // 重新載入留言
    }
});

// 格式化留言顯示
function formatTimestamp(date) {
    const d = new Date(date);
    const year = d.getFullYear();
    const month = (d.getMonth() + 1).toString().padStart(2, '0');
    const day = d.getDate().toString().padStart(2, '0');
    const hours = d.getHours().toString().padStart(2, '0');
    const minutes = d.getMinutes().toString().padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}`;
}

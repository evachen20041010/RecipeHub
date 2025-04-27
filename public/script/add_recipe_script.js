import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import {
    getAuth,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import {
    getFirestore,
    collection,
    addDoc,
    serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import {
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-storage.js";

// 初始化 Firebase
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
const storage = getStorage(app);

// 監聽登入狀態
let currentUser = null;
onAuthStateChanged(auth, (user) => {
    if (user) {
        currentUser = user;
    } else {
        alert("請先登入！");
        window.location.href = "auth.html";
    }
});

// 提交食譜
document.getElementById("submit-recipe-btn").addEventListener("click", async () => {
    const title = document.getElementById("recipe-title").value;
    const ingredientsRaw = document.getElementById("recipe-ingredients").value;
    const steps = document.getElementById("recipe-steps").value;

    if (!title || !ingredientsRaw || !steps) {
        alert("請填寫所有欄位！");
        return;
    }

    try {
        // 處理材料清單
        const ingredients = ingredientsRaw.split("\n").filter(line => line.trim() !== "");

        // 儲存至 Firestore
        await addDoc(collection(db, "recipes"), {
            title,
            ingredients,
            steps,
            imageUrl: "",  // 保留欄位為空，未來支援圖片可使用
            createdBy: currentUser.uid,
            createdAt: serverTimestamp(),
            favoritesCount: 0,
            favorites: [],
            comments: []
        });

        alert("食譜已成功新增！");
        window.location.href = "recipes.html";

    } catch (error) {
        alert("新增食譜失敗：" + error.message);
    }
});

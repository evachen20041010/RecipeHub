import {
    initializeApp,
    getApps,
    getApp
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js";
import {
    getFirestore,
    collection,
    getDocs
} from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";

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

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore(app);

// 取得 Firestore 中的食譜
async function loadRecipes() {
    const querySnapshot = await getDocs(collection(db, "recipes"));
    const recipeGrid = document.getElementById("recipe-grid");

    querySnapshot.forEach((doc) => {
        const data = doc.data();
        const imageUrl = data.imageUrl || "../images/placeholder.jpg"; // 若無圖片則用佔位圖

        const recipeCard = document.createElement("div");
        recipeCard.className = "recipe-card";
        recipeCard.innerHTML = `
      <img src="${imageUrl}" alt="${data.title}" />
      <div class="card-content">
        <h3>${data.title}</h3>
        <p>材料：${data.ingredients.slice(0, 3).join("、")}</p>
        <a href="recipe_detail.html?id=${doc.id}">查看詳情</a>
      </div>
    `;
        recipeGrid.appendChild(recipeCard);
    });
}

loadRecipes();

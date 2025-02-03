// 引入 Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, getDocs, doc, updateDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// 你的 Firebase 設定
const firebaseConfig = {
    apiKey: "AIzaSyA1nMl46TkXySnDkwJehcobU-n4ObLfsbk",
    authDomain: "ce-cpm-store.firebaseapp.com",
    projectId: "ce-cpm-store",
    storageBucket: "ce-cpm-store.firebasestorage.app",
    messagingSenderId: "168899552035",
    appId: "1:168899552035:web:1afa40b9f220cc77fa6296",
    measurementId: "G-Q8PL9MC78L"
  };

// 初始化 Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const productList = document.getElementById("product-list");
const cartList = document.getElementById("cart");

// 渲染商品
async function renderProducts() {
    productList.innerHTML = "";
    const querySnapshot = await getDocs(collection(db, "products"));
    querySnapshot.forEach(doc => {
        const product = doc.data();
        let productDiv = document.createElement("div");
        productDiv.classList.add("product");
        productDiv.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p>價格：$${product.price}</p>
            <p>剩餘數量：${product.stock}</p>
            <button onclick="addToCart('${doc.id}', ${product.stock})">加入購物車</button>
        `;
        productList.appendChild(productDiv);
    });
}

// 購物車
let cart = [];

async function addToCart(productId, stock) {
    if (stock > 0) {
        cart.push(productId);
        await updateStock(productId, stock - 1);
        renderProducts();
        renderCart();
    } else {
        alert("庫存不足！");
    }
}

// 更新 Firebase 庫存
async function updateStock(productId, newStock) {
    const productRef = doc(db, "products", productId);
    await updateDoc(productRef, { stock: newStock });
}

// 渲染購物車
function renderCart() {
    cartList.innerHTML = "";
    cart.forEach(productId => {
        let cartItem = document.createElement("li");
        cartItem.textContent = `商品 ID: ${productId}`;
        cartList.appendChild(cartItem);
    });
}

// 初始化
renderProducts();
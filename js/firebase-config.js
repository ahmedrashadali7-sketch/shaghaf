// استيراد مكتبات Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// إعدادات Firebase - باستخدام المفتاح الجديد
const firebaseConfig = {
    apiKey: "AIzaSyDpuVMALR_-vDdvCQFqWuYulioPWXm49Kg",
    authDomain: "shaghaf-story.firebaseapp.com",
    projectId: "shaghaf-story",
    storageBucket: "shaghaf-story.firebasestorage.app",
    messagingSenderId: "197591948575",
    appId: "1:197591948575:web:a0aaee7b7971f100c4e42a"
};

// تهيئة Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// تصدير المتغيرات لاستخدامها في باقي الملفات
export { app, auth, db };
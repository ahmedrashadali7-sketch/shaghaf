// استيراد مكتبات Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getStorage } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

// إعدادات Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAWQxciHVfYRGaFTgEOnDjQtNb7G-qvaQo",
  authDomain: "shaghaf-story.firebaseapp.com",
  projectId: "shaghaf-story",
  storageBucket: "shaghaf-story.firebasestorage.app",
  messagingSenderId: "197591948575",
  appId: "1:197591948575:web:a0aaee7b7971f100c4e42a",
  measurementId: "G-2NRG7ETZFF"
};

// تهيئة Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// تصدير المتغيرات لاستخدامها في ملفات أخرى
export { app, auth, db, storage };
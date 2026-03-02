// استيراد Firebase من الملف المركزي
import { db } from './firebase-config.js';

import { collection, addDoc, getDocs, getDoc, doc, updateDoc, deleteDoc, query, orderBy, limit } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// ✅ تأكد من نجاح الاستيراد
console.log('✅ Firebase Stories initialized');

// ===== إدارة القصص (أنت فقط من يستخدمها) =====

// إضافة قصة جديدة
export async function addStory(storyData) {
    try {
        const docRef = await addDoc(collection(db, "stories"), {
            ...storyData,
            createdAt: new Date().toISOString(),
            likes: 0,
            comments: 0,
            rating: 0
        });
        console.log("تم إضافة القصة بنجاح، ID:", docRef.id);
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error("خطأ في إضافة القصة:", error);
        return { success: false, error: error.message };
    }
}

// جلب كل القصص (للصفحة الرئيسية)
export async function getAllStories() {
    try {
        const q = query(collection(db, "stories"), orderBy("createdAt", "desc"));
        const querySnapshot = await getDocs(q);
        const stories = [];
        querySnapshot.forEach((doc) => {
            stories.push({ id: doc.id, ...doc.data() });
        });
        return { success: true, stories };
    } catch (error) {
        console.error("خطأ في جلب القصص:", error);
        return { success: false, error: error.message };
    }
}

// جلب قصة واحدة (لصفحة القراءة)
export async function getStory(storyId) {
    try {
        const docRef = doc(db, "stories", storyId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { success: true, story: { id: docSnap.id, ...docSnap.data() } };
        } else {
            return { success: false, error: "القصة غير موجودة" };
        }
    } catch (error) {
        console.error("خطأ في جلب القصة:", error);
        return { success: false, error: error.message };
    }
}

// تحديث قصة
export async function updateStory(storyId, storyData) {
    try {
        const docRef = doc(db, "stories", storyId);
        await updateDoc(docRef, {
            ...storyData,
            updatedAt: new Date().toISOString()
        });
        return { success: true };
    } catch (error) {
        console.error("خطأ في تحديث القصة:", error);
        return { success: false, error: error.message };
    }
}

// حذف قصة
export async function deleteStory(storyId) {
    try {
        await deleteDoc(doc(db, "stories", storyId));
        return { success: true };
    } catch (error) {
        console.error("خطأ في حذف القصة:", error);
        return { success: false, error: error.message };
    }
}

// جلب أحدث 6 قصص (للصفحة الرئيسية)
export async function getLatestStories(limitCount = 6) {
    try {
        const q = query(collection(db, "stories"), orderBy("createdAt", "desc"), limit(limitCount));
        const querySnapshot = await getDocs(q);
        const stories = [];
        querySnapshot.forEach((doc) => {
            stories.push({ id: doc.id, ...doc.data() });
        });
        return { success: true, stories };
    } catch (error) {
        console.error("خطأ في جلب أحدث القصص:", error);
        return { success: false, error: error.message };
    }
}
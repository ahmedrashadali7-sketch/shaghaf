// استيراد Firebase
import { db } from './firebase-config.js';
import { 
    collection, addDoc, getDocs, query, where, orderBy, 
    updateDoc, doc, increment, arrayUnion, arrayRemove,
    getDoc, deleteDoc
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// ===== إدارة التعليقات =====

// إضافة تعليق على قصة
export async function addComment(storyId, userId, userName, commentText) {
    try {
        const commentData = {
            storyId,
            userId,
            userName,
            comment: commentText,
            createdAt: new Date().toISOString(),
            likes: 0
        };
        
        const docRef = await addDoc(collection(db, "comments"), commentData);
        
        // تحديث عدد التعليقات في القصة
        const storyRef = doc(db, "stories", storyId);
        await updateDoc(storyRef, {
            comments: increment(1)
        });
        
        // تحديث عدد التعليقات في ملف المستخدم
        const userRef = doc(db, "users", userId);
        await updateDoc(userRef, {
            comments: increment(1)
        });
        
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error("خطأ في إضافة التعليق:", error);
        return { success: false, error: error.message };
    }
}

// جلب تعليقات قصة معينة
export async function getStoryComments(storyId) {
    try {
        const q = query(
            collection(db, "comments"), 
            where("storyId", "==", storyId),
            orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        const comments = [];
        querySnapshot.forEach((doc) => {
            comments.push({ id: doc.id, ...doc.data() });
        });
        return { success: true, comments };
    } catch (error) {
        console.error("خطأ في جلب التعليقات:", error);
        return { success: false, error: error.message };
    }
}

// ===== إدارة الإعجابات =====

// إضافة/إزالة إعجاب
export async function toggleLike(storyId, userId) {
    try {
        const likeRef = doc(db, "stories", storyId);
        const userRef = doc(db, "users", userId);
        
        // التحقق من وجود إعجاب سابق
        const likeQuery = query(
            collection(db, "likes"),
            where("storyId", "==", storyId),
            where("userId", "==", userId)
        );
        const likeSnapshot = await getDocs(likeQuery);
        
        if (likeSnapshot.empty) {
            // إضافة إعجاب جديد
            await addDoc(collection(db, "likes"), {
                storyId,
                userId,
                createdAt: new Date().toISOString()
            });
            
            // زيادة عدد الإعجابات في القصة
            await updateDoc(likeRef, {
                likes: increment(1)
            });
            
            // زيادة عدد الإعجابات في ملف المستخدم
            await updateDoc(userRef, {
                likes: increment(1)
            });
            
            return { success: true, liked: true };
        } else {
            // إزالة الإعجاب
            await deleteDoc(likeSnapshot.docs[0].ref);
            
            // نقص عدد الإعجابات في القصة
            await updateDoc(likeRef, {
                likes: increment(-1)
            });
            
            // نقص عدد الإعجابات في ملف المستخدم
            await updateDoc(userRef, {
                likes: increment(-1)
            });
            
            return { success: true, liked: false };
        }
    } catch (error) {
        console.error("خطأ في تعديل الإعجاب:", error);
        return { success: false, error: error.message };
    }
}

// التحقق من إعجاب المستخدم
export async function checkUserLike(storyId, userId) {
    try {
        const q = query(
            collection(db, "likes"),
            where("storyId", "==", storyId),
            where("userId", "==", userId)
        );
        const querySnapshot = await getDocs(q);
        return { success: true, liked: !querySnapshot.empty };
    } catch (error) {
        console.error("خطأ في التحقق من الإعجاب:", error);
        return { success: false, error: error.message };
    }
}

// ===== إدارة المفضلة =====

// إضافة/إزالة من المفضلة
export async function toggleFavorite(storyId, userId) {
    try {
        const userRef = doc(db, "users", userId);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
            const favorites = userDoc.data().favorites || [];
            
            if (favorites.includes(storyId)) {
                // إزالة من المفضلة
                await updateDoc(userRef, {
                    favorites: arrayRemove(storyId)
                });
                return { success: true, favorited: false };
            } else {
                // إضافة للمفضلة
                await updateDoc(userRef, {
                    favorites: arrayUnion(storyId)
                });
                return { success: true, favorited: true };
            }
        }
    } catch (error) {
        console.error("خطأ في تعديل المفضلة:", error);
        return { success: false, error: error.message };
    }
}

// جلب مفضلة المستخدم
export async function getUserFavorites(userId) {
    try {
        const userRef = doc(db, "users", userId);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
            const favoriteIds = userDoc.data().favorites || [];
            
            // جلب بيانات القصص المفضلة
            const stories = [];
            for (const storyId of favoriteIds) {
                const storyRef = doc(db, "stories", storyId);
                const storyDoc = await getDoc(storyRef);
                if (storyDoc.exists()) {
                    stories.push({ id: storyDoc.id, ...storyDoc.data() });
                }
            }
            
            return { success: true, favorites: stories };
        }
        return { success: true, favorites: [] };
    } catch (error) {
        console.error("خطأ في جلب المفضلة:", error);
        return { success: false, error: error.message };
    }
}
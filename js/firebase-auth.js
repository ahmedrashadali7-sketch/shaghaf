// استيراد Firebase من الملف المركزي
import { auth, db } from './firebase-config.js';

// استيراد الدوال المطلوبة
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    signOut, 
    onAuthStateChanged,
    updateProfile,
    GoogleAuthProvider,
    signInWithPopup
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// ✅ تأكد من نجاح الاستيراد
console.log('✅ Firebase Auth initialized');

// ===== إدارة المستخدمين (الزوار) =====

// إنشاء حساب جديد
export async function signUp(email, password, name) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        
        // تحديث اسم المستخدم
        await updateProfile(user, {
            displayName: name
        });
        
        // حفظ بيانات المستخدم في Firestore
        await setDoc(doc(db, "users", user.uid), {
            name: name,
            email: email,
            createdAt: new Date().toISOString(),
            avatar: "https://via.placeholder.com/100x100",
            favorites: [],
            comments: 0,
            likes: 0
        });
        
        return { success: true, user };
    } catch (error) {
        console.error("خطأ في إنشاء الحساب:", error);
        let errorMessage = "حدث خطأ في إنشاء الحساب";
        
        // ترجمة رسائل الخطأ
        if (error.code === 'auth/email-already-in-use') {
            errorMessage = "البريد الإلكتروني مستخدم بالفعل";
        } else if (error.code === 'auth/weak-password') {
            errorMessage = "كلمة المرور ضعيفة (يجب أن تكون 6 أحرف على الأقل)";
        } else if (error.code === 'auth/invalid-email') {
            errorMessage = "البريد الإلكتروني غير صالح";
        }
        
        return { success: false, error: errorMessage };
    }
}

// تسجيل الدخول
export async function signIn(email, password) {
    try {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        return { success: true, user: userCredential.user };
    } catch (error) {
        console.error("خطأ في تسجيل الدخول:", error);
        let errorMessage = "البريد الإلكتروني أو كلمة المرور غير صحيحة";
        
        if (error.code === 'auth/user-not-found') {
            errorMessage = "لا يوجد حساب بهذا البريد الإلكتروني";
        } else if (error.code === 'auth/wrong-password') {
            errorMessage = "كلمة المرور غير صحيحة";
        }
        
        return { success: false, error: errorMessage };
    }
}

// تسجيل الخروج
export async function logOut() {
    try {
        await signOut(auth);
        return { success: true };
    } catch (error) {
        console.error("خطأ في تسجيل الخروج:", error);
        return { success: false, error: error.message };
    }
}

// مراقبة حالة تسجيل الدخول
export function onAuthChange(callback) {
    return onAuthStateChanged(auth, callback);
}

// جلب بيانات المستخدم
export async function getUserData(userId) {
    try {
        const docRef = doc(db, "users", userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return { success: true, userData: docSnap.data() };
        } else {
            return { success: false, error: "المستخدم غير موجود" };
        }
    } catch (error) {
        console.error("خطأ في جلب بيانات المستخدم:", error);
        return { success: false, error: error.message };
    }
}

// الحصول على المستخدم الحالي
export function getCurrentUser() {
    return auth.currentUser;
}
/*
  شغف - الملف الرئيسي للجافاسكربت
  الإصدار: 3.0 (مع تحسينات القائمة الجانبية النهائية)
*/

// ===== إدارة القائمة الجانبية المحسنة =====
document.addEventListener('DOMContentLoaded', function() {
    const menuBtn = document.querySelector('.mobile-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    // إنشاء طبقة الخلفية المعتمة إذا لم تكن موجودة
    let overlay = document.querySelector('.menu-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.className = 'menu-overlay';
        document.body.appendChild(overlay);
    }
    
    // دالة إغلاق القائمة
    function closeMenu() {
        if (mobileMenu) {
            mobileMenu.classList.remove('active');
        }
        overlay.classList.remove('active');
        document.body.style.overflow = ''; // إعادة التمرير
    }
    
    // فتح القائمة
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            e.preventDefault();
            mobileMenu.classList.add('active');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // منع التمرير
        });
    }
    
    // إغلاق القائمة عند الضغط على الخلفية المعتمة
    if (overlay) {
        overlay.addEventListener('click', function() {
            closeMenu();
        });
    }
    
    // إغلاق القائمة عند الضغط على زر ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && mobileMenu && mobileMenu.classList.contains('active')) {
            closeMenu();
        }
    });
    
    // منع إغلاق القائمة عند الضغط داخل القائمة نفسها
    if (mobileMenu) {
        mobileMenu.addEventListener('click', function(e) {
            e.stopPropagation();
        });
    }
    
    // إغلاق القائمة عند الضغط على أي رابط داخل القائمة
    if (mobileMenu) {
        const menuLinks = mobileMenu.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', function() {
                closeMenu();
            });
        });
    }
    
    // إضافة زر إغلاق داخل القائمة إذا لم يكن موجوداً
    if (mobileMenu && !document.querySelector('.mobile-menu-close')) {
        const closeBtn = document.createElement('button');
        closeBtn.className = 'mobile-menu-close';
        closeBtn.innerHTML = '<i class="fas fa-times"></i>';
        closeBtn.addEventListener('click', closeMenu);
        mobileMenu.prepend(closeBtn);
    }
    
    // إضافة رأس القائمة إذا لم يكن موجوداً
    if (mobileMenu && !document.querySelector('.mobile-menu-header')) {
        const menuHeader = document.createElement('div');
        menuHeader.className = 'mobile-menu-header';
        menuHeader.innerHTML = `
            <div class="logo-mini">
                <i class="fas fa-heart"></i>
            </div>
            <h3>شغف</h3>
        `;
        
        // نضيفه بعد زر الإغلاق
        if (mobileMenu.firstChild) {
            mobileMenu.insertBefore(menuHeader, mobileMenu.firstChild.nextSibling);
        } else {
            mobileMenu.appendChild(menuHeader);
        }
    }
});

// ===== تحديث محتوى القائمة حسب حالة المستخدم =====
function updateMobileMenuForUser(user) {
    const mobileMenuButtons = document.getElementById('mobileMenuButtons');
    const mobileUserInfo = document.querySelector('.mobile-user-info');
    
    if (!mobileUserInfo || !mobileMenuButtons) return;
    
    if (user) {
        // مستخدم مسجل
        mobileUserInfo.innerHTML = `
            <img src="${user.photoURL || 'https://via.placeholder.com/45x45'}" 
                 alt="${user.displayName || 'مستخدم'}" 
                 class="mobile-user-avatar">
            <div class="mobile-user-details">
                <h4>${user.displayName || 'مستخدم'}</h4>
                <p>مرحباً بعودتك</p>
            </div>
        `;
        
        mobileMenuButtons.innerHTML = `
            <button class="btn btn-outline" onclick="logout()">
                <i class="fas fa-sign-out-alt"></i> تسجيل خروج
            </button>
        `;
    } else {
        // زائر
        mobileUserInfo.innerHTML = `
            <div class="mobile-user-avatar" style="background: linear-gradient(135deg, #ff6b6b, #ffb6b6); display: flex; align-items: center; justify-content: center;">
                <i class="fas fa-user" style="color: white; font-size: 1.2rem;"></i>
            </div>
            <div class="mobile-user-details">
                <h4>زائر</h4>
                <p>سجل دخولك للمشاركة</p>
            </div>
        `;
        
        mobileMenuButtons.innerHTML = `
            <a href="login.html" class="btn btn-outline">
                <i class="fas fa-sign-in-alt"></i> دخول
            </a>
            <a href="signup.html" class="btn btn-primary">
                <i class="fas fa-user-plus"></i> انضمام
            </a>
        `;
    }
}

// ===== تحديد الصفحة النشطة في القائمة =====
function setActiveNavLink() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a');
    const mobileLinks = document.querySelectorAll('.mobile-menu ul li a');
    
    // تحديث الروابط الرئيسية
    navLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        link.classList.remove('active');
        
        if (linkPage === currentPage) {
            link.classList.add('active');
        } else if (currentPage === '' && linkPage === 'index.html') {
            link.classList.add('active');
        }
    });
    
    // تحديث روابط القائمة الجانبية
    mobileLinks.forEach(link => {
        const linkPage = link.getAttribute('href');
        link.style.color = '';
        link.style.fontWeight = '';
        
        if (linkPage === currentPage) {
            link.style.color = '#ff6b6b';
            link.style.fontWeight = '700';
        } else if (currentPage === '' && linkPage === 'index.html') {
            link.style.color = '#ff6b6b';
            link.style.fontWeight = '700';
        }
    });
}

// ===== دوال تسجيل الخروج (مؤقتة) =====
window.logout = function() {
    alert('تم تسجيل الخروج بنجاح');
    window.location.reload();
};

// ===== تشغيل عند تحميل الصفحة =====
document.addEventListener('DOMContentLoaded', function() {
    setActiveNavLink();
});
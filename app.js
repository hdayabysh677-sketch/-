// ==========================================
// 1️⃣ الشاشة الترحيبية (تختفي بعد 5 ثوانٍ)
// ==========================================
window.addEventListener('DOMContentLoaded', () => {
    const splash = document.getElementById('splash-screen');
    if (splash) {
        setTimeout(() => {
            splash.style.opacity = '0';
            setTimeout(() => {
                splash.style.display = 'none';
            }, 500);
        }, 5000);
    }
});

// ==========================================
// 2️⃣ إرسال استفسار مباشر إلى الواتساب
// ==========================================
function askAboutProduct(productName) {
    let message = `*استفسار عن منتج من (هدايا بيش للتجارة)*\n\n`;
    message += `السلام عليكم، أود الاستفسار عن تفاصيل وتوفر هذا المنتج:\n`;
    message += `🎁 *${productName}*\n\n`;
    message += `أرجو إفادتي بالسعر والمدة المطلوبة للتجهيز. شكراً لكم!`;

    let encodedMessage = encodeURIComponent(message);
    let whatsappUrl = `https://wa.me/966505305996?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
}

// ==========================================
// 3️⃣ إعدادات تطبيق الـ PWA وتثبيته المخصص
// ==========================================
let deferredPrompt;
const installBtn = document.getElementById('install-btn');

window.addEventListener('beforeinstallprompt', (e) => {
    // منع النافذة التلقائية للمتصفح
    e.preventDefault();
    deferredPrompt = e;
    
    // إظهار زر التثبيت المخصص الذي أضفناه
    if (installBtn) {
        installBtn.style.display = 'block';
    }
});

// برمجة عمل الزر عند الضغط عليه
if (installBtn) {
    installBtn.addEventListener('click', () => {
        if (deferredPrompt) {
            // إظهار نافذة التثبيت للهاتف
            deferredPrompt.prompt();
            
            // معرفة قرار المستخدم
            deferredPrompt.userChoice.then((choiceResult) => {
                if (choiceResult.outcome === 'accepted') {
                    console.log('وافق المستخدم على تثبيت التطبيق');
                }
                deferredPrompt = null;
                // إخفاء الزر بعد اتخاذ القرار
                installBtn.style.display = 'none';
            });
        }
    });
}

// إخفاء الزر تلقائياً إذا تم تثبيت التطبيق بنجاح
window.addEventListener('appinstalled', () => {
    if (installBtn) {
        installBtn.style.display = 'none';
    }
    deferredPrompt = null;
    console.log('تم تثبيت التطبيق بنجاح على الجهاز');
});

// تسجيل الـ Service Worker
window.addEventListener('load', () => {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js').then(() => console.log('SW Registered'));
    }
});

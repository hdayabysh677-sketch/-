let cart = [];
let total = 0;
let userCoordinatesLink = ""; 
let currentOrderType = "توصيل"; // القيمة الافتراضية
let deferredPrompt;

// إضافة المنتجات وتحديث العرض
function addToCart(name, price) {
    cart.push({name: name, price: price});
    total += price;
    updateCartUI();
}

function updateCartUI() {
    // تحديث شريط السلة السفلي الرئيسي
    document.getElementById('cartCount').innerText = `السلة: ${cart.length} عناصر`;
    document.getElementById('cartTotal').innerText = `${total} ر.س`;
    
    // تحديث السعر الإجمالي داخل النافذة المنبثقة
    document.getElementById('modalTotal').innerText = `${total} ر.س`;

    // تحديث قائمة الأصناف المكتوبة داخل النافذة
    const itemsListContainer = document.getElementById('cartItemsList');
    if(cart.length === 0) {
        itemsListContainer.innerHTML = `<p class="empty-msg">السلة فارغة حالياً.. أضف بعض المنتجات!</p>`;
    } else {
        let itemsHtml = "";
        // تجميع المنتجات لمعرفة تكرارها
        let itemCounts = {};
        cart.forEach(item => {
            itemCounts[item.name] = (itemCounts[item.name] || 0) + 1;
        });
        
        for (let name in itemCounts) {
            itemsHtml += `
                <div class="cart-item-row">
                    <span>🎁 ${name} (×${itemCounts[name]})</span>
                </div>
            `;
        }
        itemsListContainer.innerHTML = itemsHtml;
    }
}

// التحكم في فتح وإغلاق نافذة السلة
function toggleCartModal(show) {
    const modal = document.getElementById('cartModal');
    if(show) {
        modal.style.display = "block";
        updateCartUI(); // للتأكد من تحديث البيانات عند الفتح
    } else {
        modal.style.display = "none";
    }
}

// إغلاق النافذة عند الضغط خارجها
window.onclick = function(event) {
    const modal = document.getElementById('cartModal');
    if (event.target == modal) {
        modal.style.display = "none";
    }
}

// التحكم في ظهور وإخفاء قسم الموقع بناء على نوع الاستلام
function handleOrderTypeChange(value) {
    currentOrderType = value;
    const locationSection = document.getElementById('locationSection');
    if(value === "استلام") {
        locationSection.style.display = "none";
    } else {
        locationSection.style.display = "block";
    }
}

// تحديد الموقع الجغرافي
function getLocation() {
    const statusDiv = document.getElementById('geo-status');
    if (!navigator.geolocation) {
        statusDiv.style.color = "red";
        statusDiv.innerText = "متصفحك لا يدعم تحديد الموقع تلقائياً.";
        return;
    }
    statusDiv.style.color = "orange";
    statusDiv.innerText = "جاري تحديد موقعك الحالي...";

    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            userCoordinatesLink = `https://maps.google.com/?q=${lat},${lng}`;
            statusDiv.style.color = "green";
            statusDiv.innerText = "🎯 تم تحديد موقعك بنجاح وسيرسل مع الطلب!";
        },
        (error) => {
            statusDiv.style.color = "red";
            statusDiv.innerText = "فشل التحديد. الرجاء تفعيل الـ GPS في جوالك.";
        }
    );
}

// صياغة وإرسال رسالة الواتساب النهائية
function sendWhatsAppOrder() {
    if(cart.length === 0) {
        alert('الرجاء إضافة أصناف إلى السلة أولاً!');
        return;
    }

    let textLocation = document.getElementById('customerLocation').value.trim();
    let orderNotes = document.getElementById('orderNotes').value.trim();
    
    // التحقق من الموقع في حال كان الخيار هو توصيل
    if(currentOrderType === "توصيل" && textLocation === "" && userCoordinatesLink === "") {
        alert('الرجاء تحديد موقعك تلقائياً أو كتابة العنوان يدوياً لإتمام خيار التوصيل!');
        return;
    }

    let message = `*طلب جديد من منيو (هدايا بيش للتجارة)*\n\n`;
    
    // تجميع الأصناف والعدد
    let itemCounts = {};
    cart.forEach(item => {
        itemCounts[item.name] = (itemCounts[item.name] || 0) + 1;
    });

    message += `*🎁 الأصناف المطلوبة:*\n`;
    for (let name in itemCounts) {
        message += `- ${name} (العدد: ${itemCounts[name]})\n`;
    }

    message += `\n*💰 المجموع الإجمالي:* ${total} ر.س\n`;
    message += `*📦 طريقة الاستلام:* ${currentOrderType === "توصيل" ? "توصيل إلى الموقع" : "استلام من المحل"}\n`;
    
    // إضافة تفاصيل الموقع في حال التوصيل
    if(currentOrderType === "توصيل") {
        if(userCoordinatesLink !== "") {
            message += `*📍 موقع الخريطة (GPS):* ${userCoordinatesLink}\n`;
        }
        if(textLocation !== "") {
            message += `*🏠 العنوان المكتوب:* ${textLocation}\n`;
        }
    }

    // إضافة الملاحظات إذا كتبت
    if(orderNotes !== "") {
        message += `\n*📝 ملاحظات الزبون:*\n${orderNotes}\n`;
    }

    message += `\nشكراً لتعاملكم معنا!`;

    let encodedMessage = encodeURIComponent(message);
    let whatsappUrl = `https://wa.me/966505305996?text=${encodedMessage}`;
    
    window.open(whatsappUrl, '_blank');
}

// كود الـ PWA
window.addEventListener('load', () => {
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('sw.js').then(() => console.log('SW Registered'));
    }
});

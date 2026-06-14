// ============ تبديل علامات التبويب ============
const tabs = document.querySelectorAll('.tab');
const forms = document.querySelectorAll('.form');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const targetTab = tab.dataset.tab;

        // إزالة الحالة النشطة من جميع التبويبات
        tabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');

        // إظهار النموذج المطلوب
        forms.forEach(form => {
            form.classList.remove('active');
            if (form.id === targetTab + 'Form') {
                form.classList.add('active');
            }
        });

        // إعادة تعيين حقول النموذج
        resetForm(document.getElementById(targetTab + 'Form'));
    });
});

function resetForm(form) {
    form.reset();
    form.querySelectorAll('input').forEach(input => {
        input.classList.remove('error', 'success');
    });
    form.querySelectorAll('.error-message').forEach(msg => msg.remove());
    form.querySelectorAll('.password-strength-bar').forEach(bar => {
        bar.className = 'password-strength-bar';
        bar.style.width = '0';
    });
}

// ============ إظهار/إخفاء كلمة المرور ============
document.querySelectorAll('.toggle-password').forEach(icon => {
    icon.addEventListener('click', () => {
        const targetId = icon.dataset.target;
        const input = document.getElementById(targetId);

        if (input.type === 'password') {
            input.type = 'text';
            icon.textContent = '🙈';
        } else {
            input.type = 'password';
            icon.textContent = '👁️';
        }
    });
});

// ============ التحقق من صحة البريد الإلكتروني ============
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// ============ التحقق من رقم الهاتف ============
function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[0-9\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
}

// ============ عرض رسائل الخطأ ============
function showError(input, message) {
    input.classList.add('error');
    input.classList.remove('success');

    // إزالة رسالة الخطأ السابقة إن وجدت
    const existingError = input.parentElement.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }

    const errorElement = document.createElement('span');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    input.parentElement.appendChild(errorElement);

    // إزالة الخطأ بعد فترة
    setTimeout(() => {
        input.classList.remove('error');
        if (errorElement.parentElement) {
            errorElement.remove();
        }
    }, 3000);
}

function showSuccess(input) {
    input.classList.add('success');
    input.classList.remove('error');
    const existingError = input.parentElement.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
}

// ============ مؤشر قوة كلمة المرور ============
const signupPassword = document.getElementById('signupPassword');
if (signupPassword) {
    signupPassword.addEventListener('input', () => {
        const password = signupPassword.value;
        const strengthBar = document.querySelector('#signupPassword ~ .password-strength-bar') ||
                           createStrengthBar(signupPassword);
        const strengthText = document.querySelector('#signupPassword ~ .password-strength-text') ||
                            createStrengthText(signupPassword);

        const strength = calculatePasswordStrength(password);

        strengthBar.className = 'password-strength-bar';
        if (strength === 'weak') {
            strengthBar.classList.add('weak');
            strengthText.textContent = 'ضعيفة';
            strengthText.style.color = '#ff4444';
        } else if (strength === 'medium') {
            strengthBar.classList.add('medium');
            strengthText.textContent = 'متوسطة';
            strengthText.style.color = '#ffaa00';
        } else if (strength === 'strong') {
            strengthBar.classList.add('strong');
            strengthText.textContent = 'قوية';
            strengthText.style.color = '#ffd700';
        } else {
            strengthText.textContent = '';
        }
    });
}

function createStrengthBar(input) {
    const container = document.createElement('div');
    container.className = 'password-strength';
    const bar = document.createElement('div');
    bar.className = 'password-strength-bar';
    container.appendChild(bar);
    input.parentElement.appendChild(container);
    return bar;
}

function createStrengthText(input) {
    const text = document.createElement('div');
    text.className = 'password-strength-text';
    input.parentElement.appendChild(text);
    return text;
}

function calculatePasswordStrength(password) {
    if (password.length === 0) return 'none';
    if (password.length < 6) return 'weak';

    let score = 0;
    if (password.length >= 8) score++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    if (score <= 2) return 'weak';
    if (score === 3) return 'medium';
    return 'strong';
}

// ============ معالجة نموذج تسجيل الدخول ============
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const email = document.getElementById('loginEmail');
        const password = document.getElementById('loginPassword');
        let isValid = true;

        // التحقق من البريد الإلكتروني
        if (!email.value.trim()) {
            showError(email, 'البريد الإلكتروني مطلوب');
            isValid = false;
        } else if (!isValidEmail(email.value)) {
            showError(email, 'البريد الإلكتروني غير صالح');
            isValid = false;
        } else {
            showSuccess(email);
        }

        // التحقق من كلمة المرور
        if (!password.value) {
            showError(password, 'كلمة المرور مطلوبة');
            isValid = false;
        } else if (password.value.length < 6) {
            showError(password, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل');
            isValid = false;
        } else {
            showSuccess(password);
        }

        if (isValid) {
            submitForm(loginForm, 'تم تسجيل الدخول بنجاح!');
        }
    });
}

// ============ معالجة نموذج إنشاء حساب ============
const signupForm = document.getElementById('signupForm');
if (signupForm) {
    signupForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('signupName');
        const email = document.getElementById('signupEmail');
        const phone = document.getElementById('signupPhone');
        const password = document.getElementById('signupPassword');
        const confirm = document.getElementById('signupConfirm');
        const agree = document.getElementById('agree');
        let isValid = true;

        // التحقق من الاسم
        if (!name.value.trim() || name.value.trim().length < 3) {
            showError(name, 'الاسم يجب أن يكون 3 أحرف على الأقل');
            isValid = false;
        } else {
            showSuccess(name);
        }

        // التحقق من البريد
        if (!email.value.trim()) {
            showError(email, 'البريد الإلكتروني مطلوب');
            isValid = false;
        } else if (!isValidEmail(email.value)) {
            showError(email, 'البريد الإلكتروني غير صالح');
            isValid = false;
        } else {
            showSuccess(email);
        }

        // التحقق من الهاتف
        if (!phone.value.trim()) {
            showError(phone, 'رقم الهاتف مطلوب');
            isValid = false;
        } else if (!isValidPhone(phone.value)) {
            showError(phone, 'رقم الهاتف غير صالح');
            isValid = false;
        } else {
            showSuccess(phone);
        }

        // التحقق من كلمة المرور
        if (!password.value) {
            showError(password, 'كلمة المرور مطلوبة');
            isValid = false;
        } else if (password.value.length < 6) {
            showError(password, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل');
            isValid = false;
        } else {
            showSuccess(password);
        }

        // التحقق من تطابق كلمتي المرور
        if (password.value !== confirm.value) {
            showError(confirm, 'كلمات المرور غير متطابقة');
            isValid = false;
        } else if (confirm.value) {
            showSuccess(confirm);
        }

        // التحقق من الموافقة على الشروط
        if (!agree.checked) {
            alert('يجب الموافقة على الشروط والأحكام');
            isValid = false;
        }

        if (isValid) {
            submitForm(signupForm, 'تم إنشاء حسابك بنجاح!');
        }
    });
}

// ============ إرسال النموذج (محاكاة) ============
function submitForm(form, message) {
    const submitBtn = form.querySelector('.submit-btn');
    submitBtn.classList.add('loading');

    // محاكاة طلب الخادم
    setTimeout(() => {
        submitBtn.classList.remove('loading');
        showSuccessMessage(message);
    }, 1500);
}

// ============ عرض رسالة النجاح ============
function showSuccessMessage(message) {
    const formCard = document.querySelector('.form-card');
    const successMessage = document.getElementById('successMessage');
    const successText = document.getElementById('successText');

    // إخفاء كل شيء
    document.querySelectorAll('.form, .tabs, .brand').forEach(el => {
        el.style.display = 'none';
    });

    successText.textContent = message;
    successMessage.classList.add('show');

    // إعادة التحميل بعد 3 ثوان
    setTimeout(() => {
        location.reload();
    }, 3000);
}

// ============ إنشاء الجسيمات المتحركة ============
function createParticles() {
    const particlesContainer = document.getElementById('particles');
    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 8 + 6) + 's';
        particle.style.animationDelay = Math.random() * 5 + 's';
        particle.style.opacity = Math.random() * 0.5 + 0.3;
        particlesContainer.appendChild(particle);
    }
}

// ============ تأثير الكتابة على الحقول ============
document.querySelectorAll('.input-group input').forEach(input => {
    input.addEventListener('input', () => {
        if (input.value.trim()) {
            input.classList.add('has-value');
        } else {
            input.classList.remove('has-value');
        }
    });
});

// ============ تهيئة الصفحة ============
document.addEventListener('DOMContentLoaded', () => {
    createParticles();

    // إضافة تأثير عند تحميل الصفحة
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// ============ تأثير حركة الماوس على الأشكال ============
document.addEventListener('mousemove', (e) => {
    const shapes = document.querySelectorAll('.shape');
    const x = e.clientX / window.innerWidth;
    const y = e.clientY / window.innerHeight;

    shapes.forEach((shape, index) => {
        const speed = (index + 1) * 10;
        const moveX = (x - 0.5) * speed;
        const moveY = (y - 0.5) * speed;
        shape.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
});

// ============ منع الإرسال المتعدد ============
let isSubmitting = false;
document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', (e) => {
        if (isSubmitting) {
            e.preventDefault();
            return;
        }
        isSubmitting = true;
        setTimeout(() => { isSubmitting = false; }, 2000);
    });
});

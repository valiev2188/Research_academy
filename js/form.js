document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('leadForm');
    if (!contactForm) return;

    // ─── Telegram credentials ─────────────────────────────────────────────
    const BOT_TOKEN = '8424752467:AAECss6pA38hWsepicfeVRrMj65YvP7WuwA';
    const CHAT_ID   = '-5251256520';
    // ──────────────────────────────────────────────────────────────────────

    // ── Phone mask +998 (__) ___-__-__ ────────────────────────────────────
    const phoneInput = document.getElementById('phone');
    if (phoneInput) {
        // Initialise with country code
        phoneInput.addEventListener('focus', () => {
            if (!phoneInput.value) phoneInput.value = '+998 ';
        });

        phoneInput.addEventListener('input', (e) => {
            let val = phoneInput.value.replace(/\D/g, '');
            // Always start with 998
            if (!val.startsWith('998')) val = '998' + val.replace(/^998/, '');
            val = val.substring(0, 12); // max 12 digits

            let formatted = '+998';
            if (val.length > 3) formatted += ' (' + val.substring(3, 5);
            if (val.length >= 5) formatted += ') ' + val.substring(5, 8);
            if (val.length >= 8) formatted += '-' + val.substring(8, 10);
            if (val.length >= 10) formatted += '-' + val.substring(10, 12);

            phoneInput.value = formatted;
        });

        phoneInput.addEventListener('keydown', (e) => {
            // Prevent deleting the +998 prefix
            if ((e.key === 'Backspace' || e.key === 'Delete') && phoneInput.value === '+998 ') {
                e.preventDefault();
            }
        });
    }
    // ──────────────────────────────────────────────────────────────────────

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const btn = contactForm.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        const currentLang = localStorage.getItem('appLang') || 'ru';
        const langDisplay = currentLang.toUpperCase();
        
        const statusEl = contactForm.querySelector('#status');
        const statusText = statusEl && statusEl.selectedIndex >= 0 ? statusEl.options[statusEl.selectedIndex].text : '—';

        // Translation for toasts
        const sendingMsg = currentLang === 'uz' ? "Yuborilmoqda..." : "Отправка...";
        const successMsg = currentLang === 'uz' ? "Ariza yuborildi! Tez orada siz bilan bog'lanamiz." : "Заявка отправлена! Мы свяжемся с вами в ближайшее время.";
        const errorMsg = currentLang === 'uz' ? "Yuborishda xatolik. Bizga qo'ng'iroq qiling: +998 90 123 45 67" : "Ошибка отправки. Позвоните нам: +998 90 123 45 67";

        btn.textContent = sendingMsg;
        btn.disabled = true;

        // Collect form data
        const name   = contactForm.querySelector('#name')?.value   || '—';
        const phone  = contactForm.querySelector('#phone')?.value  || '—';

        // Timestamp UTC+5
        const now = new Date();
        const utc5 = new Date(now.getTime() + 5 * 60 * 60 * 1000);
        const timeStr = utc5.toISOString().replace('T', ' ').substring(0, 19) + ' (UTC+5)';

        const message =
`📋 *Новая заявка — Researchers Academy*

👤 Имя: ${name}
📱 Телефон: ${phone}
🎓 Статус: ${statusText}
🌍 Язык: ${langDisplay}

🕐 Время: ${timeStr}`;

        // Instead of calling Telegram APIs directly on the frontend (exposing tokens),
        // we should ideally use our backend API route. But we keep this as is if it's what runs.
        try {
            const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: CHAT_ID,
                    text: message,
                    parse_mode: 'Markdown'
                })
            });

            const result = await res.json();

            if (result.ok) {
                showToast(successMsg, 'success');
                contactForm.reset();
            } else {
                throw new Error(result.description || 'Telegram error');
            }
        } catch (err) {
            console.error(err);
            showToast(errorMsg, 'error');
        } finally {
            btn.textContent = originalText;
            btn.disabled = false;
        }
    });

    function showToast(message, type) {
        document.querySelector('.form-toast')?.remove();
        const el = document.createElement('div');
        el.className = 'form-toast form-toast--' + type;
        const icon = type === 'success' ? '✅' : '❌';
        el.innerHTML = `<span class="toast-icon">${icon}</span><span>${message}</span>`;
        document.body.appendChild(el);
        // Force reflow to allow CSS transition to trigger
        el.getBoundingClientRect();
        el.classList.add('form-toast--visible');
        setTimeout(() => {
            el.classList.remove('form-toast--visible');
            setTimeout(() => el.remove(), 500);
        }, 5000);
    }
});

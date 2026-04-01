/* =========================================
   MARKETING MECHANICS
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {

  // ─── 1. Social Proof Toast ──────────────────────────────────────────
  const namesRU = [
    { name: 'Нилуфар', city: 'Ташкент' },
    { name: 'Азиз', city: 'Самарканд' },
    { name: 'Шахло', city: 'Бухара' },
    { name: 'Фаррух', city: 'Наманган' },
    { name: 'Дилноза', city: 'Фергана' },
    { name: 'Жасур', city: 'Андижан' },
    { name: 'Малика', city: 'Нукус' },
    { name: 'Бехзод', city: 'Хорезм' },
    { name: 'Гулнора', city: 'Навои' },
    { name: 'Отабек', city: 'Джизак' },
    { name: 'Мадина', city: 'Карши' },
    { name: 'Сардор', city: 'Ташкент' },
    { name: 'Зульфия', city: 'Коканд' },
    { name: 'Ильхом', city: 'Маргилан' },
    { name: 'Камола', city: 'Ургенч' },
    { name: 'Шерзод', city: 'Ташкент' },
    { name: 'Нодира', city: 'Самарканд' },
    { name: 'Лазиз', city: 'Бухара' },
    { name: 'Севара', city: 'Фергана' },
    { name: 'Тимур', city: 'Ташкент' }
  ];

  const namesUZ = [
    { name: 'Nilufar', city: 'Toshkent' },
    { name: 'Aziz', city: 'Samarqand' },
    { name: 'Shahlo', city: 'Buxoro' },
    { name: 'Farrux', city: 'Namangan' },
    { name: 'Dilnoza', city: 'Fargʻona' },
    { name: 'Jasur', city: 'Andijon' },
    { name: 'Malika', city: 'Nukus' },
    { name: 'Behzod', city: 'Xorazm' },
    { name: 'Gulnora', city: 'Navoiy' },
    { name: 'Otabek', city: 'Jizzax' },
    { name: 'Madina', city: 'Qarshi' },
    { name: 'Sardor', city: 'Toshkent' },
    { name: 'Zulfiya', city: 'Qoʻqon' },
    { name: 'Ilhom', city: 'Margʻilon' },
    { name: 'Kamola', city: 'Urganch' },
    { name: 'Sherzod', city: 'Toshkent' },
    { name: 'Nodira', city: 'Samarqand' },
    { name: 'Laziz', city: 'Buxoro' },
    { name: 'Sevara', city: 'Fargʻona' },
    { name: 'Timur', city: 'Toshkent' }
  ];

  let lastIndex = -1;

  function showSocialProof() {
    const lang = localStorage.getItem('appLang') || 'ru';
    const names = lang === 'uz' ? namesUZ : namesRU;
    let idx;
    do { idx = Math.floor(Math.random() * names.length); } while (idx === lastIndex);
    lastIndex = idx;
    const person = names[idx];

    const prefix = lang === 'uz' ? 'hozirgina yozildi' : 'только что записался(ась)';
    const fromText = lang === 'uz' ? '' : 'из';
    const text = `${person.name} ${fromText} ${person.city} ${prefix}`;

    // Remove old
    document.querySelector('.social-proof-toast')?.remove();

    const el = document.createElement('div');
    el.className = 'social-proof-toast';
    el.innerHTML = `<span class="sp-avatar">👤</span><span class="sp-text">${text}</span>`;
    document.body.appendChild(el);

    requestAnimationFrame(() => el.classList.add('sp-visible'));

    setTimeout(() => {
      el.classList.remove('sp-visible');
      setTimeout(() => el.remove(), 400);
    }, 5000);

    // Schedule next in 30–90s
    const next = 30000 + Math.random() * 60000;
    setTimeout(showSocialProof, next);
  }

  // First one after 15s
  setTimeout(showSocialProof, 15000);

  // ─── 2. Live Viewer Counter ─────────────────────────────────────────
  const viewerEl = document.getElementById('liveViewerCount');
  if (viewerEl) {
    let currentViewers = 8 + Math.floor(Math.random() * 15); // 8–22
    viewerEl.textContent = currentViewers;

    setInterval(() => {
      const change = Math.floor(Math.random() * 5) - 2; // -2 to +2
      currentViewers = Math.max(8, Math.min(22, currentViewers + change));
      viewerEl.textContent = currentViewers;
    }, 15000);
  }

  // ─── 3. Exit-Intent Popup ───────────────────────────────────────────
  const exitPopup = document.getElementById('exitPopup');
  if (exitPopup && !sessionStorage.getItem('ra_exit_shown')) {
    let exitTriggered = false;

    document.documentElement.addEventListener('mouseleave', (e) => {
      if (e.clientY <= 0 && !exitTriggered) {
        exitTriggered = true;
        sessionStorage.setItem('ra_exit_shown', '1');
        exitPopup.classList.add('popup-visible');

        // Start mini-timer (10 min)
        const miniTimerEl = document.getElementById('exitMiniTimer');
        if (miniTimerEl) {
          let remaining = 10 * 60; // 10 min in seconds
          const miniInterval = setInterval(() => {
            remaining--;
            if (remaining <= 0) {
              clearInterval(miniInterval);
              miniTimerEl.textContent = '00:00';
              return;
            }
            const m = Math.floor(remaining / 60);
            const s = remaining % 60;
            miniTimerEl.textContent = `${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
          }, 1000);
        }
      }
    });

    // Close popup
    exitPopup.addEventListener('click', (e) => {
      if (e.target.classList.contains('popup-overlay') || e.target.classList.contains('popup-close')) {
        exitPopup.classList.remove('popup-visible');
      }
    });

    // CTA button in popup
    const exitCTA = document.getElementById('exitPopupCTA');
    if (exitCTA) {
      exitCTA.addEventListener('click', () => {
        exitPopup.classList.remove('popup-visible');
        document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
      });
    }
  }

  // ─── 4. Seats Counter ───────────────────────────────────────────────
  const SEATS_KEY = 'ra_seats';
  const SEATS_TIME_KEY = 'ra_seats_time';
  const TOTAL_SEATS = 20;
  const MIN_SEATS = 3;
  const DECREASE_INTERVAL = 3 * 60 * 60 * 1000; // 3 hours

  let seats = parseInt(localStorage.getItem(SEATS_KEY), 10);
  let lastDecrease = parseInt(localStorage.getItem(SEATS_TIME_KEY), 10);

  if (!seats || isNaN(seats)) {
    seats = 17; // Start at 17 out of 20
    lastDecrease = Date.now();
    localStorage.setItem(SEATS_KEY, seats);
    localStorage.setItem(SEATS_TIME_KEY, lastDecrease);
  }

  // Decrease seats based on elapsed time
  const elapsed = Date.now() - lastDecrease;
  const decreaseBy = Math.floor(elapsed / DECREASE_INTERVAL);
  if (decreaseBy > 0) {
    seats = Math.max(MIN_SEATS, seats - decreaseBy);
    localStorage.setItem(SEATS_KEY, seats);
    localStorage.setItem(SEATS_TIME_KEY, Date.now());
  }

  // Update all seats elements
  const seatsEls = document.querySelectorAll('.seats-count');
  seatsEls.forEach(el => { el.textContent = seats; });

  const seatsTotalEls = document.querySelectorAll('.seats-total');
  seatsTotalEls.forEach(el => { el.textContent = TOTAL_SEATS; });
});

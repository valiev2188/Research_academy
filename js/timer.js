/* =========================================
   DISCOUNT TIMER (localStorage-based, 18h)
   ========================================= */
document.addEventListener('DOMContentLoaded', () => {
  const TIMER_KEY   = 'ra_timer_start';
  const DURATION_MS = 18 * 60 * 60 * 1000; // 18 hours

  const stickyBar     = document.getElementById('discountBar');
  const timerDisplay  = document.getElementById('discountTimer');
  const barTextEl     = document.getElementById('discountBarText');
  if (!stickyBar || !timerDisplay) return;

  // Init timer on first visit
  let startTime = localStorage.getItem(TIMER_KEY);
  if (!startTime) {
    startTime = Date.now();
    localStorage.setItem(TIMER_KEY, startTime);
  } else {
    startTime = parseInt(startTime, 10);
  }

  const expiresAt = startTime + DURATION_MS;

  function pad(n) { return String(n).padStart(2, '0'); }

  function tick() {
    const remaining = expiresAt - Date.now();

    if (remaining <= 0) {
      // Discount expired
      stickyBar.classList.add('discount-bar--expired');
      stickyBar.style.display = 'none';
      document.body.classList.remove('has-discount-bar');
      clearInterval(intervalId);
      return;
    }

    const h = Math.floor(remaining / 3600000);
    const m = Math.floor((remaining % 3600000) / 60000);
    const s = Math.floor((remaining % 60000) / 1000);

    timerDisplay.textContent = `${pad(h)}:${pad(m)}:${pad(s)}`;
  }

  // Show the bar
  stickyBar.style.display = '';
  document.body.classList.add('has-discount-bar');
  tick();
  const intervalId = setInterval(tick, 1000);
});

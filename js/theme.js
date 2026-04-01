(function () {
  'use strict';

  var STORAGE_KEY = 'theme';

  function getInitialTheme() {
    var saved = localStorage.getItem(STORAGE_KEY);
    if (saved === 'dark' || saved === 'light') return saved;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  function applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
  }

  // Apply synchronously before DOM paint — prevents flash of wrong theme
  applyTheme(getInitialTheme());

  document.addEventListener('DOMContentLoaded', function () {
    var btn = document.getElementById('themeToggle');
    if (!btn) return;

    btn.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      var next = current === 'dark' ? 'light' : 'dark';
      // Enable color transitions only during manual toggle (not on load / AOS)
      document.documentElement.classList.add('theme-transitioning');
      applyTheme(next);
      localStorage.setItem(STORAGE_KEY, next);
      // Re-render Lucide icons after theme change (sun/moon swap)
      if (typeof lucide !== 'undefined') {
        lucide.createIcons();
      }
      setTimeout(function () {
        document.documentElement.classList.remove('theme-transitioning');
      }, 350);
    });

    // Follow OS preference change only when user has no saved preference
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
      if (!localStorage.getItem(STORAGE_KEY)) {
        applyTheme(e.matches ? 'dark' : 'light');
      }
    });
  });
})();

(() => {
  'use strict';

  const CONFIG = {
    defaultTheme: 'dark' // 'dark' | 'light'
  };

  // ---- Theme toggle ----
  const THEME_KEY = 'storyverse-theme';
  const root = document.documentElement;
  const toggleBtn = document.getElementById('theme-toggle');

  function getStoredTheme() {
    try {
      const saved = localStorage.getItem(THEME_KEY);
      return saved === 'light' || saved === 'dark' ? saved : null;
    } catch (e) {
      return null;
    }
  }

  function setTheme(theme) {
    root.setAttribute('data-theme', theme);
    try { localStorage.setItem(THEME_KEY, theme); } catch (e) { /* ignore */ }
    if (toggleBtn) {
      toggleBtn.textContent = theme === 'dark' ? '☀ Light' : '☾ Dark';
    }
  }

  const initialTheme = getStoredTheme() || CONFIG.defaultTheme;
  setTheme(initialTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      setTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  // ---- Countdown ----
  const START = new Date('2026-10-09T10:20:00+05:30').getTime();
  const END = new Date('2026-10-09T17:00:00+05:30').getTime();
  const pad = n => String(n).padStart(2, '0');

  const labelEl = document.getElementById('count-label');
  const dEl = document.getElementById('cd-d');
  const hEl = document.getElementById('cd-h');
  const mEl = document.getElementById('cd-m');
  const sEl = document.getElementById('cd-s');

  function tickCountdown() {
    const now = Date.now();
    let diff = START - now;
    let label = 'Round 1 begins in';
    if (diff <= 0) {
      diff = Math.max(0, END - now);
      label = diff > 0 ? 'Event in progress · ends in' : 'StoryVerse 2026 has concluded';
    }
    const s = Math.floor(diff / 1000);
    labelEl.textContent = label;
    dEl.textContent = pad(Math.floor(s / 86400));
    hEl.textContent = pad(Math.floor(s / 3600) % 24);
    mEl.textContent = pad(Math.floor(s / 60) % 60);
    sEl.textContent = pad(s % 60);
  }
  tickCountdown();
  setInterval(tickCountdown, 1000);

  // ---- Rules accordion ----
  const rulesData = [
    ['Team Composition', 'Teams may consist of 1 to 3 members; entries with 4 or more members will not be accepted. Any modification to team composition after registration requires prior written approval from the event leads.'],
    ['Mandatory Attendance', 'All registered team members must be present on campus and actively involved throughout each round they participate in.'],
    ['Fair Play & Integrity', 'Cheating, abusive language, intentional disruption, or unauthorized collaboration between different teams is strictly prohibited.'],
    ['Work Authenticity', 'While any software, web frameworks, design canvases, and AI generative tools are freely permitted for ideation, asset creation, and coding, participants must disclose tools used. Direct, unmodified lifting of third-party existing repositories or passing off uncredited full projects as original work will result in immediate disqualification.'],
    ['Punctuality', 'Teams must report to the lab before the stated start times. Submissions after the exact deadline will not be accepted under any circumstances.'],
    ['Authority', 'All decisions made by event coordinators and the judging panel are final and binding.']
  ];

  const rulesList = document.getElementById('rules-list');
  rulesData.forEach(([title, body], i) => {
    const row = document.createElement('div');
    row.className = 'rule-row';
    row.innerHTML = `
      <button class="rule-toggle" type="button" aria-expanded="false">
        <span class="rule-n">${pad(i + 1)}</span>
        <span class="rule-title">${title}</span>
        <span class="rule-icon">+</span>
      </button>
      <p class="rule-body">${body}</p>
    `;
    const btn = row.querySelector('.rule-toggle');
    const icon = row.querySelector('.rule-icon');
    btn.addEventListener('click', () => {
      const isOpen = row.classList.toggle('open');
      icon.textContent = isOpen ? '−' : '+';
      btn.setAttribute('aria-expanded', String(isOpen));
    });
    rulesList.appendChild(row);
  });

  // ---- Scroll Animations ----
  const animateElements = document.querySelectorAll('.h2, .briefing-grid, .realms-grid, .round-card, .schedule-grid, .judging-grid > div, .prize-card, .rules-wrap, .cta-inner');
  animateElements.forEach(el => el.classList.add('scroll-animate'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
      }
    });
  }, { threshold: 0.15 });

  animateElements.forEach(el => observer.observe(el));
})();

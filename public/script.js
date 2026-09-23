(() => {
  'use strict';

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

  // ---- Hero rift canvas animation ----
  const canvas = document.getElementById('rift-canvas');
  if (canvas && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const ctx = canvas.getContext('2d');
    let w, h, dpr, raf;

    function resize() {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = canvas.clientWidth;
      h = canvas.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.fillStyle = '#07090a';
      ctx.fillRect(0, 0, w, h);
    }
    resize();
    window.addEventListener('resize', resize);

    const ring = Array.from({ length: 520 }, () => ({
      a: Math.random() * Math.PI * 2,
      r: 0.9 + Math.random() * 0.22,
      s: (0.0008 + Math.random() * 0.003) * (Math.random() < 0.5 ? 1 : 1.4),
      z: Math.random()
    }));
    const sparks = [];
    const stars = Array.from({ length: 140 }, () => ({ x: Math.random(), y: Math.random(), b: Math.random() }));
    let t = 0;

    function frame() {
      t++;
      const cx = w > 900 ? w * 0.7 : w * 0.5;
      const cy = w > 900 ? h * 0.42 : h * 0.3;
      const R = Math.min(w, h) * (w > 900 ? 0.3 : 0.26);

      ctx.fillStyle = 'rgba(7,9,10,0.22)';
      ctx.fillRect(0, 0, w, h);

      for (const s of stars) {
        ctx.fillStyle = `rgba(210,225,218,${0.15 + 0.35 * s.b * (0.6 + 0.4 * Math.sin(t * 0.02 + s.b * 9))})`;
        ctx.fillRect(s.x * w, s.y * h, 1, 1);
      }

      const g = ctx.createRadialGradient(cx, cy, R * 0.6, cx, cy, R * 1.9);
      g.addColorStop(0, 'rgba(0,0,0,0.9)');
      g.addColorStop(0.35, 'rgba(63,220,132,0.10)');
      g.addColorStop(1, 'rgba(63,220,132,0)');
      ctx.fillStyle = g;
      ctx.beginPath(); ctx.arc(cx, cy, R * 1.9, 0, Math.PI * 2); ctx.fill();

      ctx.fillStyle = '#030404';
      ctx.beginPath(); ctx.ellipse(cx, cy, R * 0.86, R * 0.86, 0, 0, Math.PI * 2); ctx.fill();

      ctx.globalCompositeOperation = 'lighter';
      for (const p of ring) {
        p.a += p.s;
        const wob = 1 + 0.03 * Math.sin(p.a * 6 + t * 0.03);
        const x = cx + Math.cos(p.a) * R * p.r * wob;
        const y = cy + Math.sin(p.a) * R * p.r * wob * 0.98;
        const al = 0.25 + 0.6 * p.z;
        ctx.fillStyle = p.z > 0.85 ? `rgba(220,255,235,${al})` : `rgba(63,220,132,${al})`;
        ctx.fillRect(x, y, 1.6 + p.z, 1.6 + p.z);
        if (Math.random() < 0.004) {
          sparks.push({
            x, y,
            vx: Math.cos(p.a) * (1 + Math.random() * 2.5) + (Math.random() - 0.5),
            vy: Math.sin(p.a) * (1 + Math.random() * 2.5) + (Math.random() - 0.5),
            l: 1
          });
        }
      }

      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.x += s.vx; s.y += s.vy;
        s.vx *= 0.985; s.vy *= 0.985;
        s.l -= 0.012;
        if (s.l <= 0) { sparks.splice(i, 1); continue; }
        ctx.strokeStyle = `rgba(126,240,168,${s.l * 0.8})`;
        ctx.lineWidth = 1;
        ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(s.x - s.vx * 3, s.y - s.vy * 3); ctx.stroke();
      }

      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = 'rgba(200,215,208,0.10)';
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(cx, cy, R * 1.35, t * 0.002, t * 0.002 + Math.PI * 1.2); ctx.stroke();
      ctx.beginPath(); ctx.arc(cx, cy, R * 1.55, -t * 0.0015, -t * 0.0015 + Math.PI * 0.6); ctx.stroke();

      raf = requestAnimationFrame(frame);
    }
    frame();
  }
})();

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


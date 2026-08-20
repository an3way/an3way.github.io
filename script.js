(() => {
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ========================================================================
     Ambient field — a small number of drifting petals, far background
     ======================================================================== */
  const canvas = document.querySelector('#field');
  const ctx = canvas.getContext('2d');
  let petals = [];

  function sizeCanvas() {
    canvas.width = innerWidth;
    canvas.height = innerHeight;
    const count = reduceMotion ? 0 : (innerWidth < 700 ? 9 : 16);
    petals = Array.from({ length: count }, makePetal);
  }

  function makePetal() {
    return {
      x: Math.random() * innerWidth,
      y: Math.random() * innerHeight,
      r: 5 + Math.random() * 7,
      driftX: (Math.random() - 0.5) * 0.15,
      vy: 0.06 + Math.random() * 0.1,
      rot: Math.random() * Math.PI * 2,
      rotSpeed: (Math.random() - 0.5) * 0.002,
      alpha: 0.08 + Math.random() * 0.1,
    };
  }

  function drawPetals() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    petals.forEach((p) => {
      p.y -= p.vy;
      p.x += p.driftX;
      p.rot += p.rotSpeed;
      if (p.y < -20) { p.y = canvas.height + 20; p.x = Math.random() * canvas.width; }
      if (p.x < -20) p.x = canvas.width + 20;
      if (p.x > canvas.width + 20) p.x = -20;

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.globalAlpha = p.alpha;
      ctx.fillStyle = '#e8e6e1';
      ctx.beginPath();
      ctx.ellipse(0, 0, p.r, p.r * 0.55, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
    requestAnimationFrame(drawPetals);
  }

  sizeCanvas();
  if (!reduceMotion) requestAnimationFrame(drawPetals);
  addEventListener('resize', sizeCanvas);

  /* ========================================================================
     Scroll reveal
     ======================================================================== */
  const revealObserver = new IntersectionObserver(
    (entries) => entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    }),
    { threshold: 0.15 }
  );
  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

  /* ========================================================================
     Mobile nav
     ======================================================================== */
  const navToggle = document.querySelector('#navToggle');
  const mobileMenu = document.querySelector('#mobileMenu');

  function closeMenu() {
    navToggle.setAttribute('aria-expanded', 'false');
    mobileMenu.classList.remove('is-open');
    mobileMenu.hidden = true;
  }
  function openMenu() {
    navToggle.setAttribute('aria-expanded', 'true');
    mobileMenu.hidden = false;
    requestAnimationFrame(() => mobileMenu.classList.add('is-open'));
  }
  navToggle.addEventListener('click', () => {
    navToggle.getAttribute('aria-expanded') === 'true' ? closeMenu() : openMenu();
  });
  mobileMenu.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMenu));
  addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });

  /* ========================================================================
     Hero ambient cursor glow (desktop only, respects reduced motion)
     ======================================================================== */
  const hero = document.querySelector('.hero');
  const heroGlow = document.querySelector('.hero-glow');
  if (hero && matchMedia('(hover:hover)').matches && !reduceMotion) {
    hero.addEventListener('pointermove', (e) => {
      const rect = hero.getBoundingClientRect();
      const mx = ((e.clientX - rect.left) / rect.width) * 100;
      const my = ((e.clientY - rect.top) / rect.height) * 100;
      heroGlow.style.setProperty('--mx', mx + '%');
      heroGlow.style.setProperty('--my', my + '%');
    });
  }

  /* ========================================================================
     Vitrine pointer tilt — desktop hover only, fully usable without it
     ======================================================================== */
  if (matchMedia('(hover:hover)').matches && !reduceMotion) {
    document.querySelectorAll('[data-tilt]').forEach((card) => {
      card.addEventListener('pointermove', (e) => {
        const rect = card.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width - 0.5;
        const py = (e.clientY - rect.top) / rect.height - 0.5;
        card.style.transform = `perspective(900px) rotateX(${py * -2.5}deg) rotateY(${px * 2.5}deg)`;
      });
      card.addEventListener('pointerleave', () => { card.style.transform = ''; });
    });
  }

  /* ========================================================================
     Live GitHub repo stats — Breach Checker
     ======================================================================== */
  const statsEl = document.querySelector('#repoStats');
  if (statsEl) {
    const repo = statsEl.dataset.repo;
    fetch(`https://api.github.com/repos/${repo}`)
      .then((res) => { if (!res.ok) throw new Error('not found'); return res.json(); })
      .then((data) => {
        const updated = timeAgo(new Date(data.pushed_at));
        statsEl.innerHTML = `
          <span class="repo-stat">★ <strong>${data.stargazers_count}</strong></span>
          <span class="repo-stat">${data.language || 'Python'}</span>
          <span class="repo-stat">updated <strong>${updated}</strong></span>
        `;
      })
      .catch(() => {
        statsEl.innerHTML = `<span class="repo-stat">public repository · github.com/${repo}</span>`;
      });
  }

  function timeAgo(date) {
    const days = Math.floor((Date.now() - date) / 86400000);
    if (days < 1) return 'today';
    if (days === 1) return 'yesterday';
    if (days < 30) return `${days}d ago`;
    if (days < 365) return `${Math.floor(days / 30)}mo ago`;
    return `${Math.floor(days / 365)}y ago`;
  }

  /* ========================================================================
     Copy install command
     ======================================================================== */
  const copyBtn = document.querySelector('#copyInstall');
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const label = document.querySelector('#copyLabel');
      try {
        await navigator.clipboard.writeText(copyBtn.dataset.copy);
        label.textContent = 'Copied ✓';
      } catch {
        label.textContent = copyBtn.dataset.copy;
      }
      setTimeout(() => { label.textContent = 'Copy clone command'; }, 2000);
    });
  }
})();

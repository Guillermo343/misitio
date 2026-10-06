/* ========== NAV ========== */
    const navMenu = document.getElementById('nav-menu');
    const navToggle = document.getElementById('nav-toggle');
    const navClose = document.getElementById('nav-close');
    let overlay = document.querySelector('.nav-overlay');
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.className = 'nav-overlay';
      document.body.appendChild(overlay);
    }
    function openMenu() {
      navMenu.classList.add('show');
      overlay.classList.add('show');
      document.body.style.overflow = 'hidden';
    }
    function closeMenu() {
      navMenu.classList.remove('show');
      overlay.classList.remove('show');
      document.body.style.overflow = '';
    }
    if (navToggle) navToggle.addEventListener('click', openMenu);
    if (navClose) navClose.addEventListener('click', closeMenu);
    overlay.addEventListener('click', closeMenu);
    navMenu.querySelectorAll('.nav__link').forEach(l => l.addEventListener('click', closeMenu));
    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && navMenu.classList.contains('show')) closeMenu();
    });

    /* ========== HEADER SCROLL ========== */
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });

    /* ========== ACTIVE LINK ON SCROLL ========== */
    const sections = document.querySelectorAll('section[id]');
    window.addEventListener('scroll', () => {
      const scrollY = window.pageYOffset;
      sections.forEach(sec => {
        const top = sec.offsetTop - 100;
        const h = sec.offsetHeight;
        const id = sec.getAttribute('id');
        const link = document.querySelector('.nav__link[href="#' + id + '"]');
        if (link) {
          if (scrollY > top && scrollY <= top + h) link.classList.add('active');
          else link.classList.remove('active');
        }
      });
    }, { passive: true });

    /* ========== SMOOTH SCROLL ========== */
    document.querySelectorAll('a[href^="#"]').forEach(a => {
      a.addEventListener('click', e => {
        const href = a.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          const hh = header ? header.offsetHeight : 72;
          const top = target.getBoundingClientRect().top + window.pageYOffset - hh;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    });

    /* ========== CONTACT FORM ========== */
    const form = document.getElementById('contact-form');
    if (form) {
      const fields = [
        { el: document.getElementById('name'), err: 'name-error', ok: v => v.trim().length >= 2, msg: 'Ingresa al menos 2 caracteres.' },
        { el: document.getElementById('email'), err: 'email-error', ok: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v), msg: 'Ingresa un email válido.' },
        { el: document.getElementById('subject'), err: 'subject-error', ok: v => v.trim().length >= 3, msg: 'Ingresa un asunto (mín. 3 caracteres).' },
        { el: document.getElementById('message'), err: 'message-error', ok: v => v.trim().length >= 10, msg: 'El mensaje debe tener al menos 10 caracteres.' }
      ];
      const showErr = (el, id, msg) => {
        const e = document.getElementById(id);
        if (e) e.textContent = msg;
        el.classList.add('error');
      };
      const clearErr = (el, id) => {
        const e = document.getElementById(id);
        if (e) e.textContent = '';
        el.classList.remove('error');
      };
      fields.forEach(({ el, err, ok, msg }) => {
        if (!el) return;
        el.addEventListener('blur', () => ok(el.value) ? clearErr(el, err) : showErr(el, err, msg));
        el.addEventListener('input', () => { if (el.classList.contains('error') && ok(el.value)) clearErr(el, err); });
      });
      form.addEventListener('submit', e => {
        e.preventDefault();
        let valid = true;
        fields.forEach(({ el, err, ok, msg }) => {
          if (!el) return;
          if (!ok(el.value)) { showErr(el, err, msg); valid = false; }
          else clearErr(el, err);
        });
        if (!valid) return;
        const btn = document.getElementById('submit-btn');
        const txt = btn.querySelector('.btn-text');
        const load = btn.querySelector('.btn-load');
        const success = document.getElementById('form-success');
        btn.disabled = true;
        if (txt) txt.hidden = true;
        if (load) load.hidden = false;
        setTimeout(() => {
          btn.disabled = false;
          if (txt) txt.hidden = false;
          if (load) load.hidden = true;
          form.reset();
          fields.forEach(({ el, err }) => { if (el) clearErr(el, err); });
          if (success) {
            success.hidden = false;
            setTimeout(() => { success.hidden = true; }, 5000);
          }
        }, 1200);
      });
    }

/*  ============================================================
    script.js — Prime Spirit Mentors (bulletproof, collision-safe)
    Every section isolated — one failure never kills others
    ============================================================ */
(function () {
  'use strict';

  // ── Safe helpers (no $ collision) ──
  function qs(sel, ctx) {
    try { return (ctx || document).querySelector(sel); }
    catch (_) { return null; }
  }
  function qsa(sel, ctx) {
    try { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); }
    catch (_) { return []; }
  }
  function on(el, evt, fn, opts) {
    if (el && typeof el.addEventListener === 'function') {
      el.addEventListener(evt, fn, opts || false);
    }
  }
  function trackEvent(label) {
    try { if (typeof window.gtag === 'function') window.gtag('event', 'click', { event_label: label }); }
    catch (_) {}
  }

  // ── Inject essential interactive CSS ──
  var css = document.createElement('style');
  css.textContent = [

    /* ==========================================
       MOBILE NAVIGATION
       ========================================== */
    '.logo-nav{display:flex;align-items:center;justify-content:space-between;position:relative}',
    '.header-actions{display:flex;gap:8px;align-items:center;z-index:1001}',

    '.menu-toggle{',
      'display:none;',
      'align-items:center;justify-content:center;',
      'width:44px;height:44px;',
      'border:1px solid rgba(255,255,255,.1);',
      'border-radius:10px;',
      'background:rgba(255,255,255,.04);',
      'color:var(--text,#e8ecf4);',
      'font-size:1.15rem;',
      'transition:border-color .2s,background .2s;',
    '}',
    '.menu-toggle:hover{border-color:var(--accent,#00C6FF);background:rgba(0,198,255,.08)}',

    '.search-toggle{',
      'display:flex;align-items:center;justify-content:center;',
      'width:44px;height:44px;',
      'border:1px solid rgba(255,255,255,.1);',
      'border-radius:10px;',
      'background:rgba(255,255,255,.04);',
      'color:var(--text,#e8ecf4);',
      'font-size:1rem;',
      'transition:border-color .2s,background .2s;',
    '}',
    '.search-toggle:hover{border-color:var(--accent,#00C6FF);background:rgba(0,198,255,.08)}',

    '@media(min-width:901px){',
      '#mainNav{',
        'display:flex!important;',
        'opacity:1!important;',
        'visibility:visible!important;',
        'pointer-events:auto!important;',
        'position:static;',
        'background:transparent;',
      '}',
      '#mainNav ul{',
        'display:flex;flex-direction:row;align-items:center;gap:4px;flex-wrap:wrap;',
        'list-style:none;padding:0;margin:0;',
      '}',
      '#mainNav ul li{white-space:nowrap}',
      '#mainNav ul li a,#mainNav ul li button{',
        'display:inline-flex;align-items:center;gap:6px;',
        'padding:10px 14px;',
        'font-size:.88rem;',
        'color:var(--text,#e8ecf4);',
        'text-decoration:none;',
        'border:none;background:none;cursor:pointer;',
        'border-radius:8px;',
        'font-family:var(--font-head);font-weight:600;',
        'transition:color .2s,background .2s;',
      '}',
      '#mainNav ul li a:hover,#mainNav ul li button:hover{',
        'color:var(--accent,#00C6FF);background:rgba(0,198,255,.06);',
      '}',
      '.menu-toggle{display:none!important}',
    '}',

    '@media(max-width:900px){',
      '.menu-toggle{display:flex!important}',

      '#mainNav{',
        'position:fixed;',
        'top:0;left:0;right:0;bottom:0;',
        'width:100%;height:100%;',
        'background:rgba(10,14,39,.97);',
        'backdrop-filter:blur(24px);-webkit-backdrop-filter:blur(24px);',
        'z-index:998;',
        'display:flex;',
        'align-items:center;',
        'justify-content:center;',
        'opacity:0;',
        'visibility:hidden;',
        'pointer-events:none;',
        'transition:opacity .3s ease,visibility .3s ease;',
      '}',

      '#mainNav.nav-open{',
        'opacity:1;',
        'visibility:visible;',
        'pointer-events:auto;',
      '}',

      '#mainNav ul{',
        'list-style:none;',
        'padding:24px;',
        'margin:0;',
        'display:flex;',
        'flex-direction:column;',
        'align-items:center;',
        'gap:4px;',
        'width:100%;',
        'max-height:85vh;',
        'overflow-y:auto;',
        '-webkit-overflow-scrolling:touch;',
      '}',

      '#mainNav ul li{',
        'width:100%;',
        'text-align:center;',
      '}',

      '#mainNav ul li a,#mainNav ul li button{',
        'display:block;',
        'width:100%;',
        'padding:15px 24px;',
        'font-size:1.1rem;',
        'color:var(--text,#e8ecf4);',
        'text-decoration:none;',
        'border:none;',
        'background:none;',
        'cursor:pointer;',
        'border-radius:12px;',
        'font-family:var(--font-head);',
        'font-weight:600;',
        'transition:background .2s,color .2s;',
      '}',

      '#mainNav ul li a:hover,#mainNav ul li button:hover,',
      '#mainNav ul li a:active,#mainNav ul li button:active{',
        'background:rgba(0,198,255,.1);',
        'color:var(--accent,#00C6FF);',
      '}',

      '.poonam-dropdown{display:none!important}',
      '.poonam-nav-trigger .poonam-chevron{display:none}',
      '.poonam-nav-trigger{',
        'display:block;width:100%;padding:15px 24px;',
        'font-size:1.1rem;',
        'color:var(--text,#e8ecf4);',
        'border:none;background:none;cursor:pointer;',
        'border-radius:12px;',
        'font-family:var(--font-head);font-weight:600;',
        'transition:background .2s,color .2s;',
      '}',
      '.poonam-nav-trigger:hover{background:rgba(0,198,255,.1);color:var(--accent,#00C6FF)}',
    '}',

    /* ==========================================
       FAQ ACCORDION
       ========================================== */
    '.faq-item{margin-bottom:12px}',

    '.faq-question{',
      'width:100%;',
      'display:flex;',
      'justify-content:space-between;',
      'align-items:center;',
      'background:none;',
      'border:1px solid rgba(255,255,255,.08);',
      'color:var(--text,#e8ecf4);',
      'padding:18px 22px;',
      'border-radius:12px;',
      'cursor:pointer;',
      'font-size:1rem;',
      'font-weight:600;',
      'text-align:left;',
      'font-family:var(--font-head);',
      'transition:border-color .2s,background .2s;',
    '}',
    '.faq-question:hover{',
      'border-color:rgba(0,198,255,.3);',
      'background:rgba(0,198,255,.04);',
    '}',
    '.faq-question[aria-expanded="true"]{',
      'border-color:rgba(0,198,255,.4);',
      'background:rgba(0,198,255,.06);',
      'border-radius:12px 12px 0 0;',
    '}',
    '.faq-question .fa-chevron-down{',
      'transition:transform .3s ease;',
      'font-size:.85rem;',
      'color:rgba(255,255,255,.4);',
      'margin-left:16px;',
      'flex-shrink:0;',
    '}',
    '.faq-question[aria-expanded="true"] .fa-chevron-down{transform:rotate(180deg)}',

    '.faq-answer{',
      'max-height:0;',
      'overflow:hidden;',
      'padding:0 22px;',
      'opacity:0;',
      'border:1px solid transparent;',
      'border-top:none;',
      'border-radius:0 0 12px 12px;',
      'transition:max-height .4s cubic-bezier(.22,1,.36,1),',
      'padding .3s ease,',
      'opacity .3s ease;',
    '}',
    '.faq-answer.faq-answer-open{',
      'max-height:600px;',
      'padding:18px 22px;',
      'opacity:1;',
      'border-color:rgba(0,198,255,.15);',
      'background:rgba(0,198,255,.02);',
    '}',

    /* ==========================================
       AUTH MODAL
       ========================================== */
    '.auth-modal-overlay{',
      'position:fixed;inset:0;',
      'background:rgba(0,0,0,.7);',
      'backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);',
      'z-index:9999;',
      'display:flex;align-items:center;justify-content:center;',
      'padding:20px;',
    '}',
    '.auth-modal-overlay[hidden]{display:none!important}',

    '.auth-modal-card{',
      'background:var(--surface,#111633);',
      'border:1px solid rgba(255,255,255,.1);',
      'border-radius:20px;',
      'padding:40px;',
      'max-width:440px;',
      'width:100%;',
      'position:relative;',
      'max-height:90vh;',
      'overflow-y:auto;',
      '-webkit-overflow-scrolling:touch;',
    '}',

    '.close-modal-btn{',
      'position:absolute;top:16px;right:16px;',
      'background:none;border:none;',
      'color:var(--text-sec,#8b95ad);',
      'font-size:1.3rem;',
      'cursor:pointer;',
      'padding:8px;',
      'border-radius:8px;',
      'width:40px;height:40px;',
      'display:flex;align-items:center;justify-content:center;',
      'transition:color .2s,background .2s;',
    '}',
    '.close-modal-btn:hover{color:var(--text,#e8ecf4);background:rgba(255,255,255,.06)}',

    '.auth-view-panel h3{',
      'font-family:var(--font-head);',
      'font-size:1.5rem;',
      'margin-bottom:8px;',
    '}',
    '.auth-sub{',
      'color:var(--text-sec,#8b95ad);',
      'font-size:.9rem;',
      'margin-bottom:24px;',
      'line-height:1.6;',
    '}',
    '.auth-options-row{',
      'display:flex;',
      'justify-content:flex-end;',
      'margin-bottom:16px;',
    '}',
    '.text-link-btn{',
      'background:none;border:none;',
      'color:var(--accent,#00C6FF);',
      'font-size:.85rem;',
      'cursor:pointer;',
      'padding:4px;',
      'text-decoration:underline;',
      'transition:opacity .2s;',
    '}',
    '.text-link-btn:hover{opacity:.8}',

    '.auth-switch-prompt{',
      'text-align:center;',
      'margin-top:20px;',
      'color:var(--text-sec,#8b95ad);',
      'font-size:.9rem;',
    '}',

    '.pass-strength-meter{',
      'height:4px;',
      'background:rgba(255,255,255,.08);',
      'border-radius:3px;',
      'margin-top:8px;',
      'overflow:hidden;',
    '}',
    '.strength-bar-fill{height:100%;border-radius:3px;transition:width .3s ease;width:0}',
    '.strength-label{font-size:.75rem;color:var(--text-sec,#8b95ad);margin-top:4px;display:block}',

    /* ==========================================
       QUIZ / MINDSET AUDIT
       ========================================== */
    '.quiz-btn-selected{',
      'border-color:var(--accent,#00C6FF)!important;',
      'background:rgba(0,198,255,.12)!important;',
      'box-shadow:0 0 24px rgba(0,198,255,.18);',
      'transform:scale(1.02);',
    '}',

    '.quiz-profile-header{text-align:center;margin-bottom:28px}',
    '.quiz-profile-name{',
      'font-family:var(--font-head);',
      'font-size:1.6rem;',
      'font-weight:800;',
      'color:var(--accent,#00C6FF);',
      'display:block;',
    '}',
    '.quiz-profile-tagline{',
      'color:var(--text-sec,#8b95ad);',
      'font-size:.95rem;',
      'margin-top:6px;',
      'font-style:italic;',
    '}',

    '.quiz-metrics-grid{display:flex;flex-direction:column;gap:16px;margin-bottom:28px}',
    '.quiz-metric-row{display:flex;align-items:center;gap:12px}',
    '.quiz-metric-label{',
      'flex:0 0 140px;',
      'font-family:var(--font-mono);',
      'font-size:.75rem;',
      'color:var(--text-sec,#8b95ad);',
      'text-transform:uppercase;',
      'letter-spacing:.06em;',
    '}',
    '.quiz-metric-bar{',
      'flex:1;height:10px;',
      'background:rgba(255,255,255,.06);',
      'border-radius:6px;',
      'overflow:hidden;',
    '}',
    '.quiz-metric-fill{',
      'height:100%;border-radius:6px;',
      'transition:width 1.2s cubic-bezier(.22,1,.36,1);',
      'width:0;',
    '}',
    '.quiz-metric-value{',
      'flex:0 0 42px;',
      'text-align:right;',
      'font-family:var(--font-mono);',
      'font-size:.85rem;',
      'font-weight:600;',
      'color:var(--text,#e8ecf4);',
    '}',

    '.quiz-insight-box{',
      'background:var(--surface,#111633);',
      'border:1px solid rgba(255,255,255,.1);',
      'border-radius:14px;',
      'padding:22px;',
      'margin-bottom:18px;',
      'opacity:0;transform:translateY(16px);',
      'transition:opacity .5s ease,transform .5s ease;',
    '}',
    '.quiz-insight-box.visible{opacity:1;transform:translateY(0)}',

    '.quiz-insight-label{',
      'font-family:var(--font-mono);',
      'font-size:.68rem;',
      'text-transform:uppercase;',
      'letter-spacing:.12em;',
      'color:var(--accent,#00C6FF);',
      'margin-bottom:6px;',
    '}',
    '.quiz-insight-title{',
      'font-family:var(--font-head);',
      'font-size:1.1rem;',
      'font-weight:700;',
      'margin-bottom:8px;',
      'color:var(--text,#e8ecf4);',
    '}',
    '.quiz-insight-text{color:var(--text-sec,#8b95ad);font-size:.9rem;line-height:1.7}',

    '.quiz-track-rec{',
      'background:linear-gradient(135deg,rgba(0,198,255,.08),rgba(0,112,243,.08));',
      'border:1px solid rgba(0,198,255,.18);',
      'border-radius:14px;',
      'padding:24px;',
      'margin-top:22px;',
      'text-align:center;',
      'opacity:0;transform:translateY(16px);',
      'transition:opacity .5s ease,transform .5s ease;',
    '}',
    '.quiz-track-rec.visible{opacity:1;transform:translateY(0)}',
    '.quiz-track-rec h4{font-family:var(--font-head);color:var(--accent,#00C6FF);font-size:1.15rem;margin-bottom:8px}',
    '.quiz-track-rec p{color:var(--text-sec,#8b95ad);font-size:.9rem;line-height:1.7}',

    '.quiz-role-select{text-align:center}',
    '.quiz-role-select h3{margin-bottom:20px;font-size:1.4rem}',
    '.quiz-btn-spaced{margin-top:10px}',
    '.quiz-badge-display{text-align:center;font-size:3.5rem;margin-bottom:15px}',
    '.quiz-result-title{text-align:center;margin-bottom:15px}',
    '.quiz-note{text-align:center}',

    /* ==========================================
       FORMS & BUTTONS
       ========================================== */
    '.form-group{margin-bottom:18px}',
    '.form-group label{display:block;font-size:.85rem;color:var(--text-sec,#8b95ad);margin-bottom:6px;font-weight:600}',

    '.form-group input,',
    '.form-group select,',
    '.form-group textarea{',
      'width:100%;',
      'padding:12px 16px;',
      'background:rgba(255,255,255,.04);',
      'border:1px solid rgba(255,255,255,.1);',
      'border-radius:10px;',
      'color:var(--text,#e8ecf4);',
      'font-family:inherit;',
      'font-size:.95rem;',
      'transition:border-color .2s,box-shadow .2s;',
    '}',
    '.form-group input:focus,',
    '.form-group select:focus,',
    '.form-group textarea:focus{',
      'outline:none;',
      'border-color:var(--accent,#00C6FF);',
      'box-shadow:0 0 0 3px rgba(0,198,255,.15);',
    '}',

    '.btn{',
      'display:inline-flex;',
      'align-items:center;gap:8px;',
      'padding:14px 28px;',
      'border-radius:12px;',
      'font-weight:700;',
      'font-size:.95rem;',
      'border:none;cursor:pointer;',
      'transition:all .2s ease;',
      'text-decoration:none;',
      'font-family:var(--font-head);',
    '}',
    '.btn-primary{',
      'background:linear-gradient(135deg,var(--accent,#00C6FF),var(--blue,#0070F3));',
      'color:#fff;',
      'box-shadow:0 4px 20px rgba(0,198,255,.25);',
    '}',
    '.btn-primary:hover{transform:translateY(-2px);box-shadow:0 8px 30px rgba(0,198,255,.35)}',
    '.btn-secondary{background:transparent;border:2px solid rgba(255,255,255,.15);color:var(--text,#e8ecf4)}',
    '.btn-secondary:hover{border-color:var(--accent,#00C6FF);color:var(--accent,#00C6FF)}',
    '.btn-full{width:100%;justify-content:center}',

    '.quiz-btn{',
      'display:block;width:100%;',
      'text-align:left;',
      'padding:16px 22px;',
      'margin-bottom:10px;',
      'background:rgba(255,255,255,.03);',
      'border:1px solid rgba(255,255,255,.08);',
      'border-radius:12px;',
      'color:var(--text,#e8ecf4);',
      'font-size:.95rem;',
      'cursor:pointer;',
      'transition:all .2s;',
      'font-family:inherit;',
      'line-height:1.5;',
    '}',
    '.quiz-btn:hover{',
      'border-color:rgba(0,198,255,.3);',
      'background:rgba(0,198,255,.05);',
    '}',

    /* ==========================================
       TOAST NOTIFICATION
       ========================================== */
    '.ps-toast{',
      'position:fixed;',
      'bottom:30px;',
      'left:50%;',
      'transform:translateX(-50%) translateY(80px);',
      'background:var(--surface,#111633);',
      'border:1px solid rgba(0,198,255,.3);',
      'color:var(--text,#e8ecf4);',
      'padding:16px 28px;',
      'border-radius:14px;',
      'z-index:10001;',
      'font-size:.95rem;',
      'font-family:var(--font-body);',
      'opacity:0;',
      'transition:all .4s cubic-bezier(.22,1,.36,1);',
      'pointer-events:none;',
      'max-width:90vw;',
      'text-align:center;',
      'box-shadow:0 8px 40px rgba(0,0,0,.4);',
    '}',
    '.ps-toast.show{',
      'opacity:1;',
      'transform:translateX(-50%) translateY(0);',
      'pointer-events:auto;',
    '}',

    /* ==========================================
       RESPONSIVE TWEAKS
       ========================================== */
    '@media(max-width:600px){',
      '.quiz-metric-row{flex-wrap:wrap}',
      '.quiz-metric-label{flex:0 0 90px;font-size:.65rem}',
      '.quiz-metric-value{font-size:.78rem}',
      '.auth-modal-card{padding:28px 20px;border-radius:16px}',
      '.auth-view-panel h3{font-size:1.3rem}',
      '.faq-question{padding:16px 18px;font-size:.92rem}',
      '.faq-answer.faq-answer-open{padding:14px 18px}',
      '.ps-toast{padding:14px 20px;font-size:.88rem;bottom:20px}',
    '}'
  ].join('\n');
  document.head.appendChild(css);

  // ── Toast notification (replaces alert) ──
  function showToast(msg, duration) {
    var existing = qs('.ps-toast');
    if (existing) existing.remove();
    var toast = document.createElement('div');
    toast.className = 'ps-toast';
    toast.textContent = msg;
    document.body.appendChild(toast);
    requestAnimationFrame(function () {
      requestAnimationFrame(function () { toast.classList.add('show'); });
    });
    setTimeout(function () {
      toast.classList.remove('show');
      setTimeout(function () { toast.remove(); }, 400);
    }, duration || 3500);
  }

  // ============================================================
  // SECTION 1: SCROLL PROGRESS
  // ============================================================
  try {
    var scrollProgress = qs('#scrollProgress');
    if (scrollProgress) {
      on(window, 'scroll', function () {
        var st = window.pageYOffset || document.documentElement.scrollTop;
        var dh = document.documentElement.scrollHeight - window.innerHeight;
        var pct = dh > 0 ? (st / dh) * 100 : 0;
        scrollProgress.style.width = pct + '%';
        scrollProgress.setAttribute('aria-valuenow', String(Math.round(pct)));
      }, { passive: true });
    }
  } catch (_) {}

  // ============================================================
  // SECTION 2: BACK TO TOP
  // ============================================================
  try {
    var backToTop = qs('#backToTop');
    if (backToTop) {
      on(window, 'scroll', function () {
        backToTop.hidden = (window.pageYOffset || document.documentElement.scrollTop) < 400;
      }, { passive: true });
      on(backToTop, 'click', function () {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    }
  } catch (_) {}

  // ============================================================
  // SECTION 3: MOBILE MENU
  // ============================================================
  try {
    var menuToggle = qs('#menuToggle');
    var mainNav    = qs('#mainNav');
    if (menuToggle && mainNav) {
      on(menuToggle, 'click', function () {
        var expanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', String(!expanded));
        mainNav.classList.toggle('nav-open');
        var icon = this.querySelector('i');
        if (icon) icon.className = expanded ? 'fas fa-bars' : 'fas fa-times';
      });
      on(mainNav, 'click', function (e) {
        if (e.target.closest('a') && mainNav.classList.contains('nav-open')) {
          mainNav.classList.remove('nav-open');
          menuToggle.setAttribute('aria-expanded', 'false');
          var icon = menuToggle.querySelector('i');
          if (icon) icon.className = 'fas fa-bars';
        }
      });
    }
  } catch (_) {}

  // ============================================================
  // SECTION 4: SEARCH OVERLAY
  // ============================================================
  try {
    var searchToggle  = qs('#searchToggle');
    var searchOverlay = qs('#searchOverlay');
    var searchClose   = qs('#searchClose');
    var searchInput   = qs('#searchInput');
    var searchResults = qs('#searchResults');

    function closeSearch() {
      if (searchOverlay) searchOverlay.hidden = true;
      if (searchToggle) searchToggle.setAttribute('aria-expanded', 'false');
      if (searchToggle) searchToggle.focus();
    }

    if (searchToggle && searchOverlay) {
      on(searchToggle, 'click', function () {
        searchOverlay.hidden = false;
        this.setAttribute('aria-expanded', 'true');
        if (searchInput) setTimeout(function () { searchInput.focus(); }, 60);
      });
      on(searchClose, 'click', closeSearch);
      on(searchOverlay, 'click', function (e) {
        if (e.target === searchOverlay) closeSearch();
      });
      on(document, 'keydown', function (e) {
        if (e.key === 'Escape' && searchOverlay && !searchOverlay.hidden) closeSearch();
      });
      if (searchInput && searchResults) {
        on(searchInput, 'input', function () {
          var q = this.value.toLowerCase().trim();
          if (!q) { searchResults.innerHTML = ''; return; }
          var matches = qsa('h2, h3').map(function (el) {
            return { text: el.textContent, section: el.closest('section') };
          }).filter(function (s) {
            return s.text.toLowerCase().indexOf(q) !== -1;
          }).slice(0, 8);
          searchResults.innerHTML = matches.length
            ? matches.map(function (m) {
                return '<a href="#' + (m.section ? m.section.id : '') + '" class="search-result-item">' + m.text + '</a>';
              }).join('')
            : '<p style="color:var(--text-sec,#8b95ad);padding:12px 0">No results found.</p>';
        });
      }
    }
  } catch (_) {}

  // ============================================================
  // SECTION 5: POONAM DROPDOWN
  // ============================================================
  try {
    var poonamTrigger  = qs('#poonamNavTrigger');
    var poonamDropdown = qs('#poonamDropdown');

    if (poonamTrigger && poonamDropdown) {
      on(poonamTrigger, 'click', function (e) {
        e.stopPropagation();
        var expanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', String(!expanded));
        poonamDropdown.classList.toggle('poonam-dd-open', !expanded);
      });
      on(document, 'click', function (e) {
        if (poonamDropdown.classList.contains('poonam-dd-open') &&
            !poonamDropdown.contains(e.target) && e.target !== poonamTrigger) {
          poonamTrigger.setAttribute('aria-expanded', 'false');
          poonamDropdown.classList.remove('poonam-dd-open');
        }
      });
    }
  } catch (_) {}

  // ============================================================
  // SECTION 6: FAQ ACCORDION (event delegation — bulletproof)
  // ============================================================
  try {
    on(document, 'click', function (e) {
      var btn = e.target.closest('.faq-question');
      if (!btn) return;

      var expanded = btn.getAttribute('aria-expanded') === 'true';
      var answer   = btn.nextElementSibling;

      // Close all others
      qsa('.faq-question').forEach(function (other) {
        if (other !== btn) {
          other.setAttribute('aria-expanded', 'false');
          var a = other.nextElementSibling;
          if (a) a.classList.remove('faq-answer-open');
        }
      });

      // Toggle this one
      btn.setAttribute('aria-expanded', String(!expanded));
      if (answer) answer.classList.toggle('faq-answer-open', !expanded);
    });
  } catch (_) {}

  // ============================================================
  // SECTION 7: AUTH MODAL (event delegation — bulletproof)
  // ============================================================
  try {
    var authModal = qs('#authModal');

    function openAuth(view) {
      if (!authModal) return;
      authModal.hidden = false;
      showAuthView(view || 'login');
    }

    function closeAuth() {
      if (authModal) authModal.hidden = true;
    }

    function showAuthView(view) {
      var login  = qs('#authViewLogin');
      var signup = qs('#authViewSignup');
      var forgot = qs('#authViewForgot');
      if (login)  login.hidden  = (view !== 'login');
      if (signup) signup.hidden = (view !== 'signup');
      if (forgot) forgot.hidden = (view !== 'forgot');
    }

    // Event delegation for all auth-related clicks
    on(document, 'click', function (e) {
      var target = e.target;

      // Student Login / Parent Login buttons
      if (target.closest('#btnStudentLogin') || target.closest('#btnParentLogin')) {
        e.preventDefault();
        openAuth('login');
        return;
      }

      // Close modal button
      if (target.closest('#btnCloseModal')) {
        closeAuth();
        return;
      }

      // Click on overlay backdrop
      if (target === authModal) {
        closeAuth();
        return;
      }

      // Navigation between auth views
      if (target.closest('#btnGotoSignup')) { showAuthView('signup'); return; }
      if (target.closest('#btnGotoLogin') || target.closest('#btnGotoLogin2')) { showAuthView('login'); return; }
      if (target.closest('#btnGotoForgot')) { showAuthView('forgot'); return; }
    });

    // Escape key to close
    on(document, 'keydown', function (e) {
      if (e.key === 'Escape' && authModal && !authModal.hidden) closeAuth();
    });

    // Form submissions (delegation)
    on(document, 'submit', function (e) {
      var form = e.target;
      if (form.id === 'formLogin' || form.id === 'formSignup' || form.id === 'formForgot') {
        e.preventDefault();
        showToast('Backend integration required. This is a frontend demo.');
      }
    });

    // Password strength
    on(document, 'input', function (e) {
      if (e.target.id !== 'signupPass') return;
      var v = e.target.value;
      var s = 0;
      if (v.length >= 8) s++;
      if (/[A-Z]/.test(v)) s++;
      if (/[0-9]/.test(v)) s++;
      if (/[^A-Za-z0-9]/.test(v)) s++;
      var pct    = (s / 4) * 100;
      var colors = ['#ff4444', '#ffaa00', '#aadd00', '#00df89'];
      var labels = ['Weak', 'Fair', 'Good', 'Strong'];
      var bar = qs('#strengthBar');
      var fb  = qs('#strengthFeedback');
      if (bar) { bar.style.width = pct + '%'; bar.style.background = colors[s] || colors[0]; }
      if (fb)  { fb.textContent = v.length === 0 ? 'Min 8 chars, uppercase, number, special char' : (labels[s] || labels[0]); }
    });
  } catch (_) {}

  // ============================================================
  // SECTION 8: NOTES DOWNLOAD
  // ============================================================
  try {
    on(document, 'click', function (e) {
      var btn = e.target.closest('.download-btn-style');
      if (!btn) return;
      var notesType = btn.getAttribute('data-notes') || 'unknown';
      trackEvent('cta-notes-' + notesType);
      openAuth('login');
    });
  } catch (_) {}

  // ============================================================
  // SECTION 9: CONTACT FORM
  // ============================================================
  try {
    on(document, 'submit', function (e) {
      if (e.target.id !== 'contactForm') return;
      e.preventDefault();
      var nameEl  = qs('#studentName');
      var emailEl = qs('#studentEmail');
      var phoneEl = qs('#studentPhone');
      var name  = nameEl  ? nameEl.value.trim()  : '';
      var email = emailEl ? emailEl.value.trim()  : '';
      var phone = phoneEl ? phoneEl.value.trim()  : '';

      if (!name || !email || !phone) { showToast('Please fill in all required fields.'); return; }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showToast('Please enter a valid email address.'); return; }
      if (!/^[0-9]{10}$/.test(phone)) { showToast('Please enter a valid 10-digit phone number.'); return; }

      trackEvent('contact-form-submit');
      showToast('Thank you! Abhinav sir will reach out within 24 hours.', 4000);
      e.target.reset();
    });
  } catch (_) {}

  // ============================================================
  // SECTION 10: DATA-TRACK ANALYTICS
  // ============================================================
  try {
    on(document, 'click', function (e) {
      var el = e.target.closest('[data-track]');
      if (el) trackEvent(el.getAttribute('data-track'));
    });
  } catch (_) {}

  // ============================================================
  // SECTION 11: SMOOTH SCROLL
  // ============================================================
  try {
    on(document, 'click', function (e) {
      var link = e.target.closest('a[href^="#"]');
      if (!link) return;
      var href = link.getAttribute('href');
      if (href && href.length > 1) {
        var target = qs(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  } catch (_) {}

  // ============================================================
  // SECTION 12: BLOG FILTERS
  // ============================================================
  try {
    on(document, 'click', function (e) {
      var btn = e.target.closest('.filter-btn');
      if (!btn) return;
      qsa('.filter-btn').forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');
      var filter = btn.getAttribute('data-filter');
      qsa('.blog-card, .blog-post-card').forEach(function (card) {
        if (filter === 'all') {
          card.style.display = '';
        } else {
          var tags = (card.getAttribute('data-category') || card.getAttribute('data-tags') || '').toLowerCase();
          card.style.display = tags.indexOf(filter) !== -1 ? '' : 'none';
        }
      });
    });
  } catch (_) {}

  // ============================================================
  // SECTION 13: MINDSET AUDIT QUIZ
  // ============================================================
  try {

    // ── Student Questions ──
    var studentQuestions = [
      { q: "When you sit down to study a completely new chapter, what's your first instinct?",
        options: [
          { text: "Read the textbook line by line carefully", scores: { CD: 4, ER: 3, SD: 5, SA: 3, FC: 4 } },
          { text: "Watch a video lecture or explanation first", scores: { CD: 3, ER: 3, SD: 3, SA: 3, FC: 3 } },
          { text: "Jump straight into solved examples", scores: { CD: 2, ER: 3, SD: 2, SA: 4, FC: 2 } },
          { text: "Skim headings and key formulas first", scores: { CD: 2, ER: 2, SD: 2, SA: 3, FC: 2 } }
        ]},
      { q: "During a mock test, you encounter a problem you've never seen before. You:",
        options: [
          { text: "Break it into smaller parts and attempt logically", scores: { CD: 4, ER: 4, SD: 3, SA: 5, FC: 3 } },
          { text: "Skip it and come back after finishing others", scores: { CD: 3, ER: 4, SD: 3, SA: 4, FC: 3 } },
          { text: "Feel a wave of panic and lose your train of thought", scores: { CD: 2, ER: 1, SD: 2, SA: 1, FC: 2 } },
          { text: "Use elimination to make an educated guess", scores: { CD: 2, ER: 3, SD: 2, SA: 4, FC: 3 } }
        ]},
      { q: "How would you describe your daily study routine?",
        options: [
          { text: "Fixed schedule — same hours every day", scores: { CD: 3, ER: 4, SD: 5, SA: 3, FC: 5 } },
          { text: "Flexible but mostly consistent", scores: { CD: 3, ER: 3, SD: 4, SA: 3, FC: 4 } },
          { text: "Intense bursts right before exams", scores: { CD: 2, ER: 2, SD: 2, SA: 3, FC: 2 } },
          { text: "No fixed routine — study when motivated", scores: { CD: 2, ER: 2, SD: 1, SA: 2, FC: 1 } }
        ]},
      { q: "A formula or derivation refuses to stick in your memory. You:",
        options: [
          { text: "Write it out repeatedly until it sticks", scores: { CD: 2, ER: 3, SD: 4, SA: 2, FC: 4 } },
          { text: "Try to understand the logic behind it first", scores: { CD: 5, ER: 3, SD: 3, SA: 4, FC: 3 } },
          { text: "Create mnemonics, diagrams, or visual tricks", scores: { CD: 3, ER: 3, SD: 3, SA: 4, FC: 3 } },
          { text: "Move on and hope I remember during the exam", scores: { CD: 1, ER: 2, SD: 1, SA: 1, FC: 2 } }
        ]},
      { q: "After a mock test, your first instinct is to:",
        options: [
          { text: "Analyze every wrong answer in detail", scores: { CD: 4, ER: 4, SD: 4, SA: 5, FC: 4 } },
          { text: "Check your score and percentile ranking", scores: { CD: 2, ER: 3, SD: 3, SA: 2, FC: 3 } },
          { text: "Feel disappointed if the score is low", scores: { CD: 2, ER: 2, SD: 2, SA: 2, FC: 2 } },
          { text: "Move on to the next topic quickly", scores: { CD: 3, ER: 3, SD: 3, SA: 3, FC: 3 } }
        ]},
      { q: "What's the biggest barrier to your preparation right now?",
        options: [
          { text: "I can't maintain focus for long stretches", scores: { CD: 3, ER: 3, SD: 2, SA: 2, FC: 2 } },
          { text: "Concepts feel unclear despite studying", scores: { CD: 2, ER: 3, SD: 3, SA: 2, FC: 3 } },
          { text: "I don't have enough time for revision", scores: { CD: 3, ER: 3, SD: 2, SA: 3, FC: 3 } },
          { text: "Exam pressure ruins my performance", scores: { CD: 3, ER: 1, SD: 3, SA: 2, FC: 3 } }
        ]},
      { q: "When you make the same mistake repeatedly:",
        options: [
          { text: "I maintain an error log and review it regularly", scores: { CD: 4, ER: 4, SD: 5, SA: 4, FC: 4 } },
          { text: "I get frustrated but keep pushing through", scores: { CD: 3, ER: 4, SD: 3, SA: 3, FC: 3 } },
          { text: "I solve extra problems on that specific topic", scores: { CD: 3, ER: 3, SD: 3, SA: 3, FC: 4 } },
          { text: "I ask my teacher to re-explain the concept", scores: { CD: 4, ER: 3, SD: 3, SA: 3, FC: 3 } }
        ]},
      { q: "How do you typically approach a complex numerical problem?",
        options: [
          { text: "Read carefully → identify given/required → solve systematically", scores: { CD: 4, ER: 4, SD: 4, SA: 4, FC: 4 } },
          { text: "Start solving and figure it out as I go", scores: { CD: 2, ER: 3, SD: 2, SA: 2, FC: 2 } },
          { text: "Check if it matches a known pattern or template", scores: { CD: 3, ER: 3, SD: 3, SA: 4, FC: 3 } },
          { text: "I often get stuck midway and lose confidence", scores: { CD: 2, ER: 1, SD: 2, SA: 2, FC: 2 } }
        ]},
      { q: "On exam day, you typically feel:",
        options: [
          { text: "Calm and well-prepared", scores: { CD: 3, ER: 5, SD: 4, SA: 3, FC: 4 } },
          { text: "Nervous, but the pressure helps me focus", scores: { CD: 3, ER: 4, SD: 3, SA: 3, FC: 3 } },
          { text: "Very anxious — I second-guess my answers", scores: { CD: 2, ER: 1, SD: 2, SA: 2, FC: 2 } },
          { text: "Fine initially, but panic if I get stuck on a question", scores: { CD: 3, ER: 2, SD: 3, SA: 2, FC: 3 } }
        ]},
      { q: "If you could change one thing about your preparation, it would be:",
        options: [
          { text: "Better time management", scores: { CD: 3, ER: 3, SD: 3, SA: 4, FC: 3 } },
          { text: "Deeper understanding of concepts", scores: { CD: 5, ER: 3, SD: 3, SA: 3, FC: 3 } },
          { text: "A more disciplined daily routine", scores: { CD: 3, ER: 3, SD: 5, SA: 3, FC: 4 } },
          { text: "Less anxiety and more confidence", scores: { CD: 3, ER: 5, SD: 3, SA: 3, FC: 3 } }
        ]}
    ];

    // ── Parent Questions ──
    var parentQuestions = [
      { q: "How would you describe your child's study routine at home?",
        options: [
          { text: "Very disciplined — fixed schedule, rarely deviates", scores: { SL: 5, CM: 3, AW: 4, BL: 4, ST: 4 } },
          { text: "Reasonably consistent with occasional gaps", scores: { SL: 4, CM: 3, AW: 3, BL: 4, ST: 3 } },
          { text: "Needs constant reminders to sit and study", scores: { SL: 2, CM: 2, AW: 3, BL: 2, ST: 2 } },
          { text: "Varies a lot — intense some weeks, absent others", scores: { SL: 2, CM: 2, AW: 2, BL: 2, ST: 2 } }
        ]},
      { q: "When your child gets lower marks than expected, you typically:",
        options: [
          { text: "Sit with them to understand what went wrong", scores: { SL: 5, CM: 5, AW: 4, BL: 4, ST: 4 } },
          { text: "Encourage them to work harder next time", scores: { SL: 4, CM: 3, AW: 3, BL: 3, ST: 3 } },
          { text: "Worry about their future prospects", scores: { SL: 3, CM: 2, AW: 3, BL: 2, ST: 2 } },
          { text: "Compare with peers or toppers in their class", scores: { SL: 2, CM: 1, AW: 2, BL: 1, ST: 1 } }
        ]},
      { q: "How openly does your child communicate about academic struggles?",
        options: [
          { text: "Very open — they share difficulties and ask for help", scores: { SL: 4, CM: 5, AW: 5, BL: 4, ST: 4 } },
          { text: "They mention challenges sometimes", scores: { SL: 3, CM: 3, AW: 3, BL: 3, ST: 3 } },
          { text: "Rarely talks about struggles unless asked directly", scores: { SL: 2, CM: 2, AW: 2, BL: 3, ST: 2 } },
          { text: "Gets defensive when asked about studies", scores: { SL: 1, CM: 1, AW: 2, BL: 1, ST: 1 } }
        ]},
      { q: "Do you know your child's specific weak topics or subjects?",
        options: [
          { text: "Yes — I track their performance regularly", scores: { SL: 4, CM: 4, AW: 5, BL: 3, ST: 5 } },
          { text: "I have a general idea", scores: { SL: 3, CM: 3, AW: 3, BL: 3, ST: 3 } },
          { text: "Not really — I rely on the coaching institute", scores: { SL: 2, CM: 2, AW: 2, BL: 3, ST: 2 } },
          { text: "My child doesn't share that information", scores: { SL: 1, CM: 1, AW: 1, BL: 2, ST: 1 } }
        ]},
      { q: "How do you handle screen time and digital distractions?",
        options: [
          { text: "Clear rules that are consistently enforced", scores: { SL: 5, CM: 3, AW: 3, BL: 4, ST: 4 } },
          { text: "Rules exist but enforcement is inconsistent", scores: { SL: 3, CM: 2, AW: 3, BL: 3, ST: 2 } },
          { text: "We've mostly given up on controlling it", scores: { SL: 1, CM: 2, AW: 2, BL: 1, ST: 1 } },
          { text: "My child self-regulates their screen time", scores: { SL: 4, CM: 4, AW: 4, BL: 5, ST: 4 } }
        ]},
      { q: "What's your biggest concern about your child's exam preparation?",
        options: [
          { text: "They don't put in enough effort", scores: { SL: 3, CM: 2, AW: 3, BL: 2, ST: 3 } },
          { text: "They study hard but scores don't reflect it", scores: { SL: 3, CM: 3, AW: 4, BL: 3, ST: 4 } },
          { text: "They're too stressed or anxious about exams", scores: { SL: 4, CM: 4, AW: 4, BL: 4, ST: 3 } },
          { text: "They lack clear goals or motivation", scores: { SL: 3, CM: 2, AW: 3, BL: 2, ST: 3 } }
        ]},
      { q: "How involved are you in planning your child's academic journey?",
        options: [
          { text: "Very involved — I help choose resources and track progress", scores: { SL: 4, CM: 4, AW: 4, BL: 3, ST: 5 } },
          { text: "Involved at a high level — goals, coaching choices", scores: { SL: 3, CM: 3, AW: 3, BL: 4, ST: 4 } },
          { text: "Mostly leave it to the child and teachers", scores: { SL: 3, CM: 3, AW: 2, BL: 4, ST: 2 } },
          { text: "I want to help more but don't know how", scores: { SL: 3, CM: 2, AW: 3, BL: 2, ST: 2 } }
        ]},
      { q: "Does your child maintain hobbies or activities alongside studies?",
        options: [
          { text: "Yes — we ensure a balanced routine", scores: { SL: 3, CM: 4, AW: 4, BL: 5, ST: 4 } },
          { text: "They used to but stopped for exam prep", scores: { SL: 3, CM: 3, AW: 3, BL: 2, ST: 3 } },
          { text: "Not really — mostly studying all the time", scores: { SL: 3, CM: 2, AW: 3, BL: 1, ST: 2 } },
          { text: "Too many breaks and not enough study", scores: { SL: 2, CM: 2, AW: 3, BL: 2, ST: 2 } }
        ]},
      { q: "How does your child handle competitive pressure from peers?",
        options: [
          { text: "It motivates them to improve", scores: { SL: 4, CM: 3, AW: 4, BL: 4, ST: 4 } },
          { text: "They get stressed but manage to cope", scores: { SL: 3, CM: 3, AW: 3, BL: 3, ST: 3 } },
          { text: "It significantly affects their confidence", scores: { SL: 2, CM: 2, AW: 4, BL: 2, ST: 2 } },
          { text: "They seem largely unaffected either way", scores: { SL: 3, CM: 3, AW: 3, BL: 3, ST: 2 } }
        ]},
      { q: "If you could improve one aspect of your child's preparation:",
        options: [
          { text: "Better study habits and consistency", scores: { SL: 5, CM: 3, AW: 3, BL: 3, ST: 4 } },
          { text: "Stronger conceptual understanding", scores: { SL: 3, CM: 3, AW: 4, BL: 3, ST: 4 } },
          { text: "Reduced exam anxiety and better mindset", scores: { SL: 4, CM: 4, AW: 4, BL: 4, ST: 3 } },
          { text: "Better mentorship and personalized guidance", scores: { SL: 3, CM: 3, AW: 3, BL: 3, ST: 4 } }
        ]}
    ];

    // ── Archetypes ──
    var studentArchetypes = {
      CD: { badge: '🔍', name: 'The Deep Diver',      tagline: "You seek true understanding — not just memorization. This depth is your greatest weapon." },
      ER: { badge: '🛡️', name: 'The Unshakeable',    tagline: "Pressure doesn't break you — it sharpens you. Your composure is rare." },
      SD: { badge: '🏗️', name: 'The Architect',      tagline: "Your structure and consistency are superpowers. Results are a matter of time." },
      SA: { badge: '♟️', name: 'The Chess Player',   tagline: "You think several moves ahead. Strategy is your natural language." },
      FC: { badge: '🏃', name: 'The Marathoner',      tagline: "Your sustained focus and quiet consistency outperform short bursts every time." }
    };
    var parentArchetypes = {
      SL: { badge: '⚓',  name: 'The Anchor',          tagline: "Your supportive presence is your child's strongest academic asset." },
      CM: { badge: '💬', name: 'The Bridge Builder',   tagline: "Open communication is the foundation of everything you do together." },
      AW: { badge: '🔎', name: 'The Investigator',     tagline: "You dig deep to understand what's really happening behind the marks." },
      BL: { badge: '⚖️', name: 'The Guardian',        tagline: "You protect your child's wellbeing — and that keeps them going long-term." },
      ST: { badge: '🧭', name: 'The Navigator',        tagline: "You see the big picture and chart the course before problems arise." }
    };

    var studentDimLabels = { CD: 'Conceptual Depth', ER: 'Exam Resilience', SD: 'Study Discipline', SA: 'Strategic Aptitude', FC: 'Focus & Consistency' };
    var parentDimLabels  = { SL: 'Support Level',    CM: 'Communication',   AW: 'Awareness',        BL: 'Balance',              ST: 'Strategic Support' };
    var barColors = { CD: '#00C6FF', ER: '#00df89', SD: '#FFB800', SA: '#A855F7', FC: '#FF6B6B',
                      SL: '#00C6FF', CM: '#00df89', AW: '#FFB800', BL: '#A855F7', ST: '#FF6B6B' };

    // ── Quiz state ──
    var quizState = { role: null, questions: [], answers: [], currentQ: 0, totalQ: 10 };

    // ── Quiz DOM ──
    var roleSelectWindow   = qs('#roleSelectWindow');
    var quizWindow         = qs('#quizWindow');
    var quizControls       = qs('#quizControls');
    var resultWindow       = qs('#resultWindow');
    var questionText       = qs('#questionText');
    var answerButtons      = qs('#answerButtons');
    var nextBtn            = qs('#nextBtn');
    var restartBtn         = qs('#restartBtn');
    var quizProgressFill   = qs('#quizProgressFill');
    var quizProgressText   = qs('#quizProgressText');
    var quizTrackIdentity  = qs('#quizTrackIdentity');
    var badgeDisplay       = qs('#badgeDisplay');
    var psychMetricsOutput = qs('#psychMetricsOutput');

    if (!roleSelectWindow || !quizWindow || !questionText || !answerButtons) {
      console.warn('[Quiz] Missing DOM — quiz section disabled.');
    } else {

      // Role selection (delegation)
      on(document, 'click', function (e) {
        if (e.target.closest('#btnRoleStudent')) { startQuiz('student'); return; }
        if (e.target.closest('#btnRoleParent'))  { startQuiz('parent');  return; }
        if (e.target.closest('#restartBtn'))     { restartQuiz();        return; }
        if (e.target.closest('#nextBtn'))        { handleNext();         return; }
      });

      function startQuiz(role) {
        quizState.role      = role;
        quizState.questions = (role === 'student') ? studentQuestions : parentQuestions;
        quizState.answers   = [];
        quizState.currentQ  = 0;
        roleSelectWindow.hidden = true;
        resultWindow.hidden     = true;
        quizWindow.hidden       = false;
        if (quizControls) quizControls.hidden = false;
        if (quizTrackIdentity) quizTrackIdentity.textContent = (role === 'student') ? '🎓 Student Track' : '👨‍👩‍👧 Parent Track';
        trackEvent('quiz-start-' + role);
        renderQuestion();
      }

      function renderQuestion() {
        var q     = quizState.questions[quizState.currentQ];
        var idx   = quizState.currentQ;
        var total = quizState.totalQ;
        if (quizProgressFill) quizProgressFill.style.width = ((idx) / total * 100) + '%';
        if (quizProgressText) quizProgressText.textContent = 'Question ' + (idx + 1) + ' of ' + total;
        questionText.textContent = q.q;
        answerButtons.innerHTML = '';
        q.options.forEach(function (opt, i) {
          var btn = document.createElement('button');
          btn.type = 'button';
          btn.className = 'quiz-btn';
          btn.textContent = opt.text;
          btn.setAttribute('data-quiz-idx', String(i));
          if (quizState.answers[idx] === i) btn.classList.add('quiz-btn-selected');
          on(btn, 'click', function () { selectAnswer(i); });
          answerButtons.appendChild(btn);
        });
        if (nextBtn) {
          nextBtn.hidden = (quizState.answers[idx] === undefined);
          nextBtn.innerHTML = (idx === total - 1)
            ? 'View Results <i class="fas fa-arrow-right" aria-hidden="true"></i>'
            : 'Next <i class="fas fa-arrow-right" aria-hidden="true"></i>';
        }
      }

      function selectAnswer(optionIndex) {
        quizState.answers[quizState.currentQ] = optionIndex;
        qsa('.quiz-btn', answerButtons).forEach(function (btn, i) {
          btn.classList.toggle('quiz-btn-selected', i === optionIndex);
        });
        if (nextBtn) {
          nextBtn.hidden = false;
          nextBtn.innerHTML = (quizState.currentQ === quizState.totalQ - 1)
            ? 'View Results <i class="fas fa-arrow-right" aria-hidden="true"></i>'
            : 'Next <i class="fas fa-arrow-right" aria-hidden="true"></i>';
        }
      }

      function handleNext() {
        if (quizState.answers[quizState.currentQ] === undefined) return;
        if (quizState.currentQ < quizState.totalQ - 1) {
          quizState.currentQ++;
          renderQuestion();
        } else {
          showResults();
        }
      }

      function showResults() {
        quizWindow.hidden = true;
        if (quizControls) quizControls.hidden = true;
        resultWindow.hidden = false;

        var isStudent  = (quizState.role === 'student');
        var archetypes = isStudent ? studentArchetypes : parentArchetypes;
        var dimLabels  = isStudent ? studentDimLabels  : parentDimLabels;
        var dimKeys    = Object.keys(dimLabels);

        var totals = {};
        dimKeys.forEach(function (k) { totals[k] = 0; });
        quizState.questions.forEach(function (q, i) {
          var sel = q.options[quizState.answers[i]];
          if (sel && sel.scores) {
            dimKeys.forEach(function (k) { totals[k] += (sel.scores[k] || 0); });
          }
        });

        var maxPerDim = quizState.totalQ * 5;
        var pct = {};
        dimKeys.forEach(function (k) { pct[k] = Math.round((totals[k] / maxPerDim) * 100); });

        var dominantKey = dimKeys[0], weakestKey = dimKeys[0];
        dimKeys.forEach(function (k) {
          if (pct[k] > pct[dominantKey]) dominantKey = k;
          if (pct[k] < pct[weakestKey])  weakestKey  = k;
        });

        var archetype = archetypes[dominantKey];
        var insights  = getInsights(isStudent, dominantKey, weakestKey, pct);
        if (badgeDisplay) badgeDisplay.textContent = archetype.badge;

        var html = '';
        html += '<div class="quiz-profile-header">';
        html +=   '<span class="quiz-profile-name">' + archetype.name + '</span>';
        html +=   '<p class="quiz-profile-tagline">' + archetype.tagline + '</p>';
        html += '</div>';
        html += '<div class="quiz-metrics-grid">';
        dimKeys.forEach(function (k) {
          html += '<div class="quiz-metric-row">';
          html +=   '<span class="quiz-metric-label">' + dimLabels[k] + '</span>';
          html +=   '<div class="quiz-metric-bar"><div class="quiz-metric-fill" style="width:0;background:' + (barColors[k] || '#00C6FF') + '" data-w="' + pct[k] + '%"></div></div>';
          html +=   '<span class="quiz-metric-value">' + pct[k] + '%</span>';
          html += '</div>';
        });
        html += '</div>';
        html += '<div class="quiz-insight-box" id="insightStrength">';
        html +=   '<div class="quiz-insight-label">Top Strength</div>';
        html +=   '<div class="quiz-insight-title">' + dimLabels[dominantKey] + ' — ' + pct[dominantKey] + '%</div>';
        html +=   '<p class="quiz-insight-text">' + insights.strength + '</p>';
        html += '</div>';
        html += '<div class="quiz-insight-box" id="insightGrowth">';
        html +=   '<div class="quiz-insight-label">Primary Growth Area</div>';
        html +=   '<div class="quiz-insight-title">' + dimLabels[weakestKey] + ' — ' + pct[weakestKey] + '%</div>';
        html +=   '<p class="quiz-insight-text">' + insights.growth + '</p>';
        html += '</div>';
        html += '<div class="quiz-track-rec" id="insightRec">';
        html +=   '<h4>' + insights.recTitle + '</h4>';
        html +=   '<p>' + insights.recText + '</p>';
        html += '</div>';

        if (psychMetricsOutput) psychMetricsOutput.innerHTML = html;

        setTimeout(function () {
          qsa('.quiz-metric-fill', psychMetricsOutput).forEach(function (bar) {
            bar.style.width = bar.getAttribute('data-w');
          });
        }, 100);
        setTimeout(function () { var el = qs('#insightStrength'); if (el) el.classList.add('visible'); }, 600);
        setTimeout(function () { var el = qs('#insightGrowth');   if (el) el.classList.add('visible'); }, 900);
        setTimeout(function () { var el = qs('#insightRec');      if (el) el.classList.add('visible'); }, 1200);

        if (quizProgressFill) quizProgressFill.style.width = '100%';
        if (quizProgressText) quizProgressText.textContent = 'Scan Complete';
        trackEvent('quiz-complete-' + quizState.role);
      }

      function restartQuiz() {
        resultWindow.hidden = true;
        quizWindow.hidden   = true;
        if (quizControls) quizControls.hidden = true;
        roleSelectWindow.hidden = false;
        if (quizProgressFill)   quizProgressFill.style.width  = '0%';
        if (quizProgressText)   quizProgressText.textContent  = '';
        if (badgeDisplay)       badgeDisplay.textContent      = '';
        if (psychMetricsOutput) psychMetricsOutput.innerHTML  = '';
        trackEvent('quiz-restart');
      }

      function getInsights(isStudent, strongest, weakest, pcts) {
        if (isStudent) {
          var sMap = {
            CD: "You have a natural drive to understand the 'why' behind every concept. This depth gives you a decisive edge in application-based questions. Keep nurturing this instinct.",
            ER: "You handle exam pressure remarkably well. This composure under fire means your test scores consistently reflect your true preparation level — a rare advantage.",
            SD: "Your study routine is structured and consistent. This discipline compounds over time and is one of the strongest predictors of success in competitive exams.",
            SA: "You think strategically about your preparation — analyzing patterns, managing priorities, and focusing on what moves the needle. This separates top performers.",
            FC: "Your ability to maintain sustained focus is a significant advantage. In an era of constant distraction, this quiet consistency outperforms flashy short bursts."
          };
          var gMap = {
            CD: "Invest more time in understanding the 'why' behind formulas and derivations rather than jumping straight to problem-solving. Concept-first learning multiplies accuracy.",
            ER: "Exam anxiety may be silently capping your performance. Try timed mock sessions, box-breathing before tests, and structured error analysis after every practice paper.",
            SD: "Building a consistent daily routine — even starting with 2 focused hours at the same time each day — will compound dramatically. Use a tracker to build momentum.",
            SA: "Develop post-test analysis habits. After every mock, identify which question types consumed the most time and which concepts caused hesitation.",
            FC: "Try the Pomodoro technique (25 min focused + 5 min break). Remove phone notifications during study windows — even one interruption resets your flow state."
          };
          var rT, rX;
          if (pcts.ER < 40 || pcts.SD < 40) {
            rT = "Recommended: Elite Hyper-Personalized Micro-Batch";
            rX = "Your profile reveals specific areas where focused 1:1 mentorship would create a dramatic shift. Our max 5-student Elite batch provides structured accountability, real-time error analysis, and psychometric counseling.";
          } else if (pcts.CD < 40 || pcts.SA < 40) {
            rT = "Recommended: Advanced Personalized Cohort";
            rX = "You'd benefit from concept-first teaching with collaborative peer benchmarks. Our max 10-student cohort balances deep conceptual instruction with competitive benchmarking.";
          } else {
            rT = "Recommended: Elite Hyper-Personalized Micro-Batch";
            rX = "Your strong profile suggests you're ready for accelerated, precision-targeted preparation. A micro-batch environment will sharpen existing strengths while providing surgical focus on growth areas.";
          }
          return { strength: sMap[strongest], growth: gMap[weakest], recTitle: rT, recText: rX };
        }

        var pSMap = {
          SL: "You provide a strong, supportive environment. This emotional safety net is the foundation your child needs to take academic risks and grow through setbacks.",
          CM: "Open communication means problems surface early and solutions are collaborative. Your willingness to listen is a genuine advantage most parents struggle with.",
          AW: "Being aware of specific strengths and weaknesses allows targeted support rather than generic encouragement. Informed parents are the best academic partners.",
          BL: "A balanced approach — studies alongside wellbeing — prevents burnout and keeps long-term motivation alive. You understand the long game.",
          ST: "Your strategic approach — setting goals, choosing resources, tracking progress — shows you're thinking about the trajectory, not just the next test."
        };
        var pGMap = {
          SL: "Create more structured support — regular check-ins about what they're learning (not just marks), a dedicated study space, and consistent encouragement during low phases.",
          CM: "Ask open-ended questions about what they're learning rather than what they scored. 'What was the hardest concept this week?' opens more doors than 'How much did you score?'",
          AW: "Ask your child's mentor for a detailed breakdown of weak topics and error patterns. Understanding the gaps allows more productive conversations.",
          BL: "If studies have consumed all activities, reintroduce one hobby or physical activity. Breaks improve memory consolidation and reduce exam anxiety.",
          ST: "Consider a professional mentor who can map your child's current level to their target exam and create a realistic, phased roadmap."
        };
        var rt, rx;
        if (pcts.CM < 40) { rt = "Suggested: Family Strategy Session"; rx = "Our free consultation includes a parent-student alignment conversation. Bridging the communication gap transforms the entire preparation experience."; }
        else if (pcts.SL < 40 || pcts.BL < 40) { rt = "Suggested: Micro-Batch with Psychometric Support"; rx = "Our small-batch environment provides structured support and balanced approach that complements your home environment."; }
        else { rt = "Suggested: Book a Free Family Consultation"; rx = "Your involvement level is strong — a quick consultation with Abhinav sir will align your support strategy with the right academic track."; }
        return { strength: pSMap[strongest], growth: pGMap[weakest], recTitle: rt, recText: rx };
      }

    } // end quiz guard

  } catch (err) { console.error('[Quiz] Error:', err); }

})();

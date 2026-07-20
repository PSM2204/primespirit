/*  ============================================================
    script.js — Prime Spirit Mentors v18.1
    Bulletproof, collision-safe, fully responsive

    v18.1 FIXES:
    — Hamburger .is-open accent glow class toggled
    — Icon fa-bars ↔ fa-times swap with font-size bump
    — iOS-safe scroll lock (position:fixed + save/restore scroll)
    — Tap-outside-to-close mobile nav overlay
    — Focus management: first link focused on open,
      hamburger focused on close
    — Escape key closes nav, search, modal, dropdown
    — Resize handler auto-closes mobile nav on desktop

    v18.0 CHANGES:
    — Removed all injected CSS (moved to style.css)
    — Fixed nav class: .active (matches CSS)
    — Fixed Poonam dropdown: .open (matches CSS)
    — Focus trap for auth modal
    — prefersReducedMotion detection
    — IntersectionObserver for .animate-in
    — GSAP ScrollTrigger conditional integration
    — Enhanced search results markup
=========================================================== */
(function () {
  'use strict';

  // ── Safe helpers ──
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

  // ── Detect motion preference ──
  var prefersReducedMotion = false;
  try {
    prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  } catch (_) {}

  // ── Toast ──
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
  // v18.1: Fixed hamburger visibility, icon swap,
  //        iOS scroll lock, tap-outside, focus management
  // ============================================================
  try {
    var menuToggle = qs('#menuToggle');
    var mainNav    = qs('#mainNav');

    function getScrollY() {
      return window.pageYOffset || document.documentElement.scrollTop || 0;
    }

    function openNav() {
      if (!mainNav || !menuToggle) return;

      // Store scroll position before locking
      var scrollY = getScrollY();

      mainNav.classList.add('active');
      menuToggle.setAttribute('aria-expanded', 'true');
      menuToggle.classList.add('is-open');

      // Swap icon — X is larger for visibility
      var icon = menuToggle.querySelector('i');
      if (icon) {
        icon.className = 'fas fa-times';
        icon.style.fontSize = '1.3rem';
      }
      menuToggle.setAttribute('aria-label', 'Close navigation menu');

      // Body scroll lock — iOS-safe
      document.body.classList.add('nav-locked');
      document.body.style.top = '-' + scrollY + 'px';
      document.body._psScrollY = scrollY;

      // Focus first nav link for accessibility
      setTimeout(function () {
        var firstLink = mainNav.querySelector('a, button');
        if (firstLink) firstLink.focus();
      }, 120);
    }

    function closeNav() {
      if (!mainNav || !menuToggle) return;

      mainNav.classList.remove('active');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.classList.remove('is-open');

      // Restore hamburger icon
      var icon = menuToggle.querySelector('i');
      if (icon) {
        icon.className = 'fas fa-bars';
        icon.style.fontSize = '';
      }
      menuToggle.setAttribute('aria-label', 'Open navigation menu');

      // Body scroll unlock — iOS-safe
      document.body.classList.remove('nav-locked');
      document.body.style.top = '';

      // Restore scroll position
      var scrollY = document.body._psScrollY || 0;
      if (scrollY) {
        window.scrollTo(0, scrollY);
        document.body._psScrollY = 0;
      }

      // Return focus to hamburger for keyboard users
      menuToggle.focus();
    }

    function isNavOpen() {
      return mainNav && mainNav.classList.contains('active');
    }

    if (menuToggle && mainNav) {
      // Toggle on hamburger click
      on(menuToggle, 'click', function (e) {
        e.stopPropagation();
        if (isNavOpen()) { closeNav(); } else { openNav(); }
      });

      // Close on nav link/button click inside nav
      on(mainNav, 'click', function (e) {
        var clickedLink = e.target.closest('a');
        var clickedBtn  = e.target.closest('button');

        if (clickedLink) {
          if (isNavOpen()) closeNav();
          return;
        }
        // Close for buttons except poonam trigger
        if (clickedBtn && !clickedBtn.classList.contains('poonam-nav-trigger')) {
          if (isNavOpen()) closeNav();
        }
      });

      // Tap on dark overlay outside nav content closes it
      on(mainNav, 'click', function (e) {
        if (e.target === mainNav && isNavOpen()) {
          closeNav();
        }
      });

      // Escape key closes
      on(document, 'keydown', function (e) {
        if (e.key === 'Escape' && isNavOpen()) {
          closeNav();
        }
      });

      // Auto-close on resize to desktop
      try {
        var desktopMQ = window.matchMedia('(min-width: 1025px)');
        function handleResize(mq) {
          if (mq.matches && isNavOpen()) closeNav();
        }
        if (desktopMQ.addEventListener) {
          desktopMQ.addEventListener('change', handleResize);
        } else if (desktopMQ.addListener) {
          desktopMQ.addListener(handleResize);
        }
      } catch (_) {}
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
            var section = el.closest('section');
            return {
              text: el.textContent.trim(),
              sectionId: section ? section.id : '',
              sectionLabel: section ? (section.getAttribute('aria-label') || section.id) : ''
            };
          }).filter(function (s) {
            return s.text.toLowerCase().indexOf(q) !== -1;
          }).slice(0, 8);

          if (matches.length) {
            searchResults.innerHTML = matches.map(function (m) {
              return '<a href="#' + m.sectionId + '" class="search-result-item">' +
                     '<strong>' + m.text + '</strong>' +
                     '<span class="search-result-section">' + m.sectionLabel + '</span>' +
                     '</a>';
            }).join('');
          } else {
            searchResults.innerHTML = '<p class="search-no-results">No results found for "' + q.replace(/</g, '&lt;') + '"</p>';
          }
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
        var isOpen = poonamDropdown.classList.contains('open');
        this.setAttribute('aria-expanded', String(!isOpen));
        poonamDropdown.classList.toggle('open', !isOpen);
      });
      on(document, 'click', function (e) {
        if (poonamDropdown.classList.contains('open') &&
            !poonamDropdown.contains(e.target) && e.target !== poonamTrigger) {
          poonamTrigger.setAttribute('aria-expanded', 'false');
          poonamDropdown.classList.remove('open');
        }
      });
      on(document, 'keydown', function (e) {
        if (e.key === 'Escape' && poonamDropdown.classList.contains('open')) {
          poonamTrigger.setAttribute('aria-expanded', 'false');
          poonamDropdown.classList.remove('open');
          poonamTrigger.focus();
        }
      });
    }
  } catch (_) {}

  // ============================================================
  // SECTION 6: FAQ ACCORDION
  // ============================================================
  try {
    on(document, 'click', function (e) {
      var btn = e.target.closest('.faq-question');
      if (!btn) return;

      var expanded = btn.getAttribute('aria-expanded') === 'true';
      var answer   = btn.nextElementSibling;

      qsa('.faq-question').forEach(function (other) {
        if (other !== btn) {
          other.setAttribute('aria-expanded', 'false');
          var a = other.nextElementSibling;
          if (a) a.classList.remove('faq-answer-open');
        }
      });

      btn.setAttribute('aria-expanded', String(!expanded));
      if (answer) answer.classList.toggle('faq-answer-open', !expanded);
    });
  } catch (_) {}

  // ============================================================
  // SECTION 7: AUTH MODAL
  // ============================================================
  try {
    var authModal = qs('#authModal');

    function getModalScrollY() {
      return window.pageYOffset || document.documentElement.scrollTop || 0;
    }

    function openAuth(view) {
      if (!authModal) return;
      var scrollY = getModalScrollY();
      authModal.hidden = false;
      showAuthView(view || 'login');
      document.body.classList.add('modal-locked');
      document.body.style.top = '-' + scrollY + 'px';
      document.body._psModalScrollY = scrollY;
      setTimeout(function () { trapFocus(authModal); }, 60);
    }

    function closeAuth() {
      if (!authModal) return;
      authModal.hidden = true;
      document.body.classList.remove('modal-locked');
      document.body.style.top = '';
      var scrollY = document.body._psModalScrollY || 0;
      if (scrollY) {
        window.scrollTo(0, scrollY);
        document.body._psModalScrollY = 0;
      }
      releaseFocusTrap(authModal);
    }

    function showAuthView(view) {
      var login  = qs('#authViewLogin');
      var signup = qs('#authViewSignup');
      var forgot = qs('#authViewForgot');
      if (login)  login.hidden  = (view !== 'login');
      if (signup) signup.hidden = (view !== 'signup');
      if (forgot) forgot.hidden = (view !== 'forgot');
    }

    function trapFocus(container) {
      var focusable = qsa(
        'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        container
      );
      if (!focusable.length) return;
      var first = focusable[0];
      var last  = focusable[focusable.length - 1];

      function handleTab(e) {
        if (e.key !== 'Tab') return;
        if (e.shiftKey) {
          if (document.activeElement === first) { e.preventDefault(); last.focus(); }
        } else {
          if (document.activeElement === last) { e.preventDefault(); first.focus(); }
        }
      }

      container._trapHandler = handleTab;
      on(container, 'keydown', handleTab);
      first.focus();
    }

    function releaseFocusTrap(container) {
      if (container._trapHandler) {
        container.removeEventListener('keydown', container._trapHandler);
        container._trapHandler = null;
      }
    }

    on(document, 'click', function (e) {
      var target = e.target;
      if (target.closest('#btnStudentLogin') || target.closest('#btnParentLogin')) {
        e.preventDefault();
        openAuth('login');
        return;
      }
      if (target.closest('#btnCloseModal')) { closeAuth(); return; }
      if (target === authModal) { closeAuth(); return; }
      if (target.closest('#btnGotoSignup')) { showAuthView('signup'); return; }
      if (target.closest('#btnGotoLogin') || target.closest('#btnGotoLogin2')) { showAuthView('login'); return; }
      if (target.closest('#btnGotoForgot')) { showAuthView('forgot'); return; }
    });

    on(document, 'keydown', function (e) {
      if (e.key === 'Escape' && authModal && !authModal.hidden) closeAuth();
    });

    on(document, 'submit', function (e) {
      var form = e.target;
      if (form.id === 'formLogin' || form.id === 'formSignup' || form.id === 'formForgot') {
        e.preventDefault();
        showToast('Backend integration required. This is a frontend demo.');
      }
    });

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
          { text: "Fixed schedule \u2014 same hours every day", scores: { CD: 3, ER: 4, SD: 5, SA: 3, FC: 5 } },
          { text: "Flexible but mostly consistent", scores: { CD: 3, ER: 3, SD: 4, SA: 3, FC: 4 } },
          { text: "Intense bursts right before exams", scores: { CD: 2, ER: 2, SD: 2, SA: 3, FC: 2 } },
          { text: "No fixed routine \u2014 study when motivated", scores: { CD: 2, ER: 2, SD: 1, SA: 2, FC: 1 } }
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
          { text: "Read carefully \u2192 identify given/required \u2192 solve systematically", scores: { CD: 4, ER: 4, SD: 4, SA: 4, FC: 4 } },
          { text: "Start solving and figure it out as I go", scores: { CD: 2, ER: 3, SD: 2, SA: 2, FC: 2 } },
          { text: "Check if it matches a known pattern or template", scores: { CD: 3, ER: 3, SD: 3, SA: 4, FC: 3 } },
          { text: "I often get stuck midway and lose confidence", scores: { CD: 2, ER: 1, SD: 2, SA: 2, FC: 2 } }
        ]},
      { q: "On exam day, you typically feel:",
        options: [
          { text: "Calm and well-prepared", scores: { CD: 3, ER: 5, SD: 4, SA: 3, FC: 4 } },
          { text: "Nervous, but the pressure helps me focus", scores: { CD: 3, ER: 4, SD: 3, SA: 3, FC: 3 } },
          { text: "Very anxious \u2014 I second-guess my answers", scores: { CD: 2, ER: 1, SD: 2, SA: 2, FC: 2 } },
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

    var parentQuestions = [
      { q: "How would you describe your child's study routine at home?",
        options: [
          { text: "Very disciplined \u2014 fixed schedule, rarely deviates", scores: { SL: 5, CM: 3, AW: 4, BL: 4, ST: 4 } },
          { text: "Reasonably consistent with occasional gaps", scores: { SL: 4, CM: 3, AW: 3, BL: 4, ST: 3 } },
          { text: "Needs constant reminders to sit and study", scores: { SL: 2, CM: 2, AW: 3, BL: 2, ST: 2 } },
          { text: "Varies a lot \u2014 intense some weeks, absent others", scores: { SL: 2, CM: 2, AW: 2, BL: 2, ST: 2 } }
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
          { text: "Very open \u2014 they share difficulties and ask for help", scores: { SL: 4, CM: 5, AW: 5, BL: 4, ST: 4 } },
          { text: "They mention challenges sometimes", scores: { SL: 3, CM: 3, AW: 3, BL: 3, ST: 3 } },
          { text: "Rarely talks about struggles unless asked directly", scores: { SL: 2, CM: 2, AW: 2, BL: 3, ST: 2 } },
          { text: "Gets defensive when asked about studies", scores: { SL: 1, CM: 1, AW: 2, BL: 1, ST: 1 } }
        ]},
      { q: "Do you know your child's specific weak topics or subjects?",
        options: [
          { text: "Yes \u2014 I track their performance regularly", scores: { SL: 4, CM: 4, AW: 5, BL: 3, ST: 5 } },
          { text: "I have a general idea", scores: { SL: 3, CM: 3, AW: 3, BL: 3, ST: 3 } },
          { text: "Not really \u2014 I rely on the coaching institute", scores: { SL: 2, CM: 2, AW: 2, BL: 3, ST: 2 } },
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
          { text: "Very involved \u2014 I help choose resources and track progress", scores: { SL: 4, CM: 4, AW: 4, BL: 3, ST: 5 } },
          { text: "Involved at a high level \u2014 goals, coaching choices", scores: { SL: 3, CM: 3, AW: 3, BL: 4, ST: 4 } },
          { text: "Mostly leave it to the child and teachers", scores: { SL: 3, CM: 3, AW: 2, BL: 4, ST: 2 } },
          { text: "I want to help more but don't know how", scores: { SL: 3, CM: 2, AW: 3, BL: 2, ST: 2 } }
        ]},
      { q: "Does your child maintain hobbies or activities alongside studies?",
        options: [
          { text: "Yes \u2014 we ensure a balanced routine", scores: { SL: 3, CM: 4, AW: 4, BL: 5, ST: 4 } },
          { text: "They used to but stopped for exam prep", scores: { SL: 3, CM: 3, AW: 3, BL: 2, ST: 3 } },
          { text: "Not really \u2014 mostly studying all the time", scores: { SL: 3, CM: 2, AW: 3, BL: 1, ST: 2 } },
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

    var studentArchetypes = {
      CD: { badge: '\uD83D\uDD0D', name: 'The Deep Diver',      tagline: "You seek true understanding \u2014 not just memorization. This depth is your greatest weapon." },
      ER: { badge: '\uD83D\uDEE1\uFE0F', name: 'The Unshakeable',    tagline: "Pressure doesn't break you \u2014 it sharpens you. Your composure is rare." },
      SD: { badge: '\uD83C\uDFD7\uFE0F', name: 'The Architect',      tagline: "Your structure and consistency are superpowers. Results are a matter of time." },
      SA: { badge: '\u265F\uFE0F', name: 'The Chess Player',   tagline: "You think several moves ahead. Strategy is your natural language." },
      FC: { badge: '\uD83C\uDFC3', name: 'The Marathoner',      tagline: "Your sustained focus and quiet consistency outperform short bursts every time." }
    };
    var parentArchetypes = {
      SL: { badge: '\u2693',  name: 'The Anchor',          tagline: "Your supportive presence is your child's strongest academic asset." },
      CM: { badge: '\uD83D\uDCAC', name: 'The Bridge Builder',   tagline: "Open communication is the foundation of everything you do together." },
      AW: { badge: '\uD83D\uDD0E', name: 'The Investigator',     tagline: "You dig deep to understand what's really happening behind the marks." },
      BL: { badge: '\u2696\uFE0F', name: 'The Guardian',        tagline: "You protect your child's wellbeing \u2014 and that keeps them going long-term." },
      ST: { badge: '\uD83E\uDDED', name: 'The Navigator',        tagline: "You see the big picture and chart the course before problems arise." }
    };

    var studentDimLabels = { CD: 'Conceptual Depth', ER: 'Exam Resilience', SD: 'Study Discipline', SA: 'Strategic Aptitude', FC: 'Focus & Consistency' };
    var parentDimLabels  = { SL: 'Support Level',    CM: 'Communication',   AW: 'Awareness',        BL: 'Balance',              ST: 'Strategic Support' };
    var barColors = { CD: '#00C6FF', ER: '#00df89', SD: '#FFB800', SA: '#A855F7', FC: '#FF6B6B', SL: '#00C6FF', CM: '#00df89', AW: '#FFB800', BL: '#A855F7', ST: '#FF6B6B' };

    var quizState = { role: null, questions: [], answers: [], currentQ: 0, totalQ: 10 };

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
      console.warn('[Quiz] Missing DOM \u2014 quiz section disabled.');
    } else {

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
        if (quizTrackIdentity) {
          quizTrackIdentity.textContent = (role === 'student')
            ? '\uD83C\uDF93 Student Track'
            : '\uD83D\uDC68\u200D\uD83D\uDC69\u200D\uD83D\uDC67 Parent Track';
        }
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
        html +=   '<div class="quiz-insight-title">' + dimLabels[dominantKey] + ' \u2014 ' + pct[dominantKey] + '%</div>';
        html +=   '<p class="quiz-insight-text">' + insights.strength + '</p>';
        html += '</div>';
        html += '<div class="quiz-insight-box" id="insightGrowth">';
        html +=   '<div class="quiz-insight-label">Primary Growth Area</div>';
        html +=   '<div class="quiz-insight-title">' + dimLabels[weakestKey] + ' \u2014 ' + pct[weakestKey] + '%</div>';
        html +=   '<p class="quiz-insight-text">' + insights.growth + '</p>';
        html += '</div>';
        html += '<div class="quiz-track-rec" id="insightRec">';
        html +=   '<h4>' + insights.recTitle + '</h4>';
        html +=   '<p>' + insights.recText + '</p>';
        html += '</div>';

        if (psychMetricsOutput) psychMetricsOutput.innerHTML = html;

        setTimeout(function () {
          qsa('.quiz-metric-fill', psychMetricsOutput).forEach(function (bar, i) {
            setTimeout(function () { bar.style.width = bar.getAttribute('data-w'); }, i * 80);
          });
        }, 100);

        if (prefersReducedMotion) {
          ['insightStrength', 'insightGrowth', 'insightRec'].forEach(function (id) {
            var el = qs('#' + id); if (el) el.classList.add('visible');
          });
        } else {
          setTimeout(function () { var el = qs('#insightStrength'); if (el) el.classList.add('visible'); }, 600);
          setTimeout(function () { var el = qs('#insightGrowth');   if (el) el.classList.add('visible'); }, 900);
          setTimeout(function () { var el = qs('#insightRec');      if (el) el.classList.add('visible'); }, 1200);
        }

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
            ER: "You handle exam pressure remarkably well. This composure under fire means your test scores consistently reflect your true preparation level \u2014 a rare advantage.",
            SD: "Your study routine is structured and consistent. This discipline compounds over time and is one of the strongest predictors of success in competitive exams.",
            SA: "You think strategically about your preparation \u2014 analyzing patterns, managing priorities, and focusing on what moves the needle. This separates top performers.",
            FC: "Your ability to maintain sustained focus is a significant advantage. In an era of constant distraction, this quiet consistency outperforms flashy short bursts."
          };
          var gMap = {
            CD: "Invest more time in understanding the 'why' behind formulas and derivations rather than jumping straight to problem-solving. Concept-first learning multiplies accuracy.",
            ER: "Exam anxiety may be silently capping your performance. Try timed mock sessions, box-breathing before tests, and structured error analysis after every practice paper.",
            SD: "Building a consistent daily routine \u2014 even starting with 2 focused hours at the same time each day \u2014 will compound dramatically. Use a tracker to build momentum.",
            SA: "Develop post-test analysis habits. After every mock, identify which question types consumed the most time and which concepts caused hesitation.",
            FC: "Try the Pomodoro technique (25 min focused + 5 min break). Remove phone notifications during study windows \u2014 even one interruption resets your flow state."
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
          BL: "A balanced approach \u2014 studies alongside wellbeing \u2014 prevents burnout and keeps long-term motivation alive. You understand the long game.",
          ST: "Your strategic approach \u2014 setting goals, choosing resources, tracking progress \u2014 shows you're thinking about the trajectory, not just the next test."
        };
        var pGMap = {
          SL: "Create more structured support \u2014 regular check-ins about what they're learning (not just marks), a dedicated study space, and consistent encouragement during low phases.",
          CM: "Ask open-ended questions about what they're learning rather than what they scored. 'What was the hardest concept this week?' opens more doors than 'How much did you score?'",
          AW: "Ask your child's mentor for a detailed breakdown of weak topics and error patterns. Understanding the gaps allows more productive conversations.",
          BL: "If studies have consumed all activities, reintroduce one hobby or physical activity. Breaks improve memory consolidation and reduce exam anxiety.",
          ST: "Consider a professional mentor who can map your child's current level to their target exam and create a realistic, phased roadmap."
        };
        var rt, rx;
        if (pcts.CM < 40) {
          rt = "Suggested: Family Strategy Session";
          rx = "Our free consultation includes a parent-student alignment conversation. Bridging the communication gap transforms the entire preparation experience.";
        } else if (pcts.SL < 40 || pcts.BL < 40) {
          rt = "Suggested: Micro-Batch with Psychometric Support";
          rx = "Our small-batch environment provides structured support and balanced approach that complements your home environment.";
        } else {
          rt = "Suggested: Book a Free Family Consultation";
          rx = "Your involvement level is strong \u2014 a quick consultation with Abhinav sir will align your support strategy with the right academic track.";
        }
        return { strength: pSMap[strongest], growth: pGMap[weakest], recTitle: rt, recText: rx };
      }

    }

  } catch (err) { console.error('[Quiz] Error:', err); }

  // ============================================================
  // SECTION 14: SCROLL REVEAL
  // ============================================================
  try {
    if (!prefersReducedMotion) {
      var revealObserver = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
              revealObserver.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
      );

      function observeAnimations() {
        qsa('.animate-in').forEach(function (el) { revealObserver.observe(el); });
      }

      if (document.readyState === 'complete' || document.readyState === 'interactive') {
        observeAnimations();
      } else {
        document.addEventListener('DOMContentLoaded', observeAnimations);
      }
    } else {
      function showAllImmediate() {
        qsa('.animate-in').forEach(function (el) { el.classList.add('visible'); });
      }
      if (document.readyState === 'complete' || document.readyState === 'interactive') {
        showAllImmediate();
      } else {
        document.addEventListener('DOMContentLoaded', showAllImmediate);
      }
    }
  } catch (_) {}

  // ============================================================
  // SECTION 15: GSAP SCROLLTRIGGER (CONDITIONAL)
  // Only runs if GSAP CDN is loaded. Safe to omit.
  // ============================================================
  try {
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined' && !prefersReducedMotion) {
      gsap.registerPlugin(ScrollTrigger);

      gsap.utils.toArray('.course-card').forEach(function (card, i) {
        gsap.from(card, { scrollTrigger: { trigger: card, start: 'top 88%', toggleActions: 'play none none none' }, y: 30, opacity: 0, duration: 0.6, delay: i * 0.06, ease: 'power2.out' });
      });
      gsap.utils.toArray('.testimonial-card').forEach(function (card, i) {
        gsap.from(card, { scrollTrigger: { trigger: card, start: 'top 88%', toggleActions: 'play none none none' }, y: 30, opacity: 0, duration: 0.6, delay: i * 0.06, ease: 'power2.out' });
      });
      gsap.utils.toArray('.section-block h2').forEach(function (heading) {
        gsap.from(heading, { scrollTrigger: { trigger: heading, start: 'top 85%', toggleActions: 'play none none none' }, y: 20, opacity: 0, duration: 0.6, ease: 'power2.out' });
      });
      gsap.utils.toArray('.faq-item').forEach(function (item, i) {
        gsap.from(item, { scrollTrigger: { trigger: item, start: 'top 90%', toggleActions: 'play none none none' }, y: 15, opacity: 0, duration: 0.4, delay: i * 0.04, ease: 'power2.out' });
      });
      gsap.utils.toArray('.poonam-card').forEach(function (card, i) {
        gsap.from(card, { scrollTrigger: { trigger: card, start: 'top 85%', toggleActions: 'play none none none' }, y: 30, opacity: 0, duration: 0.6, delay: i * 0.12, ease: 'power2.out' });
      });
      gsap.utils.toArray('.trust-item').forEach(function (item, i) {
        gsap.from(item, { scrollTrigger: { trigger: item, start: 'top 92%', toggleActions: 'play none none none' }, y: 15, opacity: 0, duration: 0.5, delay: i * 0.06, ease: 'power2.out' });
      });

      on(window, 'beforeunload', function () {
        ScrollTrigger.getAll().forEach(function (t) { t.kill(); });
      });
    }
  } catch (_) {}

})();

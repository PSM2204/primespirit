/*  ============================================================
    script.js — Prime Spirit Mentors (collision-safe)
    ============================================================ */
(function () {
  'use strict';

  // ----------------------------------------------------------
  // Safe DOM helpers — NEVER use $ or $$ (collides with jQuery)
  // ----------------------------------------------------------
  function qs(sel, ctx) {
    return (ctx || document).querySelector(sel);
  }
  function qsa(sel, ctx) {
    return Array.prototype.slice.call(
      (ctx || document).querySelectorAll(sel)
    );
  }
  function on(el, evt, fn, opts) {
    if (el && typeof el.addEventListener === 'function') {
      el.addEventListener(evt, fn, opts || false);
    }
  }
  function trackEvent(label) {
    try {
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'click', { event_label: label });
      }
    } catch (_) { /* silent */ }
  }

  // ----------------------------------------------------------
  // Inject quiz-specific CSS
  // ----------------------------------------------------------
  var quizCSS = document.createElement('style');
  quizCSS.textContent = [
    '.quiz-btn-selected{border-color:var(--accent)!important;background:rgba(0,198,255,.12)!important;box-shadow:0 0 24px rgba(0,198,255,.18);transform:scale(1.02)}',
    '.quiz-profile-header{text-align:center;margin-bottom:28px}',
    '.quiz-profile-badge{font-size:3.5rem;display:block;margin-bottom:8px;line-height:1.2}',
    '.quiz-profile-name{font-family:var(--font-head);font-size:1.6rem;font-weight:800;color:var(--accent);display:block}',
    '.quiz-profile-tagline{color:var(--text-sec);font-size:.95rem;margin-top:6px;font-style:italic}',
    '.quiz-metrics-grid{display:flex;flex-direction:column;gap:16px;margin-bottom:28px}',
    '.quiz-metric-row{display:flex;align-items:center;gap:12px}',
    '.quiz-metric-label{flex:0 0 140px;font-family:var(--font-mono);font-size:.75rem;color:var(--text-sec);text-transform:uppercase;letter-spacing:.06em}',
    '.quiz-metric-bar{flex:1;height:10px;background:rgba(255,255,255,.06);border-radius:6px;overflow:hidden}',
    '.quiz-metric-fill{height:100%;border-radius:6px;transition:width 1.2s cubic-bezier(.22,1,.36,1);width:0}',
    '.quiz-metric-value{flex:0 0 42px;text-align:right;font-family:var(--font-mono);font-size:.85rem;font-weight:600;color:var(--text)}',
    '.quiz-insight-box{background:var(--surface);border:1px solid var(--border-mid);border-radius:14px;padding:22px;margin-bottom:18px;opacity:0;transform:translateY(16px);transition:opacity .5s ease,transform .5s ease}',
    '.quiz-insight-box.visible{opacity:1;transform:translateY(0)}',
    '.quiz-insight-label{font-family:var(--font-mono);font-size:.68rem;text-transform:uppercase;letter-spacing:.12em;color:var(--accent);margin-bottom:6px}',
    '.quiz-insight-title{font-family:var(--font-head);font-size:1.1rem;font-weight:700;margin-bottom:8px;color:var(--text)}',
    '.quiz-insight-text{color:var(--text-sec);font-size:.9rem;line-height:1.7}',
    '.quiz-track-rec{background:linear-gradient(135deg,rgba(0,198,255,.08),rgba(0,112,243,.08));border:1px solid rgba(0,198,255,.18);border-radius:14px;padding:24px;margin-top:22px;text-align:center;opacity:0;transform:translateY(16px);transition:opacity .5s ease,transform .5s ease}',
    '.quiz-track-rec.visible{opacity:1;transform:translateY(0)}',
    '.quiz-track-rec h4{font-family:var(--font-head);color:var(--accent);font-size:1.15rem;margin-bottom:8px}',
    '.quiz-track-rec p{color:var(--text-sec);font-size:.9rem;line-height:1.7}',
    '@media(max-width:600px){.quiz-metric-label{flex:0 0 100px;font-size:.65rem}.quiz-metric-value{font-size:.78rem}}'
  ].join('\n');
  document.head.appendChild(quizCSS);

  // ----------------------------------------------------------
  // SCROLL PROGRESS
  // ----------------------------------------------------------
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

  // ----------------------------------------------------------
  // BACK TO TOP
  // ----------------------------------------------------------
  var backToTop = qs('#backToTop');
  if (backToTop) {
    on(window, 'scroll', function () {
      var st = window.pageYOffset || document.documentElement.scrollTop;
      backToTop.hidden = st < 400;
    }, { passive: true });
    on(backToTop, 'click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ----------------------------------------------------------
  // MOBILE MENU
  // ----------------------------------------------------------
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

  // ----------------------------------------------------------
  // SEARCH OVERLAY
  // ----------------------------------------------------------
  var searchToggle  = qs('#searchToggle');
  var searchOverlay = qs('#searchOverlay');
  var searchClose   = qs('#searchClose');
  var searchInput   = qs('#searchInput');
  var searchResults = qs('#searchResults');

  if (searchToggle && searchOverlay) {
    on(searchToggle, 'click', function () {
      searchOverlay.hidden = false;
      this.setAttribute('aria-expanded', 'true');
      if (searchInput) setTimeout(function () { searchInput.focus(); }, 60);
    });

    function closeSearch() {
      searchOverlay.hidden = true;
      searchToggle.setAttribute('aria-expanded', 'false');
      searchToggle.focus();
    }

    on(searchClose, 'click', closeSearch);
    on(searchOverlay, 'click', function (e) {
      if (e.target === searchOverlay) closeSearch();
    });
    on(document, 'keydown', function (e) {
      if (e.key === 'Escape' && !searchOverlay.hidden) closeSearch();
    });

    if (searchInput && searchResults) {
      on(searchInput, 'input', function () {
        var q = this.value.toLowerCase().trim();
        if (!q) { searchResults.innerHTML = ''; return; }
        var headings = qsa('h2, h3');
        var matches = headings
          .map(function (el) {
            return { el: el, text: el.textContent, section: el.closest('section') };
          })
          .filter(function (s) { return s.text.toLowerCase().indexOf(q) !== -1; })
          .slice(0, 8);
        searchResults.innerHTML = matches.length
          ? matches.map(function (m) {
              var id = m.section ? m.section.id : '';
              return '<a href="#' + id + '" class="search-result-item">' + m.text + '</a>';
            }).join('')
          : '<p style="color:var(--text-muted);padding:12px 0">No results found.</p>';
      });
    }
  }

  // ----------------------------------------------------------
  // POONAM DROPDOWN
  // ----------------------------------------------------------
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
      if (poonamDropdown && poonamTrigger &&
          !poonamDropdown.contains(e.target) && e.target !== poonamTrigger) {
        poonamTrigger.setAttribute('aria-expanded', 'false');
        poonamDropdown.classList.remove('poonam-dd-open');
      }
    });
  }

  // ----------------------------------------------------------
  // FAQ ACCORDION
  // ----------------------------------------------------------
  qsa('.faq-question').forEach(function (btn) {
    on(btn, 'click', function () {
      var expanded = this.getAttribute('aria-expanded') === 'true';
      var answer   = this.nextElementSibling;
      // Close others
      qsa('.faq-question').forEach(function (other) {
        if (other !== btn) {
          other.setAttribute('aria-expanded', 'false');
          var a = other.nextElementSibling;
          if (a) a.classList.remove('faq-answer-open');
        }
      });
      this.setAttribute('aria-expanded', String(!expanded));
      if (answer) answer.classList.toggle('faq-answer-open', !expanded);
    });
  });

  // ----------------------------------------------------------
  // AUTH MODAL
  // ----------------------------------------------------------
  var authModal      = qs('#authModal');
  var btnCloseModal  = qs('#btnCloseModal');
  var authViewLogin  = qs('#authViewLogin');
  var authViewSignup = qs('#authViewSignup');
  var authViewForgot = qs('#authViewForgot');

  function openAuth(view) {
    if (!authModal) return;
    authModal.hidden = false;
    showAuthView(view || 'login');
  }
  function closeAuth() {
    if (authModal) authModal.hidden = true;
  }
  function showAuthView(view) {
    if (authViewLogin)  authViewLogin.hidden  = (view !== 'login');
    if (authViewSignup) authViewSignup.hidden = (view !== 'signup');
    if (authViewForgot) authViewForgot.hidden = (view !== 'forgot');
  }

  on(qs('#btnStudentLogin'), 'click', function () { openAuth('login'); });
  on(qs('#btnParentLogin'),   'click', function () { openAuth('login'); });
  on(btnCloseModal,           'click', closeAuth);
  on(authModal,               'click', function (e) { if (e.target === authModal) closeAuth(); });
  on(document,                'keydown', function (e) {
    if (e.key === 'Escape' && authModal && !authModal.hidden) closeAuth();
  });

  on(qs('#btnGotoSignup'),  'click', function () { showAuthView('signup'); });
  on(qs('#btnGotoLogin'),   'click', function () { showAuthView('login'); });
  on(qs('#btnGotoForgot'),  'click', function () { showAuthView('forgot'); });
  on(qs('#btnGotoLogin2'),  'click', function () { showAuthView('login'); });

  ['formLogin', 'formSignup', 'formForgot'].forEach(function (id) {
    var form = qs('#' + id);
    if (form) {
      on(form, 'submit', function (e) {
        e.preventDefault();
        alert('Backend integration required. This is a frontend demo.');
      });
    }
  });

  // Password strength
  var signupPass       = qs('#signupPass');
  var strengthBar      = qs('#strengthBar');
  var strengthFeedback = qs('#strengthFeedback');

  if (signupPass && strengthBar) {
    on(signupPass, 'input', function () {
      var v = this.value;
      var s = 0;
      if (v.length >= 8) s++;
      if (/[A-Z]/.test(v)) s++;
      if (/[0-9]/.test(v)) s++;
      if (/[^A-Za-z0-9]/.test(v)) s++;
      var pct    = (s / 4) * 100;
      var colors = ['#ff4444', '#ffaa00', '#aadd00', '#00df89'];
      var labels = ['Weak', 'Fair', 'Good', 'Strong'];
      strengthBar.style.width    = pct + '%';
      strengthBar.style.background = colors[s] || colors[0];
      if (strengthFeedback) {
        strengthFeedback.textContent = v.length === 0
          ? 'Min 8 chars, uppercase, number, special char'
          : (labels[s] || labels[0]);
      }
    });
  }

  // ----------------------------------------------------------
  // NOTES DOWNLOAD — requires auth
  // ----------------------------------------------------------
  qsa('.download-btn-style').forEach(function (btn) {
    on(btn, 'click', function () {
      var notesType = this.getAttribute('data-notes') || 'unknown';
      trackEvent('cta-notes-' + notesType);
      openAuth('login');
    });
  });

  // ----------------------------------------------------------
  // CONTACT FORM
  // ----------------------------------------------------------
  var contactForm = qs('#contactForm');
  if (contactForm) {
    on(contactForm, 'submit', function (e) {
      e.preventDefault();
      var nameEl  = qs('#studentName');
      var emailEl = qs('#studentEmail');
      var phoneEl = qs('#studentPhone');
      var name  = nameEl  ? nameEl.value.trim()  : '';
      var email = emailEl ? emailEl.value.trim()  : '';
      var phone = phoneEl ? phoneEl.value.trim()  : '';

      if (!name || !email || !phone) {
        alert('Please fill in all required fields.');
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+/.test(email)) {
        alert('Please enter a valid email address.');
        return;
      }
      if (!/^[0-9]{10}$/.test(phone)) {
        alert('Please enter a valid 10-digit phone number.');
        return;
      }
      trackEvent('contact-form-submit');
      alert('Thank you! Abhinav sir will review your profile and reach out within 24 hours.');
      contactForm.reset();
    });
  }

  // ----------------------------------------------------------
  // DATA-TRACK ANALYTICS
  // ----------------------------------------------------------
  qsa('[data-track]').forEach(function (el) {
    on(el, 'click', function () {
      trackEvent(this.getAttribute('data-track'));
    });
  });

  // ----------------------------------------------------------
  // SMOOTH SCROLL (anchor links)
  // ----------------------------------------------------------
  qsa('a[href^="#"]').forEach(function (link) {
    on(link, 'click', function (e) {
      var href = this.getAttribute('href');
      if (href && href.length > 1) {
        var target = qs(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  // ----------------------------------------------------------
  // BLOG FILTER BUTTONS
  // ----------------------------------------------------------
  qsa('.filter-btn').forEach(function (btn) {
    on(btn, 'click', function () {
      qsa('.filter-btn').forEach(function (b) { b.classList.remove('active'); });
      this.classList.add('active');
      var filter = this.getAttribute('data-filter');
      qsa('.blog-card, .blog-post-card').forEach(function (card) {
        if (filter === 'all') {
          card.style.display = '';
        } else {
          var tags = (card.getAttribute('data-category') || card.getAttribute('data-tags') || '').toLowerCase();
          card.style.display = tags.indexOf(filter) !== -1 ? '' : 'none';
        }
      });
    });
  });

  // ==========================================================
  // ==========================================================
  //           MINDSET AUDIT QUIZ
  // ==========================================================
  // ==========================================================

  // ---------- STUDENT QUESTIONS ----------
  var studentQuestions = [
    {
      q: "When you sit down to study a completely new chapter, what's your first instinct?",
      options: [
        { text: "Read the textbook line by line carefully", scores: { CD: 4, ER: 3, SD: 5, SA: 3, FC: 4 } },
        { text: "Watch a video lecture or explanation first", scores: { CD: 3, ER: 3, SD: 3, SA: 3, FC: 3 } },
        { text: "Jump straight into solved examples", scores: { CD: 2, ER: 3, SD: 2, SA: 4, FC: 2 } },
        { text: "Skim headings and key formulas first", scores: { CD: 2, ER: 2, SD: 2, SA: 3, FC: 2 } }
      ]
    },
    {
      q: "During a mock test, you encounter a problem you've never seen before. You:",
      options: [
        { text: "Break it into smaller parts and attempt logically", scores: { CD: 4, ER: 4, SD: 3, SA: 5, FC: 3 } },
        { text: "Skip it and come back after finishing others", scores: { CD: 3, ER: 4, SD: 3, SA: 4, FC: 3 } },
        { text: "Feel a wave of panic and lose your train of thought", scores: { CD: 2, ER: 1, SD: 2, SA: 1, FC: 2 } },
        { text: "Use elimination to make an educated guess", scores: { CD: 2, ER: 3, SD: 2, SA: 4, FC: 3 } }
      ]
    },
    {
      q: "How would you describe your daily study routine?",
      options: [
        { text: "Fixed schedule — same hours every day", scores: { CD: 3, ER: 4, SD: 5, SA: 3, FC: 5 } },
        { text: "Flexible but mostly consistent", scores: { CD: 3, ER: 3, SD: 4, SA: 3, FC: 4 } },
        { text: "Intense bursts right before exams", scores: { CD: 2, ER: 2, SD: 2, SA: 3, FC: 2 } },
        { text: "No fixed routine — study when motivated", scores: { CD: 2, ER: 2, SD: 1, SA: 2, FC: 1 } }
      ]
    },
    {
      q: "A formula or derivation refuses to stick in your memory. You:",
      options: [
        { text: "Write it out repeatedly until it sticks", scores: { CD: 2, ER: 3, SD: 4, SA: 2, FC: 4 } },
        { text: "Try to understand the logic behind it first", scores: { CD: 5, ER: 3, SD: 3, SA: 4, FC: 3 } },
        { text: "Create mnemonics, diagrams, or visual tricks", scores: { CD: 3, ER: 3, SD: 3, SA: 4, FC: 3 } },
        { text: "Move on and hope I remember during the exam", scores: { CD: 1, ER: 2, SD: 1, SA: 1, FC: 2 } }
      ]
    },
    {
      q: "After a mock test, your first instinct is to:",
      options: [
        { text: "Analyze every wrong answer in detail", scores: { CD: 4, ER: 4, SD: 4, SA: 5, FC: 4 } },
        { text: "Check your score and percentile ranking", scores: { CD: 2, ER: 3, SD: 3, SA: 2, FC: 3 } },
        { text: "Feel disappointed if the score is low", scores: { CD: 2, ER: 2, SD: 2, SA: 2, FC: 2 } },
        { text: "Move on to the next topic quickly", scores: { CD: 3, ER: 3, SD: 3, SA: 3, FC: 3 } }
      ]
    },
    {
      q: "What's the biggest barrier to your preparation right now?",
      options: [
        { text: "I can't maintain focus for long stretches", scores: { CD: 3, ER: 3, SD: 2, SA: 2, FC: 2 } },
        { text: "Concepts feel unclear despite studying", scores: { CD: 2, ER: 3, SD: 3, SA: 2, FC: 3 } },
        { text: "I don't have enough time for revision", scores: { CD: 3, ER: 3, SD: 2, SA: 3, FC: 3 } },
        { text: "Exam pressure ruins my performance", scores: { CD: 3, ER: 1, SD: 3, SA: 2, FC: 3 } }
      ]
    },
    {
      q: "When you make the same mistake repeatedly:",
      options: [
        { text: "I maintain an error log and review it regularly", scores: { CD: 4, ER: 4, SD: 5, SA: 4, FC: 4 } },
        { text: "I get frustrated but keep pushing through", scores: { CD: 3, ER: 4, SD: 3, SA: 3, FC: 3 } },
        { text: "I solve extra problems on that specific topic", scores: { CD: 3, ER: 3, SD: 3, SA: 3, FC: 4 } },
        { text: "I ask my teacher to re-explain the concept", scores: { CD: 4, ER: 3, SD: 3, SA: 3, FC: 3 } }
      ]
    },
    {
      q: "How do you typically approach a complex numerical problem?",
      options: [
        { text: "Read carefully → identify given/required → solve systematically", scores: { CD: 4, ER: 4, SD: 4, SA: 4, FC: 4 } },
        { text: "Start solving and figure it out as I go", scores: { CD: 2, ER: 3, SD: 2, SA: 2, FC: 2 } },
        { text: "Check if it matches a known pattern or template", scores: { CD: 3, ER: 3, SD: 3, SA: 4, FC: 3 } },
        { text: "I often get stuck midway and lose confidence", scores: { CD: 2, ER: 1, SD: 2, SA: 2, FC: 2 } }
      ]
    },
    {
      q: "On exam day, you typically feel:",
      options: [
        { text: "Calm and well-prepared", scores: { CD: 3, ER: 5, SD: 4, SA: 3, FC: 4 } },
        { text: "Nervous, but the pressure helps me focus", scores: { CD: 3, ER: 4, SD: 3, SA: 3, FC: 3 } },
        { text: "Very anxious — I second-guess my answers", scores: { CD: 2, ER: 1, SD: 2, SA: 2, FC: 2 } },
        { text: "Fine initially, but panic if I get stuck on a question", scores: { CD: 3, ER: 2, SD: 3, SA: 2, FC: 3 } }
      ]
    },
    {
      q: "If you could change one thing about your preparation, it would be:",
      options: [
        { text: "Better time management", scores: { CD: 3, ER: 3, SD: 3, SA: 4, FC: 3 } },
        { text: "Deeper understanding of concepts", scores: { CD: 5, ER: 3, SD: 3, SA: 3, FC: 3 } },
        { text: "A more disciplined daily routine", scores: { CD: 3, ER: 3, SD: 5, SA: 3, FC: 4 } },
        { text: "Less anxiety and more confidence", scores: { CD: 3, ER: 5, SD: 3, SA: 3, FC: 3 } }
      ]
    }
  ];

  // ---------- PARENT QUESTIONS ----------
  var parentQuestions = [
    {
      q: "How would you describe your child's study routine at home?",
      options: [
        { text: "Very disciplined — fixed schedule, rarely deviates", scores: { SL: 5, CM: 3, AW: 4, BL: 4, ST: 4 } },
        { text: "Reasonably consistent with occasional gaps", scores: { SL: 4, CM: 3, AW: 3, BL: 4, ST: 3 } },
        { text: "Needs constant reminders to sit and study", scores: { SL: 2, CM: 2, AW: 3, BL: 2, ST: 2 } },
        { text: "Varies a lot — intense some weeks, absent others", scores: { SL: 2, CM: 2, AW: 2, BL: 2, ST: 2 } }
      ]
    },
    {
      q: "When your child gets lower marks than expected, you typically:",
      options: [
        { text: "Sit with them to understand what went wrong", scores: { SL: 5, CM: 5, AW: 4, BL: 4, ST: 4 } },
        { text: "Encourage them to work harder next time", scores: { SL: 4, CM: 3, AW: 3, BL: 3, ST: 3 } },
        { text: "Worry about their future prospects", scores: { SL: 3, CM: 2, AW: 3, BL: 2, ST: 2 } },
        { text: "Compare with peers or toppers in their class", scores: { SL: 2, CM: 1, AW: 2, BL: 1, ST: 1 } }
      ]
    },
    {
      q: "How openly does your child communicate about academic struggles?",
      options: [
        { text: "Very open — they share difficulties and ask for help", scores: { SL: 4, CM: 5, AW: 5, BL: 4, ST: 4 } },
        { text: "They mention challenges sometimes", scores: { SL: 3, CM: 3, AW: 3, BL: 3, ST: 3 } },
        { text: "Rarely talks about struggles unless asked directly", scores: { SL: 2, CM: 2, AW: 2, BL: 3, ST: 2 } },
        { text: "Gets defensive when asked about studies", scores: { SL: 1, CM: 1, AW: 2, BL: 1, ST: 1 } }
      ]
    },
    {
      q: "Do you know your child's specific weak topics or subjects?",
      options: [
        { text: "Yes — I track their performance regularly", scores: { SL: 4, CM: 4, AW: 5, BL: 3, ST: 5 } },
        { text: "I have a general idea", scores: { SL: 3, CM: 3, AW: 3, BL: 3, ST: 3 } },
        { text: "Not really — I rely on the coaching institute", scores: { SL: 2, CM: 2, AW: 2, BL: 3, ST: 2 } },
        { text: "My child doesn't share that information", scores: { SL: 1, CM: 1, AW: 1, BL: 2, ST: 1 } }
      ]
    },
    {
      q: "How do you handle screen time and digital distractions?",
      options: [
        { text: "Clear rules that are consistently enforced", scores: { SL: 5, CM: 3, AW: 3, BL: 4, ST: 4 } },
        { text: "Rules exist but enforcement is inconsistent", scores: { SL: 3, CM: 2, AW: 3, BL: 3, ST: 2 } },
        { text: "We've mostly given up on controlling it", scores: { SL: 1, CM: 2, AW: 2, BL: 1, ST: 1 } },
        { text: "My child self-regulates their screen time", scores: { SL: 4, CM: 4, AW: 4, BL: 5, ST: 4 } }
      ]
    },
    {
      q: "What's your biggest concern about your child's exam preparation?",
      options: [
        { text: "They don't put in enough effort", scores: { SL: 3, CM: 2, AW: 3, BL: 2, ST: 3 } },
        { text: "They study hard but scores don't reflect it", scores: { SL: 3, CM: 3, AW: 4, BL: 3, ST: 4 } },
        { text: "They're too stressed or anxious about exams", scores: { SL: 4, CM: 4, AW: 4, BL: 4, ST: 3 } },
        { text: "They lack clear goals or motivation", scores: { SL: 3, CM: 2, AW: 3, BL: 2, ST: 3 } }
      ]
    },
    {
      q: "How involved are you in planning your child's academic journey?",
      options: [
        { text: "Very involved — I help choose resources and track progress", scores: { SL: 4, CM: 4, AW: 4, BL: 3, ST: 5 } },
        { text: "Involved at a high level — goals, coaching choices", scores: { SL: 3, CM: 3, AW: 3, BL: 4, ST: 4 } },
        { text: "Mostly leave it to the child and teachers", scores: { SL: 3, CM: 3, AW: 2, BL: 4, ST: 2 } },
        { text: "I want to help more but don't know how", scores: { SL: 3, CM: 2, AW: 3, BL: 2, ST: 2 } }
      ]
    },
    {
      q: "Does your child maintain hobbies or activities alongside studies?",
      options: [
        { text: "Yes — we ensure a balanced routine", scores: { SL: 3, CM: 4, AW: 4, BL: 5, ST: 4 } },
        { text: "They used to but stopped for exam prep", scores: { SL: 3, CM: 3, AW: 3, BL: 2, ST: 3 } },
        { text: "Not really — mostly studying all the time", scores: { SL: 3, CM: 2, AW: 3, BL: 1, ST: 2 } },
        { text: "Too many breaks and not enough study", scores: { SL: 2, CM: 2, AW: 3, BL: 2, ST: 2 } }
      ]
    },
    {
      q: "How does your child handle competitive pressure from peers?",
      options: [
        { text: "It motivates them to improve", scores: { SL: 4, CM: 3, AW: 4, BL: 4, ST: 4 } },
        { text: "They get stressed but manage to cope", scores: { SL: 3, CM: 3, AW: 3, BL: 3, ST: 3 } },
        { text: "It significantly affects their confidence", scores: { SL: 2, CM: 2, AW: 4, BL: 2, ST: 2 } },
        { text: "They seem largely unaffected either way", scores: { SL: 3, CM: 3, AW: 3, BL: 3, ST: 2 } }
      ]
    },
    {
      q: "If you could improve one aspect of your child's preparation:",
      options: [
        { text: "Better study habits and consistency", scores: { SL: 5, CM: 3, AW: 3, BL: 3, ST: 4 } },
        { text: "Stronger conceptual understanding", scores: { SL: 3, CM: 3, AW: 4, BL: 3, ST: 4 } },
        { text: "Reduced exam anxiety and better mindset", scores: { SL: 4, CM: 4, AW: 4, BL: 4, ST: 3 } },
        { text: "Better mentorship and personalized guidance", scores: { SL: 3, CM: 3, AW: 3, BL: 3, ST: 4 } }
      ]
    }
  ];

  // ---------- ARCHETYPES ----------
  var studentArchetypes = {
    CD: { badge: '🔍', name: 'The Deep Diver', tagline: "You seek true understanding — not just memorization. This depth is your greatest weapon." },
    ER: { badge: '🛡️', name: 'The Unshakeable', tagline: "Pressure doesn't break you — it sharpens you. Your composure is rare." },
    SD: { badge: '🏗️', name: 'The Architect', tagline: "Your structure and consistency are superpowers. Results are a matter of time." },
    SA: { badge: '♟️', name: 'The Chess Player', tagline: "You think several moves ahead. Strategy is your natural language." },
    FC: { badge: '🏃', name: 'The Marathoner', tagline: "Your sustained focus and quiet consistency outperform short bursts every time." }
  };
  var parentArchetypes = {
    SL: { badge: '⚓', name: 'The Anchor', tagline: "Your supportive presence is your child's strongest academic asset." },
    CM: { badge: '💬', name: 'The Bridge Builder', tagline: "Open communication is the foundation of everything you do together." },
    AW: { badge: '🔎', name: 'The Investigator', tagline: "You dig deep to understand what's really happening behind the marks." },
    BL: { badge: '⚖️', name: 'The Guardian', tagline: "You protect your child's wellbeing — and that keeps them going long-term." },
    ST: { badge: '🧭', name: 'The Navigator', tagline: "You see the big picture and chart the course before problems arise." }
  };

  var studentDimLabels = { CD: 'Conceptual Depth', ER: 'Exam Resilience', SD: 'Study Discipline', SA: 'Strategic Aptitude', FC: 'Focus & Consistency' };
  var parentDimLabels  = { SL: 'Support Level', CM: 'Communication', AW: 'Awareness', BL: 'Balance', ST: 'Strategic Support' };

  var barColors = {
    CD: '#00C6FF', ER: '#00df89', SD: '#FFB800', SA: '#A855F7', FC: '#FF6B6B',
    SL: '#00C6FF', CM: '#00df89', AW: '#FFB800', BL: '#A855F7', ST: '#FF6B6B'
  };

  // ---------- QUIZ STATE ----------
  var quizState = {
    role: null,
    questions: [],
    answers: [],
    currentQ: 0,
    totalQ: 10
  };

  // ---------- QUIZ DOM REFS ----------
  var roleSelectWindow  = qs('#roleSelectWindow');
  var quizWindow        = qs('#quizWindow');
  var quizControls      = qs('#quizControls');
  var resultWindow      = qs('#resultWindow');
  var questionText      = qs('#questionText');
  var answerButtons     = qs('#answerButtons');
  var nextBtn           = qs('#nextBtn');
  var restartBtn        = qs('#restartBtn');
  var quizProgressFill  = qs('#quizProgressFill');
  var quizProgressText  = qs('#quizProgressText');
  var quizTrackIdentity = qs('#quizTrackIdentity');
  var badgeDisplay      = qs('#badgeDisplay');
  var psychMetricsOutput = qs('#psychMetricsOutput');

  // Guard: quiz section must exist
  if (!roleSelectWindow || !quizWindow || !questionText || !answerButtons) {
    console.warn('[Quiz] Required DOM elements missing — quiz disabled.');
    return;
  }

  // ---------- ROLE SELECTION ----------
  var btnRoleStudent = qs('#btnRoleStudent');
  var btnRoleParent  = qs('#btnRoleParent');

  on(btnRoleStudent, 'click', function () { startQuiz('student'); });
  on(btnRoleParent,  'click', function () { startQuiz('parent'); });

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
      quizTrackIdentity.textContent = (role === 'student') ? '🎓 Student Track' : '👨‍👩‍👧 Parent Track';
    }
    trackEvent('quiz-start-' + role);
    renderQuestion();
  }

  // ---------- RENDER QUESTION ----------
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
      btn.type      = 'button';
      btn.className = 'quiz-btn';
      btn.textContent = opt.text;
      btn.setAttribute('data-index', String(i));

      if (quizState.answers[idx] !== undefined && quizState.answers[idx] === i) {
        btn.classList.add('quiz-btn-selected');
      }
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

  // ---------- SELECT ANSWER ----------
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

  // ---------- NEXT ----------
  on(nextBtn, 'click', function () {
    if (quizState.answers[quizState.currentQ] === undefined) return;
    if (quizState.currentQ < quizState.totalQ - 1) {
      quizState.currentQ++;
      renderQuestion();
    } else {
      showResults();
    }
  });

  // ---------- SHOW RESULTS ----------
  function showResults() {
    quizWindow.hidden       = true;
    if (quizControls) quizControls.hidden = true;
    resultWindow.hidden     = false;

    var isStudent  = (quizState.role === 'student');
    var archetypes = isStudent ? studentArchetypes : parentArchetypes;
    var dimLabels  = isStudent ? studentDimLabels  : parentDimLabels;
    var dimKeys    = Object.keys(dimLabels);

    // Calculate scores
    var totals = {};
    dimKeys.forEach(function (k) { totals[k] = 0; });

    quizState.questions.forEach(function (q, i) {
      var sel = q.options[quizState.answers[i]];
      if (sel && sel.scores) {
        dimKeys.forEach(function (k) {
          totals[k] += (sel.scores[k] || 0);
        });
      }
    });

    var maxPerDim = quizState.totalQ * 5;
    var pct = {};
    dimKeys.forEach(function (k) {
      pct[k] = Math.round((totals[k] / maxPerDim) * 100);
    });

    // Dominant & weakest
    var dominantKey = dimKeys[0];
    var weakestKey  = dimKeys[0];
    dimKeys.forEach(function (k) {
      if (pct[k] > pct[dominantKey]) dominantKey = k;
      if (pct[k] < pct[weakestKey])  weakestKey  = k;
    });

    var archetype = archetypes[dominantKey];
    var insights  = getInsights(isStudent, dominantKey, weakestKey, pct);

    if (badgeDisplay) badgeDisplay.textContent = archetype.badge;

    // Build results HTML
    var html = '';
    html += '<div class="quiz-profile-header">';
    html +=   '<span class="quiz-profile-name">' + archetype.name + '</span>';
    html +=   '<p class="quiz-profile-tagline">' + archetype.tagline + '</p>';
    html += '</div>';

    html += '<div class="quiz-metrics-grid">';
    dimKeys.forEach(function (k) {
      var p = pct[k];
      var c = barColors[k] || '#00C6FF';
      html += '<div class="quiz-metric-row">';
      html +=   '<span class="quiz-metric-label">' + dimLabels[k] + '</span>';
      html +=   '<div class="quiz-metric-bar"><div class="quiz-metric-fill" style="width:0%;background:' + c + '" data-width="' + p + '%"></div></div>';
      html +=   '<span class="quiz-metric-value">' + p + '%</span>';
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

    // Animate bars
    setTimeout(function () {
      qsa('.quiz-metric-fill', psychMetricsOutput).forEach(function (bar) {
        bar.style.width = bar.getAttribute('data-width');
      });
    }, 100);

    // Fade in insight boxes (staggered)
    setTimeout(function () { var el = qs('#insightStrength'); if (el) el.classList.add('visible'); }, 600);
    setTimeout(function () { var el = qs('#insightGrowth');   if (el) el.classList.add('visible'); }, 900);
    setTimeout(function () { var el = qs('#insightRec');      if (el) el.classList.add('visible'); }, 1200);

    if (quizProgressFill) quizProgressFill.style.width = '100%';
    if (quizProgressText) quizProgressText.textContent = 'Scan Complete';

    trackEvent('quiz-complete-' + quizState.role);
  }

  // ---------- INSIGHTS ENGINE ----------
  function getInsights(isStudent, strongest, weakest, pcts) {
    if (isStudent) {
      var sMap = {
        CD: "You have a natural drive to understand the 'why' behind every concept — not just the 'what'. This depth gives you a decisive edge in application-based questions in NEET, JEE, and boards. Keep nurturing this instinct.",
        ER: "You handle exam pressure remarkably well. This composure under fire means your test scores consistently reflect your true preparation level — a rare advantage among aspirants.",
        SD: "Your study routine is structured and consistent. This discipline compounds over time and is one of the strongest predictors of success in competitive exams. Protect this habit at all costs.",
        SA: "You think strategically about your preparation — analyzing patterns, managing priorities, and focusing on what moves the needle. This big-picture thinking separates top performers.",
        FC: "Your ability to maintain sustained focus over long periods is a significant advantage. In an era of constant distraction, this quiet consistency outperforms flashy short bursts every time."
      };
      var gMap = {
        CD: "Consider investing more time in understanding the 'why' behind formulas and derivations rather than jumping straight to problem-solving. Concept-first learning will multiply your accuracy and speed over time.",
        ER: "Exam anxiety may be silently capping your performance. Try incorporating timed mock sessions, box-breathing before tests, and structured error analysis (not self-blame) after every practice paper.",
        SD: "Building a consistent daily routine — even starting with just 2 focused hours at the same time each day — will compound dramatically. Use a simple tracker to build momentum before scaling up.",
        SA: "Develop a habit of post-test analysis. After every mock, identify which question types consumed the most time and which concepts caused hesitation. Then build targeted strategies for those exact gaps.",
        FC: "Try the Pomodoro technique (25 minutes focused work + 5 minutes break) and gradually extend your focus blocks. Remove phone notifications during study windows — even one interruption resets your flow state."
      };

      var rTitle, rText;
      if (pcts.ER < 40 || pcts.SD < 40) {
        rTitle = "Recommended: Elite Hyper-Personalized Micro-Batch";
        rText   = "Your profile reveals specific areas where focused, 1:1 mentorship would create a dramatic shift. Our max 5-student Elite batch provides structured accountability, real-time error analysis, and psychometric counseling designed exactly for this.";
      } else if (pcts.CD < 40 || pcts.SA < 40) {
        rTitle = "Recommended: Advanced Personalized Cohort";
        rText   = "You'd benefit from concept-first teaching with collaborative peer benchmarks. Our max 10-student cohort balances deep conceptual instruction with competitive benchmarking.";
      } else {
        rTitle = "Recommended: Elite Hyper-Personalized Micro-Batch";
        rText   = "Your strong overall profile suggests you're ready for accelerated, precision-targeted preparation. A micro-batch environment will sharpen your existing strengths while providing surgical focus on your growth areas.";
      }
      return { strength: sMap[strongest], growth: gMap[weakest], recTitle: rTitle, recText: rText };
    }

    // Parent
    var pSMap = {
      SL: "You provide a strong, supportive environment for your child. This emotional safety net is the foundation they need to take academic risks and grow through setbacks.",
      CM: "Open communication with your child about their studies means problems surface early and solutions are collaborative. Most parents struggle with this — your willingness to listen is a genuine advantage.",
      AW: "Being aware of your child's specific strengths and weaknesses allows you to provide targeted support rather than generic encouragement. Informed parents are the best academic partners.",
      BL: "Maintaining a balanced approach — studies alongside wellbeing, hobbies, and rest — prevents burnout and keeps long-term motivation alive. You understand the long game.",
      ST: "Your strategic approach to academic planning — setting goals, choosing resources, tracking progress — shows you're thinking about the trajectory, not just the next test."
    };
    var pGMap = {
      SL: "Consider creating more structured support — regular check-ins about what they're learning (not just marks), a dedicated study space, and consistent encouragement during low phases.",
      CM: "Try asking open-ended questions about what they're learning rather than what they scored. Questions like 'What was the hardest concept this week?' open more doors than 'How much did you score?'",
      AW: "Ask your child's mentor for a detailed breakdown of weak topics and common error patterns. Understanding exactly where the gaps are allows you to have more productive conversations.",
      BL: "If studies have consumed all other activities, consider reintroducing one hobby or physical activity. Research consistently shows that breaks improve memory consolidation and reduce exam anxiety.",
      ST: "Consider sitting down with a professional mentor who can map your child's current level to their target exam and create a realistic, phased roadmap."
    };

    var rt, rx;
    if (pcts.CM < 40) {
      rt = "Suggested: Family Strategy Session with Abhinav Sir";
      rx = "Our free consultation includes a parent-student alignment conversation. Bridging the communication gap can transform the entire preparation experience.";
    } else if (pcts.SL < 40 || pcts.BL < 40) {
      rt = "Suggested: Micro-Batch Coaching with Psychometric Support";
      rx = "Our small-batch environment provides the structured support and balanced approach that complements your home environment.";
    } else {
      rt = "Suggested: Book a Free Family Consultation";
      rx = "Your involvement level is strong — a quick consultation with Abhinav sir will help align your support strategy with the right academic track for your child.";
    }
    return { strength: pSMap[strongest], growth: pGMap[weakest], recTitle: rt, recText: rx };
  }

  // ---------- RESTART ----------
  on(restartBtn, 'click', function () {
    resultWindow.hidden      = true;
    quizWindow.hidden        = true;
    if (quizControls) quizControls.hidden = true;
    roleSelectWindow.hidden  = false;

    if (quizProgressFill)  quizProgressFill.style.width  = '0%';
    if (quizProgressText)  quizProgressText.textContent  = '';
    if (badgeDisplay)      badgeDisplay.textContent      = '';
    if (psychMetricsOutput) psychMetricsOutput.innerHTML  = '';

    trackEvent('quiz-restart');
  });

})();

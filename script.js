(function () {
  'use strict';

  // ========================================
  // INJECT QUIZ-SPECIFIC STYLES
  // ========================================
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

  // ========================================
  // UTILITIES
  // ========================================
  var $ = function (sel, ctx) { return (ctx || document).querySelector(sel); };
  var $$$$ = function (sel, ctx) { return Array.prototype.slice.call((ctx || document).querySelectorAll(sel)); };

  function trackEvent(label) {
    if (typeof gtag === 'function') {
      gtag('event', 'click', { event_label: label });
    }
  }

  // ========================================
  // SCROLL PROGRESS BAR
  // ========================================
  var scrollProgress = $('#scrollProgress');
  if (scrollProgress) {
    window.addEventListener('scroll', function () {
      var st = window.pageYOffset || document.documentElement.scrollTop;
      var dh = document.documentElement.scrollHeight - window.innerHeight;
      var pct = dh > 0 ? (st / dh) * 100 : 0;
      scrollProgress.style.width = pct + '%';
      scrollProgress.setAttribute('aria-valuenow', Math.round(pct));
    }, { passive: true });
  }

  // ========================================
  // BACK TO TOP
  // ========================================
  var backToTop = $('#backToTop');
  if (backToTop) {
    window.addEventListener('scroll', function () {
      backToTop.hidden = (window.pageYOffset || document.documentElement.scrollTop) < 400;
    }, { passive: true });
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // ========================================
  // MOBILE MENU
  // ========================================
  var menuToggle = $('#menuToggle');
  var mainNav = $('#mainNav');
  if (menuToggle && mainNav) {
    menuToggle.addEventListener('click', function () {
      var expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', String(!expanded));
      mainNav.classList.toggle('nav-open');
      var icon = this.querySelector('i');
      if (icon) icon.className = expanded ? 'fas fa-bars' : 'fas fa-times';
    });
    mainNav.addEventListener('click', function (e) {
      if (e.target.closest('a') && mainNav.classList.contains('nav-open')) {
        mainNav.classList.remove('nav-open');
        menuToggle.setAttribute('aria-expanded', 'false');
        var icon = menuToggle.querySelector('i');
        if (icon) icon.className = 'fas fa-bars';
      }
    });
  }

  // ========================================
  // SEARCH OVERLAY
  // ========================================
  var searchToggle = $('#searchToggle');
  var searchOverlay = $('#searchOverlay');
  var searchClose = $('#searchClose');
  var searchInput = $('#searchInput');
  var searchResults = $('#searchResults');

  if (searchToggle && searchOverlay) {
    searchToggle.addEventListener('click', function () {
      searchOverlay.hidden = false;
      this.setAttribute('aria-expanded', 'true');
      if (searchInput) setTimeout(function () { searchInput.focus(); }, 50);
    });

    function closeSearch() {
      searchOverlay.hidden = true;
      searchToggle.setAttribute('aria-expanded', 'false');
      searchToggle.focus();
    }

    if (searchClose) searchClose.addEventListener('click', closeSearch);
    searchOverlay.addEventListener('click', function (e) {
      if (e.target === searchOverlay) closeSearch();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && !searchOverlay.hidden) closeSearch();
    });

    if (searchInput && searchResults) {
      searchInput.addEventListener('input', function () {
        var q = this.value.toLowerCase().trim();
        if (!q) { searchResults.innerHTML = ''; return; }
        var all = $$('h2, h3').map(function (el) {
          return { el: el, text: el.textContent, section: el.closest('section') };
        });
        var matches = all.filter(function (s) {
          return s.text.toLowerCase().indexOf(q) !== -1;
        }).slice(0, 8);
        searchResults.innerHTML = matches.length
          ? matches.map(function (m) {
              return '<a href="#' + (m.section ? m.section.id : '') + '" class="search-result-item">' + m.text + '</a>';
            }).join('')
          : '<p style="color:var(--text-muted);padding:12px 0">No results found.</p>';
      });
    }
  }

  // ========================================
  // POONAM DROPDOWN
  // ========================================
  var poonamTrigger = ('#poonamNavTrigger');
  var poonamDropdown = $('#poonamDropdown');
  if (poonamTrigger && poonamDropdown) {
    poonamTrigger.addEventListener('click', function (e) {
      e.stopPropagation();
      var expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', String(!expanded));
      poonamDropdown.classList.toggle('poonam-dd-open', !expanded);
    });
    document.addEventListener('click', function (e) {
      if (!poonamDropdown.contains(e.target) && e.target !== poonamTrigger) {
        poonamTrigger.setAttribute('aria-expanded', 'false');
        poonamDropdown.classList.remove('poonam-dd-open');
      }
    });
  }

  // ========================================
  // FAQ ACCORDION
  // ========================================
  $$$$('.faq-question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var expanded = this.getAttribute('aria-expanded') === 'true';
      var answer = this.nextElementSibling;
      $$('.faq-question').forEach(function (other) {
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

  // ========================================
  // AUTH MODAL
  // ========================================
  var authModal = ('#authModal');
  var btnCloseModal = $('#btnCloseModal');
  var authViewLogin = $('#authViewLogin');
  var authViewSignup = $('#authViewSignup');
  var authViewForgot = $('#authViewForgot');

  function openAuth(view) {
    if (!authModal) return;
    authModal.hidden = false;
    showAuthView(view || 'login');
  }

  function closeAuth() {
    if (authModal) authModal.hidden = true;
  }

  function showAuthView(view) {
    if (authViewLogin) authViewLogin.hidden = view !== 'login';
    if (authViewSignup) authViewSignup.hidden = view !== 'signup';
    if (authViewForgot) authViewForgot.hidden = view !== 'forgot';
  }

  var btnStudentLogin = $('#btnStudentLogin');
  var btnParentLogin = $('#btnParentLogin');
  if (btnStudentLogin) btnStudentLogin.addEventListener('click', function () { openAuth('login'); });
  if (btnParentLogin) btnParentLogin.addEventListener('click', function () { openAuth('login'); });
  if (btnCloseModal) btnCloseModal.addEventListener('click', closeAuth);
  if (authModal) authModal.addEventListener('click', function (e) { if (e.target === authModal) closeAuth(); });

  var btnGotoSignup = $('#btnGotoSignup');
  var btnGotoLogin = $('#btnGotoLogin');
  var btnGotoForgot = $('#btnGotoForgot');
  var btnGotoLogin2 = $('#btnGotoLogin2');
  if (btnGotoSignup) btnGotoSignup.addEventListener('click', function () { showAuthView('signup'); });
  if (btnGotoLogin) btnGotoLogin.addEventListener('click', function () { showAuthView('login'); });
  if (btnGotoForgot) btnGotoForgot.addEventListener('click', function () { showAuthView('forgot'); });
  if (btnGotoLogin2) btnGotoLogin2.addEventListener('click', function () { showAuthView('login'); });

  ['formLogin', 'formSignup', 'formForgot'].forEach(function (id) {
    var form = $('#' + id);
    if (form) {
      form.addEventListener('submit', function (e) {
        e.preventDefault();
        alert('Backend integration required. This is a frontend demo.');
      });
    }
  });

  // Password strength indicator
  var signupPass = $('#signupPass');
  var strengthBar = $('#strengthBar');
  var strengthFeedback = $('#strengthFeedback');
  if (signupPass && strengthBar) {
    signupPass.addEventListener('input', function () {
      var v = this.value;
      var s = 0;
      if (v.length >= 8) s++;
      if (/[A-Z]/.test(v)) s++;
      if (/[0-9]/.test(v)) s++;
      if (/[^A-Za-z0-9]/.test(v)) s++;
      var pct = (s / 4) * 100;
      var colors = ['#ff4444', '#ffaa00', '#aadd00', '#00df89'];
      var labels = ['Weak', 'Fair', 'Good', 'Strong'];
      strengthBar.style.width = pct + '%';
      strengthBar.style.background = colors[s] || colors[0];
      if (strengthFeedback) strengthFeedback.textContent = v.length === 0
        ? 'Min 8 chars, uppercase, number, special char'
        : labels[s] || labels[0];
    });
  }

  // ========================================
  // NOTES DOWNLOAD — opens auth modal
  // ========================================
  $$$$('.download-btn-style').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var notesType = this.getAttribute('data-notes') || 'unknown';
      trackEvent('cta-notes-' + notesType);
      openAuth('login');
    });
  });

  // ========================================
  // CONTACT FORM
  // ========================================
  var contactForm = $('#contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = ($('#studentName') || {}).value;
      var email = ($('#studentEmail') || {}).value;
      var phone = ($('#studentPhone') || {}).value;

      if (!name || !name.trim() || !email || !email.trim() || !phone || !phone.trim()) {
        alert('Please fill in all required fields.');
        return;
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
        alert('Please enter a valid email address.');
        return;
      }
      if (!/^[0-9]{10}$/.test(phone.trim())) {
        alert('Please enter a valid 10-digit phone number.');
        return;
      }

      trackEvent('contact-form-submit');
      alert('Thank you! Abhinav sir will review your profile and reach out within 24 hours.');
      contactForm.reset();
    });
  }

  // ========================================
  // DATA-TRACK ANALYTICS
  // ========================================
  $$('[data-track]').forEach(function (el) {
    el.addEventListener('click', function () {
      trackEvent(this.getAttribute('data-track'));
    });
  });

  // ========================================
  // SMOOTH SCROLL FOR INTERNAL LINKS
  // ========================================
  $$('a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (href && href.length > 1) {
        var target = $(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }
    });
  });

  // ========================================
  // BLOG FILTER BUTTONS
  // ========================================
  $$('.filter-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      $$('.filter-btn').forEach(function (b) { b.classList.remove('active'); });
      this.classList.add('active');
      var filter = this.getAttribute('data-filter');
      $$('.blog-card, .blog-post-card').forEach(function (card) {
        if (filter === 'all') {
          card.style.display = '';
        } else {
          var tags = (card.getAttribute('data-category') || card.getAttribute('data-tags') || '').toLowerCase();
          card.style.display = tags.indexOf(filter) !== -1 ? '' : 'none';
        }
      });
    });
  });

  // ========================================
  // ========================================
  //          MINDSET AUDIT QUIZ
  // ========================================
  // ========================================

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

  // ---------- ARCHETYPE DEFINITIONS ----------
  var studentArchetypes = {
    CD: { badge: '🔍', name: 'The Deep Diver', tagline: 'You seek true understanding — not just memorization. This depth is your greatest weapon.' },
    ER: { badge: '🛡️', name: 'The Unshakeable', tagline: 'Pressure doesn\'t break you — it sharpens you. Your composure is rare.' },
    SD: { badge: '🏗️', name: 'The Architect', tagline: 'Your structure and consistency are superpowers. Results are a matter of time.' },
    SA: { badge: '♟️', name: 'The Chess Player', tagline: 'You think several moves ahead. Strategy is your natural language.' },
    FC: { badge: '🏃', name: 'The Marathoner', tagline: 'Your sustained focus and quiet consistency outperform short bursts every time.' }
  };

  var parentArchetypes = {
    SL: { badge: '⚓', name: 'The Anchor', tagline: 'Your supportive presence is your child\'s strongest academic asset.' },
    CM: { badge: '💬', name: 'The Bridge Builder', tagline: 'Open communication is the foundation of everything you do together.' },
    AW: { badge: '🔎', name: 'The Investigator', tagline: 'You dig deep to understand what\'s really happening behind the marks.' },
    BL: { badge: '⚖️', name: 'The Guardian', tagline: 'You protect your child\'s wellbeing — and that keeps them going long-term.' },
    ST: { badge: '🧭', name: 'The Navigator', tagline: 'You see the big picture and chart the course before problems arise.' }
  };

  var studentDimLabels = {
    CD: 'Conceptual Depth',
    ER: 'Exam Resilience',
    SD: 'Study Discipline',
    SA: 'Strategic Aptitude',
    FC: 'Focus & Consistency'
  };

  var parentDimLabels = {
    SL: 'Support Level',
    CM: 'Communication',
    AW: 'Awareness',
    BL: 'Balance',
    ST: 'Strategic Support'
  };

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

  // ---------- DOM REFERENCES ----------
  var roleSelectWindow = ('#roleSelectWindow');
  var quizWindow = $('#quizWindow');
  var quizControls = $('#quizControls');
  var resultWindow = $('#resultWindow');
  var questionText = $('#questionText');
  var answerButtons = $('#answerButtons');
  var nextBtn = $('#nextBtn');
  var restartBtn = $('#restartBtn');
  var quizProgressFill = $('#quizProgressFill');
  var quizProgressText = $('#quizProgressText');
  var quizTrackIdentity = $('#quizTrackIdentity');
  var badgeDisplay = $('#badgeDisplay');
  var psychMetricsOutput = $('#psychMetricsOutput');

  // ---------- GUARD ----------
  if (!roleSelectWindow || !quizWindow || !questionText || !answerButtons) {
    console.warn('[Quiz] Required DOM elements missing — quiz disabled.');
    return;
  }

  // ---------- ROLE SELECTION ----------
  var btnRoleStudent = $('#btnRoleStudent');
  var btnRoleParent = $('#btnRoleParent');

  if (btnRoleStudent) {
    btnRoleStudent.addEventListener('click', function () { startQuiz('student'); });
  }
  if (btnRoleParent) {
    btnRoleParent.addEventListener('click', function () { startQuiz('parent'); });
  }

  function startQuiz(role) {
    quizState.role = role;
    quizState.questions = role === 'student' ? studentQuestions : parentQuestions;
    quizState.answers = [];
    quizState.currentQ = 0;

    roleSelectWindow.hidden = true;
    resultWindow.hidden = true;
    quizWindow.hidden = false;
    if (quizControls) quizControls.hidden = false;

    if (quizTrackIdentity) {
      quizTrackIdentity.textContent = role === 'student' ? '🎓 Student Track' : '👨‍👩‍👧 Parent Track';
    }

    trackEvent('quiz-start-' + role);
    renderQuestion();
  }

  // ---------- RENDER QUESTION ----------
  function renderQuestion() {
    var q = quizState.questions[quizState.currentQ];
    var idx = quizState.currentQ;
    var total = quizState.totalQ;

    // Progress
    if (quizProgressFill) quizProgressFill.style.width = ((idx) / total * 100) + '%';
    if (quizProgressText) quizProgressText.textContent = 'Question ' + (idx + 1) + ' of ' + total;

    // Question text
    questionText.textContent = q.q;

    // Clear + render options
    answerButtons.innerHTML = '';
    q.options.forEach(function (opt, i) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'quiz-btn';
      btn.textContent = opt.text;
      btn.setAttribute('data-index', String(i));

      if (quizState.answers[idx] !== undefined && quizState.answers[idx] === i) {
        btn.classList.add('quiz-btn-selected');
      }

      btn.addEventListener('click', function () { selectAnswer(i); });
      answerButtons.appendChild(btn);
    });

    // Next button visibility
    if (nextBtn) {
      nextBtn.hidden = quizState.answers[idx] === undefined;
      nextBtn.innerHTML = idx === total - 1
        ? 'View Results <i class="fas fa-arrow-right" aria-hidden="true"></i>'
        : 'Next <i class="fas fa-arrow-right" aria-hidden="true"></i>';
    }
  }

  // ---------- SELECT ANSWER ----------
  function selectAnswer(optionIndex) {
    quizState.answers[quizState.currentQ] = optionIndex;

    // Highlight
    $$$$('.quiz-btn', answerButtons).forEach(function (btn, i) {
      btn.classList.toggle('quiz-btn-selected', i === optionIndex);
    });

    // Show next
    if (nextBtn) {
      nextBtn.hidden = false;
      nextBtn.innerHTML = quizState.currentQ === quizState.totalQ - 1
        ? 'View Results <i class="fas fa-arrow-right" aria-hidden="true"></i>'
        : 'Next <i class="fas fa-arrow-right" aria-hidden="true"></i>';
    }
  }

  // ---------- NEXT BUTTON ----------
  if (nextBtn) {
    nextBtn.addEventListener('click', function () {
      if (quizState.answers[quizState.currentQ] === undefined) return;

      if (quizState.currentQ < quizState.totalQ - 1) {
        quizState.currentQ++;
        renderQuestion();
      } else {
        showResults();
      }
    });
  }

  // ---------- SHOW RESULTS ----------
  function showResults() {
    quizWindow.hidden = true;
    if (quizControls) quizControls.hidden = true;
    resultWindow.hidden = false;

    var isStudent = quizState.role === 'student';
    var archetypes = isStudent ? studentArchetypes : parentArchetypes;
    var dimLabels = isStudent ? studentDimLabels : parentDimLabels;
    var dimKeys = Object.keys(dimLabels);

    // Calculate raw totals
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

    // Percentages (max per dim = 10 questions × 5 score = 50)
    var maxPerDim = quizState.totalQ * 5;
    var pct = {};
    dimKeys.forEach(function (k) {
      pct[k] = Math.round((totals[k] / maxPerDim) * 100);
    });

    // Dominant dimension
    var dominantKey = dimKeys[0];
    dimKeys.forEach(function (k) {
      if (pct[k] > pct[dominantKey]) dominantKey = k;
    });

    // Weakest dimension
    var weakestKey = dimKeys[0];
    dimKeys.forEach(function (k) {
      if (pct[k] < pct[weakestKey]) weakestKey = k;
    });

    var archetype = archetypes[dominantKey];
    var insights = getInsights(isStudent, dominantKey, weakestKey, pct);

    // --- Badge ---
    if (badgeDisplay) badgeDisplay.textContent = archetype.badge;

    // --- Build results HTML ---
    var html = '';

    // Profile header
    html += '<div class="quiz-profile-header">';
    html += '<span class="quiz-profile-name">' + archetype.name + '</span>';
    html += '<p class="quiz-profile-tagline">' + archetype.tagline + '</p>';
    html += '</div>';

    // Metrics
    html += '<div class="quiz-metrics-grid">';
    dimKeys.forEach(function (k) {
      var p = pct[k];
      var c = barColors[k] || '#00C6FF';
      html += '<div class="quiz-metric-row">';
      html += '<span class="quiz-metric-label">' + dimLabels[k] + '</span>';
      html += '<div class="quiz-metric-bar"><div class="quiz-metric-fill" style="width:0%;background:' + c + '" data-width="' + p + '%"></div></div>';
      html += '<span class="quiz-metric-value">' + p + '%</span>';
      html += '</div>';
    });
    html += '</div>';

    // Strength insight
    html += '<div class="quiz-insight-box" id="insightStrength">';
    html += '<div class="quiz-insight-label">Top Strength</div>';
    html += '<div class="quiz-insight-title">' + dimLabels[dominantKey] + ' — ' + pct[dominantKey] + '%</div>';
    html += '<p class="quiz-insight-text">' + insights.strength + '</p>';
    html += '</div>';

    // Growth insight
    html += '<div class="quiz-insight-box" id="insightGrowth">';
    html += '<div class="quiz-insight-label">Primary Growth Area</div>';
    html += '<div class="quiz-insight-title">' + dimLabels[weakestKey] + ' — ' + pct[weakestKey] + '%</div>';
    html += '<p class="quiz-insight-text">' + insights.growth + '</p>';
    html += '</div>';

    // Recommendation
    html += '<div class="quiz-track-rec" id="insightRec">';
    html += '<h4>' + insights.recTitle + '</h4>';
    html += '<p>' + insights.recText + '</p>';
    html += '</div>';

    if (psychMetricsOutput) {
      psychMetricsOutput.innerHTML = html;
    }

    // Animate metric bars after a short delay
    setTimeout(function () {
      $$('.quiz-metric-fill', psychMetricsOutput).forEach(function (bar) {
        bar.style.width = bar.getAttribute('data-width');
      });
    }, 100);

    // Fade in insight boxes
    setTimeout(function () {
      var el = $('#insightStrength');
      if (el) el.classList.add('visible');
    }, 600);
    setTimeout(function () {
      var el = $('#insightGrowth');
      if (el) el.classList.add('visible');
    }, 900);
    setTimeout(function () {
      var el = $('#insightRec');
      if (el) el.classList.add('visible');
    }, 1200);

    // Update progress
    if (quizProgressFill) quizProgressFill.style.width = '100%';
    if (quizProgressText) quizProgressText.textContent = 'Scan Complete';

    trackEvent('quiz-complete-' + quizState.role);
  }

  // ---------- INSIGHTS ----------
  function getInsights(isStudent, strongest, weakest, pcts) {
    if (isStudent) {
      var strengthMap = {
        CD: "You have a natural drive to understand the 'why' behind every concept — not just the 'what'. This depth gives you a decisive edge in application-based questions in NEET, JEE, and boards. Keep nurturing this instinct.",
        ER: "You handle exam pressure remarkably well. This composure under fire means your test scores consistently reflect your true preparation level — a rare advantage among aspirants.",
        SD: "Your study routine is structured and consistent. This discipline compounds over time and is one of the strongest predictors of success in competitive exams. Protect this habit at all costs.",
        SA: "You think strategically about your preparation — analyzing patterns, managing priorities, and focusing on what moves the needle. This big-picture thinking separates top performers.",
        FC: "Your ability to maintain sustained focus over long periods is a significant advantage. In an era of constant distraction, this quiet consistency outperforms flashy short bursts every time."
      };
      var growthMap = {
        CD: "Consider investing more time in understanding the 'why' behind formulas and derivations rather than jumping straight to problem-solving. Concept-first learning will multiply your accuracy and speed over time.",
        ER: "Exam anxiety may be silently capping your performance. Try incorporating timed mock sessions, box-breathing before tests, and structured error analysis (not self-blame) after every practice paper.",
        SD: "Building a consistent daily routine — even starting with just 2 focused hours at the same time each day — will compound dramatically. Use a simple tracker to build momentum before scaling up.",
        SA: "Develop a habit of post-test analysis. After every mock, identify which question types consumed the most time and which concepts caused hesitation. Then build targeted strategies for those exact gaps.",
        FC: "Try the Pomodoro technique (25 minutes focused work + 5 minutes break) and gradually extend your focus blocks. Remove phone notifications during study windows — even one interruption resets your flow state."
      };

      var recTitle, recText;
      if (pcts.ER < 40 || pcts.SD < 40) {
        recTitle = "Recommended: Elite Hyper-Personalized Micro-Batch";
        recText = "Your profile reveals specific areas — like exam anxiety or routine consistency — where focused, 1:1 mentorship would create a dramatic shift. Our max 5-student Elite batch provides structured accountability, real-time error analysis, and psychometric counseling designed exactly for this.";
      } else if (pcts.CD < 40 || pcts.SA < 40) {
        recTitle = "Recommended: Advanced Personalized Cohort";
        recText = "You'd benefit from concept-first teaching with collaborative peer benchmarks. Our max 10-student cohort balances deep conceptual instruction with competitive benchmarking — ideal for building both understanding and strategy.";
      } else {
        recTitle = "Recommended: Elite Hyper-Personalized Micro-Batch";
        recText = "Your strong overall profile suggests you're ready for accelerated, precision-targeted preparation. A micro-batch environment will sharpen your existing strengths while providing surgical focus on your growth areas for maximum percentile gains.";
      }

      return { strength: strengthMap[strongest], growth: growthMap[weakest], recTitle: recTitle, recText: recText };
    }

    // Parent insights
    var pStrengthMap = {
      SL: "You provide a strong, supportive environment for your child. This emotional safety net is the foundation they need to take academic risks, ask questions without fear, and grow through setbacks rather than crumble.",
      CM: "Open communication with your child about their studies means problems surface early and solutions are collaborative. Most parents struggle with this — your willingness to listen (not just direct) is a genuine advantage.",
      AW: "Being aware of your child's specific strengths and weaknesses allows you to provide targeted support rather than generic encouragement. Informed parents are the best academic partners any mentor can have.",
      BL: "Maintaining a balanced approach — studies alongside wellbeing, hobbies, and rest — prevents burnout and keeps long-term motivation alive. Many parents sacrifice this for short-term gains; you understand the long game.",
      ST: "Your strategic approach to academic planning — setting goals, choosing the right resources, tracking progress — shows you're thinking about the trajectory, not just the next test. This kind of planning multiplies results."
    };
    var pGrowthMap = {
      SL: "Consider creating more structured support — regular check-ins about what they're learning (not just marks), a dedicated study space at home, and consistent encouragement during low phases. Small structure creates big results.",
      CM: "Try asking open-ended questions about what they're learning rather than what they scored. Questions like 'What was the hardest concept this week?' open more doors than 'How much did you score?' Practice listening without jumping to advice.",
      AW: "Ask your child's mentor for a detailed breakdown of weak topics and common error patterns. Understanding exactly where the gaps are allows you to have more productive conversations and offer meaningful help.",
      BL: "If studies have consumed all other activities, consider reintroducing one hobby or physical activity. Research consistently shows that breaks improve memory consolidation, reduce exam anxiety, and prevent the burnout that derails long-term preparation.",
      ST: "Consider sitting down with a professional mentor who can map your child's current level to their target exam and create a realistic, phased roadmap. Knowing the plan reduces both parent anxiety and student confusion."
    };

    var rTitle, rText;
    if (pcts.CM < 40) {
      rTitle = "Suggested: Family Strategy Session with Abhinav Sir";
      rText = "Our free consultation includes a parent-student alignment conversation. Bridging the communication gap between you and your child about academics can transform the entire preparation experience — less friction, more progress.";
    } else if (pcts.SL < 40 || pcts.BL < 40) {
      rTitle = "Suggested: Micro-Batch Coaching with Psychometric Support";
      rText = "Our small-batch environment provides the structured support and balanced approach that complements your home environment. The included psychometric counseling helps both students and parents navigate the preparation journey together.";
    } else {
      rTitle = "Suggested: Book a Free Family Consultation";
      rText = "Your involvement level is strong — a quick consultation with Abhinav sir will help align your support strategy with the right academic track, batch, and study plan for your child's specific goals and learning style.";
    }

    return { strength: pStrengthMap[strongest], growth: pGrowthMap[weakest], recTitle: rTitle, recText: rText };
  }

  // ---------- RESTART ----------
  if (restartBtn) {
    restartBtn.addEventListener('click', function () {
      resultWindow.hidden = true;
      quizWindow.hidden = true;
      if (quizControls) quizControls.hidden = true;
      roleSelectWindow.hidden = false;

      if (quizProgressFill) quizProgressFill.style.width = '0%';
      if (quizProgressText) quizProgressText.textContent = '';
      if (badgeDisplay) badgeDisplay.textContent = '';
      if (psychMetricsOutput) psychMetricsOutput.innerHTML = '';

      trackEvent('quiz-restart');
    });
  }

})();

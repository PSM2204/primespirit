/*==========================================================
  PRIME SPIRIT MENTORS — APPLICATION v16.0
  Modular architecture | Analytics | Blog System | Quiz
==========================================================*/
(function () {
  'use strict';

  /* ── 1. CONFIG ── */
  const CONFIG = {
    blogPostsPerPage: 6,
    quizQuestions: 10,
    scrollTrackThresholds: [25, 50, 75, 100],
    debounceMs: 100,
  };

  /* ── 2. BLOG DATA ── */
  const BLOG_POSTS = [
    {
      id: 'electrostatics-01',
      slug: 'mastering-electrostatics-coulombs-law-gauss-theorem',
      title: 'Mastering Electrostatics: From Coulomb\'s Law to Gauss\'s Theorem',
      excerpt: 'A systematic breakdown of electrostatics for NEET and JEE aspirants — covering Coulomb\'s Law, electric field lines, Gauss\'s theorem applications, and common problem-solving traps.',
      content: `<h2 id="coulombs-law">Coulomb\'s Law: The Foundation</h2>
<p>Every electrostatics problem begins with Coulomb\'s Law. The force between two point charges is directly proportional to the product of their charges and inversely proportional to the square of the distance between them. Written mathematically: <strong>F = kq₁q₂/r²</strong>. But understanding the formula is only the start — what matters is recognizing when superposition applies and how to decompose forces into components.</p>
<p>A common mistake students make in competitive exams is forgetting that Coulomb\'s Law applies to point charges. When you\'re given a continuous charge distribution, you need integration — and the limits matter. For NEET, focus on conceptual MCQ applications. For JEE, be prepared for multi-step numerical problems involving symmetric charge configurations.</p>
<h2 id="gauss-theorem">Gauss\'s Theorem: Elegant Problem-Solving</h2>
<p>Gauss\'s theorem relates the electric flux through a closed surface to the charge enclosed: <strong>∮E·dA = q_enc/ε₀</strong>. Its real power lies in exploiting symmetry. Spherical, cylindrical, and planar symmetries each yield clean results — but only if you choose the correct Gaussian surface.</p>
<p>For JEE Mains, expect problems that test whether you can identify the symmetry and pick the right surface. For NEET, the questions tend to be more conceptual — understanding that flux depends only on enclosed charge, not on the shape of the surface outside. Practice with at least 20 varied problems from each symmetry type before your exam.</p>
<h2 id="common-traps">Common Exam Traps</h2>
<p>First: electric field inside a conductor is zero, but that does not mean there are no charges — charges redistribute to the surface. Second: the direction of the electric field is always from positive to negative, but for a system of charges, use vector addition. Third: in Gauss\'s theorem problems, charges outside the Gaussian surface contribute zero net flux — this is tested in nearly every JEE cycle.</p>`,
      category: 'physics',
      examLabels: ['NEET', 'JEE'],
      difficulty: 'intermediate',
      series: 'Electrostatics Mastery',
      seriesIndex: 1,
      seriesTotal: 3,
      featured: true,
      trending: true,
      author: 'Abhinav Kashyap',
      date: '2025-11-15',
      readTime: 8,
      tags: ['electrostatics', 'coulombs-law', 'gauss-theorem', 'class-12-physics']
    },
    {
      id: 'organic-chem-01',
      slug: 'organic-chemistry-named-reactions-neet-guide',
      title: 'Organic Chemistry Named Reactions: The Complete NEET Guide',
      excerpt: 'Stop memorizing blindly. Learn the logic behind every named reaction NEET tests — from Aldol Condensation to Cannizzaro — using synthesis chain mapping.',
      content: `<h2 id="why-named-reactions">Why Named Reactions Matter in NEET</h2>
<p>Organic chemistry named reactions appear in almost every NEET paper. But the mistake most students make is treating them as isolated facts to memorize. Every named reaction follows a mechanistic logic — once you understand the mechanism, you can predict products even for reactions you haven\'t seen before.</p>
<p>Start by grouping reactions by type: substitution, elimination, addition, and rearrangement. Within each group, identify the common pattern. For instance, both <strong>Aldol Condensation</strong> and <strong>Cannizzaro Reaction</strong> involve carbonyl compounds, but Aldol requires an alpha-hydrogen while Cannizzaro occurs in its absence. This single distinction is tested repeatedly.</p>
<h2 id="chain-mapping">Synthesis Chain Mapping</h2>
<p>At Prime Spirit Mentors, we use a technique called synthesis chain mapping. Instead of memorizing individual reactions, you build a visual map connecting reactants to products through intermediate steps. This is especially effective for multi-step synthesis problems common in NEET.</p>
<p>Draw your starting compound on the left. For each possible reaction, branch out to the product. Label each arrow with the reagent and condition. Over time, you\'ll see convergence points — molecules that can be reached from multiple starting materials. These convergence points are your high-yield revision targets.</p>
<h2 id="key-reactions">Must-Know Reactions for NEET 2026</h2>
<p>Prioritize these: <strong>Markovnikov\'s addition</strong>, <strong>Saytzeff elimination</strong>, <strong>Hoffmann bromamide degradation</strong>, <strong>Gattermann-Koch reaction</strong>, and <strong>Reimer-Tiemann reaction</strong>. Each has appeared in NEET at least twice in the last five years. Practice writing mechanisms by hand — don\'t just read them from a textbook.</p>`,
      category: 'chemistry',
      examLabels: ['NEET'],
      difficulty: 'advanced',
      series: null,
      seriesIndex: null,
      seriesTotal: null,
      featured: false,
      trending: true,
      author: 'Abhinav Kashyap',
      date: '2025-10-28',
      readTime: 9,
      tags: ['organic-chemistry', 'named-reactions', 'neet', 'synthesis']
    },
    {
      id: 'integration-01',
      slug: 'integration-techniques-jee-aspirants',
      title: 'Integration Techniques Every JEE Aspirant Must Know',
      excerpt: 'From substitution to partial fractions, here\'s a systematic approach to integration that actually works under exam pressure.',
      content: `<h2 id="substitution">Substitution: Your First Instinct</h2>
<p>When you see an integral, your first move should be substitution. Look for a function and its derivative appearing together. The classic example: <strong>∫2x·e^(x²)dx</strong> — substitute u = x², and the integral simplifies to ∫e^u du. But JEE often hides the substitution inside more complex expressions.</p>
<p>A useful trick: if the integrand contains √(a² - x²), try x = a·sinθ. For √(a² + x²), try x = a·tanθ. For √(x² - a²), try x = a·secθ. These trigonometric substitutions convert irrational expressions into rational trigonometric forms that are easier to integrate.</p>
<h2 id="partial-fractions">Partial Fractions for Rational Functions</h2>
<p>When you have a rational function P(x)/Q(x) where the degree of P is less than the degree of Q, decompose into partial fractions. The key step is factoring Q(x) completely. For JEE Mains, quadratic factors with no real roots require the form <strong>(Ax + B)/(x² + bx + c)</strong> rather than simple A/(x + α).</p>
<p>Practice this: ∫(3x + 5)/((x + 1)(x + 2))dx. Decompose into A/(x+1) + B/(x+2), solve for A and B by substituting convenient values of x, then integrate term by term. Under time pressure, this method is faster than any other approach for rational integrands.</p>
<h2 id="practice-strategy">Practice Strategy</h2>
<p>Do not attempt to learn all techniques simultaneously. Week 1: master substitution. Week 2: master integration by parts (LIATE rule). Week 3: partial fractions. Week 4: mixed practice from previous JEE papers. By exam day, the pattern recognition will be automatic.</p>`,
      category: 'maths',
      examLabels: ['JEE'],
      difficulty: 'intermediate',
      series: 'Calculus for JEE',
      seriesIndex: 2,
      seriesTotal: 4,
      featured: false,
      trending: false,
      author: 'Abhinav Kashyap',
      date: '2025-12-01',
      readTime: 7,
      tags: ['integration', 'calculus', 'jee-mains', 'class-12-maths']
    },
    {
      id: 'ncert-bio-01',
      slug: 'how-to-read-ncert-biology-neet',
      title: 'How to Read NCERT Biology for Maximum NEET Score',
      excerpt: 'NCERT is the backbone of NEET Biology. But most students read it wrong. Here\'s the line-by-line strategy that top scorers use.',
      content: `<h2 id="line-by-line">Why Line-by-Line Reading Matters</h2>
<p>NEET Biology questions are increasingly drawn from specific NCERT sentences — sometimes from footnotes, diagrams, or summary tables that students skip. In the last three NEET exams, over 85% of Biology questions could be answered directly from NCERT content. This means your NCERT reading strategy is more important than any reference book.</p>
<p>Read every chapter at least three times. First reading: get the big picture. Second reading: highlight key terms, definitions, and examples. Third reading: focus on tables, diagrams, and their labels. Pay special attention to lines that contain numerical data (chromosome counts, gestation periods, percentage values) — these are favourite question sources.</p>
<h2 id="diagrams">Diagrams Are Non-Negotiable</h2>
<p>NEET regularly asks questions based on diagram labels. The human heart, nephron structure, DNA replication fork, and floral diagrams are tested almost every year. Don\'t just look at diagrams — redraw them from memory and label every part. If you can reconstruct a diagram without looking at the book, you know the chapter.</p>
<h2 id="revision-cycle">The 3-2-1 Revision Cycle</h2>
<p>After completing each chapter, revise it after 3 days, then after 2 weeks, then after 1 month. This spaced repetition approach, combined with the line-by-line method, creates deep retention. At Prime Spirit, we build this cycle into every student\'s personalized study plan based on their psychometric profile and weak-area mapping.</p>`,
      category: 'biology',
      examLabels: ['NEET'],
      difficulty: 'beginner',
      series: 'NEET Biology Strategy',
      seriesIndex: 1,
      seriesTotal: 2,
      featured: false,
      trending: true,
      author: 'Abhinav Kashyap',
      date: '2025-09-20',
      readTime: 6,
      tags: ['ncert', 'biology', 'neet', 'study-strategy', 'revision']
    },
    {
      id: 'econ-ied-01',
      slug: 'indian-economic-development-cuet-guide',
      title: 'Understanding Indian Economic Development: A CUET Perspective',
      excerpt: 'A structured approach to Indian Economic Development for CUET aspirants — covering Five Year Plans, economic reforms, and policy analysis.',
      content: `<h2 id="five-year-plans">Five Year Plans: Structure and Goals</h2>
<p>Indian Economic Development is a high-scoring section in CUET if you approach it systematically. Start with the Five Year Plans — understand not just the dates and targets, but the economic philosophy behind each. The First Five Year Plan (1951-56) was based on the Harrod-Domar model and prioritized agriculture. The Second Plan shifted to heavy industry under the Mahalanobis model.</p>
<p>For CUET, focus on the transition points: when did India shift from import substitution to liberalization? What triggered the 1991 reforms? Understanding the <strong>why</strong> behind policy changes helps you answer analytical MCQs that pure memorization cannot.</p>
<h2 id="key-indicators">Key Economic Indicators</h2>
<p>Know the current values and trends for: GDP growth rate, HDI ranking, poverty line methodology (Tendulkar vs Rangarajan), unemployment types (disguised, seasonal, structural), and sectoral contribution to GDP. CUET often presents data in tables or graphs and asks you to interpret — so practice reading economic data, not just memorizing it.</p>
<h2 id="exam-strategy">Exam Strategy</h2>
<p>Allocate 40% of your study time to Indian Economic Development and 60% to Microeconomics and Macroeconomics combined. For IED, focus on conceptual clarity over rote facts. For Micro and Macro, practice numerical problems — elasticity calculations, national income aggregates, and multiplier effects appear consistently in CUET papers.</p>`,
      category: 'economics',
      examLabels: ['CUET'],
      difficulty: 'beginner',
      series: null,
      seriesIndex: null,
      seriesTotal: null,
      featured: false,
      trending: false,
      author: 'Abhinav Kashyap',
      date: '2025-08-10',
      readTime: 7,
      tags: ['economics', 'indian-economic-development', 'cuet', 'five-year-plans']
    },
    {
      id: 'thermo-01',
      slug: 'thermodynamics-laws-explained',
      title: 'Thermodynamics: Zeroth to Third Law in 20 Minutes',
      excerpt: 'A rapid, concept-first revision of all four laws of thermodynamics for NEET and JEE — with exam-focused problem patterns and common mistakes.',
      content: `<h2 id="zeroth-law">The Zeroth Law: Thermal Equilibrium</h2>
<p>If system A is in thermal equilibrium with system C, and system B is also in thermal equilibrium with system C, then A and B are in thermal equilibrium with each other. This law establishes temperature as a measurable, transitive property. For NEET, this is usually a one-mark conceptual question — know the definition precisely.</p>
<h2 id="first-law">The First Law: Energy Conservation</h2>
<p><strong>ΔU = Q - W</strong>. The change in internal energy equals heat added to the system minus work done by the system. JEE problems often test sign conventions: is work done on the system or by the system? Is heat absorbed or released? Draw a diagram for every problem — it prevents sign errors.</p>
<p>For adiabatic processes (Q = 0), the equation simplifies to ΔU = -W. For isothermal processes (ΔU = 0 for ideal gases), Q = W. Memorize these special cases — they appear in nearly every exam.</p>
<h2 id="second-law">The Second Law: Entropy</h2>
<p>Entropy of an isolated system never decreases: <strong>ΔS ≥ 0</strong>. This is the directionality law — it tells you which processes are spontaneous. For JEE, Carnot engine efficiency (η = 1 - T₂/T₁) is a high-frequency topic. For NEET, focus on the conceptual statement and its implications for reversible vs irreversible processes.</p>
<h2 id="third-law">The Third Law</h2>
<p>As temperature approaches absolute zero, entropy approaches a minimum (zero for a perfect crystal). This law is less frequently tested but when it appears, the question is usually: "Can absolute zero be reached?" The answer is no — and understanding why is the key concept.</p>`,
      category: 'physics',
      examLabels: ['NEET', 'JEE'],
      difficulty: 'intermediate',
      series: 'Electrostatics Mastery',
      seriesIndex: 2,
      seriesTotal: 3,
      featured: false,
      trending: false,
      author: 'Abhinav Kashyap',
      date: '2025-12-10',
      readTime: 7,
      tags: ['thermodynamics', 'physics', 'neet', 'jee', 'laws-of-thermodynamics']
    }
  ];

  /* ── 3. QUIZ DATA ── */
  const QUIZ_QUESTIONS = {
    student: [
      { q: 'When facing a difficult numerical problem in an exam, what do you typically do?', opts: ['Skip it immediately', 'Try for a few seconds then skip', 'Attempt systematically with what I know', 'Panic and move on'] },
      { q: 'How do you handle study sessions when you\'re not in the mood?', opts: ['I skip studying entirely', 'I study but very distracted', 'I switch to lighter revision', 'I push through with a plan'] },
      { q: 'After a mock test, what\'s your first reaction?', opts: ['Check only the total score', 'Feel anxious about mistakes', 'Analyze wrong answers by topic', 'Compare with peers'] },
      { q: 'How organized is your study material?', opts: ['Very scattered', 'Somewhat organized', 'Structured by subject and chapter', 'I rely on memory only'] },
      { q: 'When a teacher explains something you don\'t understand, you:', opts: ['Stay quiet and move on', 'Google it later', 'Ask immediately for clarification', 'Note it down and ask after class'] },
      { q: 'How many hours of focused study can you do in a day?', opts: ['Less than 2', '2-4 hours', '4-6 hours', 'More than 6'] },
      { q: 'Do you have a fixed daily study routine?', opts: ['No routine at all', 'Loose routine, often broken', 'Fairly consistent routine', 'Strict, timed schedule'] },
      { q: 'How do you handle exam anxiety?', opts: ['It severely affects my performance', 'It slows me down a bit', 'I manage with breathing techniques', 'I rarely feel anxious'] },
      { q: 'When studying, how often do you take breaks?', opts: ['Rarely — I study until exhausted', 'When I feel tired', 'Every 45-60 minutes', 'I use a timer/Pomodoro'] },
      { q: 'What best describes your current preparation level?', opts: ['Just starting', 'Covered some syllabus', 'Mostly through, need revision', 'Confident and doing mock tests'] }
    ],
    parent: [
      { q: 'How involved are you in your child\'s daily study routine?', opts: ['Not involved at all', 'Occasionally check in', 'Regularly monitor progress', 'Actively plan study schedules'] },
      { q: 'Does your child discuss academic difficulties with you?', opts: ['Never', 'Rarely', 'Sometimes', 'Openly and regularly'] },
      { q: 'How does your child react to low test scores?', opts: ['Gives up easily', 'Gets frustrated but tries again', 'Analyzes mistakes constructively', 'Becomes overly anxious'] },
      { q: 'Does your child have a distraction problem (phone, games, social media)?', opts: ['Severe — major concern', 'Moderate — needs guidance', 'Mild — mostly managed', 'Minimal — very disciplined'] },
      { q: 'What type of coaching environment works best for your child?', opts: ['Large classroom', 'Online recorded lectures', 'Small group with personal attention', 'One-on-one tutoring'] },
      { q: 'Has your child ever expressed wanting to quit preparation?', opts: ['Frequently', 'Occasionally during stress', 'Once or twice', 'Never'] },
      { q: 'How well does your child manage time between school and competitive exam prep?', opts: ['Poorly — always behind', 'Struggles but manages', 'Reasonably well', 'Excellent time management'] },
      { q: 'Is your child receiving any form of mental health or stress support?', opts: ['No, and it\'s needed', 'No, but seems fine', 'Informal support from family', 'Professional guidance'] },
      { q: 'How does your child perform in timed test conditions vs practice?', opts: ['Much worse under pressure', 'Slightly worse', 'About the same', 'Performs better under pressure'] },
      { q: 'What is your primary concern about your child\'s preparation?', opts: ['Academic performance', 'Mental well-being', 'Lack of direction/motivation', 'Finding the right coaching'] }
    ]
  };

  const QUIZ_INSIGHTS = {
    student: [
      { range: [0, 15], label: 'Foundation Rebuild', emoji: '🛠️', desc: 'Your diagnostic suggests foundational gaps in study habits and exam strategy. A structured mentorship program with consistent tracking can transform your approach within 8 weeks.' },
      { range: [16, 25], label: 'Strategic Pivot Needed', emoji: '🔄', desc: 'You have awareness but inconsistency. The micro-batch format with real-time error mapping can close the gap between knowing what to do and actually doing it.' },
      { range: [26, 35], label: 'Optimization Phase', emoji: '📈', desc: 'Strong foundation with room for refinement. Psychometric counseling and targeted doubt-clearing can push you from good to exceptional.' },
      { range: [36, 40], label: 'Peak Performance Track', emoji: '🏆', desc: 'Excellent self-awareness and discipline. The Elite micro-batch (5 students) with advanced test simulation and error analysis is your ideal track.' }
    ],
    parent: [
      { range: [0, 15], label: 'Intervention Recommended', emoji: '⚠️', desc: 'Your child may benefit from structured mentorship with psychometric support. Early intervention with the right coaching environment can prevent burnout and build sustainable habits.' },
      { range: [16, 25], label: 'Guided Development', emoji: '🌱', desc: 'Your child shows potential but needs consistent guidance. Micro-batch coaching with personal attention can provide the structure and motivation they need.' },
      { range: [26, 35], label: 'Targeted Enhancement', emoji: '🎯', desc: 'Good awareness from your side. A personalized coaching plan focusing on specific weak areas and regular progress updates can accelerate improvement.' },
      { range: [36, 40], label: 'Empowered Learner', emoji: '✨', desc: 'Your child demonstrates strong self-management. Prime Spirit\'s Elite track can provide the academic rigor and competitive edge needed for top percentiles.' }
    ]
  };

  /* ── 4. UTILITY FUNCTIONS ── */
  function $(sel, ctx) { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.from((ctx || document).querySelectorAll(sel)); }
  function debounce(fn, ms) { let t; return function (...args) { clearTimeout(t); t = setTimeout(() => fn.apply(this, args), ms); }; }
  function formatDate(d) { return new Date(d).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' }); }

  /* ── 5. ANALYTICS ── */
  function trackEvent(name, params) {
    if (typeof gtag === 'function') gtag('event', name, params || {});
  }
  function initTracking() {
    // CTA clicks
    document.addEventListener('click', function (e) {
      var el = e.target.closest('[data-track]');
      if (el) trackEvent(el.dataset.track, { event_category: 'cta', event_label: el.textContent.trim().substring(0, 60) });
    });
    // Scroll depth
    var tracked = {};
    window.addEventListener('scroll', debounce(function () {
      var pct = Math.round((window.scrollY + window.innerHeight) / document.documentElement.scrollHeight * 100);
      CONFIG.scrollTrackThresholds.forEach(function (t) { if (pct >= t && !tracked[t]) { tracked[t] = true; trackEvent('scroll_depth', { percent: t }); } });
    }, 200));
  }

  /* ── 6. NAVIGATION ── */
  function initNav() {
    var toggle = ('#menuToggle');
    var nav = $('#mainNav');
    if (!toggle || !nav) return;
    toggle.addEventListener('click', function () {
      var open = nav.classList.toggle('active');
      toggle.setAttribute('aria-expanded', open);
      toggle.querySelector('i').className = open ? 'fas fa-times' : 'fas fa-bars';
    });
    // Close on link click (mobile)
    $$$$('a', nav).forEach(function (a) { a.addEventListener('click', function () { nav.classList.remove('active'); toggle.setAttribute('aria-expanded', 'false'); toggle.querySelector('i').className = 'fas fa-bars'; }); });
    // Close on outside click
    document.addEventListener('click', function (e) { if (!nav.contains(e.target) && !toggle.contains(e.target) && nav.classList.contains('active')) { nav.classList.remove('active'); toggle.setAttribute('aria-expanded', 'false'); toggle.querySelector('i').className = 'fas fa-bars'; } });
  }

  /* ── 7. POONAM DROPDOWN ── */
  function initPoonamDropdown() {
    var trigger = $('#poonamNavTrigger');
    var dd = $('#poonamDropdown');
    var learn = $('#poonamLearnMore');
    if (!trigger || !dd) return;
    trigger.addEventListener('click', function (e) {
      e.stopPropagation();
      if (window.innerWidth <= 1180) { var target = $('#poonam-foundation'); if (target) target.scrollIntoView({ behavior: 'smooth' }); return; }
      dd.classList.toggle('open');
      trigger.classList.toggle('active');
      trigger.setAttribute('aria-expanded', dd.classList.contains('open'));
    });
    document.addEventListener('click', function (e) { if (!dd.contains(e.target) && !trigger.contains(e.target)) { dd.classList.remove('open'); trigger.classList.remove('active'); trigger.setAttribute('aria-expanded', 'false'); } });
    if (learn) learn.addEventListener('click', function () { dd.classList.remove('open'); trigger.classList.remove('active'); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && dd.classList.contains('open')) { dd.classList.remove('open'); trigger.classList.remove('active'); trigger.focus(); } });
  }

  /* ── 8. SEARCH ── */
  function initSearch() {
    var toggle = $('#searchToggle');
    var overlay = $('#searchOverlay');
    var input = $('#searchInput');
    var results = $('#searchResults');
    var closeBtn = $('#searchClose');
    if (!toggle || !overlay) return;

    var searchIndex = [
      { title: 'Elite Micro-Batch', section: 'Programs', href: '#courses', text: 'max 5 students personalized coaching neet jee iat' },
      { title: 'Advanced Cohort', section: 'Programs', href: '#courses', text: 'max 10 students boards cuet coaching' },
      { title: 'Poonam Foundation', section: 'Programs', href: '#poonam-foundation', text: 'affordable class 6 7 8 maths science 999 rupees' },
      { title: 'NEET UG Notes', section: 'Notes Vault', href: '#notes-vault', text: 'neet biology physics chemistry notes download' },
      { title: 'JEE Mains Notes', section: 'Notes Vault', href: '#notes-vault', text: 'jee maths physics chemistry notes download' },
      { title: 'FAQ', section: 'Info', href: '#faq', text: 'frequently asked questions batch size fee structure refund' },
      { title: 'Student Reviews', section: 'Info', href: '#testimonials', text: 'testimonials reviews ratings students parents' },
      { title: 'Book Free Consultation', section: 'Contact', href: '#contact', text: 'enquiry form book demo consultation phone whatsapp' },
      { title: 'PrimeScore Calculator', section: 'Tools', href: 'primescore/', text: 'score calculator rank predictor percentile' },
      { title: 'PrimeTestQ Assessment', section: 'Tools', href: 'primetestq/index.html', text: 'free test assessment quiz practice questions' },
      { title: 'NEET Coaching Bengaluru', section: 'City Pages', href: 'city/neet-bengaluru.html', text: 'neet coaching bengaluru bangalore karnataka medical' },
      { title: 'JEE Coaching Bengaluru', section: 'City Pages', href: 'city/jee-bengaluru.html', text: 'jee coaching bengaluru bangalore karnataka engineering' },
      { title: 'NEET Coaching Hyderabad', section: 'City Pages', href: 'city/neet-hyderabad.html', text: 'neet coaching hyderabad telangana medical' },
      { title: 'CUET Coaching Hyderabad', section: 'City Pages', href: 'city/cuet-hyderabad.html', text: 'cuet coaching hyderabad telangana university entrance' },
    ];

    BLOG_POSTS.forEach(function (p) {
      searchIndex.push({ title: p.title, section: 'Blog', href: '#blog-hub', text: p.tags.join(' ') + ' ' + p.category + ' ' + p.examLabels.join(' ') + ' ' + p.excerpt.toLowerCase() });
    });

    function doSearch(q) {
      if (!q || q.length < 2) { results.innerHTML = ''; return; }
      var lq = q.toLowerCase();
      var matches = searchIndex.filter(function (item) { return (item.title.toLowerCase().includes(lq) || item.text.includes(lq)); }).slice(0, 8);
      if (!matches.length) { results.innerHTML = '<div class="search-no-results">No results found for "' + q + '"</div>'; return; }
      results.innerHTML = matches.map(function (m) {
        return '<a class="search-result-item" href="' + m.href + '"><span class="search-result-section">' + m.section + '</span><strong>' + m.title + '</strong></a>';
      }).join('');
    }

    toggle.addEventListener('click', function () {
      overlay.hidden = false;
      input.focus();
      trackEvent('search_open');
    });
    closeBtn.addEventListener('click', function () { overlay.hidden = true; input.value = ''; results.innerHTML = ''; });
    input.addEventListener('input', debounce(function () { doSearch(input.value); }, CONFIG.debounceMs));
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !overlay.hidden) { overlay.hidden = true; } });
    overlay.addEventListener('click', function (e) { if (e.target === overlay) { overlay.hidden = true; } });
    results.addEventListener('click', function (e) { if (e.target.closest('.search-result-item')) { overlay.hidden = true; trackEvent('search_click', { query: input.value }); } });
  }

  /* ── 9. SCROLL PROGRESS ── */
  function initScrollProgress() {
    var bar = $('#scrollProgress');
    var btt = $('#backToTop');
    if (!bar) return;
    window.addEventListener('scroll', debounce(function () {
      var pct = Math.round((window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100);
      bar.style.width = pct + '%';
      bar.setAttribute('aria-valuenow', pct);
      if (btt) btt.hidden = window.scrollY < 400;
    }, 50));
    if (btt) btt.addEventListener('click', function () { window.scrollTo({ top: 0, behavior: 'smooth' }); });
  }

  /* ── 10. BLOG SYSTEM ── */
  var blogState = { filter: 'all', page: 1, search: '', view: 'grid', currentPost: null, bookmarks: JSON.parse(localStorage.getItem('ps_bookmarks') || '[]'), comments: JSON.parse(localStorage.getItem('ps_comments') || '{}') };

  function getFilteredPosts() {
    var posts = BLOG_POSTS.slice();
    if (blogState.filter !== 'all') posts = posts.filter(function (p) { return p.category === blogState.filter; });
    if (blogState.search) { var sq = blogState.search.toLowerCase(); posts = posts.filter(function (p) { return p.title.toLowerCase().includes(sq) || p.excerpt.toLowerCase().includes(sq) || p.tags.some(function (t) { return t.includes(sq); }); }); }
    return posts;
  }

  function renderBlogGrid() {
    var container = $('#blogPostsContainer');
    var pag = $('#blogPagination');
    var featured = $('#featuredArticle');
    var trending = $('#trendingArticles');
    if (!container) return;

    var posts = getFilteredPosts();
    var perPage = CONFIG.blogPostsPerPage;
    var paged = posts.slice((blogState.page - 1) * perPage, blogState.page * perPage);

    // Featured
    if (featured) {
      var fp = blogState.filter === 'all' ? BLOG_POSTS.find(function (p) { return p.featured; }) : null;
      if (fp && !blogState.search) {
        featured.innerHTML = '<div class="featured-card" data-id="' + fp.id + '"><span class="featured-tag">Featured</span><div class="blog-card-meta">' + renderLabels(fp) + '</div><h3>' + fp.title + '</h3><p>' + fp.excerpt + '</p></div>';
        featured.style.display = '';
      } else { featured.style.display = 'none'; }
    }

    // Trending
    if (trending && blogState.filter === 'all' && !blogState.search) {
      var tp = BLOG_POSTS.filter(function (p) { return p.trending; }).slice(0, 4);
      trending.innerHTML = '<h3><i class="fas fa-fire" style="color:#ff6b6b;margin-right:6px"></i> Trending</h3><div class="trending-list">' + tp.map(function (p, i) { return '<div class="trending-chip" data-id="' + p.id + '"><span class="trending-rank">#' + (i + 1) + '</span>' + p.title + '</div>'; }).join('') + '</div>';
      trending.style.display = '';
    } else if (trending) { trending.style.display = 'none'; }

    // Grid
    container.innerHTML = paged.map(function (p) {
      var isBkm = blogState.bookmarks.includes(p.id);
      return '<div class="course-card blog-card animate-in" data-id="' + p.id + '"><div class="blog-card-meta">' + renderLabels(p) + '</div><h3 class="blog-card-title">' + p.title + '</h3><p>' + p.excerpt.substring(0, 120) + '...</p><div style="display:flex;align-items:center;gap:12px;margin-top:auto"><span class="blog-card-date">' + formatDate(p.date) + '</span><span class="blog-card-readtime">' + p.readTime + ' min</span><button class="blog-card-bookmark ' + (isBkm ? 'bookmarked' : '') + '" data-bookmark="' + p.id + '" aria-label="Bookmark"><i class="' + (isBkm ? 'fas' : 'far') + ' fa-bookmark"></i></button></div></div>';
    }).join('');

    // Pagination
    if (pag) {
      var totalPages = Math.ceil(posts.length / perPage);
      if (totalPages <= 1) { pag.innerHTML = ''; return; }
      var html = '<button class="page-btn" data-page="' + (blogState.page - 1) + '"' + (blogState.page <= 1 ? ' disabled' : '') + ' aria-label="Previous page">&laquo;</button>';
      for (var i = 1; i <= totalPages; i++) html += '<button class="page-btn' + (i === blogState.page ? ' active' : '') + '" data-page="' + i + '">' + i + '</button>';
      html += '<button class="page-btn" data-page="' + (blogState.page + 1) + '"' + (blogState.page >= totalPages ? ' disabled' : '') + ' aria-label="Next page">&raquo;</button>';
      pag.innerHTML = html;
    }

    initAnimateIn();
  }

  function renderLabels(p) {
    var h = '<span class="blog-label blog-label-category">' + p.category + '</span>';
    h += '<span class="blog-label blog-label-difficulty" data-diff="' + p.difficulty + '">' + p.difficulty + '</span>';
    p.examLabels.forEach(function (e) { h += '<span class="blog-label blog-label-exam">' + e + '</span>'; });
    return h;
  }

  function showPost(id) {
    var post = BLOG_POSTS.find(function (p) { return p.id === id; });
    if (!post) return;
    blogState.currentPost = post;
    blogState.view = 'detail';
    var grid = $('#blogPostsContainer');
    var detail = $('#blogPostDetail');
    var featured = $('#featuredArticle');
    var trending = $('#trendingArticles');
    var pag = $('#blogPagination');
    var filters = $('.blog-filters');
    var searchWrap = $('.blog-search-wrap');
    if (grid) grid.style.display = 'none';
    if (featured) featured.style.display = 'none';
    if (trending) trending.style.display = 'none';
    if (pag) pag.style.display = 'none';
    if (filters) filters.style.display = 'none';
    if (searchWrap) searchWrap.style.display = 'none';
    if (detail) detail.hidden = false;

    // Header
    var header = $('#postHeader');
    if (header) {
      var isBkm = blogState.bookmarks.includes(post.id);
      header.innerHTML = '<div class="blog-card-meta">' + renderLabels(post) + '<span class="blog-card-date">' + formatDate(post.date) + '</span><span class="blog-card-readtime">' + post.readTime + ' min read</span></div><h1>' + post.title + '</h1><p class="post-excerpt">' + post.excerpt + '</p>';
    }

    // Body
    var body = $('#postBody');
    if (body) body.innerHTML = post.content;

    // TOC
    generateTOC();

    // Bookmark/Share buttons
    var bBtn = $('#bookmarkBtn');
    if (bBtn) { var bkm = blogState.bookmarks.includes(post.id); bBtn.classList.toggle('bookmarked', bkm); bBtn.querySelector('span').textContent = bkm ? 'Bookmarked' : 'Bookmark'; bBtn.querySelector('i').className = bkm ? 'fas fa-bookmark' : 'far fa-bookmark'; }

    // Series nav
    renderSeriesNav(post);

    // Prev/Next
    renderPrevNext(post);

    // Related
    renderRelated(post);

    // Comments
    renderComments(post.id);

    // Reading progress
    initReadingProgress();

    trackEvent('blog_post_view', { post_id: post.id, post_title: post.title, post_category: post.category });
    window.scrollTo({ top: detail.offsetTop - 80, behavior: 'smooth' });
  }

  function hidePost() {
    blogState.view = 'grid';
    blogState.currentPost = null;
    var grid = $('#blogPostsContainer');
    var detail = $('#blogPostDetail');
    var filters = $('.blog-filters');
    var searchWrap = $('.blog-search-wrap');
    if (grid) grid.style.display = '';
    if (detail) detail.hidden = true;
    if (filters) filters.style.display = '';
    if (searchWrap) searchWrap.style.display = '';
    renderBlogGrid();
  }

  function generateTOC() {
    var body = $('#postBody');
    var tocList = $('#tocList');
    var tocWrap = $('#postToc');
    if (!body || !tocList) return;
    var headings = $$('h2[id], h3[id]', body);
    if (headings.length < 2) { if (tocWrap) tocWrap.style.display = 'none'; return; }
    if (tocWrap) tocWrap.style.display = '';
    tocList.innerHTML = headings.map(function (h) { return '<li><a href="#' + h.id + '">' + h.textContent + '</a></li>'; }).join('');
    // Scroll spy
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var link = tocList.querySelector('a[href="#' + entry.target.id + '"]');
        if (link) link.classList.toggle('active', entry.isIntersecting);
      });
    }, { rootMargin: '-80px 0px -70% 0px' });
    headings.forEach(function (h) { observer.observe(h); });
  }

  function initReadingProgress() {
    var bar = ('#readingProgressBar');
    var detail = $('#blogPostDetail');
    if (!bar || !detail) return;
    var handler = debounce(function () {
      var rect = detail.getBoundingClientRect();
      var total = detail.offsetHeight - window.innerHeight;
      var scrolled = -rect.top + 80;
      var pct = Math.max(0, Math.min(100, Math.round((scrolled / total) * 100)));
      bar.style.width = pct + '%';
    }, 30);
    window.addEventListener('scroll', handler);
    // Store for cleanup
    blogState._progressHandler = handler;
  }

  function renderSeriesNav(post) {
    var el = $('#postSeriesNav');
    if (!el || !post.series) { if (el) el.style.display = 'none'; return; }
    var seriesPosts = BLOG_POSTS.filter(function (p) { return p.series === post.series; }).sort(function (a, b) { return a.seriesIndex - b.seriesIndex; });
    if (seriesPosts.length < 2) { el.style.display = 'none'; return; }
    el.style.display = '';
    el.innerHTML = '<h4>Series: ' + post.series + '</h4><div class="series-list">' + seriesPosts.map(function (p) {
      if (p.id === post.id) return '<div class="series-item current">' + p.seriesIndex + '. ' + p.title + ' (current)</div>';
      return '<div class="series-item"><a href="#" data-id="' + p.id + '">' + p.seriesIndex + '. ' + p.title + '</a></div>';
    }).join('') + '</div>';
  }

  function renderPrevNext(post) {
    var el = $('#postPrevNext');
    if (!el) return;
    var sorted = BLOG_POSTS.slice().sort(function (a, b) { return new Date(b.date) - new Date(a.date); });
    var idx = sorted.findIndex(function (p) { return p.id === post.id; });
    var prev = sorted[idx + 1];
    var next = sorted[idx - 1];
    el.innerHTML = (prev ? '<a href="#" data-id="' + prev.id + '"><span class="post-nav-label">← Previous</span><span class="post-nav-title">' + prev.title + '</span></a>' : '<div></div>') + (next ? '<a href="#" data-id="' + next.id + '" class="post-nav-next"><span class="post-nav-label">Next →</span><span class="post-nav-title">' + next.title + '</span></a>' : '<div></div>');
  }

  function renderRelated(post) {
    var grid = $('#relatedGrid');
    if (!grid) return;
    var related = BLOG_POSTS.filter(function (p) { return p.id !== post.id && (p.category === post.category || p.examLabels.some(function (e) { return post.examLabels.includes(e); })); }).slice(0, 3);
    grid.innerHTML = related.map(function (p) {
      return '<div class="course-card blog-card" data-id="' + p.id + '" style="padding:20px"><div class="blog-card-meta">' + renderLabels(p) + '</div><h3 style="font-size:0.95rem">' + p.title + '</h3><span class="blog-card-date">' + formatDate(p.date) + '</span></div>';
    }).join('');
  }

  function renderComments(postId) {
    var container = $('#commentsContainer');
    if (!container) return;
    var comments = blogState.comments[postId] || [];
    container.innerHTML = comments.length ? comments.map(function (c) {
      return '<div class="comment-item"><div class="comment-author">' + c.author + '</div><div class="comment-text">' + c.text + '</div><div class="comment-time">' + c.time + '</div></div>';
    }).join('') : '<p style="color:var(--text-muted);font-size:0.9rem">No comments yet. Be the first to share your thoughts.</p>';
  }

  function initBlog() {
    var container = $('#blogPostsContainer');
    var pag = $('#blogPagination');
    var featured = $('#featuredArticle');
    var trending = $('#trendingArticles');
    if (!container) return;

    // Filters
    $$$$('.filter-btn').forEach(function (btn) {
      btn.addEventListener('click', function () {
        $$('.filter-btn').forEach(function (b) { b.classList.remove('active'); });
        btn.classList.add('active');
        blogState.filter = btn.dataset.filter;
        blogState.page = 1;
        renderBlogGrid();
        trackEvent('blog_filter', { filter: blogState.filter });
      });
    });

    // Blog search
    var searchInput = ('#blogSearchInput');
    if (searchInput) searchInput.addEventListener('input', debounce(function () { blogState.search = searchInput.value; blogState.page = 1; renderBlogGrid(); }, CONFIG.debounceMs));

    // Card clicks (delegation)
    document.addEventListener('click', function (e) {
      var card = e.target.closest('.blog-card[data-id], .featured-card[data-id], .trending-chip[data-id]');
      if (card && !e.target.closest('.blog-card-bookmark')) { showPost(card.dataset.id); return; }
      var relatedCard = e.target.closest('.related-grid .blog-card[data-id]');
      if (relatedCard) { showPost(relatedCard.dataset.id); return; }
      var seriesLink = e.target.closest('.series-item a[data-id]');
      if (seriesLink) { e.preventDefault(); showPost(seriesLink.dataset.id); return; }
      var navLink = e.target.closest('.post-prevnext a[data-id]');
      if (navLink) { e.preventDefault(); showPost(navLink.dataset.id); return; }
    });

    // Pagination
    if (pag) pag.addEventListener('click', function (e) {
      var btn = e.target.closest('.page-btn');
      if (btn && !btn.disabled) { blogState.page = parseInt(btn.dataset.page); renderBlogGrid(); window.scrollTo({ top: $('#blog-hub').offsetTop - 80, behavior: 'smooth' }); }
    });

    // Back button
    var backBtn = $('#backToBlog');
    if (backBtn) backBtn.addEventListener('click', hidePost);

    // Bookmark
    document.addEventListener('click', function (e) {
      var btn = e.target.closest('[data-bookmark]');
      if (!btn) return;
      var id = btn.dataset.bookmark;
      var idx = blogState.bookmarks.indexOf(id);
      if (idx > -1) blogState.bookmarks.splice(idx, 1); else blogState.bookmarks.push(id);
      localStorage.setItem('ps_bookmarks', JSON.stringify(blogState.bookmarks));
      renderBlogGrid();
      trackEvent('blog_bookmark', { post_id: id, action: idx > -1 ? 'remove' : 'add' });
    });

    // Bookmark (detail view)
    var bookmarkBtn = $('#bookmarkBtn');
    if (bookmarkBtn) bookmarkBtn.addEventListener('click', function () {
      if (!blogState.currentPost) return;
      var id = blogState.currentPost.id;
      var idx = blogState.bookmarks.indexOf(id);
      if (idx > -1) blogState.bookmarks.splice(idx, 1); else blogState.bookmarks.push(id);
      localStorage.setItem('ps_bookmarks', JSON.stringify(blogState.bookmarks));
      var bkm = blogState.bookmarks.includes(id);
      bookmarkBtn.classList.toggle('bookmarked', bkm);
      bookmarkBtn.querySelector('span').textContent = bkm ? 'Bookmarked' : 'Bookmark';
      bookmarkBtn.querySelector('i').className = bkm ? 'fas fa-bookmark' : 'far fa-bookmark';
    });

    // Share
    var shareBtn = $('#shareBtn');
    if (shareBtn) shareBtn.addEventListener('click', function () {
      if (!blogState.currentPost) return;
      var url = window.location.origin + window.location.pathname + '#blog-' + blogState.currentPost.slug;
      if (navigator.share) { navigator.share({ title: blogState.currentPost.title, text: blogState.currentPost.excerpt, url: url }); }
      else { navigator.clipboard.writeText(url); shareBtn.querySelector('span').textContent = 'Link Copied!'; setTimeout(function () { shareBtn.querySelector('span').textContent = 'Share'; }, 2000); }
      trackEvent('blog_share', { post_id: blogState.currentPost.id });
    });

    // Comments
    var commentForm = $('#commentForm');
    if (commentForm) commentForm.addEventListener('submit', function (e) {
      e.preventDefault();
      if (!blogState.currentPost) return;
      var textarea = $('#commentText');
      var text = textarea.value.trim();
      if (!text) return;
      var id = blogState.currentPost.id;
      if (!blogState.comments[id]) blogState.comments[id] = [];
      blogState.comments[id].push({ author: 'Guest', text: text, time: new Date().toLocaleString('en-IN') });
      localStorage.setItem('ps_comments', JSON.stringify(blogState.comments));
      textarea.value = '';
      renderComments(id);
      trackEvent('blog_comment', { post_id: id });
    });

    renderBlogGrid();
  }

  /* ── 11. FAQ ── */
  function initFAQ() {
    $$$$('.faq-question').forEach(function (btn) {
      btn.addEventListener('click', function () {
        var item = btn.closest('.faq-item');
        var isOpen = item.classList.contains('open');
        // Close all
        $$('.faq-item.open').forEach(function (i) { i.classList.remove('open'); i.querySelector('.faq-question').setAttribute('aria-expanded', 'false'); });
        if (!isOpen) { item.classList.add('open'); btn.setAttribute('aria-expanded', 'true'); }
      });
    });
  }

  /* ── 12. QUIZ ── */
  function initQuiz() {
    var roleStudent = ('#btnRoleStudent');
    var roleParent = $('#btnRoleParent');
    var roleWindow = $('#roleSelectWindow');
    var quizWindow = $('#quizWindow');
    var resultWindow = $('#resultWindow');
    var nextBtn = $('#nextBtn');
    var restartBtn = $('#restartBtn');
    if (!roleStudent || !roleParent) return;

    var state = { role: '', current: 0, score: 0, answers: [] };

    function startQuiz(role) {
      state = { role: role, current: 0, score: 0, answers: [] };
      roleWindow.style.display = 'none';
      quizWindow.hidden = false;
      resultWindow.hidden = true;
      nextBtn.hidden = true;
      $('#quizTrackIdentity').textContent = role === 'student' ? 'Student Profile' : 'Parent Profile';
      renderQuestion();
      trackEvent('quiz_start', { role: role });
    }

    function renderQuestion() {
      var questions = QUIZ_QUESTIONS[state.role];
      var q = questions[state.current];
      $('#quizProgressText').textContent = 'Question ' + (state.current + 1) + ' of ' + questions.length;
      $('#quizProgressFill').style.width = ((state.current / questions.length) * 100) + '%';
      $('#questionText').textContent = q.q;
      var btns = $('#answerButtons');
      btns.innerHTML = q.opts.map(function (opt, i) { return '<button class="quiz-btn" data-score="' + i + '" type="button">' + opt + '</button>'; }).join('');
    }

    document.addEventListener('click', function (e) {
      var btn = e.target.closest('#answerButtons .quiz-btn');
      if (!btn) return;
      $$$$('#answerButtons .quiz-btn').forEach(function (b) { b.style.opacity = '0.5'; b.disabled = true; });
      btn.style.opacity = '1';
      btn.style.borderColor = 'var(--accent)';
      state.score += parseInt(btn.dataset.score);
      state.answers.push(parseInt(btn.dataset.score));
      nextBtn.hidden = false;
    });

    if (nextBtn) nextBtn.addEventListener('click', function () {
      state.current++;
      if (state.current >= QUIZ_QUESTIONS[state.role].length) { showResults(); return; }
      nextBtn.hidden = true;
      renderQuestion();
    });

    function showResults() {
      quizWindow.hidden = true;
      resultWindow.hidden = false;
      nextBtn.hidden = true;
      var insights = QUIZ_INSIGHTS[state.role];
      var result = insights.find(function (r) { return state.score >= r.range[0] && state.score <= r.range[1]; }) || insights[insights.length - 1];
      $('#badgeDisplay').textContent = result.emoji;
      $('#psychMetricsOutput').innerHTML = '<strong style="color:var(--accent);font-family:var(--font-head)">' + result.label + '</strong><br><br>' + result.desc + '<br><br><span style="font-family:var(--font-mono);font-size:0.8rem;color:var(--text-muted)">Diagnostic Score: ' + state.score + '/' + (QUIZ_QUESTIONS[state.role].length * 3) + '</span>';
      trackEvent('quiz_complete', { role: state.role, score: state.score, result: result.label });
    }

    roleStudent.addEventListener('click', function () { startQuiz('student'); });
    roleParent.addEventListener('click', function () { startQuiz('parent'); });
    if (restartBtn) restartBtn.addEventListener('click', function () { roleWindow.style.display = ''; quizWindow.hidden = true; resultWindow.hidden = true; });
  }

  /* ── 13. CONTACT FORM ── */
  function initContactForm() {
    var form = $('#contactForm');
    if (!form) return;
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = $('#studentName').value.trim();
      var email = $('#studentEmail').value.trim();
      var phone = $('#studentPhone').value.trim();
      if (!name || !email || !phone) { alert('Please fill in all required fields.'); return; }
      trackEvent('form_submit', { form_type: 'contact', student_name: name });
      // Build WhatsApp message
      var city = ($('#studentCity') || {}).value || 'Not specified';
      var cls = ($('#studentClass') || {}).value || 'Not specified';
      var exam = ($('#studentExam') || {}).value || 'Not specified';
      var msg = encodeURIComponent('New Enquiry:\nName: ' + name + '\nEmail: ' + email + '\nPhone: ' + phone + '\nCity: ' + city + '\nClass: ' + cls + '\nTarget: ' + exam);
      // Show success
      form.innerHTML = '<div class="form-success"><i class="fas fa-check-circle"></i><h3>Thank you, ' + name + '!</h3><p style="margin-top:8px;color:var(--text-sec)">We\'ll contact you within 24 hours. For immediate assistance:</p><a href="https://wa.me/919700627812?text=' + msg + '" class="btn btn-whatsapp" target="_blank" rel="noopener noreferrer" style="margin-top:16px"><i class="fab fa-whatsapp"></i> WhatsApp Us Now</a></div>';
    });
  }

  /* ── 14. AUTH MODAL ── */
  function initAuthModal() {
    var modal = $('#authModal');
    var closeBtn = $('#btnCloseModal');
    var loginBtn = $('#btnStudentLogin');
    var parentBtn = $('#btnParentLogin');
    if (!modal) return;

    function show(view) {
      modal.hidden = false;
      ['Login', 'Signup', 'Forgot'].forEach(function (v) { var el = $('#authView' + v); if (el) el.hidden = v !== view; });
      document.body.style.overflow = 'hidden';
    }
    function hide() { modal.hidden = true; document.body.style.overflow = ''; }

    if (loginBtn) loginBtn.addEventListener('click', function () { show('Login'); });
    if (parentBtn) parentBtn.addEventListener('click', function () { show('Login'); });
    if (closeBtn) closeBtn.addEventListener('click', hide);
    modal.addEventListener('click', function (e) { if (e.target === modal) hide(); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && !modal.hidden) hide(); });

    var gotoSignup = $('#btnGotoSignup');
    var gotoLogin = $('#btnGotoLogin');
    var gotoLogin2 = $('#btnGotoLogin2');
    var gotoForgot = $('#btnGotoForgot');
    if (gotoSignup) gotoSignup.addEventListener('click', function () { show('Signup'); });
    if (gotoLogin || gotoLogin2) { if (gotoLogin) gotoLogin.addEventListener('click', function () { show('Login'); }); if (gotoLogin2) gotoLogin2.addEventListener('click', function () { show('Login'); }); }
    if (gotoForgot) gotoForgot.addEventListener('click', function () { show('Forgot'); });

    // Password strength
    var passInput = $('#signupPass');
    var bar = $('#strengthBar');
    var feedback = $('#strengthFeedback');
    if (passInput && bar) {
      passInput.addEventListener('input', function () {
        var v = passInput.value;
        var s = 0;
        if (v.length >= 8) s++;
        if (/[A-Z]/.test(v)) s++;
        if (/[0-9]/.test(v)) s++;
        if (/[^A-Za-z0-9]/.test(v)) s++;
        bar.style.width = (s * 25) + '%';
        bar.style.background = s < 2 ? '#ff4444' : s < 3 ? '#ffb700' : '#00df89';
        feedback.textContent = ['Too weak', 'Weak', 'Fair', 'Strong', 'Very strong'][s];
      });
    }
  }

  /* ── 15. NOTES VAULT ── */
  function initNotesVault() {
    $$('.download-btn-style').forEach(function (btn) {
      btn.addEventListener('click', function () {
        trackEvent('notes_download_attempt', { notes_type: btn.dataset.notes });
        // Check if user is "logged in" (simple localStorage check)
        var loggedIn = localStorage.getItem('ps_user');
        if (!loggedIn) { var modal = ('#authModal'); if (modal) { modal.hidden = false; document.body.style.overflow = 'hidden'; } }
        else { alert('Download would start for: ' + btn.dataset.notes); }
      });
    });
  }

  /* ── 16. SCROLL ANIMATIONS ── */
  function initAnimateIn() {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    $$$$('.animate-in:not(.visible)').forEach(function (el) { observer.observe(el); });
    // Add animate-in to cards that don't have it
    $$('.course-card:not(.animate-in), .testimonial-card:not(.animate-in)').forEach(function (el, i) { el.classList.add('animate-in', 'stagger-' + ((i % 6) + 1)); observer.observe(el); });
  }

  /* ── 17. KEYBOARD NAV ── */
  function initKeyboardNav() {
    // Trap focus in modals
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Tab') return;
      var modal = !('#authModal').hidden ? $('#authModal .auth-modal-card') : null;
      var search = !$('#searchOverlay').hidden ? $('#searchOverlay') : null;
      var trap = modal || search;
      if (!trap) return;
      var focusable = $$$$('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])', trap);
      if (!focusable.length) return;
      var first = focusable[0];
      var last = focusable[focusable.length - 1];
      if (e.shiftKey) { if (document.activeElement === first) { e.preventDefault(); last.focus(); } }
      else { if (document.activeElement === last) { e.preventDefault(); first.focus(); } }
    });
  }

  /* ── 18. INIT ── */
  function init() {
    initNav();
    initPoonamDropdown();
    initSearch();
    initScrollProgress();
    initBlog();
    initFAQ();
    initQuiz();
    initContactForm();
    initAuthModal();
    initNotesVault();
    initAnimateIn();
    initKeyboardNav();
    initTracking();
  }

  if (document.readyState === 'loading') { document.addEventListener('DOMContentLoaded', init); }
  else { init(); }

})();

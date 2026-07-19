/*==========================================================
  PRIME SPIRIT MENTORS — BLOG.JS
  Matches repo: blog/blog.js
  Fetches: blog/posts.json
  Renders into: #blog-posts-container
  Wires: .filter-btn[data-filter] buttons
  Also wires: #featuredArticle, #trendingArticles,
              #blogPagination, #blogSearchInput (optional)
==========================================================*/
document.addEventListener("DOMContentLoaded", function () {
  "use strict";

  var POSTS_PER_PAGE = 6;
  var DEBOUNCE_MS = 180;
  var BOOKMARK_KEY = "ps_bookmarks";

  /* ── CATEGORY MAP ── */
  var CATEGORY_MAP = {
    "Physics \u00b7 NEET":      "physics",
    "Physics":                  "physics",
    "Chemistry":                "chemistry",
    "Biology":                  "biology",
    "Maths":                    "maths",
    "Economics":                "economics",
    "Coaching Strategy":        "strategy",
    "NEET Strategy":            "strategy",
    "JEE Strategy":             "strategy",
    "Admissions Guide":         "strategy",
    "Science Scholarships":     "strategy",
    "General":                  "strategy"
  };

  /* ── HELPERS ── */
  function debounce(fn, ms) {
    var t;
    return function () { var a = arguments, s = this; clearTimeout(t); t = setTimeout(function () { fn.apply(s, a); }, ms); };
  }

  function esc(str) {
    var d = document.createElement("div");
    d.appendChild(document.createTextNode(str || ""));
    return d.innerHTML;
  }

  function truncate(str, max) {
    if (!str) return "";
    return str.length > max ? str.substring(0, max).replace(/\s+\S*$/, "") + "\u2026" : str;
  }

  function formatDate(iso) {
    try { return new Date(iso + "T00:00:00").toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" }); }
    catch (e) { return iso; }
  }

  function detectExams(title) {
    var t = title.toLowerCase(), l = [];
    if (t.indexOf("neet") > -1) l.push("NEET");
    if (t.indexOf("jee") > -1) l.push("JEE");
    if (t.indexOf("cuet") > -1) l.push("CUET");
    if (t.indexOf("iat") > -1) l.push("IAT");
    if (t.indexOf("nest") > -1) l.push("NEST");
    if (t.indexOf("cbse") > -1 || t.indexOf("icse") > -1) l.push("Boards");
    return l.length ? l : ["General"];
  }

  function detectDiff(title, excerpt) {
    var c = (title + " " + excerpt).toLowerCase();
    if (/complete guide|step-by-step|crack|predictor|counselling|every .* need/.test(c)) return "advanced";
    if (/vs|honest|why .* fail|how .* helps|what changes|crisis/.test(c)) return "intermediate";
    if (/when should|signs|key differences|mistakes parents/.test(c)) return "beginner";
    return "intermediate";
  }

  function enrichPost(post) {
    return {
      title: post.title,
      slug: post.slug,
      date: post.date,
      category: post.category,
      excerpt: post.excerpt,
      url: post.url,
      filterCategory: CATEGORY_MAP[post.category] || "strategy",
      examLabels: detectExams(post.title),
      difficulty: detectDiff(post.title, post.excerpt),
      readTime: Math.max(4, Math.min(15, Math.round(post.excerpt.split(/\s+/).length * 10 / 200))),
      id: post.slug
    };
  }

  /* ── STATE ── */
  var state = { allPosts: [], filter: "all", search: "", page: 1, bookmarks: [] };
  try { state.bookmarks = JSON.parse(localStorage.getItem(BOOKMARK_KEY) || "[]"); } catch (e) {}
  if (!Array.isArray(state.bookmarks)) state.bookmarks = [];

  /* ── DOM REFS ── */
  // Matches your original index.html exactly
  var container    = document.getElementById("blog-posts-container");
  var featuredEl   = document.getElementById("featuredArticle");
  var trendingEl   = document.getElementById("trendingArticles");
  var paginationEl = document.getElementById("blogPagination");
  var searchInput  = document.getElementById("blogSearchInput");

  if (!container) return;

  /* ── RENDER LABELS ── */
  function renderLabels(post) {
    var h = '<span class="blog-label blog-label-category">' + esc(post.filterCategory) + '</span>';
    h += '<span class="blog-label blog-label-difficulty" data-diff="' + post.difficulty + '">' + esc(post.difficulty) + '</span>';
    post.examLabels.forEach(function (l) { h += '<span class="blog-label blog-label-exam">' + esc(l) + '</span>'; });
    return h;
  }

  /* ── FILTER POSTS ── */
  function getFiltered() {
    var posts = state.allPosts.slice();
    if (state.filter !== "all") {
      posts = posts.filter(function (p) { return p.filterCategory === state.filter; });
    }
    if (state.search.length >= 2) {
      var q = state.search.toLowerCase();
      posts = posts.filter(function (p) {
        return p.title.toLowerCase().indexOf(q) > -1
            || p.excerpt.toLowerCase().indexOf(q) > -1
            || p.category.toLowerCase().indexOf(q) > -1;
      });
    }
    return posts;
  }

  /* ── RENDER FEATURED ── */
  function renderFeatured(posts) {
    if (!featuredEl) return;
    if (state.filter !== "all" || state.search || !posts.length) {
      featuredEl.style.display = "none";
      return;
    }
    featuredEl.style.display = "";
    var fp = posts[0];
    featuredEl.innerHTML =
      '<a href="' + esc(fp.url) + '" style="display:block;text-decoration:none;color:inherit;padding:28px;border-radius:12px;border:1px solid rgba(0,198,255,0.15);background:linear-gradient(135deg,rgba(0,198,255,0.04),rgba(0,112,243,0.04));transition:all 0.25s" onmouseover="this.style.transform=\'translateY(-4px)\'" onmouseout="this.style.transform=\'none\'">' +
        '<span style="display:inline-block;padding:3px 10px;background:#00C6FF;color:#000;border-radius:4px;font-size:0.7rem;font-weight:700;font-family:monospace;text-transform:uppercase;margin-bottom:10px">Featured</span>' +
        '<div class="blog-card-meta">' + renderLabels(fp) + '</div>' +
        '<h3 style="font-size:1.3rem;margin-bottom:8px">' + esc(fp.title) + '</h3>' +
        '<p style="color:#8b95ad;max-width:600px">' + esc(truncate(fp.excerpt, 200)) + '</p>' +
        '<span style="display:inline-block;margin-top:10px;font-size:0.82rem;color:#00C6FF">' + formatDate(fp.date) + ' \u00b7 ' + fp.readTime + ' min read</span>' +
      '</a>';
  }

  /* ── RENDER TRENDING ── */
  function renderTrending(posts) {
    if (!trendingEl) return;
    if (state.filter !== "all" || state.search) { trendingEl.style.display = "none"; return; }
    var tp = posts.slice(0, Math.min(5, posts.length));
    trendingEl.style.display = "";
    trendingEl.innerHTML =
      '<h3 style="font-size:1rem;color:#8b95ad;margin-bottom:12px;font-family:monospace;font-weight:400"><i class="fas fa-fire" style="color:#ff6b6b;margin-right:6px"></i> Trending</h3>' +
      '<div style="display:flex;gap:12px;overflow-x:auto;padding-bottom:8px">' +
        tp.map(function (p, i) {
          return '<a href="' + esc(p.url) + '" style="flex-shrink:0;display:flex;align-items:center;gap:8px;padding:10px 16px;background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);border-radius:8px;white-space:nowrap;font-size:0.85rem;color:#8b95ad;text-decoration:none;transition:all 0.2s" onmouseover="this.style.borderColor=\'#00C6FF\';this.style.color=\'#00C6FF\'" onmouseout="this.style.borderColor=\'rgba(255,255,255,0.08)\';this.style.color=\'#8b95ad\'">' +
            '<span style="font-family:monospace;font-weight:700;color:#00C6FF;font-size:0.75rem">#' + (i + 1) + '</span>' +
            esc(truncate(p.title, 55)) +
          '</a>';
        }).join("") +
      '</div>';
  }

  /* ── RENDER GRID ── */
  function renderGrid(posts) {
    var total = posts.length;
    var start = (state.page - 1) * POSTS_PER_PAGE;
    var paged = posts.slice(start, start + POSTS_PER_PAGE);

    if (!paged.length) {
      container.innerHTML =
        '<div style="text-align:center;padding:60px 0;color:#7a8499">' +
          '<i class="fas fa-search" style="font-size:2rem;display:block;margin-bottom:12px;opacity:0.35"></i>' +
          '<p>No articles match. Try a different filter or search term.</p>' +
        '</div>';
      if (paginationEl) paginationEl.innerHTML = "";
      return;
    }

    container.innerHTML = paged.map(function (post, idx) {
      var bk = state.bookmarks.indexOf(post.slug) > -1;
      return '<div class="course-card" data-category="' + esc(post.filterCategory) + '">' +
        '<div style="display:flex;flex-wrap:wrap;gap:6px;margin-bottom:12px">' + renderLabels(post) + '</div>' +
        '<h3><a href="' + esc(post.url) + '" style="color:inherit;text-decoration:none">' + esc(post.title) + '</a></h3>' +
        '<p>' + esc(truncate(post.excerpt, 140)) + '</p>' +
        '<div style="display:flex;align-items:center;gap:10px;margin-top:auto;flex-wrap:wrap">' +
          '<span style="font-size:0.75rem;color:#7a8499;font-family:monospace">' + formatDate(post.date) + '</span>' +
          '<span style="font-size:0.75rem;color:#7a8499;font-family:monospace">' + post.readTime + ' min</span>' +
          '<button class="blog-bookmark-btn ' + (bk ? 'bookmarked' : '') + '" data-bookmark="' + esc(post.slug) + '" style="color:' + (bk ? '#00C6FF' : '#7a8499') + ';background:none;border:none;cursor:pointer;padding:4px;font-size:0.85rem" aria-label="' + (bk ? 'Remove bookmark' : 'Bookmark') + '">' +
            '<i class="' + (bk ? 'fas' : 'far') + ' fa-bookmark"></i>' +
          '</button>' +
          '<a href="' + esc(post.url) + '" class="btn-course-enroll" style="margin-left:auto">Read Article</a>' +
        '</div>' +
      '</div>';
    }).join("");

    renderPagination(total);
  }

  /* ── RENDER PAGINATION ── */
  function renderPagination(total) {
    if (!paginationEl) return;
    var pages = Math.ceil(total / POSTS_PER_PAGE);
    if (pages <= 1) { paginationEl.innerHTML = ""; return; }

    var h = '<button class="blog-page-btn" data-page="' + (state.page - 1) + '"' + (state.page <= 1 ? ' disabled' : '') + '>&laquo;</button>';
    for (var i = 1; i <= pages; i++) {
      h += '<button class="blog-page-btn' + (i === state.page ? ' active' : '') + '" data-page="' + i + '">' + i + '</button>';
    }
    h += '<button class="blog-page-btn" data-page="' + (state.page + 1) + '"' + (state.page >= pages ? ' disabled' : '') + '>&raquo;</button>';
    paginationEl.innerHTML = h;
  }

  /* ── RENDER ALL ── */
  function renderAll() {
    var posts = getFiltered();
    renderFeatured(posts);
    renderTrending(posts);
    renderGrid(posts);

    // Populate global search index for site-wide search
    if (!window._searchIndex) window._searchIndex = [];
    state.allPosts.forEach(function (p) {
      var exists = window._searchIndex.some(function (s) { return s.href === p.url; });
      if (!exists) {
        window._searchIndex.push({
          title: p.title,
          section: "Blog",
          href: p.url,
          text: (p.title + " " + p.excerpt + " " + p.category).toLowerCase()
        });
      }
    });
  }

  /* ── WIRE FILTER BUTTONS ── */
  // Matches your original HTML: class="filter-btn" data-filter="physics" etc.
  var filterBtns = document.querySelectorAll(".filter-btn");
  for (var i = 0; i < filterBtns.length; i++) {
    (function (btn) {
      btn.addEventListener("click", function () {
        var all = document.querySelectorAll(".filter-btn");
        for (var j = 0; j < all.length; j++) all[j].classList.remove("active");
        btn.classList.add("active");
        state.filter = btn.getAttribute("data-filter") || "all";
        state.page = 1;
        renderAll();
      });
    })(filterBtns[i]);
  }

  /* ── WIRE SEARCH ── */
  if (searchInput) {
    searchInput.addEventListener("input", debounce(function () {
      state.search = searchInput.value.trim();
      state.page = 1;
      renderAll();
    }, DEBOUNCE_MS));
  }

  /* ── WIRE PAGINATION ── */
  if (paginationEl) {
    paginationEl.addEventListener("click", function (e) {
      var btn = e.target.closest(".blog-page-btn");
      if (!btn || btn.disabled) return;
      state.page = parseInt(btn.getAttribute("data-page"), 10) || 1;
      renderAll();
      var section = document.getElementById("blog-hub");
      if (section) window.scrollTo({ top: section.getBoundingClientRect().top + window.pageYOffset - 90, behavior: "smooth" });
    });
  }

  /* ── WIRE BOOKMARKS ── */
  document.addEventListener("click", function (e) {
    var btn = e.target.closest("[data-bookmark]");
    if (!btn) return;
    e.preventDefault();
    e.stopPropagation();
    var slug = btn.getAttribute("data-bookmark");
    var idx = state.bookmarks.indexOf(slug);
    if (idx > -1) state.bookmarks.splice(idx, 1);
    else state.bookmarks.push(slug);
    try { localStorage.setItem(BOOKMARK_KEY, JSON.stringify(state.bookmarks)); } catch (ex) {}
    renderAll();
  });

  /* ── FETCH AND BOOT ── */
  fetch("blog/posts.json")
    .then(function (res) {
      if (!res.ok) throw new Error("HTTP " + res.status);
      return res.json();
    })
    .then(function (posts) {
      posts.sort(function (a, b) { return new Date(b.date) - new Date(a.date); });
      state.allPosts = posts.map(enrichPost);
      renderAll();
    })
    .catch(function (err) {
      console.error("[Blog] Load failed:", err);
      container.innerHTML = '<p style="text-align:center;color:#7a8499;padding:40px">New articles coming soon.</p>';
    });
});

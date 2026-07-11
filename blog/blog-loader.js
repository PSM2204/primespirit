// blog/blog-loader.js
// Fetches blog/posts.json, renders cards into #blog-posts-container,
// and wires up the existing category filter buttons (#filter-all,
// #filter-physics, #filter-chemistry, #filter-maths, #filter-economics).

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("blog-posts-container");
  if (!container) return;

  let allPosts = [];

  function render(posts) {
    if (!posts.length) {
      container.innerHTML = "<p>New articles coming soon.</p>";
      return;
    }
    container.innerHTML = posts
      .map(
        (post) => `
      <div class="course-card" data-category="${post.category || "general"}">
        <h3><a href="${post.url}" style="color: inherit; text-decoration: none;">${post.title}</a></h3>
        <p>${post.excerpt}</p>
        <span class="target-badge">${post.date}</span>
        <a href="${post.url}" class="btn-course-enroll">Read Article</a>
      </div>
    `
      )
      .join("");
  }

  function applyFilter(category) {
    if (category === "all") {
      render(allPosts);
    } else {
      render(allPosts.filter((p) => (p.category || "general") === category));
    }
  }

  const filterMap = {
    "filter-all": "all",
    "filter-physics": "physics",
    "filter-chemistry": "chemistry",
    "filter-maths": "maths",
    "filter-economics": "economics",
  };

  Object.keys(filterMap).forEach((id) => {
    const btn = document.getElementById(id);
    if (!btn) return;
    btn.addEventListener("click", () => {
      document.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");
      applyFilter(filterMap[id]);
    });
  });

  fetch("blog/posts.json")
    .then((res) => res.json())
    .then((posts) => {
      allPosts = posts;
      render(allPosts);
    })
    .catch((err) => {
      console.error("Could not load blog posts:", err);
      container.innerHTML = "<p>New articles coming soon.</p>";
    });
});



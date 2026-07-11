// blog/blog-loader.js
// Fetches blog/posts.json and renders post cards into the
// "Insights Blog" section on the homepage. Self-contained —
// does not depend on or modify script.js.
//
// It looks for a container with id="blog-hub-posts". If that
// element doesn't exist yet, add it inside your #blog-hub section
// in index.html, e.g.:
//   <div id="blog-hub-posts" class="blog-grid"></div>

document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("blog-hub-posts");
  if (!container) return;

  fetch("blog/posts.json")
    .then((res) => res.json())
    .then((posts) => {
      if (!posts.length) {
        container.innerHTML = "<p>New articles coming soon.</p>";
        return;
      }

      container.innerHTML = posts
        .map(
          (post) => `
        <a class="blog-card" href="${post.url}">
          <h3>${post.title}</h3>
          <p class="blog-card-date">${post.date}</p>
          <p class="blog-card-excerpt">${post.excerpt}</p>
        </a>
      `
        )
        .join("");
    })
    .catch((err) => {
      console.error("Could not load blog posts:", err);
    });
});


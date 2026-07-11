// scripts/generate-post.js
// Picks the next unused topic, asks Gemini to write a post,
// creates blog/<slug>.html from the template, and updates blog/posts.json.
// Run by GitHub Actions with GEMINI_API_KEY as a secret.

import fs from "fs";
import path from "path";

const API_KEY = process.env.GEMINI_API_KEY;
const BLOG_DIR = path.join(process.cwd(), "blog");
const TOPICS_PATH = path.join(BLOG_DIR, "topics.json");
const POSTS_PATH = path.join(BLOG_DIR, "posts.json");
const TEMPLATE_PATH = path.join(BLOG_DIR, "template.html");

function slugify(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function callGemini(topic) {
  const prompt = `Write a 500-700 word blog post for an online coaching institute called
"Prime Spirit Mentors" (micro-batches of 5-10 students, Class 6-12 boards CBSE/ICSE,
NEET, JEE, CUET, IAT, NEST). Topic: "${topic}".
Rules:
- Start with a short, direct 2-3 sentence answer to the topic as if answering the question immediately.
- Use question-based subheadings (h2/h3 as <h2> and <h3> HTML tags).
- Be specific and concrete, avoid generic filler.
- Do not invent statistics, quotes, or named people/schools.
- Output clean HTML (paragraphs in <p>, headings in <h2>/<h3>, no <html>/<body> tags, no markdown).`;

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    }
  );

  if (!res.ok) {
    throw new Error(`Gemini API error: ${res.status} ${await res.text()}`);
  }

  const data = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error("No content returned from Gemini");
  return text.trim();
}

async function main() {
  if (!API_KEY) throw new Error("Missing GEMINI_API_KEY env var");

  const topics = JSON.parse(fs.readFileSync(TOPICS_PATH, "utf-8"));
  const posts = JSON.parse(fs.readFileSync(POSTS_PATH, "utf-8"));
  const usedTitles = new Set(posts.map((p) => p.title));

  const nextTopic = topics.find((t) => !usedTitles.has(t));
  if (!nextTopic) {
    console.log("No unused topics left in topics.json. Add more topics.");
    return;
  }

  console.log(`Generating post for topic: ${nextTopic}`);
  const content = await callGemini(nextTopic);

  const slug = slugify(nextTopic);
  const date = new Date().toISOString().split("T")[0];
  const description = nextTopic;

  const template = fs.readFileSync(TEMPLATE_PATH, "utf-8");
  const html = template
    .replaceAll("{{TITLE}}", nextTopic)
    .replaceAll("{{DESCRIPTION}}", description)
    .replaceAll("{{DATE}}", date)
    .replaceAll("{{CONTENT}}", content);

  fs.writeFileSync(path.join(BLOG_DIR, `${slug}.html`), html);

  posts.unshift({
    title: nextTopic,
    slug,
    date,
    excerpt: description,
    url: `blog/${slug}.html`,
  });
  fs.writeFileSync(POSTS_PATH, JSON.stringify(posts, null, 2));

  console.log(`Created blog/${slug}.html and updated posts.json`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});


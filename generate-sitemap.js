// generate-sitemap.js
import fs from "fs";

const SITE_URL = "https://texasdentalhub.com";

// 🔁 Keep this list in sync with your Supabase cities
const cities = [
  "houston",
  "katy",
  "sugar-land",
  "richmond",
  "rosenberg",
  "the-woodlands",
  "spring"
];

const urls = [
  `${SITE_URL}/dentists/`,
  ...cities.map(c => `${SITE_URL}/dentists/${c}-tx`)
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `
  <url>
    <loc>${url}</loc>
    <changefreq>weekly</changefreq>
    <priority>${url.includes("-tx") ? "0.8" : "0.6"}</priority>
  </url>
`).join("")}
</urlset>
`;

fs.writeFileSync("sitemap.xml", sitemap.trim());
console.log("✅ sitemap.xml generated");

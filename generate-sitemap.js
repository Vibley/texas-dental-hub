// generate-sitemap.js
const fs = require("fs");

const SITE_URL = "https://texasdentalhub.com";
const OUTPUT_PATH = "docs/sitemap.xml";

const SUPABASE_URL = "https://wehhvavlbhdbcmgvdaxj.supabase.co";

// 🔐 We will store this securely in GitHub Secrets
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;

function slugify(city) {
  return city
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function fetchCities() {
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/clinics?select=city`,
    {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`
      }
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch cities from Supabase");
  }

  const rows = await response.json();

  const uniqueCities = [
    ...new Set(
      rows
        .map(r => (r.city || "").trim())
        .filter(Boolean)
        .map(slugify)
    )
  ];

  return uniqueCities;
}

(async () => {
  try {
    const cities = await fetchCities();

    const urls = [
      `${SITE_URL}/`,
      `${SITE_URL}/dentists/`,
      ...cities.map(c => `${SITE_URL}/dentists/${c}-tx`)
    ];

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `
  <url>
    <loc>${url}</loc>
    <changefreq>weekly</changefreq>
    <priority>${url.includes("/dentists/") ? "0.8" : "1.0"}</priority>
  </url>
`).join("")}
</urlset>`;

    fs.writeFileSync(OUTPUT_PATH, sitemap.trim());
    console.log(`✅ Sitemap generated with ${cities.length} cities`);
  } catch (err) {
    console.error("❌ Sitemap generation failed:", err);
    process.exit(1);
  }
})();

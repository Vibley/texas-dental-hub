// generate-sitemap.js
const fs = require("fs");

const SITE_URL = "https://texasdentalhub.com";
const SUPABASE_URL = "https://wehhvavlbhdbcmgvdaxj.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_ANON_KEY;

const DOCS_PATH = "docs/";

function slugify(text) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

async function fetchClinics() {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/clinics?select=name,city`,
    {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`
      }
    }
  );

  if (!res.ok) throw new Error("Failed to fetch clinics");

  return await res.json();
}

(async () => {
  try {
    const rows = await fetchClinics();

    const uniqueCities = [
      ...new Set(
        rows
          .map(r => (r.city || "").trim())
          .filter(Boolean)
      )
    ];

    const citySlugs = uniqueCities.map(slugify);

    // 🔹 Generate City Sitemap
    const cityUrls = [
      `${SITE_URL}/`,
      `${SITE_URL}/dentists/`,
      ...citySlugs.map(c => `${SITE_URL}/dentists/${c}-tx`)
    ];

    const citySitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${cityUrls.map(url => `
  <url>
    <loc>${url}</loc>
    <changefreq>weekly</changefreq>
    <priority>${url.includes("/dentists/") ? "0.8" : "1.0"}</priority>
  </url>
`).join("")}
</urlset>`;

    fs.writeFileSync(`${DOCS_PATH}sitemap-cities.xml`, citySitemap.trim());

    // 🔹 Generate Clinic Sitemap
    const clinicUrls = rows.map(r => {
      const clinicSlug = slugify(r.name);
      return `${SITE_URL}/?clinic=${clinicSlug}`;
    });

    const clinicSitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${clinicUrls.map(url => `
  <url>
    <loc>${url}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>
`).join("")}
</urlset>`;

    fs.writeFileSync(`${DOCS_PATH}sitemap-clinics.xml`, clinicSitemap.trim());

    // 🔹 Generate Sitemap Index
    const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${SITE_URL}/sitemap-cities.xml</loc>
  </sitemap>
  <sitemap>
    <loc>${SITE_URL}/sitemap-clinics.xml</loc>
  </sitemap>
</sitemapindex>`;

    fs.writeFileSync(`${DOCS_PATH}sitemap.xml`, sitemapIndex.trim());

    console.log(`✅ Cities: ${citySlugs.length}`);
    console.log(`✅ Clinics: ${clinicUrls.length}`);
    console.log("✅ Sitemap index generated successfully");
  } catch (err) {
    console.error("❌ Sitemap generation failed:", err);
    process.exit(1);
  }
})();

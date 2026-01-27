const fs = require("fs");

const SUPABASE_URL = "https://wehhvavlbhdbcmgvdaxj.supabase.co";
const SUPABASE_KEY = "sb_publishable_HI7wHyO6rFnczXvvEGoldg_GF-Hd2DV";
const SITE_URL = "https://texasdentalhub.com";

async function generateSitemap() {
  const fetch = (...args) =>
    import("node-fetch").then(({ default: fetch }) => fetch(...args));

  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/clinics?select=city`,
    {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`
      }
    }
  );

  if (!res.ok) {
    throw new Error(`Supabase error: ${res.status}`);
  }

  const rows = await res.json();

  const cities = [
    ...new Set(
      rows
        .map(r => (r.city || "").trim().toLowerCase())
        .filter(Boolean)
    )
  ];

  const urls = [];
  urls.push(`${SITE_URL}/`);

  cities.forEach(city => {
    const slug = city.replace(/[^a-z0-9]+/g, "-");
    urls.push(`${SITE_URL}/?city=${slug}`);
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(url => `
  <url>
    <loc>${url}</loc>
  </url>`).join("")}
</urlset>`;

  fs.writeFileSync("sitemap.xml", xml.trim());
  console.log(`✅ Sitemap generated (${urls.length} URLs)`);
}

generateSitemap().catch(err => {
  console.error("❌ Sitemap generation failed:", err);
  process.exit(1);
});
